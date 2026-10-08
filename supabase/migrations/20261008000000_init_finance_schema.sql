-- ==============================================================================
-- Enterprise Finance Management System Schema
-- Supabase Migration Script
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. SCHEMAS & UTILITIES
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. PROFILES TABLE (Mirrors auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'EMPLOYEE' CHECK (role IN ('EMPLOYEE', 'MANAGER', 'FINANCE', 'ADMIN')),
  department TEXT NOT NULL DEFAULT 'Engineering',
  manager_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  avatar_initials TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trigger for profiles updated_at
DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Trigger to automatically create profile on auth.users sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  extracted_initials TEXT;
  extracted_name TEXT;
BEGIN
  extracted_name := COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1));
  extracted_initials := UPPER(substring(extracted_name from 1 for 2));

  INSERT INTO public.profiles (id, email, name, role, department, avatar_initials)
  VALUES (
    NEW.id,
    NEW.email,
    extracted_name,
    COALESCE(NEW.raw_user_meta_data->>'role', 'EMPLOYEE'),
    COALESCE(NEW.raw_user_meta_data->>'department', 'Engineering'),
    extracted_initials
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. DEPARTMENT BUDGETS TABLE
CREATE TABLE IF NOT EXISTS public.department_budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  allocated_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  spent_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  currency TEXT NOT NULL DEFAULT 'INR',
  fiscal_period TEXT NOT NULL,
  threshold_percent NUMERIC(5, 2) NOT NULL DEFAULT 80.00,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

DROP TRIGGER IF EXISTS set_budgets_updated_at ON public.department_budgets;
CREATE TRIGGER set_budgets_updated_at
  BEFORE UPDATE ON public.department_budgets
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 5. EXPENSE POLICIES TABLE
CREATE TABLE IF NOT EXISTS public.expense_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL UNIQUE,
  max_limit NUMERIC(15, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  requires_receipt BOOLEAN NOT NULL DEFAULT true,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. EXPENSE CLAIMS TABLE
CREATE TABLE IF NOT EXISTS public.expense_claims (
  id TEXT PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  employee_name TEXT NOT NULL,
  employee_department TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  amount NUMERIC(15, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  category TEXT NOT NULL CHECK (category IN ('TRAVEL', 'MEALS', 'SOFTWARE', 'HARDWARE', 'OFFICE', 'TRAINING', 'HOTEL', 'OTHER')),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('PERSONAL_CARD', 'PERSONAL_CASH', 'PERSONAL_UPI', 'CORPORATE_CARD')),
  merchant TEXT,
  receipt_url TEXT,
  receipt_name TEXT,
  status TEXT NOT NULL DEFAULT 'SUBMITTED' CHECK (status IN (
    'DRAFT', 'SUBMITTED', 'MANAGER_APPROVED', 'MANAGER_REJECTED',
    'FINANCE_APPROVED', 'FINANCE_REJECTED', 'PAYMENT_PENDING',
    'PAID', 'DISBURSED', 'CLOSED'
  )),
  policy_violation TEXT,
  policy_exceeded_amount NUMERIC(15, 2) DEFAULT 0.00,
  employee_exception_reason TEXT,
  is_duplicate_warning BOOLEAN DEFAULT false,
  duplicate_details TEXT,
  is_hold BOOLEAN DEFAULT false,
  hold_reason TEXT,
  held_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  manager_remark TEXT,
  finance_remark TEXT,
  payment_reference TEXT,
  disbursed_at TIMESTAMPTZ,
  payment_channel TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

DROP TRIGGER IF EXISTS set_claims_updated_at ON public.expense_claims;
CREATE TRIGGER set_claims_updated_at
  BEFORE UPDATE ON public.expense_claims
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 7. REIMBURSEMENT RECORDS TABLE
CREATE TABLE IF NOT EXISTS public.reimbursement_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_id TEXT NOT NULL REFERENCES public.expense_claims(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  employee_name TEXT NOT NULL,
  eligible_personal_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  corporate_card_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'PAID')),
  payment_reference TEXT,
  disbursed_at TIMESTAMPTZ,
  payment_method TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

DROP TRIGGER IF EXISTS set_reimbursements_updated_at ON public.reimbursement_records;
CREATE TRIGGER set_reimbursements_updated_at
  BEFORE UPDATE ON public.reimbursement_records
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 8. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_id TEXT REFERENCES public.expense_claims(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  actor_name TEXT,
  actor_role TEXT,
  previous_state JSONB,
  new_state JSONB,
  remarks TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_department ON public.profiles(department);
CREATE INDEX IF NOT EXISTS idx_claims_employee ON public.expense_claims(employee_id);
CREATE INDEX IF NOT EXISTS idx_claims_status ON public.expense_claims(status);
CREATE INDEX IF NOT EXISTS idx_claims_category ON public.expense_claims(category);
CREATE INDEX IF NOT EXISTS idx_claims_created ON public.expense_claims(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_budgets_dept ON public.department_budgets(department);
CREATE INDEX IF NOT EXISTS idx_reimbursements_claim ON public.reimbursement_records(claim_id);
CREATE INDEX IF NOT EXISTS idx_reimbursements_status ON public.reimbursement_records(status);
CREATE INDEX IF NOT EXISTS idx_audit_claim ON public.audit_logs(claim_id);

-- 10. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.department_budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reimbursement_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper functions for RLS checks
CREATE OR REPLACE FUNCTION public.get_current_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Profiles are viewable by authenticated users"
  ON public.profiles FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "Admin full manage profiles"
  ON public.profiles FOR ALL TO authenticated
  USING (public.get_current_role() = 'ADMIN');

-- Department Budgets Policies
CREATE POLICY "Budgets viewable by authenticated users"
  ON public.department_budgets FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Budgets manageable by Finance and Admin"
  ON public.department_budgets FOR ALL TO authenticated
  USING (public.get_current_role() IN ('FINANCE', 'ADMIN'));

-- Policies Policies
CREATE POLICY "Policies viewable by authenticated users"
  ON public.expense_policies FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Policies manageable by Admin and Finance"
  ON public.expense_policies FOR ALL TO authenticated
  USING (public.get_current_role() IN ('FINANCE', 'ADMIN'));

-- Expense Claims Policies
CREATE POLICY "Employees can view own claims"
  ON public.expense_claims FOR SELECT TO authenticated
  USING (
    employee_id = auth.uid()
    OR public.get_current_role() IN ('FINANCE', 'ADMIN')
    OR (
      public.get_current_role() = 'MANAGER'
      AND employee_department = (SELECT department FROM public.profiles WHERE id = auth.uid())
    )
  );

CREATE POLICY "Employees can create claims"
  ON public.expense_claims FOR INSERT TO authenticated
  WITH CHECK (employee_id = auth.uid() OR public.get_current_role() IN ('FINANCE', 'ADMIN'));

CREATE POLICY "Claims editable by owners or managers/finance"
  ON public.expense_claims FOR UPDATE TO authenticated
  USING (
    employee_id = auth.uid()
    OR public.get_current_role() IN ('FINANCE', 'ADMIN')
    OR (
      public.get_current_role() = 'MANAGER'
      AND employee_department = (SELECT department FROM public.profiles WHERE id = auth.uid())
    )
  );

-- Reimbursement Records Policies
CREATE POLICY "Reimbursements viewable by owner, finance, admin"
  ON public.reimbursement_records FOR SELECT TO authenticated
  USING (
    employee_id = auth.uid()
    OR public.get_current_role() IN ('FINANCE', 'ADMIN')
  );

CREATE POLICY "Reimbursements manageable by Finance and Admin"
  ON public.reimbursement_records FOR ALL TO authenticated
  USING (public.get_current_role() IN ('FINANCE', 'ADMIN'));

-- Audit Logs Policies
CREATE POLICY "Audit logs readable by Finance and Admin"
  ON public.audit_logs FOR SELECT TO authenticated
  USING (public.get_current_role() IN ('FINANCE', 'ADMIN'));

CREATE POLICY "Audit logs insertable by authenticated users"
  ON public.audit_logs FOR INSERT TO authenticated
  WITH CHECK (true);

-- 11. STORAGE BUCKET FOR RECEIPTS
INSERT INTO storage.buckets (id, name, public)
VALUES ('receipts', 'receipts', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Receipts access by authenticated users"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'receipts');

CREATE POLICY "Receipts upload by authenticated users"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'receipts');

CREATE POLICY "Receipts deletion by owners and admins"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'receipts' AND (auth.uid() = owner OR public.get_current_role() IN ('FINANCE', 'ADMIN')));
