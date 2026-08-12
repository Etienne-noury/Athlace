import { Layout } from '@/components/layout/Layout';

export default function Cookies() {
  return (
    <Layout>
      <section className="bg-muted/30 border-b border-border py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl font-bold text-foreground">Politique cookies</h1>
        </div>
      </section>
      <section className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="prose prose-slate max-w-none">
          <h2>Que sont les cookies ?</h2>
          <p>
            Les cookies sont de petits fichiers texte stockés sur votre appareil lors de la visite d'un site. Ils permettent de mémoriser vos préférences, de sécuriser votre connexion et de mesurer l'audience.
          </p>

          <h2>Cookies utilisés sur Athlace</h2>
          <ul>
            <li><strong>Cookies techniques :</strong> authentification, sécurité, préférences d'affichage.</li>
            <li><strong>Cookies de mesure d'audience :</strong> outils anonymisés pour comprendre l'utilisation du site.</li>
          </ul>

          <h2>Gestion des préférences</h2>
          <p>
            Vous pouvez à tout moment modifier vos choix de cookies via les paramètres de votre navigateur. Le refus des cookies techniques peut affecter le fonctionnement de certaines fonctionnalités.
          </p>
        </div>
      </section>
    </Layout>
  );
}
