import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Card, CardTitle, StatusBadge } from '@/components/community/CommunityUI';
import { EmptyState, Level, useFormat } from './shared';
import { TIERS } from './reference';

// The four reseller tiers come from the tier document of 26/10/2026; no outlet is open yet.
export default function OutletsTab() {
  const { t } = useTranslation('shop');
  const f = useFormat();

  return (
    <>
      <section aria-label={t('tabs.points')} className="grid gap-3.5 grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
        {TIERS.map((tier) => (
          <article
            key={tier.key}
            className={cn(
              'p-5 rounded-3xl border flex flex-col gap-3',
              tier.key === 'signature' ? 'bg-[linear-gradient(165deg,#2a0808,#0d0d0d_60%)] border-[#4a1414]' : 'bg-[rgba(28,24,23,0.9)] border-white/[0.08]'
            )}
          >
            <Level level={tier.level} />
            <h3 className="m-0 text-xl font-black text-white">{tier.name}</h3>
            <dl className="m-0 grid gap-2 text-[13px]">
              {([
                ['deposit', tier.deposit != null ? f.fcfa(tier.deposit) : t('outlets.standby')],
                ['entry', t(`outlets.tiers.${tier.key}.entry`)],
                ['share', t(`outlets.tiers.${tier.key}.share`)],
                ['furniture', t(`outlets.tiers.${tier.key}.furniture`)],
              ] as const).map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[11px] tracking-[0.08em] uppercase text-[#8F8F8F]">{t(`outlets.${k}`)}</dt>
                  <dd className="m-0 text-[#E0E0E0] font-medium">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-auto pt-3 border-t border-white/[0.08] flex items-baseline gap-1.5">
              {tier.planned != null ? (
                <>
                  <b className="text-[28px] font-black text-white">0</b>
                  <span className="text-xs text-[#8F8F8F]">/ {tier.planned} {t('outlets.planned')}</span>
                </>
              ) : (
                <StatusBadge tone="red">{t('outlets.building')}</StatusBadge>
              )}
            </div>
          </article>
        ))}
      </section>

      <Card className="p-5 flex flex-col gap-3.5">
        <CardTitle>{t('outlets.listTitle')}</CardTitle>
        <EmptyState title={t('outlets.listEmpty')}>{t('outlets.listText')}</EmptyState>
      </Card>
    </>
  );
}
