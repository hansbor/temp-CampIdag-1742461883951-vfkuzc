/*
  # Fix todos table and policies

  1. Changes
    - Add safety checks for existing policy
    - Ensure table and policy are created only if they don't exist

  2. Security
    - Maintain RLS on todos table
    - Ensure policy for authenticated users
*/

-- Create todos table if it doesn't exist
CREATE TABLE IF NOT EXISTS todos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text,
  status text,
  progress integer DEFAULT 0,
  user_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists and create new one
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'todos' 
    AND policyname = 'Users can manage their own todos'
  ) THEN
    CREATE POLICY "Users can manage their own todos"
      ON todos
      FOR ALL
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;
