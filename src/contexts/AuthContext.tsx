
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'staff' | 'viewer';
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  hasRole: (role: 'admin' | 'staff' | 'viewer') => boolean;
  createDemoUser: (email: string, password: string, fullName: string, role: 'admin' | 'staff' | 'viewer') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching user profile for:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }

      console.log('User profile fetched:', data);
      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setUserProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const createDemoUser = async (email: string, password: string, fullName: string, role: 'admin' | 'staff' | 'viewer') => {
    try {
      console.log('Creating demo user:', email, role);
      
      // First, try to sign up the user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      console.log('SignUp response:', { signUpData, signUpError });

      if (signUpError && !signUpError.message.includes('already registered')) {
        console.error('SignUp error:', signUpError);
        throw signUpError;
      }

      // If user already exists or was just created, try to update their profile
      if (signUpData.user?.id) {
        console.log('Updating user profile for:', signUpData.user.id);
        
        // Update or insert profile
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: signUpData.user.id,
            email,
            full_name: fullName,
            role
          });

        if (profileError) {
          console.error('Profile upsert error:', profileError);
        }

        // Update or insert user role
        const { error: roleError } = await supabase
          .from('user_roles')
          .upsert({
            user_id: signUpData.user.id,
            role
          });

        if (roleError) {
          console.error('User role upsert error:', roleError);
        }
      }

      console.log('Demo user created successfully:', email);
    } catch (error) {
      console.error('Error creating demo user:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in for:', email);
      
      // Special handling for demo accounts - create them if they don't exist
      if (email === 'admin@escaoptical.com' && password === 'admin123') {
        await createDemoUser(email, password, 'System Administrator', 'admin');
      } else if (email === 'staff@escaoptical.com' && password === 'staff123') {
        await createDemoUser(email, password, 'Staff Member', 'staff');
      } else if (email === 'viewer@escaoptical.com' && password === 'viewer123') {
        await createDemoUser(email, password, 'System Viewer', 'viewer');
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('Sign in response:', { data, error });

      if (error) {
        console.error('Sign in error details:', error);
        toast({
          title: "Sign In Failed",
          description: error.message || "Invalid email or password. Please check your credentials and try again.",
          variant: "destructive"
        });
        throw error;
      }

      if (data.user) {
        console.log('Sign in successful for user:', data.user.email);
        toast({
          title: "Success",
          description: "Successfully signed in!"
        });
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      console.log('Attempting sign up for:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      console.log('Sign up response:', { data, error });

      if (error) {
        console.error('Sign up error details:', error);
        toast({
          title: "Sign Up Failed",
          description: error.message || "Failed to create account. Please try again.",
          variant: "destructive"
        });
        throw error;
      }

      toast({
        title: "Success",
        description: "Account created successfully! Please check your email for verification."
      });
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }

      toast({
        title: "Success",
        description: "Successfully signed out!"
      });
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const hasRole = (role: 'admin' | 'staff' | 'viewer') => {
    if (!userProfile) return false;
    
    // Admin has access to everything
    if (userProfile.role === 'admin') return true;
    
    // Staff has access to staff and viewer features
    if (userProfile.role === 'staff' && (role === 'staff' || role === 'viewer')) return true;
    
    // Viewer only has access to viewer features
    if (userProfile.role === 'viewer' && role === 'viewer') return true;
    
    return false;
  };

  const value = {
    user,
    session,
    userProfile,
    loading,
    signIn,
    signUp,
    signOut,
    hasRole,
    createDemoUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
