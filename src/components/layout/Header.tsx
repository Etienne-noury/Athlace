import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  Search,
  User,
  MapPin,
  Heart,
  ChevronDown,
  Building2,
  HelpCircle,
  Compass,
  Map,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useQuery } from '@tanstack/react-query';
import {
  FEDERATION_CATEGORIES,
  fetchFederationsByCategorie,
  slugifyFederation,
} from '@/lib/federations-officielles';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth, signOut } from '@/lib/auth';


const navItems = [
  {
    id: 'sports',
    label: 'Trouver un sport',
    href: '/sports/',
    icon: Compass,
    megaMenu: true,
    type: 'sports',
  },
  {
    id: 'clubs',
    label: 'Trouver un club',
    href: '/clubs/',
    icon: MapPin,
    megaMenu: true,
    type: 'clubs',
  },
  {
    id: 'b2b',
    label: 'Pour les clubs',
    href: '/pour-les-clubs/',
    icon: Building2,
  },
  {
    id: 'decouvrir',
    label: 'Découvrir',
    href: '/decouvrir/',
    icon: Compass,
  },
];

const clubMenuLinks = [
  { label: 'Par ville', href: '/clubs/tout/ville/', icon: MapPin },
  { label: 'Par sport', href: '/sports/', icon: Compass },
  { label: 'Autour de moi', href: '/carte/', icon: Map },
  { label: 'Tous les clubs', href: '/clubs/', icon: Search },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { data: federationsByCategorie } = useQuery({
    queryKey: ['federations-by-categorie'],
    queryFn: fetchFederationsByCategorie,
    staleTime: 1000 * 60 * 60,
  });



  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Mon compte';
  const initials = displayName
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/clubs/?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20 gap-3">
          {/* Logo + Search shortcut */}
          <div className="flex flex-1 min-w-0 items-center gap-3">
            <Link to="/" className="flex items-center gap-2 group shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#262E47] to-[#415CAF] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <span className="text-xl font-bold text-white">A</span>
              </div>
              <span className="font-display text-xl font-bold text-foreground hidden sm:block">
                Athlace
              </span>
            </Link>

            {/* Desktop Search */}
            <form onSubmit={handleSearch} className="hidden xl:flex w-full max-w-[220px]">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Sport, ville, club..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 w-full bg-muted/50 border-muted"
                />
              </div>
            </form>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex shrink-0 items-center justify-center gap-1">


            {navItems.map((item) => (
              <div
                key={item.id}
                className="relative"
                onMouseEnter={() => item.megaMenu && setActiveMega(item.id)}
                onMouseLeave={() => setActiveMega(null)}
              >
                <Link
                  to={item.href}
                  className={cn(
                    "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-1.5",
                    location.pathname === item.href || location.pathname.startsWith(item.href)
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {item.label}
                  {item.megaMenu && <ChevronDown className="h-3.5 w-3.5" />}
                </Link>

                {/* Mega menu */}
                {item.megaMenu && activeMega === item.id && (
                  <div className="fixed left-1/2 -translate-x-1/2 top-16 lg:top-20 pt-2 w-[900px] max-w-[95vw]">
                    <div className="bg-popover border border-border rounded-xl shadow-xl p-6">
                      {item.type === 'sports' && (
                        <div className="grid grid-cols-4 gap-x-6 gap-y-5 max-h-[70vh] overflow-y-auto">
                          {FEDERATION_CATEGORIES.map((categorie) => {
                            const feds = federationsByCategorie?.[categorie] ?? [];
                            if (feds.length === 0) return null;
                            return (
                              <div key={categorie}>
                                <Link
                                  to={`/sports/famille/${slugifyFederation(categorie)}/`}
                                  className="font-display font-semibold text-sm text-foreground hover:text-primary block mb-2"
                                >
                                  {categorie}
                                </Link>
                                <ul className="space-y-1.5">
                                  {feds.slice(0, 5).map((fed) => (
                                    <li key={fed.id}>
                                      <Link
                                        to={`/sports/${slugifyFederation(fed.sigle || fed.nom)}/`}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                      >
                                        {fed.nom}
                                      </Link>
                                    </li>
                                  ))}
                                  {feds.length > 5 && (
                                    <li>
                                      <Link
                                        to={`/sports/famille/${slugifyFederation(categorie)}/`}
                                        className="text-sm text-primary font-medium hover:underline"
                                      >
                                        Voir tout →
                                      </Link>
                                    </li>
                                  )}
                                </ul>
                              </div>
                            );
                          })}
                        </div>
                      )}


                      {item.type === 'clubs' && (
                        <div className="grid grid-cols-2 gap-8">
                          <div>
                            <h3 className="font-display font-semibold text-foreground mb-3">Trouver un club</h3>
                            <ul className="space-y-2">
                              {clubMenuLinks.map((link) => (
                                <li key={link.href}>
                                  <Link
                                    to={link.href}
                                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                                  >
                                    <link.icon className="h-4 w-4" />
                                    {link.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h3 className="font-display font-semibold text-foreground mb-3">Top villes</h3>
                            <ul className="space-y-2">
                              {['Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Lille', 'Nantes', 'Strasbourg', 'Toulouse'].map((city) => (
                                <li key={city}>
                                  <Link
                                    to={`/clubs/${city.toLowerCase().replace(/ /g, '-')}/`}
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                  >
                                    Clubs à {city}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1 shrink-0">
            <Link to="/clubs/" className="sm:hidden">
              <Button variant="ghost" size="icon" aria-label="Rechercher un club">
                <Search className="h-5 w-5 text-muted-foreground" />
              </Button>
            </Link>
            <Link to="/compte/mes-clubs/" className="hidden sm:flex">

              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="hidden sm:flex gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
                    </Avatar>
                    <span className="max-w-[120px] truncate">{displayName}</span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-popover z-50">
                  <DropdownMenuLabel className="truncate">{user.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild><Link to="/compte/">Tableau de bord</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/compte/profil/">Mon profil</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/compte/mes-clubs/">Mes clubs</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/compte/notifications/">Notifications</Link></DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={async () => {
                      await signOut();
                      navigate('/');
                    }}
                  >
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/compte/connexion/">
                  <Button variant="outline" className="gap-2">
                    <User className="h-4 w-4" />
                    <span>Connexion</span>
                  </Button>
                </Link>
                <Link to="/compte/inscription/">
                  <Button className="gap-2">
                    <span>Créer un compte</span>
                  </Button>
                </Link>
              </div>
            )}


            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border/50">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Sport, ville, club..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10"
                />
              </div>
            </form>

            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-lg font-medium transition-all flex items-center gap-2",
                    location.pathname === item.href || location.pathname.startsWith(item.href)
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}

              <Accordion type="single" collapsible className="mt-2">
                {FEDERATION_CATEGORIES.map((categorie) => {
                  const feds = federationsByCategorie?.[categorie] ?? [];
                  if (feds.length === 0) return null;
                  return (
                    <AccordionItem key={categorie} value={categorie}>
                      <AccordionTrigger className="px-4 text-sm font-medium">
                        {categorie}
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="flex flex-col gap-1 px-4 pb-2">
                          {feds.map((fed) => (
                            <li key={fed.id}>
                              <Link
                                to={`/sports/${slugifyFederation(fed.sigle || fed.nom)}/`}
                                onClick={() => setIsMenuOpen(false)}
                                className="block py-1.5 text-sm text-muted-foreground hover:text-foreground"
                              >
                                {fed.nom}
                              </Link>
                            </li>
                          ))}
                          <li>
                            <Link
                              to={`/sports/famille/${slugifyFederation(categorie)}/`}
                              onClick={() => setIsMenuOpen(false)}
                              className="block py-1.5 text-sm text-primary font-medium"
                            >
                              Voir la catégorie →
                            </Link>
                          </li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>

              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border/50">
                <Link to="/compte/" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full gap-2">
                    <User className="h-4 w-4" />
                    Mon Compte
                  </Button>
                </Link>
                {!user && (
                  <Link to="/compte/inscription/" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full">Créer un compte</Button>
                  </Link>
                )}
              </div>
              <Link
                to="/aide/faq/"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 rounded-lg font-medium text-muted-foreground hover:text-foreground hover:bg-muted flex items-center gap-2"
              >
                <HelpCircle className="h-4 w-4" />
                Une question ?
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
