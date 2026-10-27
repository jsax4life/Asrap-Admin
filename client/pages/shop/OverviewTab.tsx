import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardTitle, KpiCard, StatusBadge, BadgeTone, PendingNote } from '@/components/community/CommunityUI';
import { shopService, ShopOverview } from '@/services/shopService';
import { Banner, loadError, useFormat } from './shared';
import { ORDER_REFERENCES, ORDER_SPLIT, ORDER_TOTAL } from './reference';

const TODO: [string, BadgeTone, string][] = [
  ['receive', 'orange', 'todo'],
  ['prices', 'red', 'gap'],
  ['rules', 'neutral', 'proposal'],
  ['delivery', 'neutral', 'decide'],
];

export default function OverviewTab() {
  const { t } = useTranslation('shop');
  const f = useFormat();
  const [overview, setOverview] = useState<ShopOverview | null>(null);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    shopService
      .getOverview()
      .then((o) => {
        setOverview(o.data);
        setUnavailable(o.unavailable);
      })
      .catch((error) => loadError(error, t('errors.loadFailed')));
  }, []);

  return (
    <>
      {unavailable && <Banner>{t('notConnectedBanner')}</Banner>}

      <section aria-label={t('tabs.vue')} className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
        <KpiCard highlight label={t('overview.ordered')} value={f.count(ORDER_TOTAL)} caption={t('overview.orderedCaption', { refs: ORDER_REFERENCES })} />
        <KpiCard label={t('overview.ordersToProcess')} value={f.count(overview?.ordersToProcess)} caption={t('overview.ordersToProcessCaption')} />
        <KpiCard label={t('overview.toReview')} value={f.count(overview?.productsToReview)} caption={t('overview.toReviewCaption')} />
        <KpiCard
          label={t('overview.reserved')}
          value={f.count(overview?.artistReservedFcfa)}
          unit={<span className="text-[15px] text-[#C4C4C4]">FCFA</span>}
          caption={t('overview.reservedCaption')}
        />
      </section>

      <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(min(380px,100%),1fr))] items-start">
        <Card className="p-5 flex flex-col gap-3">
          <CardTitle>{t('overview.todoTitle')}</CardTitle>
          {TODO.map(([key, tone, badge]) => (
            <div key={key} className="flex items-center gap-3 py-2.5 border-b border-white/[0.07] last:border-0">
              <div className="flex-1 flex flex-col gap-0.5">
                <b className="text-sm text-white">{t(`overview.todo.${key}`)}</b>
                <span className="text-xs text-[#C4C4C4]">{t(`overview.todo.${key}Text`)}</span>
              </div>
              <StatusBadge tone={tone}>{t(`overview.badges.${badge}`)}</StatusBadge>
            </div>
          ))}
        </Card>

        <Card className="p-5 flex flex-col gap-3">
          <CardTitle>{t('overview.splitTitle')}</CardTitle>
          {(Object.keys(ORDER_SPLIT) as (keyof typeof ORDER_SPLIT)[]).map((key) => (
            <div key={key} className="flex justify-between gap-3 text-sm px-3 py-2.5 rounded-xl bg-white/[0.04]">
              <span>{t(`overview.split.${key}`)}</span>
              <b className="text-white tabular-nums">{f.count(ORDER_SPLIT[key])}</b>
            </div>
          ))}
          <PendingNote>{t('overview.splitSource')}</PendingNote>
        </Card>
      </div>
    </>
  );
}
