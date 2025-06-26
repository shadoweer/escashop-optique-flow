
-- Drop functions with CASCADE to remove all dependent policies
DROP FUNCTION IF EXISTS public.get_user_role(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.has_role(uuid, app_role) CASCADE;

-- Drop existing policies that might conflict
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

-- Update the app_role enum to match the new requirements
ALTER TYPE public.app_role RENAME TO app_role_old;

CREATE TYPE public.app_role AS ENUM ('admin', 'sales_employee', 'cashier');

-- Update existing tables to use the new enum
ALTER TABLE public.profiles 
  ALTER COLUMN role DROP DEFAULT,
  ALTER COLUMN role TYPE public.app_role USING 
    CASE 
      WHEN role::text = 'admin' THEN 'admin'::public.app_role
      WHEN role::text = 'staff' THEN 'sales_employee'::public.app_role
      WHEN role::text = 'viewer' THEN 'cashier'::public.app_role
      ELSE 'sales_employee'::public.app_role
    END,
  ALTER COLUMN role SET DEFAULT 'sales_employee'::public.app_role;

ALTER TABLE public.user_roles 
  ALTER COLUMN role TYPE public.app_role USING 
    CASE 
      WHEN role::text = 'admin' THEN 'admin'::public.app_role
      WHEN role::text = 'staff' THEN 'sales_employee'::public.app_role
      WHEN role::text = 'viewer' THEN 'cashier'::public.app_role
      ELSE 'sales_employee'::public.app_role
    END;

-- Drop the old enum
DROP TYPE public.app_role_old;

-- Recreate the functions with the new enum
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = _user_id
      AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS app_role
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT role
  FROM public.profiles
  WHERE id = _user_id
  LIMIT 1
$$;

-- Update the handle_new_user function to set default role as sales_employee
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  -- Insert into profiles table
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', 'New User'),
    'sales_employee'
  );
  
  -- Insert into user_roles table
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'sales_employee');
  
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- Log the error but don't block user creation
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Recreate essential RLS policies for the new role system
CREATE POLICY "Admins can view all profiles" 
  ON public.profiles 
  FOR SELECT 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Admins can manage all roles" 
  ON public.user_roles 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'));
