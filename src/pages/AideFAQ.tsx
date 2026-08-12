import { Layout } from '@/components/layout/Layout';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQS = [
  {
    question: "Athlace est-il gratuit ?",
    answer: "Oui, la consultation du répertoire et la mise en favoris de clubs sont entièrement gratuites pour les pratiquants. Les clubs peuvent souscrire à des options de visibilité payantes."
  },
  {
    question: "Comment trouver un club près de chez moi ?",
    answer: "Utilisez la barre de recherche en renseignant un sport, une ville ou un code postal. Vous pouvez aussi explorer la carte interactive ou consulter les listes par région et par ville."
  },
  {
    question: "Les informations des clubs sont-elles à jour ?",
    answer: "Athlace agrège des données publiques et fédérales. Les clubs partenaires peuvent mettre à jour leur fiche en temps réel. Si vous constatez une erreur, utilisez le bouton de signalement sur la page du club."
  },
  {
    question: "Comment s'inscrire dans un club ?",
    answer: "Athlace vous permet de découvrir et comparer les clubs. L'inscription se fait directement auprès du club via son site web ou ses coordonnées de contact."
  },
  {
    question: "Je suis dirigeant de club : comment apparaître sur Athlace ?",
    answer: "Créez un compte puis réclamez votre fiche club depuis la page 'Pour les clubs'. Vous pourrez ensuite compléter vos informations, tarifs et horaires."
  },
];

export default function AideFAQ() {
  return (
    <Layout>
      <section className="bg-muted/30 border-b border-border py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl font-bold text-foreground">Foire aux questions</h1>
          <p className="text-muted-foreground mt-2">Trouvez rapidement des réponses à vos questions.</p>
        </div>
      </section>
      <section className="container mx-auto px-4 py-12 max-w-3xl">
        <Accordion type="single" collapsible className="w-full">
          {FAQS.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </Layout>
  );
}
