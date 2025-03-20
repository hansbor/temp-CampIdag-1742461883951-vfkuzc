/*
  # Add default items tables

  1. New Tables
    - `default_todo_items`
      - `id` (uuid, primary key)
      - `text` (text, the todo item text)
      - `user_id` (uuid, foreign key to users)
      - `created_at` (timestamp)
    - `default_packing_items`
      - `id` (uuid, primary key)
      - `text` (text, the packing item text)
      - `person` (text, assigned person)
      - `user_id` (uuid, foreign key to users)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own items
*/

-- Create default todo items table
CREATE TABLE IF NOT EXISTS default_todo_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  text text NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create default packing items table
CREATE TABLE IF NOT EXISTS default_packing_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  text text NOT NULL,
  person text,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE default_todo_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE default_packing_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own default todo items"
  ON default_todo_items
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own default packing items"
  ON default_packing_items
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
