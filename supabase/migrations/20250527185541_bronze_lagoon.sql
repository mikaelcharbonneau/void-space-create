/*
  # Add missing columns to AuditReports table

  1. Changes
    - Add `walkthrough_id` column to track report sequence
    - Add `ReportData` column to store JSON report data
    - Add `user_full_name` column for display purposes
    - Add `datacenter` column for location tracking
    - Add `datahall` column for specific location
    - Add `state` column for report status
    - Add `issues_reported` column for issue count
    - Add indexes for performance optimization

  2. Notes
    - Using JSONB for ReportData to allow flexible report structure
    - Adding indexes on frequently queried columns
*/

-- Add new columns if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'AuditReports' AND column_name = 'walkthrough_id'
  ) THEN
    ALTER TABLE "AuditReports" ADD COLUMN walkthrough_id INTEGER;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'AuditReports' AND column_name = 'ReportData'
  ) THEN
    ALTER TABLE "AuditReports" ADD COLUMN "ReportData" JSONB;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'AuditReports' AND column_name = 'user_full_name'
  ) THEN
    ALTER TABLE "AuditReports" ADD COLUMN user_full_name TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'AuditReports' AND column_name = 'datacenter'
  ) THEN
    ALTER TABLE "AuditReports" ADD COLUMN datacenter TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'AuditReports' AND column_name = 'datahall'
  ) THEN
    ALTER TABLE "AuditReports" ADD COLUMN datahall TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'AuditReports' AND column_name = 'state'
  ) THEN
    ALTER TABLE "AuditReports" ADD COLUMN state TEXT DEFAULT 'Healthy';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'AuditReports' AND column_name = 'issues_reported'
  ) THEN
    ALTER TABLE "AuditReports" ADD COLUMN issues_reported INTEGER DEFAULT 0;
  END IF;
END $$;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_audit_reports_walkthrough_id ON "AuditReports" (walkthrough_id);
CREATE INDEX IF NOT EXISTS idx_audit_reports_datacenter_datahall ON "AuditReports" (datacenter, datahall);
CREATE INDEX IF NOT EXISTS idx_audit_reports_state ON "AuditReports" (state);