-- Optional assigned category caps; unlike expense policies, these are monthly
-- Employee limits. No sample limits are fabricated for new users.
CREATE TABLE public.employee_category_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN (
    'TRAVEL', 'HOTEL', 'MEALS', 'SOFTWARE', 'HARDWARE', 'OFFICE', 'TRAINING', 'OTHER'
  )),
  monthly_limit NUMERIC(15,2) NOT NULL CHECK (monthly_limit >= 0),
  currency TEXT NOT NULL DEFAULT 'INR',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (employee_id, category)
);
CREATE TRIGGER set_employee_category_limits_updated_at
  BEFORE UPDATE ON public.employee_category_limits
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
ALTER TABLE public.employee_category_limits ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.employee_category_limits FROM anon, authenticated;
GRANT SELECT ON public.employee_category_limits TO authenticated;
CREATE POLICY "Employee category limits read own" ON public.employee_category_limits
  FOR SELECT TO authenticated USING (employee_id = (SELECT auth.uid()));

ALTER TABLE public.employee_card_transactions
  ADD COLUMN category TEXT CHECK (category IS NULL OR category IN (
    'TRAVEL', 'HOTEL', 'MEALS', 'SOFTWARE', 'HARDWARE', 'OFFICE', 'TRAINING', 'OTHER'
  ));
