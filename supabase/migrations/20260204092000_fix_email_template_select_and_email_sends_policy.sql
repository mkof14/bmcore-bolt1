/*
  # Normalize email templates/select and email_sends admin policy

  - Remove authenticated-wide SELECT on email_templates
  - Ensure admin-only SELECT on email_sends uses profiles.is_admin
*/

-- Email templates: drop authenticated-wide select policy if exists
DROP POLICY IF EXISTS "Authenticated users can view email templates" ON public.email_templates;
DROP POLICY IF EXISTS "Users can view email templates" ON public.email_templates;

-- Email sends: replace admin view policy to use profiles.is_admin
DROP POLICY IF EXISTS "Admins can view all email sends" ON public.email_sends;

CREATE POLICY "Admins can view all email sends"
  ON public.email_sends FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.is_admin = true
    )
  );
