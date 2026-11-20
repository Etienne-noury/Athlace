import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { isClubFormOpen } from '@/lib/club-form-access';
import MyClub from '@/pages/MyClub';

/** Questionnaire club sans compte : ouvre une session anonyme puis affiche le questionnaire habituel. */
export default function OpenClubForm() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [failed, setFailed] = useState(false);
  const open = isClubFormOpen();

  useEffect(() => {
    if (!open || loading || user || failed) return;
    supabase.auth.signInAnonymously().then(({ error }) => { if (error) setFailed(true); });
  }, [open, loading, user, failed]);

  if (!open) return <Navigate to={`/compte/mon-club/${location.search}`} replace />;
  if (user) return <MyClub />;
  if (failed) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="mb-4 font-sans text-2xl font-black text-nuit">Compléter ma fiche</h1>
          <p className="mb-6 text-nuit/70">L'accès sans compte n'est pas disponible pour le moment. Connectez-vous pour continuer.</p>
          <Button asChild><Link to="/compte/connexion/" state={{ from: `/compte/mon-club/${location.search}` }}>Se connecter</Link></Button>
        </div>
      </Layout>
    );
  }
  return (
    <Layout>
      <div role="status" className="container mx-auto flex justify-center px-4 py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    </Layout>
  );
}
