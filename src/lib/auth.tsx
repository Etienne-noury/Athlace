import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  city: string | null;
  phone: string | null;
}

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  session: null,
  profile: null,
  loading: true,
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, city, phone')
      .eq('id', userId)
      .maybeSingle();
    setProfile((data as Profile) ?? null);
  }, []);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setLoading(false);
      if (newSession?.user) {
        // Avoid calling supabase inside the callback synchronously
        setTimeout(() => loadProfile(newSession.user.id), 0);
      } else {
        setProfile(null);
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
      if (data.session?.user) loadProfile(data.session.user.id);
    });

    return () => listener.subscription.unsubscribe();
  }, [loadProfile]);

  const refreshProfile = useCallback(async () => {
    if (user) await loadProfile(user.id);
  }, [user, loadProfile]);

  const value = useMemo(
    () => ({ user, session, profile, loading, refreshProfile }),
    [user, session, profile, loading, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

/* ---------- Auth actions ---------- */

export async function signInWithEmail(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signUpWithEmail(email: string, password: string, fullName?: string) {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/compte/profil/`,
      data: fullName ? { full_name: fullName } : undefined,
    },
  });
}

export async function signInWithGoogle(next?: string) {
  if (next) sessionStorage.setItem('athlace:next', next);
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/compte/profil/` },
  });
}

export async function resetPassword(email: string) {
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/compte/nouveau-mot-de-passe/`,
  });
}

export async function updatePassword(password: string) {
  return supabase.auth.updateUser({ password });
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function deleteAccount() {
  return supabase.functions.invoke('delete-account');
}

/* ---------- Error messages (FR) ---------- */

export function authErrorMessage(message?: string): string {
  if (!message) return "Une erreur est survenue. Veuillez réessayer.";
  const m = message.toLowerCase();
  if (m.includes('invalid login credentials')) return 'Email ou mot de passe incorrect.';
  if (m.includes('email not confirmed')) return "Votre email n'est pas encore confirmé. Vérifiez votre boîte de réception.";
  if (m.includes('user already registered') || m.includes('already been registered'))
    return 'Un compte existe déjà avec cet email.';
  if (m.includes('password should be at least')) return 'Le mot de passe doit contenir au moins 8 caractères.';
  if (m.includes('unable to validate email') || m.includes('invalid email')) return "L'adresse email est invalide.";
  if (m.includes('rate limit') || m.includes('too many')) return 'Trop de tentatives. Réessayez dans quelques minutes.';
  if (m.includes('same password')) return "Le nouveau mot de passe doit être différent de l'ancien.";
  if (m.includes('new password')) return 'Mot de passe invalide.';
  return message;
}
