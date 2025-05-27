/*
  # Add missing columns to AuditReports table

  1. Changes
    - Add datacenter column
    - Add datahall column
    - Add issues_reported column
    - Add state column
    - Add ticket column
    - Add user_full_name column

  2. Security
    - Maintain existing RLS policies
*/

-- Add new columns to AuditReports table
ALTER TABLE "AuditReports" 
  ADD COLUMN IF NOT EXISTS "datacenter" text,
  ADD COLUMN IF NOT EXISTS "datahall" text,
  ADD COLUMN IF NOT EXISTS "issues_reported" integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "state" text CHECK ("state" IN ('Healthy', 'Warning', 'Critical')),
  ADD COLUMN IF NOT EXISTS "ticket" text,
  ADD COLUMN IF NOT EXISTS "user_full_name" text;

-- Create index for performance
CREATE INDEX IF NOT EXISTS "idx_audit_reports_state" ON "AuditReports" ("state");
CREATE INDEX IF NOT EXISTS "idx_audit_reports_datacenter" ON "AuditReports" ("datacenter");
CREATE INDEX IF NOT EXISTS "idx_audit_reports_datahall" ON "AuditReports" ("datahall");

-- Update existing rows to have a default state of 'Healthy'
UPDATE "AuditReports" 
SET "state" = 'Healthy' 
WHERE "state" IS NULL;