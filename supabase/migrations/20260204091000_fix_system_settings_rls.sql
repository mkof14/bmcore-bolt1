/*
  # Tighten RLS for system_settings

  - Remove authenticated-wide read/write access
  - Allow public read only for is_public = true
  - Allow admins to manage all settings
*/

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
