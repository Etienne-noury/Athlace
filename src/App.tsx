import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Redirect, FootballClubRedirect, MapSearchRedirect } from "./components/Redirect";
import { ScrollToTop } from "./components/ScrollToTop";
import { AuthProvider } from "./lib/auth";
import { RequireAuth } from "./components/auth/RequireAuth";
import { RequireAdmin } from "./components/auth/RequireAdmin";
import Index from "./pages/Index";

/*
 * Table des routes du site : une ligne = une URL.
 * Seule la page d'accueil est chargée d'emblée ; les autres pages sont téléchargées
 * à la demande (lazy) pour que le premier affichage reste léger.
 */

// Sports
const SportsIndex = lazy(() => import("./pages/SportsIndex"));
const SportsFamily = lazy(() => import("./pages/SportsFamily"));
const SportDetail = lazy(() => import("./pages/SportDetail"));

// Recherche de clubs (liste + carte) et fiche club
const ClubsIndex = lazy(() => import("./pages/ClubsIndex"));
const LocationIndex = lazy(() => import("./pages/LocationIndex"));
const GeoHub = lazy(() => import("./pages/GeoHub"));
const ClubDetail = lazy(() => import("./pages/ClubDetail"));

// Fédérations, événements, blog
const FederationsIndex = lazy(() => import("./pages/FederationsIndex"));
const FederationDetail = lazy(() => import("./pages/FederationDetail"));
const Evenements = lazy(() => import("./pages/Evenements"));
const EventDetail = lazy(() => import("./pages/EventDetail"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));

// Espace club
const ClubsB2B = lazy(() => import("./pages/ClubsB2B"));
const MyClub = lazy(() => import("./pages/MyClub"));

