/*
  # Add RLS policies for all tables

  1. Security Changes
    - Enable RLS on all tables that were missing it
    - Add policies for authenticated users to manage their own data
    - Ensure consistent security across all tables

  2. Tables Updated
    - packing_list_items
    - shop_list_items
    - planning_items
*/

-- Enable RLS on tables
ALTER TABLE packing_list_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_list_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE planning_items ENABLE ROW LEVEL SECURITY;

-- Packing list items policies
CREATE POLICY "Users can manage their own packing items"
  ON packing_list_items
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Shopping list items policies
CREATE POLICY "Users can manage their own shopping items"
  ON shop_list_items
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Planning items policies
CREATE POLICY "Users can manage their own planning items"
  ON planning_items
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
