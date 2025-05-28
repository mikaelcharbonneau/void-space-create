/*
  # Update incidents table schema
  
  1. Changes
    - Add rack_number column to store the specific rack where the issue was found
    - Add part_type column to identify the type of part (PSU, PDU, RDHX)
    - Add part_identifier column to store specific part ID (e.g., PSU 1, PDU A)
    - Add u_height column for rack position (when applicable)
    - Remove description column as it's now broken down into specific fields
    - Add comments column for additional notes
  
  2. Security
    - Maintain existing RLS policies
*/

-- Add new columns to incidents table
ALTER TABLE incidents 
  ADD COLUMN IF NOT EXISTS rack_number text NOT NULL,
  ADD COLUMN IF NOT EXISTS part_type text NOT NULL,
  ADD COLUMN IF NOT EXISTS part_identifier text NOT NULL,
  ADD COLUMN IF NOT EXISTS u_height text,
  ADD COLUMN IF NOT EXISTS comments text,
  DROP COLUMN IF EXISTS description;

-- Create indexes for new columns
CREATE INDEX IF NOT EXISTS incidents_rack_number_idx ON incidents(rack_number);
CREATE INDEX IF NOT EXISTS incidents_part_type_idx ON incidents(part_type);