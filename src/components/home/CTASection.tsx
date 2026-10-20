import { Link } from 'react-router-dom';
import { ArrowRight, UserPlus, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CTASection() {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {/* For Users */}
          <div className="relative bg-blue-500 rounded-3xl p-8 lg:p-10 overflow-hidden">
            {/* Decorative */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-glass rounded-pill -translate-y-1/2 translate-x-1/2" />
             <div className="absolute bottom-0 left-0 w-32 h-32 bg-glass rounded-pill translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative">
               <div className="w-14 h-14 rounded-2xl bg-glass flex items-center justify-center mb-6">
                 <UserPlus className="w-7 h-7 text-cream-100" />
              </div>
              
               <h3 className="font-sans text-2xl lg:text-3xl font-black text-cream-100 mb-4">
                Vous êtes sportif ?
              </h3>
              
              <p className="text-surface-alt text-lg mb-8 leading-relaxed">
                Créez votre compte gratuit pour enregistrer vos clubs favoris et retrouver en un clic leur lien d'inscription.
              </p>
              
              <Link to="/compte/inscription/">
                 <Button size="lg" variant="secondary" className="gap-2">
                  Créer mon compte
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>

            </div>
          </div>

          {/* For Clubs */}
          <div className="relative bg-card rounded-3xl p-8 lg:p-10 border-2 border-border overflow-hidden">
            {/* Decorative */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-tint-100 rounded-pill -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative">
               <div className="w-14 h-14 rounded-2xl bg-tint-100 flex items-center justify-center mb-6">
                 <Building2 className="w-7 h-7 text-blue-500" />
              </div>
              
              <h3 className="font-sans text-2xl lg:text-3xl font-black text-foreground mb-4">
                Vous gérez un club ?
              </h3>
              
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Votre fiche existe déjà grâce aux données de votre fédération. Complétez-la gratuitement pour qu'elle soit à
                jour, et découvrez bientôt Athlace Club pour gérer et animer votre club.
              </p>
              
              <div className="flex flex-wrap gap-3">
                <Link to="/compte/mon-club/">
                  <Button size="lg" className="gap-2">
                    Compléter ma fiche
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/pour-les-clubs/">
                  <Button size="lg" variant="secondary" className="gap-2">
                    Découvrir l'offre club
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
