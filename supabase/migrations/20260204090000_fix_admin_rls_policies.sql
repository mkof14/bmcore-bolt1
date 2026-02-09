/*
  # Tighten RLS for admin-managed tables

  - Remove overly-permissive profile policies
  - Remove authenticated-wide email template management
  - Restrict email_sends write policies to admins
*/

-- Profiles: remove permissive authenticated policies
DROP POLICY IF EXISTS "Authenticated users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can update all profiles" ON public.profiles;

-- Email templates: remove authenticated-wide management policies
DROP POLICY IF EXISTS "Authenticated users can insert email templates" ON public.email_templates;
DROP POLICY IF EXISTS "Authenticated users can update email templates" ON public.email_templates;
DROP POLICY IF EXISTS "Authenticated users can delete email templates" ON public.email_templates;

-- Email sends: restrict write access to admins
DROP POLICY IF EXISTS "System can insert email sends" ON public.email_sends;
DROP POLICY IF EXISTS "System can update email sends" ON public.email_sends;

CREATE POLICY "Admins can insert email sends"
  ON public.email_sends FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.is_admin = true
    )
  );

CREATE POLICY "Admins can update email sends"
  ON public.email_sends FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.is_admin = true
    )
  );
