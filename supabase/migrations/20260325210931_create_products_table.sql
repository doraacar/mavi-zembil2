/*
  # Create Products Table

  1. New Tables
    - `products`
      - `id` (uuid, primary key) - Unique product identifier
      - `name` (text) - Product name
      - `category` (text) - Product category (Tekstil, Ayakkabı, Hobi, Sanat)
      - `price` (decimal) - Product price in Turkish Lira
      - `image` (text) - Product image URL
      - `description` (text) - Detailed product description
      - `badge` (text, nullable) - Optional badge text (El Yapımı, Yeni, etc.)
      - `in_stock` (boolean) - Stock availability
      - `created_at` (timestamptz) - Record creation timestamp

  2. Security
    - Enable RLS on `products` table
    - Add policy for public read access (products are publicly viewable)
    - No insert/update/delete policies (admin-only via service role)
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  price decimal(10, 2) NOT NULL,
  image text NOT NULL,
  description text NOT NULL,
  badge text,
  in_stock boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are publicly viewable"
  ON products
  FOR SELECT
  TO anon, authenticated
  USING (true);