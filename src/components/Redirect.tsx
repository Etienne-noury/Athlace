import { Navigate, useLocation, useParams } from 'react-router-dom';

interface RedirectProps {
  to: string;
}

export function Redirect({ to }: RedirectProps) {
  return <Navigate to={to} replace />;
}

export function MapSearchRedirect() {
  const { search, hash } = useLocation();
  return <Navigate to={{ pathname: '/clubs/', search, hash }} replace />;
}

export function FootballClubRedirect() {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={`/clubs/${id}`} replace />;
}

export function ClubLegacyRedirect() {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={`/clubs/${id}`} replace />;
}
