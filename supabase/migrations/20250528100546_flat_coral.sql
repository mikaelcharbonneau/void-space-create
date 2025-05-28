/*
  # Update incidents table schema
  
  1. Changes
    - Add new columns for detailed incident tracking
    - Remove description column
    - Add appropriate indexes
  
  2. Notes
    - Handles existing data by setting default values
    - Ensures data integrity with NOT NULL constraints
*/

-- First add the columns as nullable
ALTER TABLE incidents 
  ADD COLUMN IF NOT EXISTS rack_number text,
  ADD COLUMN IF NOT EXISTS part_type text,
  ADD COLUMN IF NOT EXISTS part_identifier text,
  ADD COLUMN IF NOT EXISTS u_height text,
  ADD COLUMN IF NOT EXISTS comments text;

-- Update existing rows with default values
UPDATE incidents 
SET 
  rack_number = COALESCE(rack_number, 'LEGACY'),
  part_type = COALESCE(part_type, 'Unknown'),
  part_identifier = COALESCE(part_identifier, 'Unknown');

-- Now make the columns NOT NULL
ALTER TABLE incidents 
  ALTER COLUMN rack_number SET NOT NULL,
  ALTER COLUMN part_type SET NOT NULL,
  ALTER COLUMN part_identifier SET NOT NULL;

-- Drop the description column
ALTER TABLE incidents 
  DROP COLUMN IF EXISTS description;

-- Create indexes for new columns
CREATE INDEX IF NOT EXISTS incidents_rack_number_idx ON incidents(rack_number);
CREATE INDEX IF NOT EXISTS incidents_part_type_idx ON incidents(part_type);
CREATE INDEX IF NOT EXISTS incidents_part_identifier_idx ON incidents(part_identifier);