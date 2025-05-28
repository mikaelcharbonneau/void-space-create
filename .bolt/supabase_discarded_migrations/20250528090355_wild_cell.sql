-- Drop existing table if it exists
DROP TABLE IF EXISTS "AuditReports";

-- Create new table with correct schema
CREATE TABLE "AuditReports" (
  "Id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "GeneratedBy" text NOT NULL,
  "Timestamp" timestamptz DEFAULT now(),
  "datacenter" text,
  "datahall" text,
  "issues_reported" integer DEFAULT 0,
  "state" text DEFAULT 'Healthy',
  "walkthrough_id" integer,
  "user_full_name" text,
  "ReportData" jsonb
);

-- Create indexes for better query performance
CREATE INDEX idx_audit_reports_timestamp ON "AuditReports"("Timestamp" DESC);
CREATE INDEX idx_audit_reports_datacenter ON "AuditReports"(datacenter);
CREATE INDEX idx_audit_reports_datahall ON "AuditReports"(datahall);
CREATE INDEX idx_audit_reports_state ON "AuditReports"(state);
CREATE INDEX idx_audit_reports_walkthrough_id ON "AuditReports"(walkthrough_id);

-- Enable Row Level Security
ALTER TABLE "AuditReports" ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read all reports"
  ON "AuditReports"
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create reports"
  ON "AuditReports"
  FOR INSERT
  TO authenticated
  WITH CHECK (true);