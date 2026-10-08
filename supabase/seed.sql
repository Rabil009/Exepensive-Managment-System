-- ==============================================================================
-- Enterprise Finance Management System Seed Data
-- ==============================================================================

-- 1. SEED EXPENSE POLICIES
INSERT INTO public.expense_policies (category, max_limit, currency, requires_receipt, description)
VALUES 
  ('MEALS', 2500.00, 'INR', true, 'Per diem meal expense limit per team member per day.'),
  ('TRAVEL', 15000.00, 'INR', true, 'Domestic transit and flight booking upper limit.'),
  ('HOTEL', 5000.00, 'INR', true, 'Standard corporate nightly hotel accommodation cap.'),
  ('SOFTWARE', 10000.00, 'INR', true, 'Monthly recurring team SaaS / developer tool limit.'),
  ('HARDWARE', 50000.00, 'INR', true, 'Approved workstation and peripherals replacement limit.'),
  ('OFFICE', 3000.00, 'INR', true, 'Stationery and standard office consumable supplies.'),
  ('TRAINING', 25000.00, 'INR', true, 'Certification, course, and conference enrollment budget.'),
  ('OTHER', 2000.00, 'INR', true, 'Miscellaneous ad-hoc business expenses requiring justification.')
ON CONFLICT (category) DO UPDATE
SET max_limit = EXCLUDED.max_limit,
    requires_receipt = EXCLUDED.requires_receipt,
    description = EXCLUDED.description;

-- 2. SEED DEPARTMENT BUDGETS (Q4 2026)
INSERT INTO public.department_budgets (name, department, allocated_amount, spent_amount, currency, fiscal_period, threshold_percent)
VALUES
  ('Engineering Ops & Infrastructure', 'Engineering', 1250000.00, 482500.00, 'INR', 'Q4 2026', 80.00),
  ('Sales & Client Partnerships', 'Sales', 850000.00, 310000.00, 'INR', 'Q4 2026', 75.00),
  ('Finance & Treasury Operations', 'Finance & Treasury', 500000.00, 145000.00, 'INR', 'Q4 2026', 85.00),
  ('People & Talent Acquisition', 'HR & Admin', 400000.00, 198000.00, 'INR', 'Q4 2026', 80.00),
  ('Product & Design', 'Product', 650000.00, 220000.00, 'INR', 'Q4 2026', 80.00)
ON CONFLICT DO NOTHING;
