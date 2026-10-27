import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardTitle, KpiCard, PillButton, StatusBadge, BadgeTone } from '@/components/community/CommunityUI';
import { shopService, ShopOverview, PayoutBatch, BatchStatus } from '@/services/shopService';
import { Banner, EmptyState, loadError, useFormat, useRun } from './shared';

const TONE: Record<BatchStatus, BadgeTone> = { draft: 'orange', approved: 'orange', sent: 'neutral', cancelled: 'red' };

export default function PayoutsTab() {
  const { t } = useTranslation('shop');
  const f = useFormat();
  const { run, busy } = useRun();
  const [overview, setOverview] = useState<ShopOverview | null>(null);
  const [batches, setBatches] = useState<PayoutBatch[] | null>(null);
  const [unavailable, setUnavailable] = useState(false);

  const load = () =>
    Promise.all([shopService.getOverview(), shopService.listBatches()])
      .then(([o, b]) => {
        setOverview(o.data);
        setBatches(b.data?.batches ?? null);
        setUnavailable(o.unavailable || b.unavailable);
      })
      .catch((error) => loadError(error, t('errors.loadFailed')));

  useEffect(() => {
    load();
  }, []);

  const act = async (id: string, action: 'approve' | 'send' | 'cancel') => {
    if (await run(() => shopService.batchAction(id, action), t('payouts.done'))) load();
  };

  const fcfaUnit = <span className="text-[15px] text-[#C4C4C4]">FCFA</span>;

  return (
    <>
      {unavailable && <Banner>{t('notConnectedBanner')}</Banner>}
      <section aria-label={t('tabs.versements')} className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
        <KpiCard highlight label={t('payouts.reserved')} value={f.count(overview?.artistReservedFcfa)} unit={fcfaUnit} caption={t('payouts.reservedCaption')} />
        <KpiCard label={t('payouts.available')} value={f.count(overview?.artistAvailableFcfa)} unit={fcfaUnit} caption={t('payouts.availableCaption')} />
        <KpiCard label={t('payouts.paid')} value={f.count(overview?.artistPaidFcfa)} unit={fcfaUnit} caption={t('payouts.paidCaption')} />
      </section>

      <Card className="p-5 flex flex-col gap-3.5">
        <div className="flex justify-between items-center gap-3 flex-wrap">
          <CardTitle>{t('payouts.batchesTitle')}</CardTitle>
          <PillButton size="sm" disabled={busy || unavailable} onClick={async () => { if (await run(() => shopService.prepareBatch(), t('payouts.prepared'))) load(); }}>
            {t('payouts.prepare')}
          </PillButton>
        </div>
        {batches && batches.length > 0 ? (
          batches.map((b) => (
            <div key={b._id} className="flex flex-wrap items-center gap-3 px-3 py-3 rounded-xl bg-white/[0.04] text-sm">
              <b className="text-white font-mono text-xs">{b.reference}</b>
              <span className="text-[#C4C4C4]">{t('payouts.artists', { n: b.lines.length })}</span>
              <b className="text-white tabular-nums">{f.fcfa(b.totalFcfa)}</b>
              <StatusBadge tone={TONE[b.status]}>{t(`payouts.status.${b.status}`)}</StatusBadge>
              <span className="flex-1" />
              {b.status === 'draft' && <PillButton size="sm" disabled={busy} onClick={() => act(b._id, 'approve')}>{t('payouts.actions.approve')}</PillButton>}
              {b.status === 'approved' && <PillButton size="sm" disabled={busy} onClick={() => act(b._id, 'send')}>{t('payouts.actions.send')}</PillButton>}
              {(b.status === 'draft' || b.status === 'approved') && (
                <PillButton size="sm" variant="outline" disabled={busy} onClick={() => act(b._id, 'cancel')}>{t('payouts.actions.cancel')}</PillButton>
              )}
            </div>
          ))
        ) : (
          <EmptyState title={t('payouts.empty')}>{t('payouts.emptyText')}</EmptyState>
        )}
      </Card>
    </>
  );
}
