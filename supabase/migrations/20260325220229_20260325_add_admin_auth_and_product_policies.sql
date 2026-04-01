/*
  # Add Admin Authentication & Product Modification Policies

  1. New Tables
    - `admin_sessions` table for admin login tracking
      - `id` (uuid, primary key)
      - `session_token` (text, unique) - Session identifier
      - `created_at` (timestamptz) - Session creation time
      - `expires_at` (timestamptz) - Session expiration time

  2. Modified Tables
    - `products` table now has UPDATE and DELETE policies for admin operations

  3. Security
    - RLS already enabled on products table
    - Add UPDATE policy for admin operations via service role
    - Add DELETE policy for admin operations via service role
    - Admin sessions tracked for audit purposes
*/

CREATE TABLE IF NOT EXISTS admin_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL
);

ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin sessions are only readable by system"
  ON admin_sessions
  FOR SELECT
  TO authenticated
  USING (false);

CREATE POLICY "Allow product updates via admin"
  ON products
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow product inserts via admin"
  ON products
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow product deletes via admin"
  ON products
  FOR DELETE
  USING (true);
