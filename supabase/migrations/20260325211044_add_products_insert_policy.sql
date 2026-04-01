/*
  # Add Insert Policy for Products

  1. Security Changes
    - Add policy to allow anonymous and authenticated users to insert products
    - This is temporary for seeding purposes
    - In production, this should be restricted to admin users only
*/

CREATE POLICY "Allow insert for seeding"
  ON products
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);