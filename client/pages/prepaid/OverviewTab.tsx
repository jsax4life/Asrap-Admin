import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardTitle, KpiCard, StatusBadge, BadgeTone, DASH, PendingNote } from '@/components/community/CommunityUI';
import { prepaidService, PrepaidOverview, PrepaidAlert, AlertType } from '@/services/prepaidService';
import { Banner, CheckRow, loadError, useFormat } from './shared';

const PLANNED_ALERTS: [AlertType, PrepaidAlert['severity']][] = [
  ['reconciliation_provider_gap', 'high'],
  ['duplicate_phone_requests', 'medium'],
  ['code_bruteforce', 'medium'],
  ['pin_locked', 'info'],
];

const SEVERITY_TONE: Record<PrepaidAlert['severity'], BadgeTone> = { high: 'red', medium: 'orange', info: 'neutral' };

export default function OverviewTab() {
  const { t } = useTranslation('prepaid');
  const f = useFormat();
  const [overview, setOverview] = useState<PrepaidOverview | null>(null);
  const [alerts, setAlerts] = useState<PrepaidAlert[] | null>(null);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    Promise.all([prepaidService.getOverview(), prepaidService.getAlerts()])
      .then(([o, a]) => {
        setOverview(o.data?.overview ?? null);
        setAlerts(a.data?.items ?? null);
        setUnavailable(o.unavailable);
      })
      .catch((error) => loadError(error, t('errors.loadFailed')));
  }, []);

  const rec = overview?.lastReconciliation ?? null;
  const gap = rec && rec.providerTotal != null ? rec.providerTotal - rec.ledgerTotal : null;

  return (
    <>
      {unavailable && <Banner>{t('notConnectedBanner')}</Banner>}

      <section aria-label={t('tabs.vue')} className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
        <KpiCard highlight label={t('overview.openRequests')} value={f.count(overview?.openRequests)} caption={t('overview.openRequestsCaption')} />
        <KpiCard
          label={t('overview.activeCards')}
          value={overview ? f.count(overview.activeCards.listeners + overview.activeCards.artists) : DASH}
          caption={t('overview.activeCardsCaption', {
            listeners: f.count(overview?.activeCards.listeners),
            artists: f.count(overview?.activeCards.artists),
          })}
        />
        <KpiCard
          label={t('overview.circulation')}
          value={f.count(overview?.moneyInCirculation)}
          unit={<span className="text-[15px] text-[#C4C4C4]">FCFA</span>}
          caption={t('overview.circulationCaption')}
        />
        <KpiCard
          label={t('overview.topups')}
          value={f.count(overview?.topupsToday.count)}
          caption={t('overview.topupsCaption', { amount: f.fcfa(overview?.topupsToday.amount) })}
        />
        <KpiCard
          label={t('overview.spent')}
          value={f.count(overview?.spentThisMonth)}
          unit={<span className="text-[15px] text-[#C4C4C4]">FCFA</span>}
          caption={t('overview.spentCaption')}
        />
      </section>

      <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(min(380px,100%),1fr))] items-start">
        <Card className="p-5 flex flex-col gap-3.5">
          <div className="flex justify-between items-baseline gap-3 flex-wrap">
            <CardTitle>{t('overview.reconciliationTitle')}</CardTitle>
            <span className="text-xs text-[#C4C4C4]">{t('overview.reconciliationWhen', { date: f.date(rec?.at) })}</span>
          </div>
          <div className="grid gap-2.5 grid-cols-3">
            {([
              ['fromOperator', f.fcfa(rec?.providerTotal)],
              ['toLedger', f.fcfa(rec?.ledgerTotal)],
              ['gap', gap == null ? DASH : f.fcfa(gap)],
            ] as const).map(([k, v]) => (
              <div key={k} className="p-3 rounded-2xl bg-white/[0.04] flex flex-col gap-1">
                <span className="text-xs text-[#C4C4C4]">{t(`overview.${k}`)}</span>
                <b className="text-lg text-white tabular-nums">{v}</b>
              </div>
            ))}
          </div>
          <CheckRow
            label={t('overview.balanceCheck')}
            value={rec ? t('overview.balanceMismatches', { n: rec.balanceMismatches.length }) : DASH}
          />
          <PendingNote>{t('overview.reconciliationNote')}</PendingNote>
        </Card>

        <Card className="p-5 flex flex-col gap-3.5">
          <div className="flex justify-between items-center gap-3">
            <CardTitle>{t('overview.alertsTitle')}</CardTitle>
            <StatusBadge tone="neutral">{f.count(overview?.openAlerts)}</StatusBadge>
          </div>
          <div className="flex flex-col gap-2">
            {alerts && alerts.length > 0
              ? alerts.map((a) => (
                  <div key={a._id} className="flex justify-between gap-3 text-sm px-3 py-2.5 rounded-xl bg-white/[0.04]">
                    <span>{t(`overview.alertTypes.${a.type}`)} · {f.date(a.createdAt)}</span>
                    <StatusBadge tone={SEVERITY_TONE[a.severity]}>{t(`overview.severity.${a.severity}`)}</StatusBadge>
                  </div>
                ))
              : alerts
                ? <span className="text-sm text-[#C4C4C4]">{t('overview.alertsEmpty')}</span>
                : PLANNED_ALERTS.map(([type, severity]) => (
                    <div key={type} className="flex justify-between gap-3 text-sm px-3 py-2.5 rounded-xl bg-white/[0.04]">
                      <span>{t(`overview.alertTypes.${type}`)}</span>
                      <StatusBadge tone={SEVERITY_TONE[severity]}>{t(`overview.severity.${severity}`)}</StatusBadge>
                    </div>
                  ))}
          </div>
          {!alerts && <PendingNote>{t('overview.plannedAlerts')}</PendingNote>}
        </Card>
      </div>
    </>
  );
}
