/*
  # Add Colors and Sizes to Products

  1. New Columns
    - `colors` (text) - Comma-separated list of available colors (e.g., "Siyah, Beyaz, Mavi")
    - `sizes` (text) - Comma-separated list of available sizes (e.g., "36, 37, 38, 39")

  2. Changes
    - Both columns default to NULL for optional variants
    - Products can have colors without sizes (e.g., necklaces)
    - Products can have sizes without colors (e.g., generic items)
    - Empty strings are treated as "no variants" for that type

  3. Notes
    - Admin users will input comma-separated values
    - Product Detail page will parse these and display as selectable chips
    - Customer must select available variants before adding to cart
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'colors'
  ) THEN
    ALTER TABLE products ADD COLUMN colors text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'sizes'
  ) THEN
    ALTER TABLE products ADD COLUMN sizes text;
  END IF;
END $$;