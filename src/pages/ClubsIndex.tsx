import { useEffect } from 'react';
import Recherche from '@/pages/Recherche';

export default function ClubsIndex() {
  useEffect(() => {
    document.title = 'Trouver un club - Athlace';
  }, []);

  return <Recherche />;
}

