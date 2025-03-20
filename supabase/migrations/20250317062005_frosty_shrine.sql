/*
  # Rename Day to Travel

  1. Changes
    - Rename 'name' column in days table to be more descriptive of travel
    - Update column comments to reflect travel context
    - Add new index for travel name searching

  2. Security
    - Maintains existing RLS policies
    - No changes to security model needed
*/

-- Update the days table to better reflect travel context
ALTER TABLE days RENAME COLUMN name TO travel_name;

-- Add a comment to explain the purpose
COMMENT ON COLUMN days.travel_name IS 'Name of the travel/trip';

-- Add an index for travel name searches
CREATE INDEX IF NOT EXISTS idx_days_travel_name ON days (travel_name);

-- Update existing data to use "Travel" prefix instead of "Day"
UPDATE days 
SET travel_name = REPLACE(travel_name, 'Day', 'Travel')
WHERE travel_name LIKE 'Day%';
