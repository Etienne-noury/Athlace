import { Layout } from '@/components/layout/Layout';
import { PageTitle } from '@/components/PageTitle';
import Recherche from '@/pages/Recherche';

export default function ClubsIndex() {
  return (
    <Layout>
      <PageTitle title="Trouver un club" description="Recherchez les clubs sportifs en France par ville, région et discipline." />
      <Recherche />
    </Layout>
  );
}
