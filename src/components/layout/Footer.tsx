import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Linkedin, Mail } from 'lucide-react';

const legalLinks = [
  { label: 'Mentions légales', href: '/mentions-legales/' },
  { label: 'CGU / CGV', href: '/cgu-cgv/' },
  { label: 'Confidentialité / RGPD', href: '/confidentialite/' },
  { label: 'Cookies', href: '/cookies/' },
  { label: 'Accessibilité', href: '/accessibilite/' },
];

const footerLinks: Record<string, { label: string; href: string; external?: boolean }[]> = {
  'Notre entreprise': [
    { label: 'Qui sommes-nous ?', href: '/entreprise/qui-sommes-nous/' },
    { label: 'Notre mission', href: '/entreprise/mission/' },
    { label: 'Presse et actualités', href: '/blog/actualites-athlace/' },
    { label: 'Recrutement', href: '/entreprise/recrutement/' },
    { label: 'Nos partenaires', href: '/entreprise/partenaires/' },
  ],
  "Besoin d'aide": [
    { label: 'FAQ', href: '/aide/faq/' },
    { label: 'Comment ça marche ?', href: '/aide/comment-ca-marche/' },
    { label: 'Contact', href: '/aide/contact/' },
    { label: 'Aide clubs', href: '/pour-les-clubs/' },
    { label: 'Aide pratiquants', href: '/aide/pratiquants/' },
  ],
  'Faire du sport': [
    { label: 'Découvrir un sport', href: '/decouvrir/' },
    { label: 'Conseils sportifs', href: '/decouvrir/conseils-sportifs/' },
    { label: 'Événements à venir', href: '/evenements/' },
    { label: 'Autour de moi', href: '/carte/' },
  ],
  'Nos services': [
    { label: 'Devenir club partenaire', href: '/pour-les-clubs/rejoindre/' },
    { label: 'Programme fidélité', href: '/compte/fidelite/' },
  ],
  'Application': [
    { label: 'Télécharger', href: '/application/' },
  ],
};

const socialLinks = [
  { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: Youtube, href: 'https://youtube.com', label: 'Youtube' },
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-bleu-athlace text-creme mt-auto">
      {/* Filigrane décoratif - grand A, bas droite */}
      <img
        src="/brand/motif-A-filigrane.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 h-[120%] w-auto opacity-[0.28] select-none"
      />
      <div className="relative container mx-auto px-4 py-12 lg:py-16">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <img src="/logos/logotype-creme-lime.png" alt="Athlace" className="h-12 w-auto object-contain" />
            </div>
            <p className="text-creme text-sm leading-relaxed">
              Le répertoire national des clubs sportifs en France. Trouvez, comparez et inscrivez-vous aux clubs près de chez vous.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-pill bg-glass flex items-center justify-center hover:bg-glass transition-colors"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).slice(0, 3).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-sans font-bold text-lg mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-creme hover:text-creme transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Secondary link grid */}
        <div className="mt-12 pt-8 border-t border-glass-border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {Object.entries(footerLinks).slice(3).map(([title, links]) => (
              <div key={title}>
                <h4 className="font-sans font-bold text-base mb-3">{title}</h4>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.href}>
                      {link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-creme hover:text-creme transition-colors text-sm"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          to={link.href}
                          className="text-creme hover:text-creme transition-colors text-sm"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="mt-12 pt-8 border-t border-glass-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-creme">
            <div className="flex flex-wrap gap-6">
              <a
                href="mailto:contact@athlace.fr"
                className="flex items-center gap-2 rounded-pill bg-glass px-4 py-2 font-bold text-creme hover:bg-glass transition-colors"
              >
                <Mail className="w-4 h-4" />
                contact@athlace.fr
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-8 border-t border-glass-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-creme">
          <p>© 2026 Athlace. Tous droits réservés.</p>
          <div className="flex flex-wrap gap-6">
            {legalLinks.map((link) => (
              <Link key={link.href} to={link.href} className="hover:text-creme transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
