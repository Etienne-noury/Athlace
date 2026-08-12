import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updatePassword, authErrorMessage, useAuth } from '@/lib/auth';
import { Lock, Loader2 } from 'lucide-react';

export default function ResetPassword() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [invalidLink, setInvalidLink] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      const hash = window.location.hash;
      if (!hash.includes('type=recovery')) setInvalidLink(true);
    }
  }, [authLoading, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    setLoading(true);
    const { error } = await updatePassword(password);
    setLoading(false);
    if (error) setError(authErrorMessage(error.message));
    else {
      setDone(true);
      setTimeout(() => navigate('/compte/profil/', { replace: true }), 1500);
    }
  };

  return (
    <Layout>
      <section className="container mx-auto px-4 py-12 lg:py-20">
        <div className="max-w-md mx-auto bg-card border border-border rounded-2xl p-8 shadow-sm">
          <h1 className="font-display text-2xl font-bold text-center mb-2">Nouveau mot de passe</h1>

          {invalidLink ? (
            <div className="space-y-4 mt-4">
              <div className="p-4 bg-destructive/10 text-destructive rounded-lg text-sm text-center">
                Ce lien de réinitialisation est invalide ou expiré.
              </div>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/compte/mot-de-passe-oublie/">Demander un nouveau lien</Link>
              </Button>
            </div>
          ) : done ? (
            <div className="p-4 bg-primary/10 text-primary rounded-lg text-sm text-center mt-4">
              Mot de passe mis à jour. Redirection…
            </div>
          ) : (
            <>
              <p className="text-muted-foreground text-center mb-6">Choisissez un nouveau mot de passe.</p>
              {error && (
                <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-lg text-sm" role="alert">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Nouveau mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      className="pl-9"
                      placeholder="8 caractères minimum"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm">Confirmer</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="confirm"
                      type="password"
                      autoComplete="new-password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      required
                      className="pl-9"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Mettre à jour
                </Button>
              </form>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}
