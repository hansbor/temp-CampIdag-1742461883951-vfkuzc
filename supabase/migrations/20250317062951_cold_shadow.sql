/*
  # Rename days table name column

  1. Changes
    - Rename the 'name' column to 'travel' in the days table
    - Update all references in foreign key constraints and policies
    - Update existing data to use "Travel" prefix

  2. Security
    - Preserves existing RLS policies
*/

-- Rename the column
ALTER TABLE days RENAME COLUMN name TO travel;

-- Add a comment to explain the purpose
COMMENT ON COLUMN days.travel IS 'Name of the travel/trip';

-- Add an index for travel name searches
CREATE INDEX IF NOT EXISTS idx_days_travel ON days (travel);

-- Update existing data to use "Travel" prefix
UPDATE days 
SET travel = REPLACE(travel, 'Day', 'Travel')
WHERE travel LIKE 'Day%';
