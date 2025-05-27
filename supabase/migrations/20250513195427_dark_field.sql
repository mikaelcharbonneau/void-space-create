/*
  # Create user activity and stats tables

  1. New Tables
    - `user_activities`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `type` (text, enum of activity types)
      - `description` (text)
      - `created_at` (timestamp)
    
    - `user_stats`
      - `user_id` (uuid, primary key, references auth.users)
      - `walkthroughs_completed` (integer)
      - `issues_resolved` (integer)
      - `reports_generated` (integer)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to read their own data
*/

-- Create enum for activity types
CREATE TYPE activity_type AS ENUM ('inspection', 'issue', 'report');

-- Create user_activities table
CREATE TABLE IF NOT EXISTS user_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  type activity_type NOT NULL,
  description text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create user_stats table
CREATE TABLE IF NOT EXISTS user_stats (
  user_id uuid PRIMARY KEY REFERENCES auth.users,
  walkthroughs_completed integer DEFAULT 0 NOT NULL,
  issues_resolved integer DEFAULT 0 NOT NULL,
  reports_generated integer DEFAULT 0 NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own activities"
  ON user_activities
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can read own stats"
  ON user_stats
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX user_activities_user_id_idx ON user_activities(user_id);
CREATE INDEX user_activities_created_at_idx ON user_activities(created_at DESC);