create table public.reimbursements (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null unique references public.expense_reports(id),
  employee_id uuid not null references public.employees(id),
  amount numeric(12,2) not null check (amount > 0),
  status text not null default 'PENDING' check (status in ('PENDING','PROCESSING','PAID','FAILED')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index reimbursements_employee_status_idx on public.reimbursements(employee_id, status);
create trigger reimbursements_updated_at before update on public.reimbursements
for each row execute function public.set_updated_at();

-- Reimburse only personal spending after Finance approval. A report may mix
-- personal and corporate card expenses, so its reimbursement can be smaller
-- than its report total.
create function public.guard_reimbursement()
returns trigger language plpgsql as $$
declare
  report_owner uuid;
  report_status text;
  personal_total numeric(12,2);
begin
  select employee_id, status into report_owner, report_status
  from public.expense_reports where id = new.report_id;
  select coalesce(sum(e.amount), 0) into personal_total
  from public.report_items ri
  join public.expenses e on e.id = ri.expense_id
  where ri.report_id = new.report_id
    and e.payment_method in ('PERSONAL_CARD','PERSONAL_CASH','PERSONAL_UPI');
  if new.employee_id <> report_owner
     or report_status not in ('APPROVED','PAYMENT_PENDING','PAID')
     or personal_total <= 0
     or new.amount <> personal_total
     or not exists (
       select 1 from public.approvals
       where report_id = new.report_id and stage = 'FINANCE' and status = 'APPROVED'
     ) then
    raise exception 'Reimbursement must equal approved personal expenses in the report';
  end if;
  return new;
end;
$$;
create trigger reimbursements_guard before insert or update on public.reimbursements
for each row execute function public.guard_reimbursement();

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  reimbursement_id uuid not null references public.reimbursements(id),
  amount numeric(12,2) not null check (amount > 0),
  payment_method text not null check (payment_method in ('BANK_TRANSFER','UPI')),
  payment_reference text not null unique,
  payment_date date not null,
  status text not null default 'PENDING' check (status in ('PENDING','PROCESSING','PAID','FAILED')),
  created_at timestamptz not null default now()
);
create index payments_reimbursement_idx on public.payments(reimbursement_id);

create function public.decide_expense_report(
  p_report_id uuid,
  p_reviewer_id uuid,
  p_stage text,
  p_decision text,
  p_comment text default null
)
returns public.expense_reports language plpgsql as $$
declare
  report_record public.expense_reports%rowtype;
  personal_total numeric(12,2);
begin
  if p_stage not in ('MANAGER','FINANCE')
     or p_decision not in ('APPROVED','REJECTED','SENT_BACK') then
    raise exception 'Invalid approval stage or decision';
  end if;
  select * into report_record from public.expense_reports where id = p_report_id for update;
  if not found then raise exception 'Report not found'; end if;

  if p_stage = 'MANAGER' then
    if report_record.status <> 'MANAGER_REVIEW' then
      raise exception 'Report is not awaiting manager review';
    end if;
    update public.approvals
    set status = p_decision, comment = p_comment, decided_at = now()
    where report_id = p_report_id and stage = 'MANAGER'
      and reviewer_id = p_reviewer_id and status = 'PENDING';
    if not found then raise exception 'Pending manager approval not found'; end if;
    if p_decision = 'APPROVED' then
      update public.expense_reports set status = 'FINANCE_REVIEW'
      where id = p_report_id returning * into report_record;
      update public.expenses set status = 'FINANCE_REVIEW'
      where id in (select expense_id from public.report_items where report_id = p_report_id);
    else
      update public.expense_reports set status = p_decision
      where id = p_report_id returning * into report_record;
      update public.expenses set status = p_decision
      where id in (select expense_id from public.report_items where report_id = p_report_id);
    end if;
    return report_record;
  end if;

  if report_record.status <> 'FINANCE_REVIEW'
     or not exists (
       select 1 from public.approvals
       where report_id = p_report_id and stage = 'MANAGER' and status = 'APPROVED'
     ) then
    raise exception 'Manager approval is required before Finance review';
  end if;
  insert into public.approvals(report_id, reviewer_id, stage, status, comment, decided_at)
  values (p_report_id, p_reviewer_id, 'FINANCE', p_decision, p_comment, now());
  update public.expense_reports set status = p_decision
  where id = p_report_id returning * into report_record;
  update public.expenses set status = p_decision
  where id in (select expense_id from public.report_items where report_id = p_report_id);
  if p_decision <> 'APPROVED' then return report_record; end if;

  select coalesce(sum(e.amount), 0) into personal_total
  from public.report_items ri
  join public.expenses e on e.id = ri.expense_id
  where ri.report_id = p_report_id
    and e.payment_method in ('PERSONAL_CARD','PERSONAL_CASH','PERSONAL_UPI');
  if personal_total > 0 then
    insert into public.reimbursements(report_id, employee_id, amount, status)
    values (p_report_id, report_record.employee_id, personal_total, 'PENDING');
    update public.expense_reports set status = 'PAYMENT_PENDING'
    where id = p_report_id returning * into report_record;
    update public.expenses set status = 'PAYMENT_PENDING'
    where id in (
      select ri.expense_id from public.report_items ri
      join public.expenses e on e.id = ri.expense_id
      where ri.report_id = p_report_id
        and e.payment_method in ('PERSONAL_CARD','PERSONAL_CASH','PERSONAL_UPI')
    );
  end if;
  return report_record;
end;
$$;

create function public.record_reimbursement_payment(
  p_reimbursement_id uuid,
  p_payment_method text,
  p_payment_reference text,
  p_payment_date date,
  p_status text default 'PAID'
)
returns public.payments language plpgsql as $$
declare
  reimbursement_record public.reimbursements%rowtype;
  payment_record public.payments%rowtype;
begin
  if p_status not in ('PENDING','PROCESSING','PAID','FAILED') then
    raise exception 'Invalid payment status';
  end if;
  select * into reimbursement_record
  from public.reimbursements where id = p_reimbursement_id for update;
  if not found or reimbursement_record.status = 'PAID' then
    raise exception 'Reimbursement is missing or already paid';
  end if;
  insert into public.payments(
    reimbursement_id, amount, payment_method, payment_reference, payment_date, status
  ) values (
    p_reimbursement_id, reimbursement_record.amount, p_payment_method,
    p_payment_reference, p_payment_date, p_status
  ) returning * into payment_record;
  update public.reimbursements set status = p_status where id = p_reimbursement_id;
  if p_status = 'PAID' then
    update public.expense_reports set status = 'PAID'
    where id = reimbursement_record.report_id;
    update public.expenses set status = 'PAID'
    where id in (
      select ri.expense_id from public.report_items ri
      join public.expenses e on e.id = ri.expense_id
      where ri.report_id = reimbursement_record.report_id
        and e.payment_method in ('PERSONAL_CARD','PERSONAL_CASH','PERSONAL_UPI')
    );
  end if;
  return payment_record;
end;
$$;
