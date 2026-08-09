"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getSupabaseClient } from "@/lib/auth";
import type { Session, User } from "@supabase/supabase-js";

interface AuthContextProps {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const syncAuthState = (session: Session | null) => {
    setSession(session);
    setUser(session?.user ?? null);
    setLoading(false);
  };

  useEffect(() => {
    const supabase = getSupabaseClient();
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      syncAuthState(session);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      syncAuthState(session);
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    const supabase = getSupabaseClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const signInWithEmail = async (email: string, password: string) => {
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };

  const signUpWithEmail = async (email: string, password: string) => {
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    return { error: error?.message ?? null };
  };

  const resetPassword = async (email: string) => {
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/account`,
    });
    return { error: error?.message ?? null };
  };

  const signOut = async () => {
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        resetPassword,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
