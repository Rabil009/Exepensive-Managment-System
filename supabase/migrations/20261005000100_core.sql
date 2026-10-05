create extension if not exists pgcrypto;

create function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.departments (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  status text not null default 'ACTIVE' check (status in ('ACTIVE', 'INACTIVE')),
  created_at timestamptz not null default now()
);

create table public.employees (
  id uuid primary key default gen_random_uuid(),
  employee_code text not null unique,
  name text not null,
  email text not null unique,
  department_id uuid not null references public.departments(id),
  manager_id uuid references public.employees(id),
  status text not null default 'ACTIVE' check (status in ('ACTIVE', 'INACTIVE')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (manager_id is distinct from id)
);
create index employees_department_id_idx on public.employees(department_id);
create index employees_manager_id_idx on public.employees(manager_id);
create trigger employees_updated_at before update on public.employees
for each row execute function public.set_updated_at();

create table public.expense_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  status text not null default 'ACTIVE' check (status in ('ACTIVE', 'INACTIVE')),
  created_at timestamptz not null default now()
);
