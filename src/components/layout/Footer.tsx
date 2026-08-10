import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-foreground text-background mt-auto">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-hero-gradient flex items-center justify-center">
                <span className="text-xl font-bold text-white">CL</span>
              </div>
              <span className="font-display text-xl font-bold">Athlace</span>
            </div>
            <p className="text-background/70 text-sm leading-relaxed">
              Le répertoire national des clubs sportifs en France. Trouvez, comparez et inscrivez-vous aux clubs près de chez vous.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-background/70 hover:text-background transition-colors">Accueil</Link></li>
              <li><Link to="/recherche" className="text-background/70 hover:text-background transition-colors">Rechercher un club</Link></li>
              <li><Link to="/disciplines" className="text-background/70 hover:text-background transition-colors">Disciplines sportives</Link></li>
              <li><Link to="/carte" className="text-background/70 hover:text-background transition-colors">Carte interactive</Link></li>
              <li><Link to="/aide" className="text-background/70 hover:text-background transition-colors">Aide & FAQ</Link></li>
            </ul>
          </div>

          {/* Disciplines populaires */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Disciplines populaires</h4>
            <ul className="space-y-2">
              <li><Link to="/recherche?discipline=football" className="text-background/70 hover:text-background transition-colors">Football</Link></li>
              <li><Link to="/recherche?discipline=tennis" className="text-background/70 hover:text-background transition-colors">Tennis</Link></li>
              <li><Link to="/recherche?discipline=natation" className="text-background/70 hover:text-background transition-colors">Natation</Link></li>
              <li><Link to="/recherche?discipline=judo" className="text-background/70 hover:text-background transition-colors">Judo</Link></li>
              <li><Link to="/recherche?discipline=equitation" className="text-background/70 hover:text-background transition-colors">Équitation</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-background/70">
                <Mail className="w-4 h-4" />
                <a href="mailto:contact@athlace.fr" className="hover:text-background transition-colors">contact@athlace.fr</a>
              </li>
              <li className="flex items-center gap-2 text-background/70">
                <Phone className="w-4 h-4" />
                <a href="tel:0800123456" className="hover:text-background transition-colors">0 800 123 456</a>
              </li>
            </ul>
            <div className="mt-6">
              <p className="text-sm text-background/50">
                Lundi - Vendredi : 9h - 18h
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-background/50">
          <p>© 2024 Athlace. Tous droits réservés.</p>
          <div className="flex gap-6">
            <Link to="/mentions-legales" className="hover:text-background transition-colors">Mentions légales</Link>
            <Link to="/confidentialite" className="hover:text-background transition-colors">Confidentialité</Link>
            <Link to="/cgv" className="hover:text-background transition-colors">CGV</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
