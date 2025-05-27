/*
  # Create reports table

  1. New Tables
    - `reports`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `status` (text)
      - `type` (text)
      - `location` (text)
      - `data` (jsonb)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  user_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  type text NOT NULL,
  location text NOT NULL,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  CONSTRAINT status_check CHECK (status IN ('draft', 'published', 'archived')),
  CONSTRAINT type_check CHECK (type IN ('inspection', 'incident', 'maintenance'))
);

-- Enable RLS
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Create policies
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

-- Create indexes
CREATE INDEX reports_user_id_idx ON reports(user_id);
CREATE INDEX reports_created_at_idx ON reports(created_at DESC);
CREATE INDEX reports_status_idx ON reports(status);
CREATE INDEX reports_type_idx ON reports(type);

-- Create updated_at trigger
CREATE TRIGGER set_reports_updated_at
  BEFORE UPDATE ON reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();