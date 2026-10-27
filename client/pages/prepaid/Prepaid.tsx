import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { PageShell, PageHeader } from '@/components/community/CommunityUI';
import OverviewTab from './OverviewTab';
import RequestsTab from './RequestsTab';
import CardsTab from './CardsTab';
import BatchesTab from './BatchesTab';
import ClaimsTab from './ClaimsTab';
import RulesTab from './RulesTab';

// Admin › AsraPa prépayée : la carte virtuelle prépayée des auditeurs et des artistes.
// Front only for now: the /admin/card/* routes are not deployed, every block shows « — ».

type TabSlug = 'vue' | 'demandes' | 'cartes' | 'lots' | 'reclamations' | 'regles';
const TABS: TabSlug[] = ['vue', 'demandes', 'cartes', 'lots', 'reclamations', 'regles'];

export default function Prepaid() {
  const { t } = useTranslation('prepaid');
  const { tab } = useParams<{ tab?: string }>();
  const active: TabSlug = TABS.includes(tab as TabSlug) ? (tab as TabSlug) : 'vue';

  return (
    <PageShell>
      <PageHeader eyebrow={t('eyebrow')} title={t(`titles.${active}`)} aside={t(`asides.${active}`)} />

      <div role="tablist" aria-label={t('tabsLabel')} className="flex gap-2 flex-wrap">
        {TABS.map((slug) => (
          <Link
            key={slug}
            to={`/prepaid/${slug}`}
            role="tab"
            aria-selected={slug === active}
            className={cn(
              'h-[42px] px-[18px] rounded-full inline-flex items-center text-sm font-bold text-white',
              slug === active ? 'border-2 border-[#FF0000] bg-[rgba(255,0,0,0.16)]' : 'border border-white/[0.18] hover:bg-white/[0.05]'
            )}
          >
            {t(`tabs.${slug}`)}
          </Link>
        ))}
      </div>

      {active === 'vue' && <OverviewTab />}
      {active === 'demandes' && <RequestsTab />}
      {active === 'cartes' && <CardsTab />}
      {active === 'lots' && <BatchesTab />}
      {active === 'reclamations' && <ClaimsTab />}
      {active === 'regles' && <RulesTab />}
    </PageShell>
  );
}
