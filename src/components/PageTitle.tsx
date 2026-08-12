import { Helmet } from 'react-helmet-async';

interface PageTitleProps {
  title?: string;
  description?: string;
}

const SITE_NAME = 'Athlace';

export function PageTitle({ title, description }: PageTitleProps) {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : SITE_NAME;
  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
    </Helmet>
  );
}
