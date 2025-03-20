-- Add start_date, end_date, and status columns to the Days table
ALTER TABLE "Days"
ADD COLUMN start_date DATE,
ADD COLUMN end_date DATE,
ADD COLUMN status TEXT;

-- Optional: Add a constraint to ensure start_date is before end_date
-- ALTER TABLE "Days"
-- ADD CONSTRAINT start_before_end CHECK (start_date <= end_date);
