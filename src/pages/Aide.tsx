import { useState } from 'react';
import { Search, ChevronDown, Mail, Phone, MessageCircle } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { useSiteStats } from '@/hooks/useSiteStats';
import { formatCount } from '@/lib/format-stats';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    category: 'Général',
    questions: [
      {
        q: 'Qu\'est-ce que Athlace ?',
        a: 'Athlace est le répertoire national des clubs sportifs en France. Notre plateforme vous permet de découvrir, comparer et vous inscrire aux clubs sportifs près de chez vous, parmi {{clubs}} clubs référencés.'
      },
      {
        q: 'L\'utilisation de Athlace est-elle gratuite ?',
        a: 'Oui, Athlace est entièrement gratuit pour les sportifs. Vous pouvez rechercher des clubs, consulter leurs informations et créer un compte sans aucun frais.'
      },
      {
        q: 'Comment créer un compte ?',
        a: 'Cliquez sur "Mon Compte" en haut à droite, puis sur "Créer un compte". Vous pouvez vous inscrire avec votre email ou via Google/Apple.'
      },
    ]
  },
  {
    category: 'Recherche de clubs',
    questions: [
      {
        q: 'Comment trouver un club près de chez moi ?',
        a: 'Utilisez la barre de recherche sur la page d\'accueil en entrant votre ville ou code postal. Vous pouvez également utiliser la carte interactive qui utilise votre géolocalisation.'
      },
      {
        q: 'Puis-je filtrer les clubs par niveau ?',
        a: 'Oui, dans les filtres de recherche, vous pouvez sélectionner le niveau souhaité : Loisir, Compétition Régionale, Compétition Nationale ou Élite.'
      },
      {
        q: 'Comment comparer les prix des licences ?',
        a: 'Sur chaque fiche club, les tarifs des licences sont clairement affichés. Vous pouvez également filtrer les résultats par plage de prix dans les critères de recherche.'
      },
    ]
  },
  {
    category: 'Inscription',
    questions: [
      {
        q: 'Comment m\'inscrire à un club ?',
        a: 'Rendez-vous sur la page du club souhaité et cliquez sur "S\'inscrire en ligne". Remplissez le formulaire avec vos informations et procédez au paiement sécurisé.'
      },
      {
        q: 'Le paiement en ligne est-il sécurisé ?',
        a: 'Oui, tous les paiements sont traités via Stripe, leader mondial du paiement en ligne. Vos données bancaires sont chiffrées et ne sont jamais stockées sur nos serveurs.'
      },
      {
        q: 'Puis-je annuler mon inscription ?',
        a: 'Les conditions d\'annulation dépendent de chaque club. Consultez les CGV du club concerné ou contactez-le directement pour connaître sa politique d\'annulation.'
      },
    ]
  },
  {
    category: 'Clubs partenaires',
    questions: [
      {
        q: 'Comment référencer mon club sur Athlace ?',
        a: 'Cliquez sur "Inscrire mon club" en bas de page et remplissez le formulaire d\'inscription. Notre équipe validera votre demande sous 48h.'
      },
      {
        q: 'Le référencement est-il payant ?',
        a: 'Le référencement de base est gratuit. Des options premium sont disponibles pour augmenter la visibilité de votre club (mise en avant, badges, etc.).'
      },
      {
        q: 'Comment modifier les informations de mon club ?',
        a: 'Connectez-vous à votre espace club et accédez à la section "Modifier les informations". Les modifications sont validées par notre équipe avant publication.'
      },
    ]
  },
];

export default function Aide() {
  const [searchQuery, setSearchQuery] = useState('');
  const { stats, isReady } = useSiteStats();

  const clubsLabel = isReady ? formatCount(stats.clubs) : 'des milliers de';

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions
      .map(q => ({ ...q, a: q.a.replace('{{clubs}}', clubsLabel) }))
      .filter(q => 
      q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-sport-gradient text-white py-12 lg:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-3xl lg:text-5xl font-bold mb-4">
            Centre d'aide
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
            Trouvez rapidement des réponses à vos questions sur Athlace
          </p>

          {/* Search */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Rechercher dans la FAQ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-base bg-white text-foreground"
            />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* FAQ */}
          <div className="lg:col-span-2">
            <h2 className="font-display text-2xl font-bold text-foreground mb-8">
              Questions fréquentes
            </h2>

            {filteredFaqs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Aucun résultat pour "{searchQuery}"</p>
              </div>
            ) : (
              <div className="space-y-8">
                {filteredFaqs.map((category) => (
                  <div key={category.category}>
                    <h3 className="font-semibold text-lg text-foreground mb-4">
                      {category.category}
                    </h3>
                    <Accordion type="single" collapsible className="space-y-2">
                      {category.questions.map((faq, index) => (
                        <AccordionItem 
                          key={index} 
                          value={`${category.category}-${index}`}
                          className="bg-card rounded-xl border border-border px-6"
                        >
                          <AccordionTrigger className="text-left hover:no-underline">
                            {faq.q}
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground">
                            {faq.a}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Contact */}
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-8">
              Nous contacter
            </h2>

            <div className="space-y-4">
              <div className="bg-card rounded-2xl border border-border p-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Email</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Réponse sous 24-48h
                </p>
                <a href="mailto:support@athlace.fr" className="text-primary hover:underline">
                  support@athlace.fr
                </a>
              </div>

              <div className="bg-card rounded-2xl border border-border p-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Téléphone</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Lun-Ven 9h-18h
                </p>
                <a href="tel:0800123456" className="text-primary hover:underline">
                  0 800 123 456
                </a>
              </div>

              <div className="bg-card rounded-2xl border border-border p-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <MessageCircle className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Chat en ligne</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Assistance instantanée
                </p>
                <Button className="w-full">Démarrer un chat</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
