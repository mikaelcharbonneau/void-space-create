/*
  # Fix user stats RLS policies

  1. Changes
    - Add RLS policies for user_stats table to allow users to:
      - Insert their own stats
      - Update their own stats
  
  2. Security
    - Enable RLS on user_stats table
    - Add policies for authenticated users to:
      - Insert their own stats
      - Update their own stats
*/

-- Add insert policy for user_stats
CREATE POLICY "Users can insert own stats"
  ON user_stats
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Add update policy for user_stats
CREATE POLICY "Users can update own stats"
  ON user_stats
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);