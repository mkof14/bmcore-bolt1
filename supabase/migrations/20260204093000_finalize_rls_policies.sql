/*
  # Finalize RLS Policies (canonical set)
  - profiles
  - email_templates
  - email_sends
  - system_settings
*/

-- PROFILES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "read_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "update_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can update all profiles" ON public.profiles;

CREATE POLICY "read_own_profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "update_own_profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (public.is_admin_cached(auth.uid()));

CREATE POLICY "Admins can update any profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (public.is_admin_cached(auth.uid()))
  WITH CHECK (public.is_admin_cached(auth.uid()));

-- EMAIL_TEMPLATES
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_read_email_templates" ON public.email_templates;
DROP POLICY IF EXISTS "admin_insert_email_templates" ON public.email_templates;
DROP POLICY IF EXISTS "admin_update_email_templates" ON public.email_templates;
DROP POLICY IF EXISTS "admin_delete_email_templates" ON public.email_templates;
DROP POLICY IF EXISTS "Authenticated users can insert email templates" ON public.email_templates;
DROP POLICY IF EXISTS "Authenticated users can update email templates" ON public.email_templates;
DROP POLICY IF EXISTS "Authenticated users can delete email templates" ON public.email_templates;
DROP POLICY IF EXISTS "Authenticated users can view email templates" ON public.email_templates;
DROP POLICY IF EXISTS "Users can view email templates" ON public.email_templates;
DROP POLICY IF EXISTS "Admins can view all email templates" ON public.email_templates;

CREATE POLICY "admin_read_email_templates"
  ON public.email_templates
  FOR SELECT
  TO authenticated
  USING (public.is_admin_cached(auth.uid()));

CREATE POLICY "admin_insert_email_templates"
  ON public.email_templates
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin_cached(auth.uid()));

CREATE POLICY "admin_update_email_templates"
  ON public.email_templates
  FOR UPDATE
  TO authenticated
  USING (public.is_admin_cached(auth.uid()))
  WITH CHECK (public.is_admin_cached(auth.uid()));

CREATE POLICY "admin_delete_email_templates"
  ON public.email_templates
  FOR DELETE
  TO authenticated
  USING (public.is_admin_cached(auth.uid()));

-- EMAIL_SENDS
ALTER TABLE public.email_sends ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can view all email sends" ON public.email_sends;
DROP POLICY IF EXISTS "Users can view their own email sends" ON public.email_sends;
DROP POLICY IF EXISTS "System can insert email sends" ON public.email_sends;
DROP POLICY IF EXISTS "System can update email sends" ON public.email_sends;
DROP POLICY IF EXISTS "Admins can insert email sends" ON public.email_sends;
DROP POLICY IF EXISTS "Admins can update email sends" ON public.email_sends;

CREATE POLICY "Admins can view all email sends"
  ON public.email_sends
  FOR SELECT
  TO authenticated
  USING (public.is_admin_cached(auth.uid()));

CREATE POLICY "Users can view their own email sends"
  ON public.email_sends
  FOR SELECT
  TO authenticated
  USING (recipient_user_id = auth.uid());

CREATE POLICY "Admins can insert email sends"
  ON public.email_sends
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin_cached(auth.uid()));

CREATE POLICY "Admins can update email sends"
  ON public.email_sends
  FOR UPDATE
  TO authenticated
  USING (public.is_admin_cached(auth.uid()))
  WITH CHECK (public.is_admin_cached(auth.uid()));

-- SYSTEM_SETTINGS
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view public settings" ON public.system_settings;
DROP POLICY IF EXISTS "Admins can manage settings" ON public.system_settings;
DROP POLICY IF EXISTS "Authenticated users can view all settings" ON public.system_settings;
DROP POLICY IF EXISTS "Authenticated users can manage settings" ON public.system_settings;

CREATE POLICY "Public can view public settings"
  ON public.system_settings
  FOR SELECT
  USING (is_public = true);

CREATE POLICY "Admins can manage settings"
  ON public.system_settings
  FOR ALL
  TO authenticated
  USING (public.is_admin_cached(auth.uid()))
  WITH CHECK (public.is_admin_cached(auth.uid()));
