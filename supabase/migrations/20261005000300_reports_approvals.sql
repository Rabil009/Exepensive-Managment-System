create table public.expense_reports (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees(id),
  title text not null check (length(btrim(title)) > 0),
  total_amount numeric(12,2) not null default 0 check (total_amount >= 0),
  status text not null default 'DRAFT' check (status in ('DRAFT','SUBMITTED','MANAGER_REVIEW','FINANCE_REVIEW','APPROVED','PAYMENT_PENDING','PAID','REJECTED','SENT_BACK')),
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index expense_reports_employee_idx on public.expense_reports(employee_id, created_at desc);
create index expense_reports_status_idx on public.expense_reports(status);
create trigger expense_reports_updated_at before update on public.expense_reports
for each row execute function public.set_updated_at();

create table public.report_items (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.expense_reports(id) on delete cascade,
  expense_id uuid not null unique references public.expenses(id),
  unique (report_id, expense_id)
);
create index report_items_report_idx on public.report_items(report_id);

create function public.guard_report_item()
returns trigger language plpgsql as $$
declare
  report_owner uuid;
  report_status text;
  expense_owner uuid;
  expense_status text;
begin
  if tg_op = 'UPDATE' then
    raise exception 'Remove and add a draft report item instead of updating it';
  end if;
  select employee_id, status into report_owner, report_status
  from public.expense_reports where id = coalesce(new.report_id, old.report_id);
  if report_status <> 'DRAFT' then
    raise exception 'Report items can only change while the report is a draft';
  end if;
  if tg_op = 'DELETE' then return old; end if;
  select employee_id, status into expense_owner, expense_status
  from public.expenses where id = new.expense_id;
  if expense_owner <> report_owner or expense_status <> 'DRAFT' then
    raise exception 'A report can contain only its employee draft expenses';
  end if;
  return new;
end;
$$;
create trigger report_items_guard before insert or update or delete on public.report_items
for each row execute function public.guard_report_item();

create function public.refresh_report_total()
returns trigger language plpgsql as $$
begin
  update public.expense_reports
  set total_amount = coalesce((
    select sum(e.amount)
    from public.report_items ri join public.expenses e on e.id = ri.expense_id
    where ri.report_id = coalesce(new.report_id, old.report_id)
  ), 0)
  where id = coalesce(new.report_id, old.report_id);
  return null;
end;
$$;
create trigger report_items_total after insert or delete on public.report_items
for each row execute function public.refresh_report_total();

create table public.approvals (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.expense_reports(id),
  reviewer_id uuid not null references public.employees(id),
  stage text not null check (stage in ('MANAGER','FINANCE')),
  status text not null default 'PENDING' check (status in ('PENDING','APPROVED','REJECTED','SENT_BACK')),
  comment text,
  decided_at timestamptz,
  created_at timestamptz not null default now(),
  unique (report_id, stage),
  check ((status = 'PENDING' and decided_at is null) or (status <> 'PENDING' and decided_at is not null))
);
create index approvals_reviewer_status_idx on public.approvals(reviewer_id, status);

create function public.submit_expense_report(p_report_id uuid)
returns public.expense_reports language plpgsql as $$
declare
  report_record public.expense_reports%rowtype;
  manager uuid;
begin
  select * into report_record from public.expense_reports where id = p_report_id for update;
  if not found or report_record.status <> 'DRAFT' then
    raise exception 'Only a draft report can be submitted';
  end if;
  if not exists (select 1 from public.report_items where report_id = p_report_id) then
    raise exception 'Add at least one expense before submitting';
  end if;
  select manager_id into manager from public.employees where id = report_record.employee_id;
  if manager is null then
    raise exception 'The employee needs a manager before submission';
  end if;
  update public.expense_reports
  set status = 'MANAGER_REVIEW', submitted_at = now()
  where id = p_report_id returning * into report_record;
  update public.expenses set status = 'MANAGER_REVIEW'
  where id in (select expense_id from public.report_items where report_id = p_report_id);
  insert into public.approvals(report_id, reviewer_id, stage, status)
  values (p_report_id, manager, 'MANAGER', 'PENDING');
  return report_record;
end;
$$;
