import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { JournalArticle } from '@/data/journal';

export function FurtherReading({ link }: { link: JournalArticle['further'] }) {
  return <section className="mt-12 border-t border-border pt-8">
    <h2 className="text-2xl font-black text-foreground mb-4">Pour aller plus loin</h2>
    <Button asChild variant="outline" className="h-auto whitespace-normal text-left gap-2">
      <Link to={link.href}>{link.label}<ArrowRight className="h-4 w-4 shrink-0" /></Link>
    </Button>
  </section>;
}