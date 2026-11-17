import { Link } from 'react-router-dom';
import { useIsAdmin } from '@/hooks/useIsAdmin';

/** Rappel pour les admins : ils voient les clubs scrapés que le public ne voit pas encore. */
export function AdminPreviewBar() {
  const isAdmin = useIsAdmin();
  if (!isAdmin) return null;
  return (
    <div className="bg-nuit px-4 py-1.5 text-center text-xs text-blanc">
      Mode admin : vous voyez tous les clubs, y compris ceux des fédérations non publiées.{' '}
      <Link to="/admin" className="font-bold text-lime underline-offset-2 hover:underline">Gérer la publication</Link>
    </div>
  );
}
