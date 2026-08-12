import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signUpWithEmail, signInWithGoogle, authErrorMessage } from '@/lib/auth';
import { Mail, Lock, User as UserIcon, Loader2 } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

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
    const { data, error } = await signUpWithEmail(email.trim(), password, fullName.trim() || undefined);
    setLoading(false);
    if (error) {
      setError(authErrorMessage(error.message));
      return;
    }
    if (data.session) navigate('/compte/profil/', { replace: true });
    else setSuccess(true);
  };

  const handleGoogle = async () => {
    setLoading(true);
    const { error } = await signInWithGoogle('/compte/profil/');
    if (error) {
      setLoading(false);
      setError(authErrorMessage(error.message));
    }
  };

  return (
    <Layout>
      <section className="container mx-auto px-4 py-12 lg:py-20">
        <div className="max-w-md mx-auto bg-card border border-border rounded-2xl p-8 shadow-sm">
          <h1 className="font-display text-2xl font-bold text-center mb-2">Créer un compte</h1>
          <p className="text-muted-foreground text-center mb-6">
            Rejoignez Athlace pour sauvegarder vos clubs et votre parcours sportif.
          </p>

          {success ? (
            <div className="space-y-4">
              <div className="p-4 bg-primary/10 text-primary rounded-lg text-sm text-center">
                Inscription réussie ! Vérifiez votre email pour activer votre compte.
              </div>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/compte/connexion/">Retour à la connexion</Link>
              </Button>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-lg text-sm" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nom complet</Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-9"
                      placeholder="Votre nom"
                      autoComplete="name"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-9"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
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
                  <Label htmlFor="confirm">Confirmer le mot de passe</Label>
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
                  Créer mon compte
                </Button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center text-xs"><span className="bg-card px-2 text-muted-foreground">ou</span></div>
              </div>

              <Button variant="outline" className="w-full" onClick={handleGoogle} disabled={loading}>
                Continuer avec Google
              </Button>

              <p className="text-sm text-center mt-6 text-muted-foreground">
                Déjà inscrit ?{' '}
                <Link to="/compte/connexion/" className="text-primary hover:underline">Se connecter</Link>
              </p>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}
