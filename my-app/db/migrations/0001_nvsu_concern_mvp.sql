CREATE TYPE "public"."concern_category" AS ENUM('equipment', 'electrical', 'cleanliness', 'facility', 'safety', 'other');--> statement-breakpoint
CREATE TYPE "public"."concern_status" AS ENUM('submitted', 'in_review', 'in_progress', 'resolved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."moderation_action" AS ENUM('block_user', 'unblock_user', 'remove_report', 'restore_report', 'change_status');--> statement-breakpoint
CREATE TABLE "concern_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"author_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"category" "concern_category" DEFAULT 'other' NOT NULL,
	"location" text,
	"status" "concern_status" DEFAULT 'submitted' NOT NULL,
	"vote_score" integer DEFAULT 0 NOT NULL,
	"is_removed" boolean DEFAULT false NOT NULL,
	"removed_at" timestamp with time zone,
	"removed_by" uuid,
	"removal_reason" text,
	"created_at" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
	"updated_at" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "concern_status_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"report_id" uuid NOT NULL,
	"changed_by" uuid,
	"old_status" "concern_status",
	"new_status" "concern_status" NOT NULL,
	"note" text,
	"created_at" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "concern_votes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"report_id" uuid NOT NULL,
	"voter_id" uuid NOT NULL,
	"value" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
	"updated_at" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "moderation_actions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"admin_id" uuid NOT NULL,
	"target_user_id" uuid,
	"report_id" uuid,
	"action" "moderation_action" NOT NULL,
	"reason" text,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "school_id" text;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "updated_at" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "is_blocked" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "blocked_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "blocked_reason" text;--> statement-breakpoint
ALTER TABLE "concern_reports" ADD CONSTRAINT "concern_reports_author_id_profiles_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "concern_reports" ADD CONSTRAINT "concern_reports_removed_by_profiles_id_fk" FOREIGN KEY ("removed_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "concern_status_history" ADD CONSTRAINT "concern_status_history_report_id_concern_reports_id_fk" FOREIGN KEY ("report_id") REFERENCES "public"."concern_reports"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "concern_status_history" ADD CONSTRAINT "concern_status_history_changed_by_profiles_id_fk" FOREIGN KEY ("changed_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "concern_votes" ADD CONSTRAINT "concern_votes_report_id_concern_reports_id_fk" FOREIGN KEY ("report_id") REFERENCES "public"."concern_reports"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "concern_votes" ADD CONSTRAINT "concern_votes_voter_id_profiles_id_fk" FOREIGN KEY ("voter_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moderation_actions" ADD CONSTRAINT "moderation_actions_admin_id_profiles_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moderation_actions" ADD CONSTRAINT "moderation_actions_target_user_id_profiles_id_fk" FOREIGN KEY ("target_user_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moderation_actions" ADD CONSTRAINT "moderation_actions_report_id_concern_reports_id_fk" FOREIGN KEY ("report_id") REFERENCES "public"."concern_reports"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "concern_reports_author_idx" ON "concern_reports" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "concern_reports_status_idx" ON "concern_reports" USING btree ("status");--> statement-breakpoint
CREATE INDEX "concern_reports_category_idx" ON "concern_reports" USING btree ("category");--> statement-breakpoint
CREATE INDEX "concern_reports_created_at_idx" ON "concern_reports" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "concern_status_history_report_idx" ON "concern_status_history" USING btree ("report_id");--> statement-breakpoint
CREATE UNIQUE INDEX "concern_votes_report_voter_idx" ON "concern_votes" USING btree ("report_id","voter_id");--> statement-breakpoint
CREATE INDEX "concern_votes_report_idx" ON "concern_votes" USING btree ("report_id");--> statement-breakpoint
CREATE INDEX "concern_votes_voter_idx" ON "concern_votes" USING btree ("voter_id");--> statement-breakpoint
CREATE INDEX "moderation_actions_admin_idx" ON "moderation_actions" USING btree ("admin_id");--> statement-breakpoint
CREATE INDEX "moderation_actions_target_user_idx" ON "moderation_actions" USING btree ("target_user_id");--> statement-breakpoint
CREATE INDEX "moderation_actions_report_idx" ON "moderation_actions" USING btree ("report_id");--> statement-breakpoint
CREATE UNIQUE INDEX "profiles_school_id_idx" ON "profiles" USING btree ("school_id");--> statement-breakpoint
CREATE INDEX "profiles_role_idx" ON "profiles" USING btree ("role");--> statement-breakpoint
ALTER TABLE "concern_votes" ADD CONSTRAINT "concern_votes_value_check" CHECK ("value" IN (-1, 1));--> statement-breakpoint
CREATE SCHEMA IF NOT EXISTS "private";--> statement-breakpoint
CREATE OR REPLACE FUNCTION "private"."is_admin"()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE((
    SELECT role = 'admin'
    FROM public.profiles
    WHERE id = (select auth.uid())
      AND is_blocked = false
  ), false);
$$;--> statement-breakpoint
REVOKE ALL ON FUNCTION "private"."is_admin"() FROM PUBLIC;--> statement-breakpoint
GRANT USAGE ON SCHEMA "private" TO authenticated;--> statement-breakpoint
GRANT EXECUTE ON FUNCTION "private"."is_admin"() TO authenticated;--> statement-breakpoint
CREATE OR REPLACE FUNCTION "public"."handle_new_user"()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  school_id_from_email text;
  requested_role text;
BEGIN
  school_id_from_email := split_part(NEW.email, '@', 1);
  requested_role := NEW.raw_app_meta_data->>'role';

  INSERT INTO public.profiles (
    id,
    email,
    school_id,
    full_name,
    role
  )
  VALUES (
    NEW.id,
    NEW.email,
    CASE
      WHEN school_id_from_email ~ '^[0-9]{3}-[0-9]{4}$' THEN school_id_from_email
      ELSE NULL
    END,
    COALESCE(
      NULLIF(NEW.raw_user_meta_data->>'display_name', ''),
      NULLIF(NEW.raw_user_meta_data->>'full_name', ''),
      NULLIF(NEW.raw_user_meta_data->>'name', '')
    ),
    CASE
      WHEN requested_role IN ('admin', 'user') THEN requested_role::public.user_role
      ELSE 'user'::public.user_role
    END
  )
  ON CONFLICT (id) DO UPDATE SET
    email = excluded.email,
    school_id = COALESCE(public.profiles.school_id, excluded.school_id),
    full_name = COALESCE(public.profiles.full_name, excluded.full_name);

  RETURN NEW;
END;
$$;--> statement-breakpoint
INSERT INTO public.profiles (
  id,
  email,
  school_id,
  full_name,
  role
)
SELECT
  users.id,
  users.email,
  CASE
    WHEN split_part(users.email, '@', 1) ~ '^[0-9]{3}-[0-9]{4}$'
      THEN split_part(users.email, '@', 1)
    ELSE NULL
  END,
  COALESCE(
    NULLIF(users.raw_user_meta_data->>'display_name', ''),
    NULLIF(users.raw_user_meta_data->>'full_name', ''),
    NULLIF(users.raw_user_meta_data->>'name', '')
  ),
  CASE
    WHEN users.raw_app_meta_data->>'role' IN ('admin', 'user')
      THEN (users.raw_app_meta_data->>'role')::public.user_role
    ELSE 'user'::public.user_role
  END
FROM auth.users
ON CONFLICT (id) DO UPDATE SET
  email = excluded.email,
  school_id = COALESCE(public.profiles.school_id, excluded.school_id),
  full_name = COALESCE(public.profiles.full_name, excluded.full_name);--> statement-breakpoint
CREATE TRIGGER "profiles_updated_at"
BEFORE UPDATE ON "public"."profiles"
FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();--> statement-breakpoint
CREATE TRIGGER "concern_reports_updated_at"
BEFORE UPDATE ON "public"."concern_reports"
FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();--> statement-breakpoint
CREATE TRIGGER "concern_votes_updated_at"
BEFORE UPDATE ON "public"."concern_votes"
FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();--> statement-breakpoint
CREATE OR REPLACE FUNCTION "public"."refresh_concern_vote_score"()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  affected_report_id uuid;
BEGIN
  affected_report_id := COALESCE(NEW.report_id, OLD.report_id);

  UPDATE public.concern_reports
  SET vote_score = COALESCE((
    SELECT SUM(value)
    FROM public.concern_votes
    WHERE report_id = affected_report_id
  ), 0)
  WHERE id = affected_report_id;

  RETURN COALESCE(NEW, OLD);
END;
$$;--> statement-breakpoint
CREATE TRIGGER "concern_votes_refresh_score"
AFTER INSERT OR UPDATE OR DELETE ON "public"."concern_votes"
FOR EACH ROW EXECUTE FUNCTION "public"."refresh_concern_vote_score"();--> statement-breakpoint
ALTER TABLE "public"."concern_reports" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "public"."concern_votes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "public"."concern_status_history" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "public"."moderation_actions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
GRANT SELECT, UPDATE ON "public"."profiles" TO authenticated;--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE ON "public"."concern_reports" TO authenticated;--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON "public"."concern_votes" TO authenticated;--> statement-breakpoint
GRANT SELECT, INSERT ON "public"."concern_status_history" TO authenticated;--> statement-breakpoint
GRANT SELECT, INSERT ON "public"."moderation_actions" TO authenticated;--> statement-breakpoint
CREATE POLICY "Authenticated users can view profiles" ON "public"."profiles"
FOR SELECT TO authenticated
USING (true);--> statement-breakpoint
CREATE POLICY "Admins can block and update profiles" ON "public"."profiles"
FOR UPDATE TO authenticated
USING ((select private.is_admin()))
WITH CHECK ((select private.is_admin()));--> statement-breakpoint
CREATE POLICY "Authenticated users can view visible concern reports" ON "public"."concern_reports"
FOR SELECT TO authenticated
USING (
  "is_removed" = false
  OR "author_id" = (select auth.uid())
  OR (select private.is_admin())
);--> statement-breakpoint
CREATE POLICY "Unblocked users can create concern reports" ON "public"."concern_reports"
FOR INSERT TO authenticated
WITH CHECK (
  "author_id" = (select auth.uid())
  AND NOT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = (select auth.uid())
      AND is_blocked = true
  )
);--> statement-breakpoint
CREATE POLICY "Authors and admins can update concern reports" ON "public"."concern_reports"
FOR UPDATE TO authenticated
USING (
  (
    "author_id" = (select auth.uid())
    AND "status" = 'submitted'
    AND "is_removed" = false
  )
  OR (select private.is_admin())
)
WITH CHECK (
  "author_id" = (select auth.uid())
  OR (select private.is_admin())
);--> statement-breakpoint
CREATE POLICY "Authenticated users can view concern votes" ON "public"."concern_votes"
FOR SELECT TO authenticated
USING (true);--> statement-breakpoint
CREATE POLICY "Unblocked users can vote once per report" ON "public"."concern_votes"
FOR INSERT TO authenticated
WITH CHECK (
  "voter_id" = (select auth.uid())
  AND NOT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = (select auth.uid())
      AND is_blocked = true
  )
);--> statement-breakpoint
CREATE POLICY "Users can change their own votes" ON "public"."concern_votes"
FOR UPDATE TO authenticated
USING ("voter_id" = (select auth.uid()))
WITH CHECK (
  "voter_id" = (select auth.uid())
  AND NOT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = (select auth.uid())
      AND is_blocked = true
  )
);--> statement-breakpoint
CREATE POLICY "Users can remove their own votes" ON "public"."concern_votes"
FOR DELETE TO authenticated
USING ("voter_id" = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "Authenticated users can view concern status history" ON "public"."concern_status_history"
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.concern_reports
    WHERE id = "report_id"
  )
);--> statement-breakpoint
CREATE POLICY "Admins can add concern status history" ON "public"."concern_status_history"
FOR INSERT TO authenticated
WITH CHECK ((select private.is_admin()));--> statement-breakpoint
CREATE POLICY "Admins can view moderation actions" ON "public"."moderation_actions"
FOR SELECT TO authenticated
USING ((select private.is_admin()));--> statement-breakpoint
CREATE POLICY "Admins can add moderation actions" ON "public"."moderation_actions"
FOR INSERT TO authenticated
WITH CHECK ((select private.is_admin()));--> statement-breakpoint
CREATE OR REPLACE FUNCTION "public"."update_updated_at"()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;--> statement-breakpoint
REVOKE ALL ON FUNCTION "public"."handle_new_user"() FROM PUBLIC, anon, authenticated;--> statement-breakpoint
REVOKE ALL ON FUNCTION "public"."refresh_concern_vote_score"() FROM PUBLIC, anon, authenticated;--> statement-breakpoint
ALTER TABLE "public"."organizations" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP POLICY IF EXISTS "Users can update own profile" ON "public"."profiles";--> statement-breakpoint
DROP POLICY IF EXISTS "Admins can block and update profiles" ON "public"."profiles";--> statement-breakpoint
CREATE POLICY "Users and admins can update profiles" ON "public"."profiles"
FOR UPDATE TO authenticated
USING ((select auth.uid()) = id OR (select private.is_admin()))
WITH CHECK ((select auth.uid()) = id OR (select private.is_admin()));--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "profiles_organization_id_idx" ON "profiles" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "concern_reports_removed_by_idx" ON "concern_reports" USING btree ("removed_by");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "concern_status_history_changed_by_idx" ON "concern_status_history" USING btree ("changed_by");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "bookings_service_id_idx" ON "bookings" USING btree ("service_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "bookings_lead_id_idx" ON "bookings" USING btree ("lead_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "blog_posts_organization_id_idx" ON "blog_posts" USING btree ("organization_id");--> statement-breakpoint
CREATE POLICY "Authenticated users can view organizations" ON "public"."organizations"
FOR SELECT TO authenticated
USING (true);--> statement-breakpoint
CREATE POLICY "Admins can manage organizations" ON "public"."organizations"
FOR ALL TO authenticated
USING ((select private.is_admin()))
WITH CHECK ((select private.is_admin()));--> statement-breakpoint
CREATE POLICY "Authenticated users can manage services" ON "public"."services"
FOR ALL TO authenticated
USING (true)
WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Authenticated users can manage leads" ON "public"."leads"
FOR ALL TO authenticated
USING (true)
WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Authenticated users can manage bookings" ON "public"."bookings"
FOR ALL TO authenticated
USING (true)
WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Authenticated users can insert analytics" ON "public"."analytics_events"
FOR INSERT TO authenticated
WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Admins can view analytics" ON "public"."analytics_events"
FOR SELECT TO authenticated
USING ((select private.is_admin()));--> statement-breakpoint
CREATE POLICY "Authenticated users can manage gallery items" ON "public"."gallery_items"
FOR ALL TO authenticated
USING (true)
WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Authenticated users can manage notifications" ON "public"."notifications"
FOR ALL TO authenticated
USING (true)
WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Admins can view audit logs" ON "public"."audit_logs"
FOR SELECT TO authenticated
USING ((select private.is_admin()));--> statement-breakpoint
CREATE POLICY "Admins can insert audit logs" ON "public"."audit_logs"
FOR INSERT TO authenticated
WITH CHECK ((select private.is_admin()));--> statement-breakpoint
CREATE POLICY "Authenticated users can manage blog posts" ON "public"."blog_posts"
FOR ALL TO authenticated
USING (true)
WITH CHECK (true);--> statement-breakpoint
DROP POLICY IF EXISTS "Admins can manage organizations" ON "public"."organizations";--> statement-breakpoint
CREATE POLICY "Admins can insert organizations" ON "public"."organizations"
FOR INSERT TO authenticated
WITH CHECK ((select private.is_admin()));--> statement-breakpoint
CREATE POLICY "Admins can update organizations" ON "public"."organizations"
FOR UPDATE TO authenticated
USING ((select private.is_admin()))
WITH CHECK ((select private.is_admin()));--> statement-breakpoint
CREATE POLICY "Admins can delete organizations" ON "public"."organizations"
FOR DELETE TO authenticated
USING ((select private.is_admin()));--> statement-breakpoint
DROP POLICY IF EXISTS "Authenticated users can manage services" ON "public"."services";--> statement-breakpoint
CREATE POLICY "Admins can manage services" ON "public"."services"
FOR ALL TO authenticated
USING ((select private.is_admin()))
WITH CHECK ((select private.is_admin()));--> statement-breakpoint
DROP POLICY IF EXISTS "Authenticated users can manage leads" ON "public"."leads";--> statement-breakpoint
CREATE POLICY "Admins can manage leads" ON "public"."leads"
FOR ALL TO authenticated
USING ((select private.is_admin()))
WITH CHECK ((select private.is_admin()));--> statement-breakpoint
DROP POLICY IF EXISTS "Authenticated users can manage bookings" ON "public"."bookings";--> statement-breakpoint
CREATE POLICY "Admins can manage bookings" ON "public"."bookings"
FOR ALL TO authenticated
USING ((select private.is_admin()))
WITH CHECK ((select private.is_admin()));--> statement-breakpoint
DROP POLICY IF EXISTS "Authenticated users can insert analytics" ON "public"."analytics_events";--> statement-breakpoint
CREATE POLICY "Admins can insert analytics" ON "public"."analytics_events"
FOR INSERT TO authenticated
WITH CHECK ((select private.is_admin()));--> statement-breakpoint
DROP POLICY IF EXISTS "Authenticated users can manage gallery items" ON "public"."gallery_items";--> statement-breakpoint
CREATE POLICY "Admins can manage gallery items" ON "public"."gallery_items"
FOR ALL TO authenticated
USING ((select private.is_admin()))
WITH CHECK ((select private.is_admin()));--> statement-breakpoint
DROP POLICY IF EXISTS "Authenticated users can manage notifications" ON "public"."notifications";--> statement-breakpoint
CREATE POLICY "Admins can manage notifications" ON "public"."notifications"
FOR ALL TO authenticated
USING ((select private.is_admin()))
WITH CHECK ((select private.is_admin()));--> statement-breakpoint
DROP POLICY IF EXISTS "Authenticated users can manage blog posts" ON "public"."blog_posts";--> statement-breakpoint
CREATE POLICY "Admins can manage blog posts" ON "public"."blog_posts"
FOR ALL TO authenticated
USING ((select private.is_admin()))
WITH CHECK ((select private.is_admin()));
