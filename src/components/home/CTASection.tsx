import { Link } from 'react-router-dom';
import { ArrowRight, UserPlus, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CTASection() {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {/* For Users */}
          <div className="relative bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-8 lg:p-10 overflow-hidden">
            {/* Decorative */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
                <UserPlus className="w-7 h-7 text-white" />
              </div>
              
              <h3 className="font-display text-2xl lg:text-3xl font-bold text-white mb-4">
                Vous êtes sportif ?
              </h3>
              
              <p className="text-white/80 text-lg mb-8 leading-relaxed">
                Créez votre compte gratuit pour sauvegarder vos clubs favoris, 
                suivre vos inscriptions et recevoir des recommandations personnalisées.
              </p>
              
              <Link to="/compte/inscription/">
                <Button size="lg" variant="secondary" className="gap-2 bg-white text-primary hover:bg-white/90">
                  Créer mon compte
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>

            </div>
          </div>

          {/* For Clubs */}
          <div className="relative bg-card rounded-3xl p-8 lg:p-10 border-2 border-border overflow-hidden">
            {/* Decorative */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
                <Building2 className="w-7 h-7 text-accent" />
              </div>
              
              <h3 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-4">
                Vous gérez un club ?
              </h3>
              
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Référencez gratuitement votre club sur Athlace, gérez vos inscriptions 
                en ligne et augmentez votre visibilité auprès de milliers de sportifs.
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
