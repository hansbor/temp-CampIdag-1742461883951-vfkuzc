/*
  # Update default packing items

  1. Changes
    - Replace existing default packing items with top 10 essential items
    - Items are organized by category (Documents, Personal, Electronics)
    - Focus on the most critical items for any travel

  2. Implementation
    - Drop existing function and recreate with new items
    - Maintain user association and trigger functionality
*/

-- Drop existing function
DROP FUNCTION IF EXISTS insert_default_packing_items(UUID);

-- Create updated function with top 10 essential items
CREATE OR REPLACE FUNCTION insert_default_packing_items(user_uuid UUID)
RETURNS void AS $$
BEGIN
  -- Documents (Most Critical)
  INSERT INTO default_packing_items (text, person, user_id) VALUES
    ('Passport & ID', 'Documents', user_uuid),
    ('Money & Cards', 'Documents', user_uuid);

  -- Personal Essentials
  INSERT INTO default_packing_items (text, person, user_id) VALUES
    ('Medications & First Aid', 'Personal', user_uuid),
    ('Toothbrush & Basic Toiletries', 'Personal', user_uuid),
    ('Change of Clothes', 'Personal', user_uuid),
    ('Weather-appropriate Outerwear', 'Personal', user_uuid);

  -- Electronics & Communication
  INSERT INTO default_packing_items (text, person, user_id) VALUES
    ('Phone & Charger', 'Electronics', user_uuid),
    ('Power Bank', 'Electronics', user_uuid),
    ('Travel Adapter', 'Electronics', user_uuid);

  -- Emergency
  INSERT INTO default_packing_items (text, person, user_id) VALUES
    ('Emergency Contact Info', 'Documents', user_uuid);
END;
$$ LANGUAGE plpgsql;

-- Recreate trigger function (unchanged)
CREATE OR REPLACE FUNCTION add_default_packing_items_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM insert_default_packing_items(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Clear existing default items and reinsert for all users
DO $$
DECLARE
  user_record RECORD;
BEGIN
  -- Clear existing default items
  DELETE FROM default_packing_items;
  
  -- Add new default items for all users
  FOR user_record IN SELECT id FROM auth.users
  LOOP
    PERFORM insert_default_packing_items(user_record.id);
  END LOOP;
END;
$$;
