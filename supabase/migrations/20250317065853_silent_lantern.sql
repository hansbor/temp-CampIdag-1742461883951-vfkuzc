/*
  # Add default packing list items

  1. Changes
    - Add default packing items for common travel needs
    - Items are organized by person and category
    - These will be automatically added when creating new travels

  2. Default Items Added
    - Personal items (toiletries, clothing, etc.)
    - Electronics and chargers
    - Documents and money
    - General travel items
*/

-- Insert default packing items for general use
INSERT INTO default_packing_items (text, person) VALUES
  -- Personal Items
  ('Toothbrush & toothpaste', 'Personal'),
  ('Deodorant', 'Personal'),
  ('Shampoo & conditioner', 'Personal'),
  ('Medications', 'Personal'),
  ('Underwear', 'Personal'),
  ('Socks', 'Personal'),
  ('Pajamas', 'Personal'),
  ('Casual clothes', 'Personal'),
  ('Comfortable shoes', 'Personal'),

  -- Electronics
  ('Phone charger', 'Electronics'),
  ('Power bank', 'Electronics'),
  ('Camera', 'Electronics'),
  ('Universal adapter', 'Electronics'),
  ('Headphones', 'Electronics'),

  -- Documents
  ('Passport', 'Documents'),
  ('Travel insurance', 'Documents'),
  ('Boarding passes', 'Documents'),
  ('Hotel reservations', 'Documents'),
  ('Cash & cards', 'Documents'),

  -- General Items
  ('First aid kit', 'General'),
  ('Umbrella', 'General'),
  ('Water bottle', 'General'),
  ('Snacks', 'General'),
  ('Backpack/day bag', 'General');
