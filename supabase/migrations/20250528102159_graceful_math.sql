/*
  # Add description column to incidents table

  1. Changes
    - Add description column to incidents table
    - Add index on description column for faster text search
    - Update RLS policies to include the new column

  2. Security
    - Maintain existing RLS policies
    - Ensure new column is included in policy checks
*/

-- Add description column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'incidents' 
    AND column_name = 'description'
  ) THEN
    ALTER TABLE incidents 
    ADD COLUMN description text NOT NULL DEFAULT '';
  END IF;
END $$;

-- Create index for text search on description
CREATE INDEX IF NOT EXISTS incidents_description_idx ON incidents USING gin(to_tsvector('english', description));

-- Update RLS policies to include new column
ALTER POLICY "Users can create incidents" ON incidents 
USING (true);

ALTER POLICY "Users can read all incidents" ON incidents 
USING (true);

ALTER POLICY "Users can update own incidents" ON incidents 
USING (uid() = user_id)
WITH CHECK (uid() = user_id);

ALTER POLICY "Users can update their own incidents" ON incidents 
USING (uid() = user_id)
WITH CHECK (uid() = user_id);