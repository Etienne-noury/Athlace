import { Layout } from '@/components/layout/Layout';

export default function CGU() {
  return (
    <Layout>
      <section className="bg-muted/30 border-b border-border py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl font-bold text-foreground">Conditions générales d'utilisation et de vente</h1>
        </div>
      </section>
      <section className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="prose prose-slate max-w-none">
          <h2>Objet</h2>
          <p>
            Les présentes conditions générales d'utilisation (CGU) régissent l'accès et l'utilisation du site Athlace, répertoire en ligne de clubs sportifs en France. Elles s'appliquent à tout utilisateur, qu'il soit visiteur, membre ou club partenaire.
          </p>

          <h2>Inscription et compte</h2>
          <p>
            L'inscription est gratuite. L'utilisateur s'engage à fournir des informations exactes et à maintenir la confidentialité de ses identifiants. En cas d'utilisation frauduleuse, Athlace se réserve le droit de suspendre le compte.
          </p>

          <h2>Services gratuits et payants</h2>
          <p>
            La consultation du répertoire et la mise en favoris de clubs sont gratuites. Des services payants peuvent être proposés aux clubs (fiche premium, visibilité boostée). Les tarifs sont indiqués sur la page dédiée et facturés selon les conditions en vigueur.
          </p>

          <h2>Comportement des utilisateurs</h2>
          <p>
            Les utilisateurs s'engagent à ne pas publier de contenus illicites, diffamatoires ou trompeurs. Tout signalement d'abus peut être adressé à contact@athlace.fr.
          </p>

          <h2>Modification des CGU</h2>
          <p>
            Athlace peut modifier les présentes conditions à tout moment. La version en vigueur est celle accessible sur le site à la date d'utilisation.
          </p>
        </div>
      </section>
    </Layout>
  );
}
