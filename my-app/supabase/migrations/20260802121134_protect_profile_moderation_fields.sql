CREATE OR REPLACE FUNCTION "private"."protect_profile_moderation_fields"()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, private
AS $$
BEGIN
  IF (select auth.uid()) IS NULL THEN
    RETURN NEW;
  END IF;

  IF NOT private.is_admin() THEN
    IF NEW.role IS DISTINCT FROM OLD.role
      OR NEW.is_blocked IS DISTINCT FROM OLD.is_blocked
      OR NEW.blocked_at IS DISTINCT FROM OLD.blocked_at
      OR NEW.blocked_reason IS DISTINCT FROM OLD.blocked_reason THEN
      RAISE EXCEPTION 'Only admins can change moderation fields';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION "private"."protect_profile_moderation_fields"() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS "protect_profile_moderation_fields" ON "public"."profiles";
CREATE TRIGGER "protect_profile_moderation_fields"
BEFORE UPDATE ON "public"."profiles"
FOR EACH ROW EXECUTE FUNCTION "private"."protect_profile_moderation_fields"();
