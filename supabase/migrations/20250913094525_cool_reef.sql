/*
# Fix Authentication Trigger and Profile Creation

## Changes
1. Update the handle_new_user function to properly handle user metadata
2. Ensure customer role is set correctly
3. Handle admin users properly
*/

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Recreate the function with better error handling
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
DECLARE
  user_role user_role := 'customer';
  user_name text := '';
  user_phone text := '';
  user_district text := '';
  user_area text := '';
  user_landmarks text := '';
  user_email_verified boolean := false;
BEGIN
  -- Extract metadata
  IF NEW.raw_user_meta_data IS NOT NULL THEN
    user_name := COALESCE(NEW.raw_user_meta_data->>'full_name', '');
    user_phone := COALESCE(NEW.raw_user_meta_data->>'phone_number', '');
    user_district := COALESCE(NEW.raw_user_meta_data->>'district', '');
    user_area := COALESCE(NEW.raw_user_meta_data->>'area', '');
    user_landmarks := COALESCE(NEW.raw_user_meta_data->>'landmarks', '');
    
    -- Check if this is an admin user
    IF NEW.raw_user_meta_data->>'role' IS NOT NULL THEN
      user_role := (NEW.raw_user_meta_data->>'role')::user_role;
      user_email_verified := COALESCE((NEW.raw_user_meta_data->>'email_verified')::boolean, false);
    END IF;
  END IF;

  -- Insert profile
  INSERT INTO profiles (
    id, 
    email, 
    full_name, 
    phone_number, 
    district, 
    area, 
    landmarks, 
    role,
    email_verified,
    is_active
  ) VALUES (
    NEW.id,
    NEW.email,
    user_name,
    user_phone,
    user_district,
    user_area,
    user_landmarks,
    user_role,
    user_email_verified,
    true
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the user creation
    RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();