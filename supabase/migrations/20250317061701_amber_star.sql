/*
  # Add cascade delete for day-related items
  
  1. Changes
    - Add ON DELETE CASCADE to foreign key constraints for:
      - packing_list_items
      - planning_items
      - shop_list_items
    - This ensures all related items are automatically deleted when a day is removed
  
  2. Security
    - Maintains existing RLS policies
    - No changes to access controls needed
*/

-- Update packing_list_items to cascade delete
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'packing_list_items_user_id_fkey'
  ) THEN
    ALTER TABLE packing_list_items
    DROP CONSTRAINT packing_list_items_user_id_fkey;
  END IF;
END $$;

ALTER TABLE packing_list_items
ADD CONSTRAINT packing_list_items_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update planning_items to cascade delete
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'planning_items_user_id_fkey'
  ) THEN
    ALTER TABLE planning_items
    DROP CONSTRAINT planning_items_user_id_fkey;
  END IF;
END $$;

ALTER TABLE planning_items
ADD CONSTRAINT planning_items_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update shop_list_items to cascade delete
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'shop_list_items_user_id_fkey'
  ) THEN
    ALTER TABLE shop_list_items
    DROP CONSTRAINT shop_list_items_user_id_fkey;
  END IF;
END $$;

ALTER TABLE shop_list_items
ADD CONSTRAINT shop_list_items_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
