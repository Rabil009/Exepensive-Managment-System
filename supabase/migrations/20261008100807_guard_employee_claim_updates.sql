-- Existing claim RLS permits owner updates. Employees must use the report
-- action for status changes and must not edit submitted financial records.
CREATE FUNCTION public.guard_employee_claim_update()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
DECLARE
  action TEXT;
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = (SELECT auth.uid()) AND role = 'EMPLOYEE'
  ) THEN
    action := current_setting('app.employee_report_action', true);
    IF NOT (
      (action = 'withdraw' AND OLD.status = 'SUBMITTED' AND NEW.status = 'DRAFT'
        AND NEW.submitted_at IS NULL)
      OR (action = 'submit' AND OLD.status = 'DRAFT' AND NEW.status = 'SUBMITTED'
        AND NEW.submitted_at IS NOT NULL)
    ) OR (to_jsonb(NEW) - 'status' - 'submitted_at' - 'updated_at')
         IS DISTINCT FROM (to_jsonb(OLD) - 'status' - 'submitted_at' - 'updated_at') THEN
      RAISE EXCEPTION 'Employee claims can only change through report actions';
    END IF;
  END IF;
  RETURN NEW;
END $$;
REVOKE ALL ON FUNCTION public.guard_employee_claim_update() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER guard_employee_claim_update
  BEFORE UPDATE ON public.expense_claims
  FOR EACH ROW EXECUTE FUNCTION public.guard_employee_claim_update();

CREATE OR REPLACE FUNCTION public.employee_change_report_status(p_report_name TEXT, p_action TEXT)
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
  PERFORM set_config('app.employee_report_action', p_action, true);
  UPDATE public.expense_claims
  SET status = next_status,
      submitted_at = CASE WHEN next_status = 'SUBMITTED' THEN now() ELSE NULL END
  WHERE employee_id = (SELECT auth.uid()) AND report_name = p_report_name
    AND status = expected;
  GET DIAGNOSTICS changed = ROW_COUNT;
  RETURN changed;
END $$;
