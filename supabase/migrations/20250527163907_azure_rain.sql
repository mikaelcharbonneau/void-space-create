/*
  # Create reports table for storing generated reports

  1. New Tables
    - `reports`
      - `id` (uuid, primary key)
      - `title` (text)
      - `user_id` (uuid, references users)
      - `created_at` (timestamptz)
      - `date_range` (jsonb) - Start and end dates for the report
      - `filters` (jsonb) - Applied filters
      - `issues` (jsonb) - Array of included issues
      - `summary` (text) - Auto-generated report summary

  2. Security
    - Enable RLS on `reports` table
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  date_range jsonb NOT NULL,
  filters jsonb NOT NULL DEFAULT '{}',
  issues jsonb NOT NULL DEFAULT '[]',
  summary text,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create own reports"
  ON reports
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read all reports"
  ON reports
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own reports"
  ON reports
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add updated_at trigger
CREATE TRIGGER set_reports_updated_at
  BEFORE UPDATE ON reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();