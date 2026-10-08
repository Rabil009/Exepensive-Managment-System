-- New email-link signups get an Employee profile. Browser-controlled metadata
-- must never assign Finance, Manager, or Admin privileges.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  extracted_name text;
BEGIN
  extracted_name := COALESCE(NULLIF(NEW.raw_user_meta_data->>'name', ''), split_part(NEW.email, '@', 1));
  INSERT INTO public.profiles (id, email, name, role, department, avatar_initials)
  VALUES (
    NEW.id,
    NEW.email,
    extracted_name,
    'EMPLOYEE',
    'Engineering',
    upper(substring(extracted_name from 1 for 2))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$function$;

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
