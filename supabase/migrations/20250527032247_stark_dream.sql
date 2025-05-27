/*
  # Add missing RLS policies for user_profiles table

  1. Changes
    - Add upsert policy for user_profiles table
    - Ensure RLS is enabled
    - Keep existing policies intact

  2. Security
    - Maintains row-level security
    - Users can only upsert their own profiles
*/

-- Enable RLS if not already enabled
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'user_profiles' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Add upsert policy
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'user_profiles' 
    AND policyname = 'Users can upsert own profile'
  ) THEN
    CREATE POLICY "Users can upsert own profile"
      ON user_profiles
      FOR ALL
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;