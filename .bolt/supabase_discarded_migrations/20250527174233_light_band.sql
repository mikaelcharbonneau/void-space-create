/*
  # Create reports table

  1. New Tables
    - `reports`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text, nullable)
      - `user_id` (uuid, references users.id)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `status` (text, with check constraint)
      - `type` (text, with check constraint)
      - `location` (text)
      - `data` (jsonb)

  2. Security
    - Enable RLS on `reports` table
    - Add policies for:
      - Authenticated users can read all reports
      - Users can create their own reports
      - Users can update their own reports

  3. Indexes
    - Created_at (DESC) for efficient sorting
    - User_id for foreign key lookups
    - Status for filtering
    - Type for filtering
*/

-- Create the reports table
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  user_id uuid NOT NULL REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'draft',
  type text NOT NULL,
  location text NOT NULL,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  CONSTRAINT status_check CHECK (status IN ('draft', 'published', 'archived')),
  CONSTRAINT type_check CHECK (type IN ('inspection', 'incident', 'maintenance'))
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS reports_created_at_idx ON reports (created_at DESC);
CREATE INDEX IF NOT EXISTS reports_user_id_idx ON reports (user_id);
CREATE INDEX IF NOT EXISTS reports_status_idx ON reports (status);
CREATE INDEX IF NOT EXISTS reports_type_idx ON reports (type);

-- Enable Row Level Security
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can read all reports"
  ON reports
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create own reports"
  ON reports
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reports"
  ON reports
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create trigger for updating the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER set_reports_updated_at
  BEFORE UPDATE ON reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();