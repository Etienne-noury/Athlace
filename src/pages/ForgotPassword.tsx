import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { resetPassword, authErrorMessage } from '@/lib/auth';
import { Mail, Loader2 } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await resetPassword(email.trim());
    setLoading(false);
    if (error) setError(authErrorMessage(error.message));
    else setSent(true);
  };

  return (
    <Layout>
      <section className="container mx-auto px-4 py-12 lg:py-20">
        <div className="max-w-md mx-auto bg-card border border-border rounded-2xl p-8 shadow-sm">
          <h1 className="font-display text-2xl font-bold text-center mb-2">Mot de passe oublié</h1>
          <p className="text-muted-foreground text-center mb-6">
            Saisissez votre email, nous vous enverrons un lien de réinitialisation.
          </p>

          {sent ? (
            <div className="space-y-4">
              <div className="p-4 bg-primary/10 text-primary rounded-lg text-sm text-center">
                Si un compte existe pour {email}, un email de réinitialisation vient d'être envoyé.
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
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Envoyer le lien
                </Button>
              </form>
              <p className="text-sm text-center mt-6 text-muted-foreground">
                <Link to="/compte/connexion/" className="text-primary hover:underline">Retour à la connexion</Link>
              </p>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}
