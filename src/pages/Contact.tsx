import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Contact() {
  return (
    <Layout>
      <section className="bg-muted/30 border-b border-border py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl font-bold text-foreground">Contactez-nous</h1>
          <p className="text-muted-foreground mt-2">Une question, une suggestion ou un problème ? Écrivez-nous.</p>
        </div>
      </section>
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="font-display text-2xl font-semibold mb-6">Envoyer un message</h2>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input id="firstName" placeholder="Votre prénom" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input id="lastName" placeholder="Votre nom" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="votre@email.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Sujet</Label>
                <Input id="subject" placeholder="Demande d'information" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Votre message..." rows={5} />
              </div>
              <Button type="submit">Envoyer</Button>
            </form>
          </div>
          <div className="bg-card border border-border rounded-2xl p-8">
            <h2 className="font-display text-2xl font-semibold mb-6">Nos coordonnées</h2>

            <a
              href="mailto:contact@athlace.fr"
              className="flex items-center gap-4 rounded-xl bg-primary/10 border border-primary/20 p-5 mb-6 hover:bg-primary/15 transition-colors"
            >
              <span className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6 text-primary" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm text-muted-foreground">Écrivez-nous directement</span>
                <span className="block font-display text-lg font-semibold text-foreground break-all">
                  contact@athlace.fr
                </span>
                <span className="block text-xs text-muted-foreground mt-1">Réponse sous 48h ouvrées</span>
              </span>
            </a>

            <div className="space-y-4">
              <a href="tel:0800123456" className="flex items-center gap-3 text-muted-foreground hover:text-foreground">
                <Phone className="w-5 h-5 text-primary" /> 0 800 123 456
              </a>
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="w-5 h-5 text-primary" /> Lundi - Vendredi : 9h - 18h
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
