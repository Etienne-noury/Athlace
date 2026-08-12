import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Redirect, FootballClubRedirect, ClubLegacyRedirect } from "./components/Redirect";
import Index from "./pages/Index";
import Recherche from "./pages/Recherche";
import Disciplines from "./pages/Disciplines";
import ClubDetail from "./pages/ClubDetail";
import Carte from "./pages/Carte";
import Aide from "./pages/Aide";
import Federations from "./pages/Federations";
import Football from "./pages/Football";
import FootballClubDetail from "./pages/FootballClubDetail";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";

// New arborescence pages
import SportsIndex from "./pages/SportsIndex";
import SportsFamily from "./pages/SportsFamily";
import SportDetail from "./pages/SportDetail";
import ClubsIndex from "./pages/ClubsIndex";
import RegionsIndex from "./pages/RegionsIndex";
import CitiesIndex from "./pages/CitiesIndex";
import GeoHub from "./pages/GeoHub";
import ClubsB2B from "./pages/ClubsB2B";
import Discover from "./pages/Discover";
import DiscoverArticle from "./pages/DiscoverArticle";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import BlogDossier from "./pages/BlogDossier";
import AideFAQ from "./pages/AideFAQ";
import HowItWorks from "./pages/HowItWorks";
import Contact from "./pages/Contact";
import HelpPratiquants from "./pages/HelpPratiquants";
import About from "./pages/About";
import Mission from "./pages/Mission";
import Recruitment from "./pages/Recruitment";
import Partners from "./pages/Partners";
import Compte from "./pages/Compte";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Favorites from "./pages/Favorites";
import MyClub from "./pages/MyClub";
import Notifications from "./pages/Notifications";
import Fidelity from "./pages/Fidelity";
import MentionsLegales from "./pages/MentionsLegales";
import CGU from "./pages/CGU";
import Confidentialite from "./pages/Confidentialite";
import Cookies from "./pages/Cookies";
import Accessibilite from "./pages/Accessibilite";
import Evenements from "./pages/Evenements";
import Application from "./pages/Application";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Home */}
          <Route path="/" element={<Index />} />

          {/* Sports hub */}
          <Route path="/sports/" element={<SportsIndex />} />
          <Route path="/sports/famille/:familyId/" element={<SportsFamily />} />
          <Route path="/sports/:sportId/" element={<SportDetail />} />

          {/* Clubs / geo hub */}
          <Route path="/clubs/" element={<ClubsIndex />} />
          <Route path="/clubs/tout/region/" element={<RegionsIndex />} />
          <Route path="/clubs/tout/ville/" element={<CitiesIndex />} />
          <Route path="/clubs/:a/" element={<GeoHub />} />
          <Route path="/clubs/:a/:b/" element={<GeoHub />} />
          <Route path="/clubs/:a/:b/:c/" element={<GeoHub />} />
          <Route path="/clubs/:a/:b/:c/:d/" element={<GeoHub />} />


          {/* Club detail */}
          <Route path="/club/:id" element={<ClubDetail />} />

          {/* Map */}
          <Route path="/carte" element={<Carte />} />
          <Route path="/carte/" element={<Carte />} />

          {/* B2B & discover */}
          <Route path="/pour-les-clubs/" element={<ClubsB2B />} />
          <Route path="/pour-les-clubs/:slug/" element={<ClubsB2B />} />
          <Route path="/decouvrir/" element={<Discover />} />
          <Route path="/decouvrir/:slug/" element={<DiscoverArticle />} />
          <Route path="/blog/" element={<Blog />} />
          <Route path="/blog/:id/" element={<BlogPost />} />
          <Route path="/blog/dossier-:id/" element={<BlogDossier />} />

          {/* Help */}
          <Route path="/aide/faq/" element={<AideFAQ />} />
          <Route path="/aide/comment-ca-marche/" element={<HowItWorks />} />
          <Route path="/aide/contact/" element={<Contact />} />
          <Route path="/aide/pratiquants/" element={<HelpPratiquants />} />
          <Route path="/aide" element={<Navigate to="/aide/faq/" replace />} />

          {/* Company */}
          <Route path="/entreprise/qui-sommes-nous/" element={<About />} />
          <Route path="/entreprise/mission/" element={<Mission />} />
          <Route path="/entreprise/recrutement/" element={<Recruitment />} />
          <Route path="/entreprise/partenaires/" element={<Partners />} />

          {/* Account */}
          <Route path="/compte/" element={<Compte />} />
          <Route path="/compte/connexion/" element={<Login />} />
          <Route path="/compte/inscription/" element={<Register />} />
          <Route path="/compte/profil/" element={<Profile />} />
          <Route path="/compte/mes-clubs/" element={<Favorites />} />
          <Route path="/compte/mon-club/" element={<MyClub />} />
          <Route path="/compte/notifications/" element={<Notifications />} />
          <Route path="/compte/fidelite/" element={<Fidelity />} />

          {/* Legal */}
          <Route path="/mentions-legales/" element={<MentionsLegales />} />
          <Route path="/cgu-cgv/" element={<CGU />} />
          <Route path="/confidentialite/" element={<Confidentialite />} />
          <Route path="/cookies/" element={<Cookies />} />
          <Route path="/accessibilite/" element={<Accessibilite />} />

          {/* Misc */}
          <Route path="/evenements/" element={<Evenements />} />
          <Route path="/application/" element={<Application />} />

          {/* Legacy redirects */}
          <Route path="/recherche" element={<Navigate to="/clubs/" replace />} />
          <Route path="/recherche/*" element={<Navigate to="/clubs/" replace />} />
          <Route path="/disciplines" element={<Navigate to="/sports/" replace />} />
          <Route path="/disciplines/*" element={<Navigate to="/sports/" replace />} />
          <Route path="/football" element={<Navigate to="/sports/football/" replace />} />
          <Route path="/football/club/:id" element={<FootballClubRedirect />} />
          <Route path="/federations" element={<Navigate to="/decouvrir/guide-licences-federations/" replace />} />
          <Route path="/federations/*" element={<Navigate to="/decouvrir/guide-licences-federations/" replace />} />
          <Route path="/favoris" element={<Navigate to="/compte/mes-clubs/" replace />} />

          {/* Admin & legacy routes preserved */}
          <Route path="/admin" element={<Admin />} />
          <Route path="/aide-old" element={<Aide />} />
          <Route path="/federations-old" element={<Federations />} />
          <Route path="/football-old" element={<Football />} />
          <Route path="/football-club-old/:id" element={<FootballClubDetail />} />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
