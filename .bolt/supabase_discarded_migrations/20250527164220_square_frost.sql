/*
  # Enhanced reporting interface

  1. New Tables
    - report_filters
      - id (uuid, primary key)
      - user_id (uuid, references auth.users)
      - name (text)
      - filters (jsonb)
      - created_at (timestamptz)
      - is_favorite (boolean)

  2. Changes
    - Add new columns to reports table
      - assigned_to (uuid)
      - issue_type (text)
      - severity (text)
      - status (text)
      - datacenter (text)
    
  3. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create saved filters table
CREATE TABLE IF NOT EXISTS report_filters (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) NOT NULL,
    name text NOT NULL,
    filters jsonb NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    is_favorite boolean DEFAULT false NOT NULL
);

-- Add new columns to reports table
ALTER TABLE reports ADD COLUMN IF NOT EXISTS assigned_to uuid REFERENCES auth.users(id);
ALTER TABLE reports ADD COLUMN IF NOT EXISTS issue_type text;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS severity text;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS status text;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS datacenter text;

-- Enable RLS on report_filters
ALTER TABLE report_filters ENABLE ROW LEVEL SECURITY;

-- Create policies for report_filters
CREATE POLICY "Users can manage their own saved filters"
    ON report_filters
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);