// Compte
const Compte = lazy(() => import("./pages/Compte"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Profile = lazy(() => import("./pages/Profile"));
const Favorites = lazy(() => import("./pages/Favorites"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Fidelity = lazy(() => import("./pages/Fidelity"));

// Aide, entreprise, pages légales
const AideFAQ = lazy(() => import("./pages/AideFAQ"));
const Contact = lazy(() => import("./pages/Contact"));
const HelpPratiquants = lazy(() => import("./pages/HelpPratiquants"));
const About = lazy(() => import("./pages/About"));
const Mission = lazy(() => import("./pages/Mission"));
const Recruitment = lazy(() => import("./pages/Recruitment"));
const Partners = lazy(() => import("./pages/Partners"));
const MentionsLegales = lazy(() => import("./pages/MentionsLegales"));
const CGU = lazy(() => import("./pages/CGU"));
const Confidentialite = lazy(() => import("./pages/Confidentialite"));
const Cookies = lazy(() => import("./pages/Cookies"));
const Accessibilite = lazy(() => import("./pages/Accessibilite"));
const Application = lazy(() => import("./pages/Application"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Administration
const Admin = lazy(() => import("./pages/Admin"));

// Anciennes pages, conservées sous une URL « -old » (voir docs/ARCHITECTURE.md, « Code en sommeil »)
const Aide = lazy(() => import("./pages/Aide"));
const Federations = lazy(() => import("./pages/Federations"));
const Football = lazy(() => import("./pages/Football"));
const FootballClubDetail = lazy(() => import("./pages/FootballClubDetail"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center" role="status" aria-label="Chargement de la page">
    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ScrollToTop />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Accueil */}
              <Route path="/" element={<Index />} />

              {/* Sports */}
              <Route path="/sports/" element={<SportsIndex />} />
              <Route path="/sports/famille/hiver/" element={<Redirect to="/sports/famille/glisse/" />} />
              <Route path="/sports/famille/fitness/" element={<Redirect to="/sports/famille/forme/" />} />
              <Route path="/sports/famille/traditionnel/" element={<Redirect to="/sports/famille/traditions/" />} />
              <Route path="/sports/famille/paralympique/" element={<Redirect to="/sports/famille/handicap/" />} />
              <Route path="/sports/famille/peche/" element={<Redirect to="/sports/famille/nature/" />} />
              <Route path="/sports/famille/:familyId/" element={<SportsFamily />} />
              <Route path="/sports/:sportId/" element={<SportDetail />} />

              {/* Recherche de clubs : GeoHub lit les segments (sport, région, ville…) */}
              <Route path="/clubs/" element={<ClubsIndex />} />
              <Route path="/clubs/tout/" element={<LocationIndex />} />
              <Route path="/clubs/tout/region/" element={<Navigate to="/clubs/tout/?onglet=regions" replace />} />
              <Route path="/clubs/tout/ville/" element={<Navigate to="/clubs/tout/?onglet=villes" replace />} />
              <Route path="/clubs/:a/" element={<GeoHub />} />
              <Route path="/clubs/:a/:b/" element={<GeoHub />} />
              <Route path="/clubs/:a/:b/:c/" element={<GeoHub />} />
              <Route path="/clubs/:a/:b/:c/:d/" element={<GeoHub />} />

              {/* Fiche club */}
              <Route path="/club/:id" element={<ClubDetail />} />

              {/* Carte : intégrée à la recherche, l'ancienne URL redirige */}
              <Route path="/carte" element={<MapSearchRedirect />} />
              <Route path="/carte/" element={<MapSearchRedirect />} />

              {/* Espace club et blog */}
              <Route path="/pour-les-clubs/" element={<ClubsB2B />} />
              <Route path="/pour-les-clubs/:slug/" element={<ClubsB2B />} />
              <Route path="/decouvrir/" element={<Redirect to="/blog/" />} />
              <Route path="/decouvrir/guide-licences-federations/" element={<Redirect to="/blog/guide-licences-federations/" />} />
              <Route path="/decouvrir/comment-choisir-son-club/" element={<Redirect to="/blog/comment-choisir-son-club/" />} />
              <Route path="/decouvrir/fiches-sport-par-sport/" element={<Redirect to="/blog/fiches-sport-par-sport/" />} />
              <Route path="/blog/" element={<Blog />} />
              <Route path="/blog/:id/" element={<BlogPost />} />

              {/* Aide */}
              <Route path="/aide/faq/" element={<AideFAQ />} />
              <Route path="/aide/comment-ca-marche/" element={<Redirect to="/pour-les-clubs/#comment-ca-marche" />} />
              <Route path="/aide/contact/" element={<Contact />} />
              <Route path="/aide/pratiquants/" element={<HelpPratiquants />} />
              <Route path="/aide" element={<Navigate to="/aide/faq/" replace />} />

              {/* Entreprise */}
              <Route path="/entreprise/qui-sommes-nous/" element={<About />} />
              <Route path="/entreprise/mission/" element={<Mission />} />
              <Route path="/entreprise/recrutement/" element={<Recruitment />} />
              <Route path="/entreprise/partenaires/" element={<Partners />} />

              {/* Compte (RequireAuth = connexion obligatoire) */}
              <Route path="/compte/" element={<RequireAuth><Compte /></RequireAuth>} />
              <Route path="/compte/connexion/" element={<Login />} />
              <Route path="/compte/inscription/" element={<Register />} />
              <Route path="/compte/mot-de-passe-oublie/" element={<ForgotPassword />} />
              <Route path="/compte/nouveau-mot-de-passe/" element={<ResetPassword />} />
              <Route path="/compte/profil/" element={<RequireAuth><Profile /></RequireAuth>} />
              <Route path="/compte/favoris/" element={<RequireAuth><Favorites /></RequireAuth>} />
              <Route path="/compte/mes-clubs/" element={<Redirect to="/compte/favoris/" />} />
              <Route path="/compte/mon-club/" element={<RequireAuth><MyClub /></RequireAuth>} />
              <Route path="/compte/alertes/" element={<RequireAuth><Notifications /></RequireAuth>} />
              <Route path="/compte/notifications/" element={<Redirect to="/compte/alertes/" />} />
              <Route path="/compte/fidelite/" element={<Fidelity />} />

              {/* Pages légales */}
              <Route path="/mentions-legales/" element={<MentionsLegales />} />
              <Route path="/cgu-cgv/" element={<CGU />} />
              <Route path="/confidentialite/" element={<Confidentialite />} />
              <Route path="/cookies/" element={<Cookies />} />
              <Route path="/accessibilite/" element={<Accessibilite />} />

              {/* Fédérations, événements, application */}
              <Route path="/federations/" element={<FederationsIndex />} />
              <Route path="/federations/:slug/" element={<FederationDetail />} />
              <Route path="/evenements/" element={<Evenements />} />
              <Route path="/evenements/:slug/" element={<EventDetail />} />
              <Route path="/application/" element={<Application />} />

              {/* Anciennes URL redirigées */}
              <Route path="/recherche" element={<Navigate to="/clubs/" replace />} />
              <Route path="/recherche/*" element={<Navigate to="/clubs/" replace />} />
              <Route path="/disciplines" element={<Navigate to="/sports/" replace />} />
              <Route path="/disciplines/*" element={<Navigate to="/sports/" replace />} />
              <Route path="/football" element={<Navigate to="/sports/football/" replace />} />
              <Route path="/football/club/:id" element={<FootballClubRedirect />} />
              <Route path="/favoris" element={<Navigate to="/compte/favoris/" replace />} />

              {/* Administration (RequireAdmin = rôle admin, revérifié côté serveur à chaque action) */}
              <Route path="/admin" element={<RequireAdmin><Admin /></RequireAdmin>} />

              {/* Anciennes pages conservées */}
              <Route path="/aide-old" element={<Aide />} />
              <Route path="/federations-old" element={<Federations />} />
              <Route path="/football-old" element={<Football />} />
              <Route path="/football-club-old/:id" element={<FootballClubDetail />} />

              {/* Page introuvable */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
