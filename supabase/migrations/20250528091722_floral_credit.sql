/*
  # Create reports and incidents tables

  1. New Tables
    - `incidents`
      - `id` (uuid, primary key)
      - `location` (text)
      - `datahall` (text) 
      - `description` (text)
      - `severity` (incident_severity)
      - `status` (incident_status)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `user_id` (uuid, references auth.users)

    - `reports`
      - `id` (uuid, primary key)
      - `title` (text)
      - `generated_by` (uuid, references auth.users)
      - `generated_at` (timestamptz)
      - `date_range_start` (timestamptz)
      - `date_range_end` (timestamptz)
      - `datacenter` (text)
      - `datahall` (text)
      - `status` (text)
      - `total_incidents` (integer)
      - `report_data` (jsonb)

  2. Enums
    - incident_severity: critical, high, medium, low
    - incident_status: open, in-progress, resolved

  3. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create enums
CREATE TYPE incident_severity AS ENUM ('critical', 'high', 'medium', 'low');
CREATE TYPE incident_status AS ENUM ('open', 'in-progress', 'resolved');

-- Create incidents table
CREATE TABLE IF NOT EXISTS incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location text NOT NULL,
  datahall text NOT NULL,
  description text NOT NULL,
  severity incident_severity NOT NULL,
  status incident_status DEFAULT 'open' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  user_id uuid REFERENCES auth.users
);

-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  generated_by uuid REFERENCES auth.users NOT NULL,
  generated_at timestamptz DEFAULT now() NOT NULL,
  date_range_start timestamptz NOT NULL,
  date_range_end timestamptz NOT NULL,
  datacenter text,
  datahall text,
  status text NOT NULL,
  total_incidents integer DEFAULT 0 NOT NULL,
  report_data jsonb DEFAULT '{}'::jsonb NOT NULL
);

-- Create indexes
CREATE INDEX incidents_user_id_idx ON incidents(user_id);
CREATE INDEX incidents_status_idx ON incidents(status);
CREATE INDEX incidents_severity_idx ON incidents(severity);
CREATE INDEX incidents_created_at_idx ON incidents(created_at DESC);

CREATE INDEX reports_generated_by_idx ON reports(generated_by);
CREATE INDEX reports_generated_at_idx ON reports(generated_at DESC);
CREATE INDEX reports_date_range_idx ON reports(date_range_start, date_range_end);

-- Enable RLS
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read all incidents"
  ON incidents FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create incidents"
  ON incidents FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own incidents"
  ON incidents FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read all reports"
  ON reports FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create reports"
  ON reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = generated_by);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for incidents
CREATE TRIGGER set_incidents_updated_at
  BEFORE UPDATE ON incidents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();