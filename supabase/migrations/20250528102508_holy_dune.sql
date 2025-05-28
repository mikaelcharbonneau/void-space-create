/*
  # Add description column to incidents table

  1. Changes
    - Add description column to incidents table
    - Create text search index on description column
    - Update RLS policies to handle the new column properly

  2. Security
    - Maintain existing RLS policies
    - Ensure proper access control for the new column
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

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Users can create incidents" ON incidents;
DROP POLICY IF EXISTS "Users can read all incidents" ON incidents;
DROP POLICY IF EXISTS "Users can update own incidents" ON incidents;
DROP POLICY IF EXISTS "Users can update their own incidents" ON incidents;

-- Create new policies with proper syntax
CREATE POLICY "Users can create incidents" ON incidents
FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can read all incidents" ON incidents
FOR SELECT USING (true);

CREATE POLICY "Users can update own incidents" ON incidents
FOR UPDATE USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own incidents" ON incidents
FOR UPDATE USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);