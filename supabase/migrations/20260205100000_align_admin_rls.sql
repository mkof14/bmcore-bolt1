/*
  # Align admin RLS checks to profiles.is_admin (via is_admin_cached)

  - Replace legacy admin checks that rely on admin_users, profiles.role, or user_roles.role
  - Standardize on public.is_admin_cached(auth.uid()) for admin access
  - Tighten overly-permissive email campaign policies
  - Prevent non-admins from elevating profiles.is_admin or admin roles via self-update
*/

-- PROFILES: prevent self-escalation on update
DROP POLICY IF EXISTS "update_own_profile" ON public.profiles;
CREATE POLICY "update_own_profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND is_admin = false
    AND (role IS NULL OR role NOT IN ('admin', 'super_admin'))
  );

-- ADMIN USERS TABLE: remove recursion and align to cached admin check
DROP POLICY IF EXISTS "Only admins can manage admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Super admins can manage all admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can view all admin users" ON public.admin_users;

CREATE POLICY "Admins can view all admin users"
  ON public.admin_users
  FOR SELECT
  TO authenticated
  USING (public.is_admin_cached(auth.uid()));

CREATE POLICY "Admins can manage admin users"
  ON public.admin_users
  FOR ALL
  TO authenticated
  USING (public.is_admin_cached(auth.uid()))
  WITH CHECK (public.is_admin_cached(auth.uid()));

-- CORE ADMIN-MANAGED TABLES
DROP POLICY IF EXISTS "Only admins can manage plans" ON public.plans;
CREATE POLICY "Only admins can manage plans"
  ON public.plans
  FOR ALL
  TO authenticated
  USING (public.is_admin_cached(auth.uid()))
  WITH CHECK (public.is_admin_cached(auth.uid()));

DROP POLICY IF EXISTS "Only admins can manage subscriptions" ON public.subscriptions;
CREATE POLICY "Only admins can manage subscriptions"
  ON public.subscriptions
  FOR ALL
  TO authenticated
  USING (public.is_admin_cached(auth.uid()))
  WITH CHECK (public.is_admin_cached(auth.uid()));

DROP POLICY IF EXISTS "Only admins can manage categories" ON public.categories;
CREATE POLICY "Only admins can manage categories"
  ON public.categories
  FOR ALL
  TO authenticated
  USING (public.is_admin_cached(auth.uid()))
  WITH CHECK (public.is_admin_cached(auth.uid()));

DROP POLICY IF EXISTS "Only admins can manage services" ON public.services;
CREATE POLICY "Only admins can manage services"
  ON public.services
  FOR ALL
  TO authenticated
  USING (public.is_admin_cached(auth.uid()))
  WITH CHECK (public.is_admin_cached(auth.uid()));

DROP POLICY IF EXISTS "Only admins can manage templates" ON public.report_templates;
CREATE POLICY "Only admins can manage templates"
  ON public.report_templates
  FOR ALL
  TO authenticated
  USING (public.is_admin_cached(auth.uid()))
  WITH CHECK (public.is_admin_cached(auth.uid()));

DROP POLICY IF EXISTS "Only admins can read audit logs" ON public.audit_logs;
CREATE POLICY "Only admins can read audit logs"
  ON public.audit_logs
  FOR SELECT
  TO authenticated
  USING (public.is_admin_cached(auth.uid()));

-- AI MODELS / PERSONAS / DEVICE BRANDS
DROP POLICY IF EXISTS "Only admins can manage AI models" ON public.ai_models;
CREATE POLICY "Only admins can manage AI models"
  ON public.ai_models
  FOR ALL
  TO authenticated
  USING (public.is_admin_cached(auth.uid()))
  WITH CHECK (public.is_admin_cached(auth.uid()));

DROP POLICY IF EXISTS "Only admins can manage personas" ON public.assistant_personas;
CREATE POLICY "Only admins can manage personas"
  ON public.assistant_personas
  FOR ALL
  TO authenticated
  USING (public.is_admin_cached(auth.uid()))
  WITH CHECK (public.is_admin_cached(auth.uid()));

DROP POLICY IF EXISTS "Only admins can manage device brands" ON public.device_brands;
CREATE POLICY "Only admins can manage device brands"
  ON public.device_brands
  FOR ALL
  TO authenticated
  USING (public.is_admin_cached(auth.uid()))
  WITH CHECK (public.is_admin_cached(auth.uid()));

