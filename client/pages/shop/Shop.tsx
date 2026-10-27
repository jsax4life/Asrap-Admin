import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { PageShell, PageHeader } from '@/components/community/CommunityUI';
import OverviewTab from './OverviewTab';
import CatalogueTab from './CatalogueTab';
import ArtistProductsTab from './ArtistProductsTab';
import OrdersTab from './OrdersTab';
import PayoutsTab from './PayoutsTab';
import OutletsTab from './OutletsTab';
import RulesTab from './RulesTab';

// Admin › Boutique : la Boutique AsraPa (catalogue, produits d'artistes, commandes, versements, points de vente).
// Front only for now: the /admin/shop/* routes are not deployed, every block shows « — ».

type TabSlug = 'vue' | 'catalogue' | 'artistes' | 'commandes' | 'versements' | 'points' | 'regles';
const TABS: TabSlug[] = ['vue', 'catalogue', 'artistes', 'commandes', 'versements', 'points', 'regles'];

export default function Shop() {
  const { t } = useTranslation('shop');
  const { tab } = useParams<{ tab?: string }>();
  const active: TabSlug = TABS.includes(tab as TabSlug) ? (tab as TabSlug) : 'vue';

  return (
    <PageShell>
      <PageHeader eyebrow={t('eyebrow')} title={t(`titles.${active}`)} aside={t(`asides.${active}`)} />

      <div role="tablist" aria-label={t('tabsLabel')} className="flex gap-2 flex-wrap">
        {TABS.map((slug) => (
          <Link
            key={slug}
            to={`/shop/${slug}`}
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
      {active === 'catalogue' && <CatalogueTab />}
      {active === 'artistes' && <ArtistProductsTab />}
      {active === 'commandes' && <OrdersTab />}
      {active === 'versements' && <PayoutsTab />}
      {active === 'points' && <OutletsTab />}
      {active === 'regles' && <RulesTab />}
    </PageShell>
  );
}
