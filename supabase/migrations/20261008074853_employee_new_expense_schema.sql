-- Employee New Expense data. Drafts remain separate from submitted claims so
-- incomplete forms do not weaken the existing finance claim requirements.

CREATE TABLE IF NOT EXISTS public.employee_expense_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  merchant TEXT,
  expense_date DATE,
  amount NUMERIC(15, 2) CHECK (amount IS NULL OR amount >= 0),
  currency TEXT NOT NULL DEFAULT 'INR',
  category TEXT,
  report_name TEXT,
  payment_method TEXT,
  card_last4 TEXT CHECK (card_last4 IS NULL OR card_last4 ~ '^[0-9]{4}$'),
  business_purpose TEXT,
  attendees TEXT[] NOT NULL DEFAULT '{}',
  linked_transaction_id TEXT,
  receipt_path TEXT,
  receipt_name TEXT,
  receipt_content_type TEXT,
  receipt_size_bytes BIGINT CHECK (
    receipt_size_bytes IS NULL OR receipt_size_bytes BETWEEN 1 AND 26214400
  ),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_employee_expense_drafts_owner_updated
  ON public.employee_expense_drafts (employee_id, updated_at DESC);

DROP TRIGGER IF EXISTS set_employee_expense_drafts_updated_at ON public.employee_expense_drafts;
CREATE TRIGGER set_employee_expense_drafts_updated_at
  BEFORE UPDATE ON public.employee_expense_drafts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.employee_expense_drafts ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.employee_expense_drafts FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.employee_expense_drafts TO authenticated;

DROP POLICY IF EXISTS "Employee drafts select own" ON public.employee_expense_drafts;
CREATE POLICY "Employee drafts select own"
  ON public.employee_expense_drafts FOR SELECT TO authenticated
  USING (employee_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Employee drafts insert own" ON public.employee_expense_drafts;
CREATE POLICY "Employee drafts insert own"
  ON public.employee_expense_drafts FOR INSERT TO authenticated
  WITH CHECK (employee_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Employee drafts update own" ON public.employee_expense_drafts;
CREATE POLICY "Employee drafts update own"
  ON public.employee_expense_drafts FOR UPDATE TO authenticated
  USING (employee_id = (SELECT auth.uid()))
  WITH CHECK (employee_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Employee drafts delete own" ON public.employee_expense_drafts;
CREATE POLICY "Employee drafts delete own"
  ON public.employee_expense_drafts FOR DELETE TO authenticated
  USING (employee_id = (SELECT auth.uid()));

-- Add the form data needed after a draft is submitted. These columns are
-- nullable to preserve compatibility with existing claim writers.
ALTER TABLE public.expense_claims
  ADD COLUMN IF NOT EXISTS expense_date DATE,
  ADD COLUMN IF NOT EXISTS report_name TEXT,
  ADD COLUMN IF NOT EXISTS attendees TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS linked_transaction_id TEXT,
  ADD COLUMN IF NOT EXISTS card_last4 TEXT,
  ADD COLUMN IF NOT EXISTS receipt_path TEXT,
  ADD COLUMN IF NOT EXISTS receipt_content_type TEXT,
  ADD COLUMN IF NOT EXISTS receipt_size_bytes BIGINT;

ALTER TABLE public.expense_claims
  DROP CONSTRAINT IF EXISTS expense_claims_payment_method_check;
ALTER TABLE public.expense_claims
  ADD CONSTRAINT expense_claims_payment_method_check
  CHECK (payment_method IN (
    'PERSONAL_CARD', 'PERSONAL_CASH', 'PERSONAL_UPI',
    'PERSONAL_OUT_OF_POCKET', 'CORPORATE_CARD'
  ));

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'expense_claims_card_last4_check'
      AND conrelid = 'public.expense_claims'::regclass
  ) THEN
    ALTER TABLE public.expense_claims
      ADD CONSTRAINT expense_claims_card_last4_check
      CHECK (card_last4 IS NULL OR card_last4 ~ '^[0-9]{4}$');
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'expense_claims_receipt_size_bytes_check'
      AND conrelid = 'public.expense_claims'::regclass
  ) THEN
    ALTER TABLE public.expense_claims
      ADD CONSTRAINT expense_claims_receipt_size_bytes_check
      CHECK (receipt_size_bytes IS NULL OR receipt_size_bytes BETWEEN 1 AND 26214400);
  END IF;
END $$;

-- Receipt objects must be uploaded under <employee-id>/<expense-id>/<file>.
-- The path is stored in receipt_path; no public URL or file bytes go in claims.
UPDATE storage.buckets
SET public = false,
    file_size_limit = 26214400,
    allowed_mime_types = ARRAY[
      'application/pdf', 'image/png', 'image/jpeg', 'image/heic'
    ]::TEXT[]
WHERE id = 'receipts';

DROP POLICY IF EXISTS "Receipts access by authenticated users" ON storage.objects;
DROP POLICY IF EXISTS "Receipts upload by authenticated users" ON storage.objects;
DROP POLICY IF EXISTS "Receipts deletion by owners and admins" ON storage.objects;

DROP POLICY IF EXISTS "Employee receipts select own" ON storage.objects;
CREATE POLICY "Employee receipts select own"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'receipts'
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::TEXT
  );

DROP POLICY IF EXISTS "Employee receipts insert own" ON storage.objects;
CREATE POLICY "Employee receipts insert own"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'receipts'
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::TEXT
  );

DROP POLICY IF EXISTS "Employee receipts update own" ON storage.objects;
CREATE POLICY "Employee receipts update own"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'receipts'
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::TEXT
  )
  WITH CHECK (
    bucket_id = 'receipts'
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::TEXT
  );

DROP POLICY IF EXISTS "Employee receipts delete own" ON storage.objects;
CREATE POLICY "Employee receipts delete own"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'receipts'
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::TEXT
  );
