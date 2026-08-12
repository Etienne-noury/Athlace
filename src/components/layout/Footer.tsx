import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const footerLinks = {
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
  'Suivez-nous': [
    { label: 'Instagram', href: 'https://instagram.com', external: true },
    { label: 'TikTok', href: 'https://tiktok.com', external: true },
    { label: 'LinkedIn', href: 'https://linkedin.com', external: true },
  ],
  'Informations légales': [
    { label: 'Mentions légales', href: '/mentions-legales/' },
    { label: 'CGU / CGV', href: '/cgu-cgv/' },
    { label: 'Confidentialité / RGPD', href: '/confidentialite/' },
    { label: 'Cookies', href: '/cookies/' },
    { label: 'Accessibilité', href: '/accessibilite/' },
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
    <footer className="bg-[#262E47] text-white mt-auto">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#415CAF] to-[#D5DC3C] flex items-center justify-center">
                <span className="text-xl font-bold text-white">A</span>
              </div>
              <span className="font-display text-xl font-bold">Athlace</span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
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
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).slice(0, 3).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-display font-semibold text-lg mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-white/70 hover:text-white transition-colors text-sm"
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
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {Object.entries(footerLinks).slice(3).map(([title, links]) => (
              <div key={title}>
                <h4 className="font-display font-semibold text-base mb-3">{title}</h4>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.href}>
                      {link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white/70 hover:text-white transition-colors text-sm"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          to={link.href}
                          className="text-white/70 hover:text-white transition-colors text-sm"
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
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/70">
            <div className="flex flex-wrap gap-6">
              <a href="mailto:contact@athlace.fr" className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail className="w-4 h-4" />
                contact@athlace.fr
              </a>
              <a href="tel:0800123456" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone className="w-4 h-4" />
                0 800 123 456
              </a>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Lundi - Vendredi : 9h - 18h
              </span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/50">
          <p>© 2026 Athlace. Tous droits réservés.</p>
          <div className="flex flex-wrap gap-6">
            {footerLinks['Informations légales'].map((link) => (
              <Link key={link.href} to={link.href} className="hover:text-white transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
