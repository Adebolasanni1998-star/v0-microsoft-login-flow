/*
  # Create authentication logs table

  1. New Tables
    - `auth_logs`
      - `id` (uuid, primary key)
      - `email` (text, not null)
      - `login_attempt_type` (text: 'success', 'failed')
      - `ip_address` (text)
      - `browser_info` (jsonb - user agent, browser, os)
      - `device_info` (jsonb - device type, is_mobile)
      - `timestamp` (timestamp)
      - `error_message` (text, nullable)
      - `suspicious_flag` (boolean, default false)
      - `flagging_reason` (text, nullable)

  2. Security
    - Enable RLS on `auth_logs` table
    - Add policies for secure access

  3. Indexes
    - Index on email and timestamp for quick lookups
    - Index on ip_address for pattern detection
*/

CREATE TABLE IF NOT EXISTS auth_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  login_attempt_type text NOT NULL CHECK (login_attempt_type IN ('success', 'failed')),
  ip_address text,
  browser_info jsonb,
  device_info jsonb,
  timestamp timestamptz DEFAULT now(),
  error_message text,
  suspicious_flag boolean DEFAULT false,
  flagging_reason text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_auth_logs_email_timestamp 
  ON auth_logs(email, timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_auth_logs_ip_timestamp 
  ON auth_logs(ip_address, timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_auth_logs_suspicious 
  ON auth_logs(suspicious_flag, timestamp DESC);

ALTER TABLE auth_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can insert auth logs"
  ON auth_logs
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can read auth logs"
  ON auth_logs
  FOR SELECT
  TO service_role
  USING (true);
