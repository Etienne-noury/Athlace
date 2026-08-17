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
            ? `Trouvez, comparez et inscrivez-vous parmi ${formatCount(stats.clubs)} clubs sportifs en France, répartis dans ${stats.federations} fédérations sportives agréées.`
            : 'Trouvez, comparez et inscrivez-vous dans les clubs sportifs de France, toutes disciplines confondues.'
        }
      />
      <HeroSection />
      <InteractiveMapSection />
      <PopularDisciplines />
      <FeaturedClubs />
      <StatsSection />
      <CTASection />
    </Layout>
  );
};


export default Index;
