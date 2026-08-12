import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, signOut } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, User, Heart, LogOut, Bell, Shield } from 'lucide-react';

export default function Profile() {
  const { user, loading } = useAuth();
  const [fullName, setFullName] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user?.user_metadata?.full_name) {
      setFullName(user.user_metadata.full_name as string);
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName },
    });
    setSaving(false);
    if (error) setMessage(error.message);
    else setMessage('Profil mis à jour.');
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-display text-2xl font-bold mb-4">Espace membre</h1>
          <p className="text-muted-foreground mb-6">Connectez-vous pour accéder à votre profil.</p>
          <Button asChild>
            <Link to="/compte/connexion/">Se connecter</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="bg-muted/30 border-b border-border py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Mon compte</h1>
          <p className="text-muted-foreground">Gérez votre profil et vos préférences.</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1 space-y-2">
            <Button variant="secondary" className="w-full justify-start">
              <User className="w-4 h-4 mr-2" /> Profil
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link to="/compte/mes-clubs/"><Heart className="w-4 h-4 mr-2" /> Mes clubs</Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link to="/compte/notifications/"><Bell className="w-4 h-4 mr-2" /> Notifications</Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link to="/compte/mon-club/"><Shield className="w-4 h-4 mr-2" /> Mon club</Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start text-destructive" onClick={() => signOut()}>
              <LogOut className="w-4 h-4 mr-2" /> Déconnexion
            </Button>
          </aside>

          <div className="lg:col-span-3 space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="font-display text-xl font-semibold mb-4">Informations personnelles</h2>
              <form onSubmit={handleSave} className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={user.email} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nom complet</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Votre nom"
                  />
                </div>
                {message && (
                  <p className="text-sm text-primary">{message}</p>
                )}
                <Button type="submit" disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Enregistrer
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
