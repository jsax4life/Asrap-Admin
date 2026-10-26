import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardTitle, PillButton, StatusBadge, BadgeTone, DASH, PendingNote } from '@/components/community/CommunityUI';
import { prepaidService, PrepaidCard, CardDetail, CardStatus, OwnerType } from '@/services/prepaidService';
import { DefList, Field, Pill, RowButton, inputClass, loadError, textareaClass, useFormat, useRun } from './shared';

type Filter = 'all' | CardStatus | OwnerType;
const FILTERS: Filter[] = ['all', 'active', 'blocked', 'User', 'Artist'];
export const CARD_TONE: Record<CardStatus, BadgeTone> = { active: 'neutral', blocked: 'red', closed: 'neutral' };
const COLS = 'grid-cols-[1.4fr_1.3fr_0.8fr_0.9fr_0.9fr_0.8fr]';

function toQuery(filter: Filter, q: string) {
  return {
    status: filter === 'active' || filter === 'blocked' ? filter : undefined,
    ownerType: filter === 'User' || filter === 'Artist' ? filter : undefined,
    q: q.trim() || undefined,
  };
}

export default function CardsTab() {
  const { t } = useTranslation('prepaid');
  const f = useFormat();
  const { run, busy } = useRun();
  const [filter, setFilter] = useState<Filter>('all');
  const [q, setQ] = useState('');
  const [items, setItems] = useState<PrepaidCard[] | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<CardDetail | null>(null);
  const [reason, setReason] = useState('');

  const loadList = () =>
    prepaidService
      .listCards(toQuery(filter, q))
      .then((r) => setItems(r.data?.items ?? null))
      .catch((error) => loadError(error, t('errors.loadFailed')));

  const loadDetail = (id: string) =>
    prepaidService
      .getCard(id)
      .then((r) => setDetail(r.data))
      .catch((error) => loadError(error, t('errors.loadFailed')));

  useEffect(() => {
    loadList();
  }, [filter]);

  useEffect(() => {
    setDetail(null);
    setReason('');
    if (selectedId) loadDetail(selectedId);
  }, [selectedId]);

  const card = detail?.card ?? null;
  const blocked = card?.status === 'blocked';

  const refresh = async (ok: boolean) => {
    if (!ok || !card) return;
    setReason('');
    await Promise.all([loadDetail(card.id), loadList()]);
  };

  const toggleBlock = async () => {
    if (!card) return;
    if (!reason.trim()) {
      loadError(new Error(t('errors.reasonRequired')), '');
      return;
    }
    refresh(await run(
      () => (blocked ? prepaidService.unblock(card.id, reason.trim()) : prepaidService.block(card.id, reason.trim())),
      blocked ? t('cards.unblocked') : t('cards.blocked')
    ));
  };

  const pinLabel = () => {
    if (!card) return DASH;
    if (card.pinLockedUntil && new Date(card.pinLockedUntil) > new Date()) return t('cards.pinLocked', { date: f.date(card.pinLockedUntil) });
    return card.pinSet ? t('cards.pinSet') : t('cards.pinNotSet');
  };

  return (
    <div className="flex flex-wrap gap-[18px] items-start">
      <Card label={t('cards.listLabel')} className="flex-[1.35_1_520px] min-w-0 overflow-hidden">
        <div className="p-4 flex flex-wrap gap-2 justify-between items-center border-b border-white/[0.07]">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((x) => (
              <Pill key={x} active={x === filter} onClick={() => { setFilter(x); setSelectedId(null); }}>
                {t(`cards.filters.${x}`)}
              </Pill>
            ))}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); loadList(); }}>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('cards.search')} className={`${inputClass} w-[240px]`} />
          </form>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[620px]">
            <div className={`grid ${COLS} gap-x-3 px-4 py-2.5 text-xs text-[#C4C4C4] border-b border-white/[0.07]`}>
              {(['number', 'holder', 'type', 'balance', 'issued', 'state'] as const).map((c) => (
                <span key={c}>{t(`cards.columns.${c}`)}</span>
              ))}
            </div>
            {items && items.length > 0 ? (
              items.map((c) => (
                <RowButton key={c.id} selected={c.id === selectedId} onClick={() => setSelectedId(c.id)}>
                  <span className={`grid ${COLS} gap-x-3 items-center col-span-full`}>
                    <span className="font-mono text-white">{c.maskedNumber}</span>
                    <span className="truncate">{c.nameOnCard}</span>
                    <span><StatusBadge tone={c.type === 'artist' ? 'red' : 'neutral'}>{t(`owner.${c.type === 'artist' ? 'Artist' : 'User'}`)}</StatusBadge></span>
                    <span className="tabular-nums">{f.fcfa(c.balance)}</span>
                    <span>{f.date(c.issuedAt)}</span>
                    <span><StatusBadge tone={CARD_TONE[c.status]}>{t(`cardStatus.${c.status}`)}</StatusBadge></span>
                  </span>
                </RowButton>
              ))
            ) : (
              <div className="px-4 py-3.5 text-sm text-[#C4C4C4]">{items ? t('cards.empty') : t('notConnected')}</div>
            )}
          </div>
        </div>
      </Card>

      <Card className="flex-[1_1_340px] min-w-0 p-5 flex flex-col gap-3.5">
        <div className="flex justify-between items-center gap-3">
          <CardTitle>{card ? card.maskedNumber : t('cards.nothingSelected')}</CardTitle>
          {card && <StatusBadge tone={CARD_TONE[card.status]}>{t(`cardStatus.${card.status}`)}</StatusBadge>}
        </div>
        <DefList
          rows={[
            [t('cards.holder'), card?.nameOnCard ?? DASH],
            [t('cards.balance'), f.fcfa(detail?.balance)],
            [t('cards.ledgerCheck'), f.fcfa(detail?.balanceFromLedger)],
            [t('cards.request'), detail?.request ? `${detail.request.reference} · ${f.date(detail.request.decidedAt)}` : DASH],
            [t('cards.pin'), pinLabel()],
          ]}
        />
        <div className="flex flex-wrap gap-2">
          <Link
            to={card ? `/prepaid/reclamations?card=${encodeURIComponent(card.id)}` : '/prepaid/reclamations'}
            className="h-[38px] px-3.5 rounded-full border border-white/[0.22] text-[13px] font-bold text-white inline-flex items-center hover:bg-white/[0.06]"
          >
            {t('cards.seeLedger')}
          </Link>
          <PillButton size="sm" variant="outline" disabled={!card || busy} onClick={() => card && run(() => prepaidService.resetPin(card.id), t('cards.pinReset')).then(refresh)}>
            {t('cards.resetPin')}
          </PillButton>
        </div>
        <Field label={t('cards.reasonLabel')}>
          <textarea value={reason} onChange={(e) => setReason(e.target.value)} disabled={!card} className={textareaClass} />
        </Field>
        <PillButton
          variant="outline"
          className={blocked ? '' : 'border-[rgba(255,59,48,0.6)] text-[#FF8A80]'}
          disabled={!card || busy}
          onClick={toggleBlock}
        >
          {blocked ? t('cards.unblock') : t('cards.block')}
        </PillButton>
        <PendingNote>{t('cards.blockNote')}</PendingNote>
      </Card>
    </div>
  );
}