-- ADMIN CONTENT TABLES
DROP POLICY IF EXISTS "Admins can insert blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins can update blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins can delete blog posts" ON public.blog_posts;
CREATE POLICY "Admins can insert blog posts"
  ON public.blog_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin_cached(auth.uid()));
CREATE POLICY "Admins can update blog posts"
  ON public.blog_posts
  FOR UPDATE
  TO authenticated
  USING (public.is_admin_cached(auth.uid()))
  WITH CHECK (public.is_admin_cached(auth.uid()));
CREATE POLICY "Admins can delete blog posts"
  ON public.blog_posts
  FOR DELETE
  TO authenticated
  USING (public.is_admin_cached(auth.uid()));

DROP POLICY IF EXISTS "Admins can insert news" ON public.news_items;
DROP POLICY IF EXISTS "Admins can update news" ON public.news_items;
DROP POLICY IF EXISTS "Admins can delete news" ON public.news_items;
CREATE POLICY "Admins can insert news"
  ON public.news_items
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin_cached(auth.uid()));
CREATE POLICY "Admins can update news"
  ON public.news_items
  FOR UPDATE
  TO authenticated
  USING (public.is_admin_cached(auth.uid()))
  WITH CHECK (public.is_admin_cached(auth.uid()));
CREATE POLICY "Admins can delete news"
  ON public.news_items
  FOR DELETE
  TO authenticated
  USING (public.is_admin_cached(auth.uid()));

DROP POLICY IF EXISTS "Admins can insert careers" ON public.career_postings;
DROP POLICY IF EXISTS "Admins can update careers" ON public.career_postings;
DROP POLICY IF EXISTS "Admins can delete careers" ON public.career_postings;
CREATE POLICY "Admins can insert careers"
  ON public.career_postings
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin_cached(auth.uid()));
CREATE POLICY "Admins can update careers"
  ON public.career_postings
  FOR UPDATE
  TO authenticated
  USING (public.is_admin_cached(auth.uid()))
  WITH CHECK (public.is_admin_cached(auth.uid()));
