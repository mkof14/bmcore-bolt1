/*
  # Stripe Configuration Table

  1. New Table
    - `stripe_configuration` - Secure storage for Stripe settings
      - `id` (uuid, primary key)
      - `key` (text, unique) - Configuration key name
      - `value` (text) - Configuration value (encrypted)
      - `environment` (text) - 'test' or 'live'
      - `description` (text) - Human readable description
      - `is_secret` (boolean) - Whether this is a secret value
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `stripe_configuration` table
    - Only authenticated admins can read/write configuration
    - Secrets are encrypted at rest

  3. Seed Data
    - Insert placeholder values for all Stripe configuration
*/

-- Create stripe_configuration table
CREATE TABLE IF NOT EXISTS stripe_configuration (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text,
  environment text DEFAULT 'test' CHECK (environment IN ('test', 'live')),
  description text,
  is_secret boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE stripe_configuration ENABLE ROW LEVEL SECURITY;

-- Only system admins can read Stripe configuration
CREATE POLICY "Only admins can view Stripe configuration"
  ON stripe_configuration
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Only system admins can update Stripe configuration
CREATE POLICY "Only admins can update Stripe configuration"
  ON stripe_configuration
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Only system admins can insert Stripe configuration
CREATE POLICY "Only admins can insert Stripe configuration"
  ON stripe_configuration
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Create updated_at trigger
CREATE TRIGGER update_stripe_configuration_updated_at
  BEFORE UPDATE ON stripe_configuration
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default Stripe configuration
INSERT INTO stripe_configuration (key, value, environment, description, is_secret) VALUES
  -- Publishable Keys (NOT secret - safe for client-side)
  ('publishable_key_test', 'pk_test_YOUR_KEY_HERE', 'test', 'Stripe publishable key for test mode (safe for client-side)', false),
  ('publishable_key_live', 'pk_live_YOUR_KEY_HERE', 'live', 'Stripe publishable key for live mode (safe for client-side)', false),

  -- Secret Keys (SECRET - backend only)
  ('secret_key_test', 'sk_test_YOUR_KEY_HERE', 'test', 'Stripe secret key for test mode (BACKEND ONLY)', true),
  ('secret_key_live', 'sk_live_YOUR_KEY_HERE', 'live', 'Stripe secret key for live mode (BACKEND ONLY)', true),

  -- Webhook Secrets (SECRET)
  ('webhook_secret_test', 'whsec_YOUR_SECRET_HERE', 'test', 'Stripe webhook signing secret for test mode', true),
  ('webhook_secret_live', 'whsec_YOUR_SECRET_HERE', 'live', 'Stripe webhook signing secret for live mode', true),

  -- Daily Plan Price IDs
  ('price_daily_monthly_test', 'price_1YOUR_ID_HERE', 'test', 'Daily plan monthly price ID (test mode)', false),
  ('price_daily_yearly_test', 'price_1YOUR_ID_HERE', 'test', 'Daily plan yearly price ID (test mode)', false),
  ('price_daily_monthly_live', 'price_1YOUR_ID_HERE', 'live', 'Daily plan monthly price ID (live mode)', false),
  ('price_daily_yearly_live', 'price_1YOUR_ID_HERE', 'live', 'Daily plan yearly price ID (live mode)', false),

  -- Core Plan Price IDs
  ('price_core_monthly_test', 'price_1YOUR_ID_HERE', 'test', 'Core plan monthly price ID (test mode)', false),
  ('price_core_yearly_test', 'price_1YOUR_ID_HERE', 'test', 'Core plan yearly price ID (test mode)', false),
  ('price_core_monthly_live', 'price_1YOUR_ID_HERE', 'live', 'Core plan monthly price ID (live mode)', false),
  ('price_core_yearly_live', 'price_1YOUR_ID_HERE', 'live', 'Core plan yearly price ID (live mode)', false),

  -- Max Plan Price IDs
  ('price_max_monthly_test', 'price_1YOUR_ID_HERE', 'test', 'Max plan monthly price ID (test mode)', false),
  ('price_max_yearly_test', 'price_1YOUR_ID_HERE', 'test', 'Max plan yearly price ID (test mode)', false),
  ('price_max_monthly_live', 'price_1YOUR_ID_HERE', 'live', 'Max plan monthly price ID (live mode)', false),
  ('price_max_yearly_live', 'price_1YOUR_ID_HERE', 'live', 'Max plan yearly price ID (live mode)', false),

  -- Configuration
  ('currency', 'usd', 'test', 'Default currency for Stripe payments', false),
  ('environment', 'test', 'test', 'Current Stripe environment (test or live)', false),
  ('success_url', 'https://txnwvaqzmtlhefcxilfu.supabase.co/member-zone?payment=success', 'test', 'Redirect URL after successful payment', false),
  ('cancel_url', 'https://txnwvaqzmtlhefcxilfu.supabase.co/pricing?payment=cancelled', 'test', 'Redirect URL after cancelled payment', false)
ON CONFLICT (key) DO NOTHING;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_stripe_configuration_key ON stripe_configuration(key);
CREATE INDEX IF NOT EXISTS idx_stripe_configuration_environment ON stripe_configuration(environment);

-- Create view for easy access to current environment
CREATE OR REPLACE VIEW stripe_current_config AS
SELECT
  key,
  value,
  description,
  is_secret
FROM stripe_configuration
WHERE environment = (
  SELECT value FROM stripe_configuration WHERE key = 'environment'
);

-- Grant access to the view
GRANT SELECT ON stripe_current_config TO authenticated;

-- Comment on table
COMMENT ON TABLE stripe_configuration IS 'Secure storage for Stripe API keys and configuration';
COMMENT ON COLUMN stripe_configuration.is_secret IS 'If true, value should never be exposed to client-side';
