import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Linkedin, Mail } from 'lucide-react';
import { SoonBadge } from '@/components/ui/SoonBadge';

const legalLinks = [
  { label: 'Mentions légales', href: '/mentions-legales/' },
  { label: 'CGU / CGV', href: '/cgu-cgv/' },
  { label: 'Confidentialité / RGPD', href: '/confidentialite/' },
  { label: 'Cookies', href: '/cookies/' },
  { label: 'Accessibilité', href: '/accessibilite/' },
];

const footerLinks: Record<string, { label: string; href: string; soon?: boolean }[]> = {
  'Athlace': [
    { label: 'À propos', href: '/entreprise/qui-sommes-nous/' },
    { label: 'Notre mission', href: '/entreprise/mission/' },
    { label: 'Contact', href: '/aide/contact/' },
    { label: 'FAQ', href: '/aide/faq/' },
  ],
  'Pour les clubs': [
    { label: "L'offre Athlace", href: '/pour-les-clubs/' },
    { label: 'Comment ça marche', href: '/pour-les-clubs/#comment-ca-marche' },
  ],
  'Application': [
    { label: 'Télécharger', href: '/application/', soon: true },
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
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="min-w-0">
              <h4 className="font-sans font-bold text-lg mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="inline-flex flex-wrap items-center gap-2 text-creme hover:text-creme transition-colors text-sm"
                    >
                      {link.label}
                      {link.soon && <SoonBadge />}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
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
