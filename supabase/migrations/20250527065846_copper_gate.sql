/*
  # Update AuditReports table schema

  1. Changes
    - Add walkthrough_id column
    - Modify ticket column to walkthrough_id
    - Ensure proper data types and constraints
    - Add indexes for performance

  2. Security
    - Maintain existing RLS policies
*/

-- Rename ticket column to walkthrough_id and change type to integer
ALTER TABLE "AuditReports" 
  DROP COLUMN IF EXISTS "ticket",
  ADD COLUMN IF NOT EXISTS "walkthrough_id" integer NOT NULL;

-- Create index for walkthrough_id
CREATE INDEX IF NOT EXISTS "idx_audit_reports_walkthrough_id" ON "AuditReports" ("walkthrough_id");

-- Ensure other required columns exist with proper constraints
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'AuditReports' AND column_name = 'datacenter') THEN
    ALTER TABLE "AuditReports" ADD COLUMN "datacenter" text NOT NULL;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'AuditReports' AND column_name = 'datahall') THEN
    ALTER TABLE "AuditReports" ADD COLUMN "datahall" text NOT NULL;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'AuditReports' AND column_name = 'issues_reported') THEN
    ALTER TABLE "AuditReports" ADD COLUMN "issues_reported" integer DEFAULT 0 NOT NULL;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'AuditReports' AND column_name = 'state') THEN
    ALTER TABLE "AuditReports" ADD COLUMN "state" text CHECK ("state" IN ('Healthy', 'Warning', 'Critical')) NOT NULL DEFAULT 'Healthy';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'AuditReports' AND column_name = 'user_full_name') THEN
    ALTER TABLE "AuditReports" ADD COLUMN "user_full_name" text NOT NULL;
  END IF;
END $$;