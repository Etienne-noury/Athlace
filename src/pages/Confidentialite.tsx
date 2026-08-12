import { Layout } from '@/components/layout/Layout';

export default function Confidentialite() {
  return (
    <Layout>
      <section className="bg-muted/30 border-b border-border py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl font-bold text-foreground">Politique de confidentialité</h1>
        </div>
      </section>
      <section className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="prose prose-slate max-w-none">
          <h2>Données collectées</h2>
          <p>
            Athlace collecte les données strictement nécessaires à la fourniture du service : adresse email, clubs favoris, localisation approximative (si l'utilisateur l'autorise), et éventuelles informations complétées sur le profil.
          </p>

          <h2>Finalités</h2>
          <p>
            Les données sont utilisées pour permettre la connexion, la personnalisation des résultats, l'envoi de notifications (optionnelles) et l'amélioration du service. Elles ne sont jamais revendues à des tiers.
          </p>

          <h2>Base légale</h2>
          <p>
            Le traitement repose sur l'exécution du contrat (compte utilisateur) et sur le consentement pour les communications optionnelles. Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation et de portabilité de vos données.
          </p>

          <h2>Cookies</h2>
          <p>
            Athlace utilise des cookies techniques essentiels au fonctionnement du site et, avec votre consentement, des cookies de mesure d'audience. Vous pouvez gérer vos choix via le bandeau cookies ou à tout moment dans les paramètres du navigateur.
          </p>

          <h2>Durée de conservation</h2>
          <p>
            Les données sont conservées pendant la durée de vie du compte, puis supprimées ou anonymisées dans les délais légaux. Les données de clubs issues de sources publiques sont maintenues à jour dans le cadre du service.
          </p>

          <h2>Contact DPO</h2>
          <p>
            Pour toute question relative à la protection des données, contactez-nous à dpo@athlace.fr.
          </p>
        </div>
      </section>
    </Layout>
  );
}