CREATE POLICY "Admins can delete careers"
  ON public.career_postings
  FOR DELETE
  TO authenticated
  USING (public.is_admin_cached(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage marketing docs" ON public.marketing_documents;
CREATE POLICY "Admins can manage marketing docs"
  ON public.marketing_documents
  FOR ALL
  TO authenticated
  USING (public.is_admin_cached(auth.uid()))
  WITH CHECK (public.is_admin_cached(auth.uid()));

DROP POLICY IF EXISTS "Admins can view metrics" ON public.business_metrics;
DROP POLICY IF EXISTS "Super admins can manage metrics" ON public.business_metrics;
CREATE POLICY "Admins can view metrics"
  ON public.business_metrics
  FOR SELECT
  TO authenticated
  USING (public.is_admin_cached(auth.uid()));
CREATE POLICY "Admins can manage metrics"
  ON public.business_metrics
  FOR ALL
  TO authenticated
  USING (public.is_admin_cached(auth.uid()))
  WITH CHECK (public.is_admin_cached(auth.uid()));

DROP POLICY IF EXISTS "Admins can view audit logs" ON public.audit_logs;
CREATE POLICY "Admins can view audit logs"
  ON public.audit_logs
  FOR SELECT
  TO authenticated
  USING (public.is_admin_cached(auth.uid()));

-- ADVANCED FEATURES: admin-only views
DROP POLICY IF EXISTS "Admins can view all exit intent captures" ON public.exit_intent_captures;
CREATE POLICY "Admins can view all exit intent captures"
  ON public.exit_intent_captures
  FOR SELECT
  TO authenticated
  USING (public.is_admin_cached(auth.uid()));

DROP POLICY IF EXISTS "Admins can view all feedback" ON public.user_feedback;
CREATE POLICY "Admins can view all feedback"
  ON public.user_feedback
  FOR SELECT
  TO authenticated
  USING (public.is_admin_cached(auth.uid()));

DROP POLICY IF EXISTS "Admins can view all session recordings" ON public.session_recordings;
CREATE POLICY "Admins can view all session recordings"
  ON public.session_recordings
  FOR SELECT
  TO authenticated
  USING (public.is_admin_cached(auth.uid()));

-- SOCIAL MEDIA FEATURES: admin manage
DROP POLICY IF EXISTS "Admins can manage contests" ON public.social_contests;
CREATE POLICY "Admins can manage contests"
  ON public.social_contests
  FOR ALL
  TO authenticated
  USING (public.is_admin_cached(auth.uid()))
  WITH CHECK (public.is_admin_cached(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage videos" ON public.video_content;
CREATE POLICY "Admins can manage videos"
  ON public.video_content
  FOR ALL
  TO authenticated
  USING (public.is_admin_cached(auth.uid()))
  WITH CHECK (public.is_admin_cached(auth.uid()));

-- PUSH NOTIFICATIONS: admin manage/read
DROP POLICY IF EXISTS "Admins can manage all subscriptions" ON public.push_subscriptions;
CREATE POLICY "Admins can manage all subscriptions"
  ON public.push_subscriptions
  FOR ALL
  TO authenticated
  USING (public.is_admin_cached(auth.uid()))
  WITH CHECK (public.is_admin_cached(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage all notifications" ON public.notification_queue;
CREATE POLICY "Admins can manage all notifications"
  ON public.notification_queue
  FOR ALL
  TO authenticated
  USING (public.is_admin_cached(auth.uid()))
  WITH CHECK (public.is_admin_cached(auth.uid()));

DROP POLICY IF EXISTS "Admins can read all notification history" ON public.notification_history;
CREATE POLICY "Admins can read all notification history"
  ON public.notification_history
  FOR SELECT
  TO authenticated
  USING (public.is_admin_cached(auth.uid()));

-- ANALYTICS: admin read
DROP POLICY IF EXISTS "Admins can read all analytics events" ON public.analytics_events;
CREATE POLICY "Admins can read all analytics events"
  ON public.analytics_events
  FOR SELECT
  TO authenticated
  USING (public.is_admin_cached(auth.uid()));

DROP POLICY IF EXISTS "Admins can read all performance metrics" ON public.performance_metrics;
CREATE POLICY "Admins can read all performance metrics"
  ON public.performance_metrics
  FOR SELECT
  TO authenticated
  USING (public.is_admin_cached(auth.uid()));

-- ERROR LOGS: admin read/update
DROP POLICY IF EXISTS "Admins can read all error logs" ON public.error_logs;
DROP POLICY IF EXISTS "Admins can update error logs" ON public.error_logs;
CREATE POLICY "Admins can read all error logs"
  ON public.error_logs
  FOR SELECT
  TO authenticated
  USING (public.is_admin_cached(auth.uid()));
CREATE POLICY "Admins can update error logs"
  ON public.error_logs
  FOR UPDATE
  TO authenticated
  USING (public.is_admin_cached(auth.uid()))
  WITH CHECK (public.is_admin_cached(auth.uid()));

-- TESTIMONIALS / REVIEWS: admin manage
DROP POLICY IF EXISTS "Admins can manage testimonials" ON public.testimonials;
CREATE POLICY "Admins can manage testimonials"
  ON public.testimonials
  FOR ALL
  TO authenticated
  USING (public.is_admin_cached(auth.uid()))
  WITH CHECK (public.is_admin_cached(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage all reviews" ON public.service_reviews;
CREATE POLICY "Admins can manage all reviews"
  ON public.service_reviews
  FOR ALL
  TO authenticated
  USING (public.is_admin_cached(auth.uid()))
  WITH CHECK (public.is_admin_cached(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage trust metrics" ON public.trust_metrics;
CREATE POLICY "Admins can manage trust metrics"
  ON public.trust_metrics
  FOR ALL
  TO authenticated
  USING (public.is_admin_cached(auth.uid()))
  WITH CHECK (public.is_admin_cached(auth.uid()));

-- EMAIL CAMPAIGNS: admin-only
DROP POLICY IF EXISTS "authenticated_read_campaigns" ON public.email_campaigns;
DROP POLICY IF EXISTS "authenticated_write_campaigns" ON public.email_campaigns;
CREATE POLICY "Admins can manage email campaigns"
  ON public.email_campaigns
  FOR ALL
  TO authenticated
  USING (public.is_admin_cached(auth.uid()))
  WITH CHECK (public.is_admin_cached(auth.uid()));

DROP POLICY IF EXISTS "authenticated_read_logs" ON public.email_campaign_logs;
CREATE POLICY "Admins can manage email campaign logs"
  ON public.email_campaign_logs
  FOR ALL
  TO authenticated
  USING (public.is_admin_cached(auth.uid()))
  WITH CHECK (public.is_admin_cached(auth.uid()));
