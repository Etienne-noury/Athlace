import { Layout } from '@/components/layout/Layout';

export default function MentionsLegales() {
  return (
    <Layout>
      <section className="bg-muted/30 border-b border-border py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl font-bold text-foreground">Mentions légales</h1>
        </div>
      </section>
      <section className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="prose prose-slate max-w-none">
          <h2>Éditeur du site</h2>
          <p>
            Le site Athlace est édité par Athlace SAS, société par actions simplifiée au capital de 10 000 €, immatriculée au RCS de Paris sous le numéro 000 000 000.
          </p>
          <p>
            Siège social : 1 rue du Sport, 75000 Paris, France.<br />
            Email : contact@athlace.fr
          </p>

          <h2>Directeur de la publication</h2>
          <p>Directeur de la publication : le fondateur d'Athlace.</p>

          <h2>Hébergement</h2>
          <p>
            Le site est hébergé par Lovable Cloud. Données stockées au sein de l'Union Européenne.
          </p>

          <h2>Propriété intellectuelle</h2>
          <p>
            L'ensemble des éléments constituant le site (textes, graphismes, logiciels, photographies, images, vidéos, sons, plans, logos, marques, etc.) est la propriété exclusive d'Athlace ou de ses partenaires. Toute reproduction, représentation ou exploitation est interdite sans autorisation préalable.
          </p>

          <h2>Limitation de responsabilité</h2>
          <p>
            Athlace s'efforce d'assurer l'exactitude et la mise à jour des informations publiées. Toutefois, les informations sur les clubs (coordonnées, tarifs, horaires) sont fournies par les clubs et les sources publiques. Athlace ne peut garantir l'exactitude exhaustive de ces données et invite les utilisateurs à vérifier directement auprès des clubs concernés.
          </p>
        </div>
      </section>
    </Layout>
  );
}
