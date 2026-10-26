import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardTitle, PillButton, StatusBadge, DASH, PendingNote } from '@/components/community/CommunityUI';
import { prepaidService, PrepaidCard, CardLedger } from '@/services/prepaidService';
import { CARD_TONE } from './CardsTab';
import { Field, RowButton, inputClass, loadError, textareaClass, useFormat, useRun } from './shared';

type Correction =
  | { kind: 'reverse'; id: string; label: string }
  | { kind: 'credit'; id: string; label: string }
  | { kind: 'refund'; id: string; label: string };

export default function ClaimsTab() {
  const { t } = useTranslation('prepaid');
  const f = useFormat();
  const { run, busy } = useRun();
  const [params] = useSearchParams();
  const [q, setQ] = useState('');
  const [results, setResults] = useState<PrepaidCard[] | null>(null);
  const [searched, setSearched] = useState(false);
  const [cardId, setCardId] = useState<string | null>(params.get('card'));
  const [ledger, setLedger] = useState<CardLedger | null>(null);
  const [correction, setCorrection] = useState<Correction | null>(null);
  const [reason, setReason] = useState('');

  const loadLedger = (id: string) =>
    prepaidService
      .getLedger(id)
      .then((r) => setLedger(r.data))
      .catch((error) => loadError(error, t('errors.loadFailed')));

  useEffect(() => {
    setLedger(null);
    setCorrection(null);
    if (cardId) loadLedger(cardId);
  }, [cardId]);

  const search = async () => {
    setSearched(true);
    try {
      const r = await prepaidService.listCards({ q: q.trim() || undefined });
      setResults(r.data?.items ?? null);
    } catch (error) {
      loadError(error, t('errors.loadFailed'));
    }
  };

  const save = async () => {
    if (!correction || !reason.trim() || !cardId) return;
    const why = reason.trim();
    const action =
      correction.kind === 'reverse' ? () => prepaidService.reverse(correction.id, why)
        : correction.kind === 'credit' ? () => prepaidService.creditTopup(correction.id, why)
          : () => prepaidService.refundPayment(correction.id, why);
    if (await run(action, t('claims.saved'))) {
      setCorrection(null);
      setReason('');
      loadLedger(cardId);
    }
  };

  const sign = (d: 'credit' | 'debit') => (d === 'credit' ? '+ ' : '− ');

  return (
    <div className="flex flex-wrap gap-[18px] items-start">
      <div className="flex-[1.5_1_560px] min-w-0 flex flex-col gap-[18px]">
        <Card className="p-5 flex flex-col gap-3">
          <CardTitle>{t('claims.searchTitle')}</CardTitle>
          <form className="flex flex-wrap gap-2" onSubmit={(e) => { e.preventDefault(); search(); }}>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('claims.search')} className={`${inputClass} flex-1 min-w-[220px]`} />
            <PillButton type="submit" size="sm">{t('claims.searchButton')}</PillButton>
          </form>
          {searched && (
            <div className="rounded-2xl overflow-hidden border border-white/[0.07]">
              {results && results.length > 0 ? (
                results.map((c) => (
                  <RowButton key={c.id} selected={c.id === cardId} onClick={() => setCardId(c.id)}>
                    <span className="col-span-full flex justify-between gap-3 items-center">
                      <span className="font-mono text-white">{c.maskedNumber}</span>
                      <span className="truncate flex-1">{c.nameOnCard}</span>
                      <span className="tabular-nums">{f.fcfa(c.balance)}</span>
                      <StatusBadge tone={CARD_TONE[c.status]}>{t(`cardStatus.${c.status}`)}</StatusBadge>
                    </span>
                  </RowButton>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-[#C4C4C4]">{results ? t('claims.noResult') : t('notConnected')}</div>
              )}
            </div>
          )}
        </Card>

        <Card className="p-5 flex flex-col gap-3">
          <CardTitle>{t('claims.ledgerTitle')}</CardTitle>
          <div className="overflow-x-auto">
            <div className="min-w-[560px] text-[13px]">
              <div className="grid grid-cols-[0.9fr_1.5fr_0.9fr_1.3fr_0.9fr] gap-x-3 py-2 text-xs text-[#C4C4C4] border-b border-white/[0.07]">
                {(['when', 'operation', 'amount', 'reference', 'action'] as const).map((c) => <span key={c}>{t(`claims.columns.${c}`)}</span>)}
              </div>
              {ledger && ledger.items.length > 0 ? (
                ledger.items.map((e) => (
                  <div key={`${e.txnId}-${e.direction}`} className="grid grid-cols-[0.9fr_1.5fr_0.9fr_1.3fr_0.9fr] gap-x-3 items-center py-2.5 border-b border-white/[0.07]">
                    <span>{f.date(e.at)}</span>
                    <span className="text-white">{t(`claims.types.${e.type}`, e.type)}</span>
                    <span className="tabular-nums text-white">{sign(e.direction)}{f.fcfa(e.amount)}</span>
                    <span className="truncate text-[#C4C4C4]">{e.txnId}</span>
                    <span>
                      {e.type !== 'reversal' && (
                        <PillButton size="sm" variant="outline" onClick={() => setCorrection({ kind: 'reverse', id: e.txnId, label: `${t(`claims.types.${e.type}`, e.type)} · ${f.fcfa(e.amount)}` })}>
                          {t('claims.reverse')}
                        </PillButton>
                      )}
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-3 text-sm text-[#C4C4C4]">{ledger ? t('claims.empty') : cardId ? t('notConnected') : DASH}</div>
              )}
            </div>
          </div>

          {ledger && ledger.topups.some((x) => x.status === 'pending' || x.status === 'failed') && (
            <div className="flex flex-col gap-2">
              <span className="text-[13px] text-[#C4C4C4]">{t('claims.topupsTitle')}</span>
              {ledger.topups.filter((x) => x.method === 'mobile_money' && (x.status === 'pending' || x.status === 'failed')).map((x) => (
                <div key={x._id} className="flex flex-wrap justify-between gap-3 items-center text-sm px-3 py-2.5 rounded-xl bg-white/[0.04]">
                  <span>{x.reference} · {f.fcfa(x.amount)} · {t(`claims.topupStatus.${x.status}`)}</span>
                  <PillButton size="sm" variant="outline" onClick={() => setCorrection({ kind: 'credit', id: x._id, label: `${x.reference} · ${f.fcfa(x.amount)}` })}>
                    {t('claims.credit')}
                  </PillButton>
                </div>
              ))}
            </div>
          )}

          {ledger && ledger.payments.some((p) => p.status === 'succeeded') && (
            <div className="flex flex-col gap-2">
              <span className="text-[13px] text-[#C4C4C4]">{t('claims.paymentsTitle')}</span>
              {ledger.payments.filter((p) => p.status === 'succeeded').map((p) => (
                <div key={p._id} className="flex flex-wrap justify-between gap-3 items-center text-sm px-3 py-2.5 rounded-xl bg-white/[0.04]">
                  <span>{p.product.label ?? p.product.type} · {f.fcfa(p.amount)} · {f.date(p.createdAt)}</span>
                  <PillButton size="sm" variant="outline" onClick={() => setCorrection({ kind: 'refund', id: p._id, label: `${p.product.label ?? p.product.type} · ${f.fcfa(p.amount)}` })}>
                    {t('claims.refund')}
                  </PillButton>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card className="flex-[1_1_320px] min-w-0 p-5 flex flex-col gap-3.5">
        <CardTitle>{t('claims.correctionTitle')}</CardTitle>
        <div className="text-sm text-white px-3 py-2.5 rounded-xl bg-white/[0.04]">{correction?.label ?? DASH}</div>
        <Field label={t('claims.reasonLabel')}>
          <textarea value={reason} onChange={(e) => setReason(e.target.value)} disabled={!correction} className={textareaClass} />
        </Field>
        <PendingNote>{t('claims.correctionNote')}</PendingNote>
        <PillButton disabled={!correction || !reason.trim() || busy} onClick={save}>{t('claims.save')}</PillButton>
      </Card>
    </div>
  );
}
