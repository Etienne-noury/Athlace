import { Link } from 'react-router-dom';
import {
  ArrowRight, Clock, Building2, Users, Contact, CreditCard, Star, UserPlus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SoonBadge } from '@/components/ui/SoonBadge';

const CARDS = [
  { icon: Clock, title: 'Horaires', text: 'Les créneaux par jour, catégorie et niveau.', soon: false },
  { icon: Building2, title: 'Lieux', text: 'Gymnases, dojos, piscines… avec l’adresse exacte.', soon: false },
  { icon: Users, title: 'Disciplines et publics', text: 'Sous-disciplines, enfants, loisir, compétition, handi.', soon: false },
  { icon: Contact, title: 'Contacts', text: 'Site officiel, réseaux sociaux, lien d’inscription quand il existe.', soon: false },
  { icon: CreditCard, title: 'Tarifs par niveau', text: 'Le prix de la licence selon l’âge et le niveau.', soon: true },
  { icon: Star, title: 'Avis des membres', text: 'L’expérience de ceux qui y sont inscrits.', soon: true },
  { icon: UserPlus, title: 'Inscription en ligne', text: 'S’inscrire au club directement depuis Athlace.', soon: true },
];

export function ClubDataSection() {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-2">
            Tout savoir avant de pousser la porte d’un club
          </h2>
          <p className="text-muted-foreground text-lg">
            Les infos des fédérations aujourd’hui, celles des clubs eux-mêmes demain.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CARDS.map(({ icon: Icon, title, text, soon }, index) => (
            <div
              key={title}
              className="bg-card rounded-2xl border border-border p-5 animate-fade-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-tint-100 mb-4">
                <Icon className="w-5 h-5 text-primary" aria-hidden />
              </div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="font-display text-lg font-semibold text-foreground">{title}</h3>
                {soon && <SoonBadge />}
              </div>
              <p className="text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link to="/clubs/">
            <Button className="gap-2 rounded-pill">
              Trouver un club
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
