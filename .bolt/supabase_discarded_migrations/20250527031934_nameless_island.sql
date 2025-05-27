/*
  # Add RLS policies for user profiles

  1. Security Changes
    - Enable RLS on user_profiles table (if not already enabled)
    - Add policies for authenticated users to:
      - Insert their own profile
      - Read their own profile
      - Update their own profile
    
  2. Notes
    - Policies ensure users can only access and modify their own profile data
    - All operations are restricted to authenticated users only
    - User ID must match the authenticated user's ID
*/

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy for inserting own profile
CREATE POLICY "Users can insert own profile"
ON user_profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy for reading own profile
CREATE POLICY "Users can read own profile"
ON user_profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy for updating own profile
CREATE POLICY "Users can update own profile"
ON user_profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);