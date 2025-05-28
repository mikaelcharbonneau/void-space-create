/*
  # Add walkthrough_id to incidents table

  1. Changes
    - Add walkthrough_id column to incidents table
    - Add index for better query performance
    - Update existing records with default value
  
  2. Security
    - Maintain existing RLS policies
*/

-- Add walkthrough_id column
ALTER TABLE incidents 
  ADD COLUMN IF NOT EXISTS walkthrough_id integer;

-- Create index for walkthrough_id
CREATE INDEX IF NOT EXISTS incidents_walkthrough_id_idx ON incidents(walkthrough_id);

-- Update existing records with a default value
UPDATE incidents 
SET walkthrough_id = 1 
WHERE walkthrough_id IS NULL;