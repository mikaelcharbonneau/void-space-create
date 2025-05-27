/*
  # Disable RLS for user tables
  
  1. Changes
    - Disable RLS on user_profiles table
    - Disable RLS on user_stats table
    - Drop all existing policies
*/

-- Disable RLS and drop policies for user_profiles
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can upsert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can manage own profile" ON user_profiles;

-- Disable RLS and drop policies for user_stats
ALTER TABLE user_stats DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can insert own stats" ON user_stats;
DROP POLICY IF EXISTS "Users can update own stats" ON user_stats;