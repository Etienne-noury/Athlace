import { Link } from 'react-router-dom';
import { ArrowRight, UserPlus, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SoonBadge } from '@/components/ui/SoonBadge';

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
              
               <h3 className="font-display text-2xl lg:text-3xl font-bold text-cream-100 mb-4">
                Vous êtes sportif ?
              </h3>
              
               <p className="text-surface-alt text-lg mb-3 leading-relaxed">
                Créez votre compte gratuit pour sauvegarder vos clubs favoris.
              </p>
              <p className="flex flex-wrap items-center gap-2 text-surface-alt text-sm mb-8 leading-relaxed">
                <SoonBadge className="border-glass-border bg-glass text-surface-alt" />
                Suivi de vos inscriptions et recommandations personnalisées
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
              
              <h3 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-4">
                Vous gérez un club ?
              </h3>
              
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Votre fiche existe déjà grâce aux données de votre fédération. Bientôt,
                complétez-la vous-même en quelques minutes : tarifs, horaires, photos,
                présentation.
              </p>
              
              <Link to="/pour-les-clubs/">
                <Button size="lg" variant="outline" className="gap-2 border-2">
                  Inscrire mon club
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
