create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees(id),
  category_id uuid not null references public.expense_categories(id),
  expense_date date not null,
  merchant text not null check (length(btrim(merchant)) > 0),
  amount numeric(12,2) not null check (amount > 0),
  currency text not null default 'INR' check (currency = 'INR'),
  payment_method text not null check (payment_method in ('PERSONAL_CARD','PERSONAL_CASH','PERSONAL_UPI','CORPORATE_CARD')),
  description text,
  status text not null default 'DRAFT' check (status in ('DRAFT','SUBMITTED','MANAGER_REVIEW','FINANCE_REVIEW','APPROVED','PAYMENT_PENDING','PAID','REJECTED','SENT_BACK')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index expenses_employee_date_idx on public.expenses(employee_id, expense_date desc);
create index expenses_category_idx on public.expenses(category_id);
create index expenses_status_idx on public.expenses(status);
create trigger expenses_updated_at before update on public.expenses
for each row execute function public.set_updated_at();

-- Submitted financial details stay immutable. The fixed workflow updates status only.
create function public.guard_expense_change()
returns trigger language plpgsql as $$
begin
  if tg_op = 'DELETE' then
    if old.status <> 'DRAFT' then
      raise exception 'Only draft expenses can be deleted';
    end if;
    return old;
  end if;
  if old.status <> 'DRAFT' and (
    new.employee_id is distinct from old.employee_id or
    new.category_id is distinct from old.category_id or
    new.expense_date is distinct from old.expense_date or
    new.merchant is distinct from old.merchant or
    new.amount is distinct from old.amount or
    new.currency is distinct from old.currency or
    new.payment_method is distinct from old.payment_method or
    new.description is distinct from old.description
  ) then
    raise exception 'Submitted expense details cannot be edited';
  end if;
  return new;
end;
$$;
create trigger expenses_guard_update before update on public.expenses
for each row execute function public.guard_expense_change();
create trigger expenses_guard_delete before delete on public.expenses
for each row execute function public.guard_expense_change();

create table public.receipts (
  id uuid primary key default gen_random_uuid(),
  expense_id uuid not null references public.expenses(id) on delete cascade,
  file_name text not null,
  file_path text not null unique,
  file_type text not null check (file_type in ('image/jpeg','image/png','application/pdf')),
  file_size bigint not null check (file_size > 0 and file_size <= 10485760),
  ocr_status text not null default 'PENDING' check (ocr_status in ('PENDING','COMPLETED','FAILED')),
  uploaded_at timestamptz not null default now(),
  check (file_path like expense_id::text || '/%')
);
create index receipts_expense_id_idx on public.receipts(expense_id);

-- Private bucket. Anonymous access below is deliberately limited to this
-- portfolio demo and must be replaced when authentication is introduced.
insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
values ('receipts', 'receipts', false, 10485760, array['image/jpeg','image/png','application/pdf'])
on conflict (id) do update set
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "demo receipt read" on storage.objects for select to anon
using (bucket_id = 'receipts');
create policy "demo receipt upload" on storage.objects for insert to anon
with check (
  bucket_id = 'receipts'
  and name ~* '^[0-9a-f-]{36}/[^/]+[.](jpg|jpeg|png|pdf)$'
);
create policy "demo receipt delete" on storage.objects for delete to anon
using (bucket_id = 'receipts');
