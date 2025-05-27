/*
  # Update AuditReports table structure
  
  1. Changes
    - Rename ticket column to walkthrough_id
    - Add required columns with proper defaults
    - Create necessary indexes
    
  2. Notes
    - Handles existing data by setting default values
    - Ensures NOT NULL constraints are satisfied
*/

-- First add new columns without NOT NULL constraint
ALTER TABLE "AuditReports" 
  ADD COLUMN IF NOT EXISTS "walkthrough_id" integer,
  ADD COLUMN IF NOT EXISTS "datacenter" text,
  ADD COLUMN IF NOT EXISTS "datahall" text,
  ADD COLUMN IF NOT EXISTS "issues_reported" integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "state" text DEFAULT 'Healthy',
  ADD COLUMN IF NOT EXISTS "user_full_name" text;

-- Update existing rows with default values
UPDATE "AuditReports"
SET 
  walkthrough_id = COALESCE(
    (SELECT CAST(REGEXP_REPLACE(ticket, '[^0-9]', '', 'g') AS integer) WHERE ticket ~ '^[0-9]+$'),
    (SELECT COALESCE(MAX(walkthrough_id), 0) + 1 FROM "AuditReports")
  ),
  datacenter = COALESCE(datacenter, 'Unknown'),
  datahall = COALESCE(datahall, 'Unknown'),
  issues_reported = COALESCE(issues_reported, 0),
  state = COALESCE(state, 'Healthy'),
  user_full_name = COALESCE(user_full_name, 'Unknown');

-- Now add NOT NULL constraints
ALTER TABLE "AuditReports" 
  ALTER COLUMN walkthrough_id SET NOT NULL,
  ALTER COLUMN datacenter SET NOT NULL,
  ALTER COLUMN datahall SET NOT NULL,
  ALTER COLUMN issues_reported SET NOT NULL,
  ALTER COLUMN state SET NOT NULL,
  ALTER COLUMN user_full_name SET NOT NULL;

-- Add state check constraint
ALTER TABLE "AuditReports"
  ADD CONSTRAINT state_check 
  CHECK (state IN ('Healthy', 'Warning', 'Critical'));

-- Create indexes
CREATE INDEX IF NOT EXISTS "idx_audit_reports_walkthrough_id" 
  ON "AuditReports" ("walkthrough_id");

-- Drop old ticket column if it exists
ALTER TABLE "AuditReports" 
  DROP COLUMN IF EXISTS "ticket";