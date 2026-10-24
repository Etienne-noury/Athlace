import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail } from 'lucide-react';

// Pas encore de back-end d'envoi : le formulaire ouvre la messagerie du visiteur avec le message prérempli.
function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  const f = new FormData(e.currentTarget);
  const name = `${f.get('firstName') ?? ''} ${f.get('lastName') ?? ''}`.trim();
  const subject = String(f.get('subject') || 'Contact depuis athlace.fr');
  const body = `${f.get('message') ?? ''}\n\n${name}${f.get('email') ? ` (${f.get('email')})` : ''}`;
  window.location.href = `mailto:contact@athlace.fr?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default function Contact() {
  return (
    <Layout>
      <section className="bg-muted border-b border-border py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-sans text-3xl font-black text-foreground">Contactez-nous</h1>
          <p className="text-muted-foreground mt-2">Une question, une suggestion ou un problème ? Écrivez-nous.</p>
        </div>
      </section>
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="font-sans text-2xl font-black mb-6">Envoyer un message</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input id="firstName" name="firstName" placeholder="Votre prénom" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input id="lastName" name="lastName" placeholder="Votre nom" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="votre@email.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Sujet</Label>
                <Input id="subject" name="subject" placeholder="Demande d'information" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" name="message" required placeholder="Votre message..." rows={5} />
              </div>
              <Button type="submit">Envoyer</Button>
              <p className="text-xs text-muted-foreground">Le bouton ouvre votre messagerie avec votre message prérempli.</p>
            </form>
          </div>
          <div className="bg-card border border-border rounded-2xl p-8">
            <h2 className="font-sans text-2xl font-black mb-6">Nos coordonnées</h2>

            <a
              href="mailto:contact@athlace.fr"
              className="flex items-center gap-4 rounded-xl bg-creme border border-border p-5 mb-6 hover:bg-creme transition-colors"
            >
              <span className="w-12 h-12 rounded-pill bg-creme flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6 text-primary" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm text-muted-foreground">Écrivez-nous directement</span>
                <span className="block font-sans text-lg font-bold text-foreground break-all">
                  contact@athlace.fr
                </span>
                <span className="block text-xs text-muted-foreground mt-1">Réponse sous 48h ouvrées</span>
              </span>
            </a>

          </div>
        </div>
      </section>
    </Layout>
  );
}
