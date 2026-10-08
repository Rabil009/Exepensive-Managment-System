-- Supabase may grant additional table privileges when a public table is created.
-- Employee drafts need only row-scoped CRUD through their RLS policies.
REVOKE ALL ON TABLE public.employee_expense_drafts FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.employee_expense_drafts TO authenticated;
