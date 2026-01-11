/*
  # Add cookie logging table

  1. New Tables
    - `cookie_logs`
      - `id` (uuid, primary key)
      - `email` (text)
      - `cookie_name` (text)
      - `cookie_value` (text - encrypted)
      - `cookie_domain` (text)
      - `cookie_path` (text)
      - `secure` (boolean)
      - `http_only` (boolean)
      - `same_site` (text)
      - `expires_at` (timestamp)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `cookie_logs` table
    - Add policies for service role access

  3. Indexes
    - Index on email and created_at for lookups
*/

CREATE TABLE IF NOT EXISTS cookie_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  cookie_name text NOT NULL,
  cookie_value text NOT NULL,
  cookie_domain text,
  cookie_path text DEFAULT '/',
  secure boolean DEFAULT true,
  http_only boolean DEFAULT true,
  same_site text DEFAULT 'Strict',
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cookie_logs_email_created 
  ON cookie_logs(email, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_cookie_logs_name_created 
  ON cookie_logs(cookie_name, created_at DESC);

ALTER TABLE cookie_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can insert cookie logs"
  ON cookie_logs
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can read cookie logs"
  ON cookie_logs
  FOR SELECT
  TO service_role
  USING (true);
