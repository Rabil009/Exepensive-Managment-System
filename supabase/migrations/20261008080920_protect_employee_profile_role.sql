-- A signed-in Employee can edit display fields on their profile, but cannot
-- turn that profile into a Manager, Finance, or Admin account.
CREATE OR REPLACE FUNCTION public.protect_profile_identity_fields()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $function$
DECLARE
  actor_role text;
BEGIN
  IF (SELECT auth.uid()) IS NOT NULL THEN
    SELECT role INTO actor_role FROM public.profiles WHERE id = (SELECT auth.uid());
    IF actor_role IS DISTINCT FROM 'ADMIN' AND (
      NEW.role IS DISTINCT FROM OLD.role OR
      NEW.email IS DISTINCT FROM OLD.email OR
      NEW.department IS DISTINCT FROM OLD.department OR
      NEW.manager_id IS DISTINCT FROM OLD.manager_id
    ) THEN
      RAISE EXCEPTION 'Only an administrator can change profile identity or role';
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;

REVOKE ALL ON FUNCTION public.protect_profile_identity_fields() FROM PUBLIC, anon, authenticated;
DROP TRIGGER IF EXISTS protect_profile_identity_fields ON public.profiles;
CREATE TRIGGER protect_profile_identity_fields
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.protect_profile_identity_fields();
