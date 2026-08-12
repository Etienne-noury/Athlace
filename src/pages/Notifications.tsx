import { Layout } from '@/components/layout/Layout';
import { Bell } from 'lucide-react';

export default function Notifications() {
  return (
    <Layout>
      <section className="bg-muted/30 border-b border-border py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground mt-2">Gérez vos alertes et recommandations.</p>
        </div>
      </section>
      <section className="container mx-auto px-4 py-12">
        <div className="text-center py-16 border border-dashed border-border rounded-2xl bg-muted/30">
          <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Aucune notification pour le moment.</p>
        </div>
      </section>
    </Layout>
  );
}
