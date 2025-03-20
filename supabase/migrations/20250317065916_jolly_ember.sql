/*
  # Add default packing items

  1. Changes
    - Add default packing items for common travel needs
    - Items are organized by person and category
    - These will be automatically added when creating new travels
    - Each item is associated with the authenticated user

  2. Default Items Added
    - Personal items (toiletries, clothing, etc.)
    - Electronics and chargers
    - Documents and money
    - General travel items
*/

-- Create a function to insert default packing items for a user
CREATE OR REPLACE FUNCTION insert_default_packing_items(user_uuid UUID)
RETURNS void AS $$
BEGIN
  -- Personal Items
  INSERT INTO default_packing_items (text, person, user_id) VALUES
    ('Toothbrush & toothpaste', 'Personal', user_uuid),
    ('Deodorant', 'Personal', user_uuid),
    ('Shampoo & conditioner', 'Personal', user_uuid),
    ('Medications', 'Personal', user_uuid),
    ('Underwear', 'Personal', user_uuid),
    ('Socks', 'Personal', user_uuid),
    ('Pajamas', 'Personal', user_uuid),
    ('Casual clothes', 'Personal', user_uuid),
    ('Comfortable shoes', 'Personal', user_uuid);

  -- Electronics
  INSERT INTO default_packing_items (text, person, user_id) VALUES
    ('Phone charger', 'Electronics', user_uuid),
    ('Power bank', 'Electronics', user_uuid),
    ('Camera', 'Electronics', user_uuid),
    ('Universal adapter', 'Electronics', user_uuid),
    ('Headphones', 'Electronics', user_uuid);

  -- Documents
  INSERT INTO default_packing_items (text, person, user_id) VALUES
    ('Passport', 'Documents', user_uuid),
    ('Travel insurance', 'Documents', user_uuid),
    ('Boarding passes', 'Documents', user_uuid),
    ('Hotel reservations', 'Documents', user_uuid),
    ('Cash & cards', 'Documents', user_uuid);

  -- General Items
  INSERT INTO default_packing_items (text, person, user_id) VALUES
    ('First aid kit', 'General', user_uuid),
    ('Umbrella', 'General', user_uuid),
    ('Water bottle', 'General', user_uuid),
    ('Snacks', 'General', user_uuid),
    ('Backpack/day bag', 'General', user_uuid);
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically add default items for new users
CREATE OR REPLACE FUNCTION add_default_packing_items_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM insert_default_packing_items(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to auth.users table
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION add_default_packing_items_for_new_user();

-- Insert default items for existing users
DO $$
DECLARE
  user_record RECORD;
BEGIN
  FOR user_record IN SELECT id FROM auth.users
  LOOP
    PERFORM insert_default_packing_items(user_record.id);
  END LOOP;
END;
$$;
