/*
  # Update RLS policies for shared access

  1. Security Changes
    - Update policies to allow all authenticated users to access all data
    - Remove user_id restrictions from policies
    - Maintain basic authentication requirement

  2. Tables Updated
    - days
    - todos
    - packing_list_items
    - shop_list_items
    - planning_items
    - default_todo_items
    - default_packing_items
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can manage their own days" ON days;
DROP POLICY IF EXISTS "Users can manage their own todos" ON todos;
DROP POLICY IF EXISTS "Users can manage their own packing items" ON packing_list_items;
DROP POLICY IF EXISTS "Users can manage their own shopping items" ON shop_list_items;
DROP POLICY IF EXISTS "Users can manage their own planning items" ON planning_items;
DROP POLICY IF EXISTS "Users can manage their own default todo items" ON default_todo_items;
DROP POLICY IF EXISTS "Users can manage their own default packing items" ON default_packing_items;

-- Create new shared access policies
CREATE POLICY "Authenticated users can manage all days"
  ON days
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage all todos"
  ON todos
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage all packing items"
  ON packing_list_items
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage all shopping items"
  ON shop_list_items
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage all planning items"
  ON planning_items
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage all default todo items"
  ON default_todo_items
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage all default packing items"
  ON default_packing_items
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
