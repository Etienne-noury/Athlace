import { PageTitle } from '@/components/PageTitle';
import Recherche from '@/pages/Recherche';

export default function ClubsIndex() {
  return (
    <>
      <PageTitle title="Trouver un club" description="Recherchez les clubs sportifs en France par ville, région et discipline." />
      <Recherche />
    </>
  );
}
