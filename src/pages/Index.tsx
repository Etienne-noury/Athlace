import { Layout } from '@/components/layout/Layout';
import { PageTitle } from '@/components/PageTitle';
import { HeroSection } from '@/components/home/HeroSection';
import { InteractiveMapSection } from '@/components/home/InteractiveMapSection';
import { PopularDisciplines } from '@/components/home/PopularDisciplines';
import { FeaturedClubs } from '@/components/home/FeaturedClubs';
import { StatsSection } from '@/components/home/StatsSection';
import { CTASection } from '@/components/home/CTASection';
import { useSiteStats } from '@/hooks/useSiteStats';
import { formatCount } from '@/lib/format-stats';


const Index = () => {
  const { stats, isReady } = useSiteStats();

  return (
    <Layout>
      <PageTitle
        description={
          isReady
            ? `Trouvez et comparez ${formatCount(stats.clubs)} clubs sportifs en France, issus de ${stats.federations_covered} fédérations sportives agréées - et bientôt inscrivez-vous en ligne.`
            : 'Trouvez et comparez les clubs sportifs de France, toutes fédérations agréées confondues - et bientôt inscrivez-vous en ligne.'
        }
      />
      <HeroSection />
      <StatsSection />
      <PopularDisciplines />
      <InteractiveMapSection />
      <FeaturedClubs />
      <CTASection />
    </Layout>
  );
};


export default Index;
