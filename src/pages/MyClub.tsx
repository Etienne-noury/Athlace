import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Loader2 } from 'lucide-react';

export default function MyClub() {
  const { user, loading } = useAuth();

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
          <h1 className="font-display text-2xl font-bold mb-4">Mon club</h1>
          <p className="text-muted-foreground mb-6">Connectez-vous pour réclamer ou gérer la fiche de votre club.</p>
          <Button asChild><Link to="/compte/connexion/">Se connecter</Link></Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="bg-muted/30 border-b border-border py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl font-bold text-foreground">Mon club</h1>
          <p className="text-muted-foreground mt-2">Réclamez ou mettez à jour la fiche de votre club.</p>
        </div>
      </section>
      <section className="container mx-auto px-4 py-12 max-w-2xl">
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2">
            <Label htmlFor="clubName">Nom du club</Label>
            <Input id="clubName" placeholder="Nom du club" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="license">Numéro de licence fédérale</Label>
            <Input id="license" placeholder="Numéro d'affiliation" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" placeholder="Décrivez votre demande..." rows={5} />
          </div>
          <Button type="submit">Envoyer la demande</Button>
        </form>
      </section>
    </Layout>
  );
}
