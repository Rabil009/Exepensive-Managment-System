-- Employee card records are provisioned by an issuer/admin integration. An
-- Employee can manage only app-visible controls on cards assigned to them.
CREATE TABLE public.employee_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL CHECK (length(display_name) BETWEEN 1 AND 100),
  kind TEXT NOT NULL CHECK (kind IN ('PHYSICAL', 'VIRTUAL')),
  network TEXT,
  last4 TEXT CHECK (last4 IS NULL OR last4 ~ '^[0-9]{4}$'),
  currency TEXT NOT NULL DEFAULT 'INR',
  monthly_limit NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (monthly_limit >= 0),
  active BOOLEAN NOT NULL DEFAULT true,
  frozen BOOLEAN NOT NULL DEFAULT false,
  wallet_enabled BOOLEAN NOT NULL DEFAULT true,
  travel_limits_enabled BOOLEAN NOT NULL DEFAULT true,
  online_verification_enabled BOOLEAN NOT NULL DEFAULT true,
  atm_lock_enabled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX employee_cards_owner_idx ON public.employee_cards(employee_id);
CREATE TRIGGER set_employee_cards_updated_at BEFORE UPDATE ON public.employee_cards
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
ALTER TABLE public.employee_cards ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.employee_cards FROM anon, authenticated;
GRANT SELECT ON public.employee_cards TO authenticated;
GRANT UPDATE (active, frozen, wallet_enabled, travel_limits_enabled,
  online_verification_enabled, atm_lock_enabled) ON public.employee_cards TO authenticated;
CREATE POLICY "Employee cards read own" ON public.employee_cards FOR SELECT TO authenticated
  USING (employee_id = (SELECT auth.uid()));
CREATE POLICY "Employee cards control own" ON public.employee_cards FOR UPDATE TO authenticated
  USING (employee_id = (SELECT auth.uid()))
  WITH CHECK (employee_id = (SELECT auth.uid()));

-- Transactions enter through an issuer/admin integration; Employees can only read theirs.
CREATE TABLE public.employee_card_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  card_id UUID NOT NULL REFERENCES public.employee_cards(id) ON DELETE CASCADE,
  transaction_date DATE NOT NULL,
  merchant TEXT NOT NULL,
  purpose TEXT,
  amount NUMERIC(15,2) NOT NULL CHECK (amount >= 0),
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL CHECK (status IN ('PENDING', 'SETTLED', 'DECLINED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX employee_card_transactions_owner_date_idx
  ON public.employee_card_transactions(employee_id, transaction_date DESC);
ALTER TABLE public.employee_card_transactions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.employee_card_transactions FROM anon, authenticated;
GRANT SELECT ON public.employee_card_transactions TO authenticated;
CREATE POLICY "Employee card transactions read own" ON public.employee_card_transactions
  FOR SELECT TO authenticated USING (employee_id = (SELECT auth.uid()));

-- Requests are records only; they do not issue a card or change an issuer limit.
CREATE TABLE public.employee_card_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  card_id UUID REFERENCES public.employee_cards(id) ON DELETE CASCADE,
  request_type TEXT NOT NULL CHECK (request_type IN ('LIMIT_INCREASE', 'VIRTUAL_CARD')),
  card_name TEXT,
  requested_limit NUMERIC(15,2) NOT NULL CHECK (requested_limit > 0),
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK ((request_type = 'LIMIT_INCREASE' AND card_id IS NOT NULL AND card_name IS NULL)
    OR (request_type = 'VIRTUAL_CARD' AND card_id IS NULL AND card_name IS NOT NULL
      AND length(card_name) BETWEEN 1 AND 100))
);
CREATE INDEX employee_card_requests_owner_date_idx
  ON public.employee_card_requests(employee_id, created_at DESC);
ALTER TABLE public.employee_card_requests ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.employee_card_requests FROM anon, authenticated;
GRANT SELECT ON public.employee_card_requests TO authenticated;
GRANT INSERT (employee_id, card_id, request_type, card_name, requested_limit)
  ON public.employee_card_requests TO authenticated;
CREATE POLICY "Employee card requests read own" ON public.employee_card_requests
  FOR SELECT TO authenticated USING (employee_id = (SELECT auth.uid()));
CREATE POLICY "Employee card requests create own" ON public.employee_card_requests
  FOR INSERT TO authenticated WITH CHECK (
    employee_id = (SELECT auth.uid()) AND status = 'PENDING'
    AND (card_id IS NULL OR EXISTS (
      SELECT 1 FROM public.employee_cards c
      WHERE c.id = card_id AND c.employee_id = (SELECT auth.uid())
    ))
  );

-- An Employee can withdraw an entire submitted report while it is still
-- awaiting review, then resubmit it. RLS keeps both actions owner scoped.
CREATE FUNCTION public.employee_change_report_status(p_report_name TEXT, p_action TEXT)
RETURNS INTEGER LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
DECLARE
  changed INTEGER;
  expected TEXT;
  next_status TEXT;
BEGIN
  IF p_report_name IS NULL OR btrim(p_report_name) = '' THEN
    RAISE EXCEPTION 'Report name is required';
  END IF;
  IF p_action = 'withdraw' THEN
    expected := 'SUBMITTED'; next_status := 'DRAFT';
  ELSIF p_action = 'submit' THEN
    expected := 'DRAFT'; next_status := 'SUBMITTED';
  ELSE
    RAISE EXCEPTION 'Invalid report action';
  END IF;
  PERFORM 1 FROM public.expense_claims
  WHERE employee_id = (SELECT auth.uid()) AND report_name = p_report_name
  FOR UPDATE;
  IF NOT EXISTS (
    SELECT 1 FROM public.expense_claims
    WHERE employee_id = (SELECT auth.uid()) AND report_name = p_report_name
  ) OR EXISTS (
    SELECT 1 FROM public.expense_claims
    WHERE employee_id = (SELECT auth.uid()) AND report_name = p_report_name
      AND status <> expected
  ) THEN
    RAISE EXCEPTION 'Report is unavailable for this action';
  END IF;
  UPDATE public.expense_claims
  SET status = next_status,
      submitted_at = CASE WHEN next_status = 'SUBMITTED' THEN now() ELSE NULL END
  WHERE employee_id = (SELECT auth.uid()) AND report_name = p_report_name
    AND status = expected;
  GET DIAGNOSTICS changed = ROW_COUNT;
  RETURN changed;
END $$;
REVOKE ALL ON FUNCTION public.employee_change_report_status(TEXT, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.employee_change_report_status(TEXT, TEXT) TO authenticated;
