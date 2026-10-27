import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardTitle, PillButton, PendingNote } from '@/components/community/CommunityUI';
import { shopService, ShopProduct, ProductStatus } from '@/services/shopService';
import { Banner, EmptyState, Pill, inputClass, textareaClass, loadError, useFormat, useRun } from './shared';

const FILTERS: ProductStatus[] = ['in_review', 'awaiting_stock', 'live', 'rejected'];
const CHECKS = ['photos', 'rights', 'price', 'stock'] as const;

export default function ArtistProductsTab() {
  const { t } = useTranslation('shop');
  const f = useFormat();
  const { run, busy } = useRun();
  const [status, setStatus] = useState<ProductStatus>('in_review');
  const [products, setProducts] = useState<ShopProduct[] | null>(null);
  const [unavailable, setUnavailable] = useState(false);
  const [selected, setSelected] = useState<ShopProduct | null>(null);
  const [reason, setReason] = useState('');
  const [counts, setCounts] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const allChecked = CHECKS.every((c) => checked.has(c));

  const load = () =>
    shopService
      .listProducts({ kind: 'artist', status })
      .then((r) => {
        setProducts(r.data?.products ?? null);
        setUnavailable(r.unavailable);
        setSelected(null);
      })
      .catch((error) => loadError(error, t('errors.loadFailed')));

  useEffect(() => {
    load();
  }, [status]);

  const decide = async (decision: 'approve' | 'reject') => {
    if (!selected) return;
    if (decision === 'reject' && reason.trim().length < 5) return void loadError(null, t('errors.reasonRequired'));
    const ok = await run(() => shopService.review(selected._id, decision, reason.trim() || undefined), t(decision === 'approve' ? 'artists.approved' : 'artists.rejected'));
    if (ok) {
      setReason('');
      load();
    }
  };

  const receive = async () => {
    if (!selected) return;
    const clean = Object.fromEntries(Object.entries(counts).map(([k, v]) => [k, Number(v) || 0]));
    if (await run(() => shopService.receiveStock(selected._id, clean), t('artists.received'))) load();
  };

  return (
    <>
      {unavailable && <Banner>{t('notConnectedBanner')}</Banner>}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((key) => (
          <Pill key={key} active={status === key} onClick={() => setStatus(key)}>
            {t(`artists.filters.${key}`)}
          </Pill>
        ))}
      </div>

      <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(min(380px,100%),1fr))] items-start">
        <Card className="p-5 flex flex-col gap-2">
          {products && products.length > 0 ? (
            products.map((p) => (
              <button
                key={p._id}
                type="button"
                onClick={() => {
                  setSelected(p);
                  setCounts({});
                  setChecked(new Set());
                }}
                className={`text-left flex justify-between gap-3 px-3 py-3 rounded-xl text-sm ${selected?._id === p._id ? 'bg-[rgba(255,0,0,0.12)]' : 'bg-white/[0.04] hover:bg-white/[0.07]'}`}
              >
                <span className="flex flex-col">
                  <b className="text-white">{p.name}</b>
                  <span className="text-xs text-[#C4C4C4]">{p.variants.map((v) => `${v.label} : ${v.declared}`).join(' · ')}</span>
                </span>
                <b className="text-white tabular-nums">{f.fcfa(p.priceFcfa)}</b>
              </button>
            ))
          ) : (
            <EmptyState title={t('artists.empty')}>{t('artists.emptyText')}</EmptyState>
          )}
        </Card>

        <Card className="p-5 flex flex-col gap-3">
          <CardTitle>{t('artists.checklistTitle')}</CardTitle>
          {CHECKS.map((key) => (
            <label key={key} className="flex gap-2.5 items-start p-3 rounded-xl bg-white/[0.04] text-[13px] text-[#C4C4C4]">
              <input
                type="checkbox"
                disabled={!selected}
                checked={checked.has(key)}
                onChange={(e) => {
                  const next = new Set(checked);
                  if (e.target.checked) next.add(key); else next.delete(key);
                  setChecked(next);
                }}
                className="mt-0.5 accent-[#FF0000]"
              />
              <span>
                <b className="block text-white">{t(`artists.checks.${key}`)}</b>
                {t(`artists.checks.${key}Text`)}
              </span>
            </label>
          ))}

          {selected?.status === 'in_review' && (
            <>
              <textarea className={textareaClass} placeholder={t('artists.reason')} value={reason} onChange={(e) => setReason(e.target.value)} maxLength={300} />
              <div className="flex gap-2 flex-wrap">
                <PillButton disabled={busy || !allChecked} onClick={() => decide('approve')}>{t('artists.approve')}</PillButton>
                <PillButton variant="outline" disabled={busy} onClick={() => decide('reject')}>{t('artists.reject')}</PillButton>
              </div>
            </>
          )}

          {selected?.status === 'awaiting_stock' && (
            <>
              {selected.variants.map((v) => (
                <label key={v._id} className="flex items-center justify-between gap-3 text-sm">
                  <span>{v.label} <span className="text-[#C4C4C4]">({t('artists.declared')} {v.declared})</span></span>
                  <input
                    className={`${inputClass} w-24 text-center`}
                    inputMode="numeric"
                    value={counts[v._id] ?? ''}
                    onChange={(e) => setCounts({ ...counts, [v._id]: e.target.value.replace(/\D/g, '') })}
                  />
                </label>
              ))}
              <PillButton disabled={busy} onClick={receive}>{t('artists.receive')}</PillButton>
            </>
          )}

          {!selected && (
            <div className="flex gap-2 flex-wrap">
              <PillButton disabled>{t('artists.approve')}</PillButton>
              <PillButton variant="outline" disabled>{t('artists.reject')}</PillButton>
            </div>
          )}
          <PendingNote>{t('artists.note')}</PendingNote>
        </Card>
      </div>
    </>
  );
}
