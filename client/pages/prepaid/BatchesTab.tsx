import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardTitle, PillButton, StatusBadge, BadgeTone, DASH, PendingNote } from '@/components/community/CommunityUI';
import { prepaidService, ScratchBatch, BatchStatus } from '@/services/prepaidService';
import { adminAgentService, PaymentAgentListItem } from '@/services/adminAgentService';
import { Field, inputClass, loadError, toAmount, useFormat, useRun } from './shared';

const STEPS: BatchStatus[] = ['created', 'delivered', 'activated', 'cancelled'];
const TONE: Record<BatchStatus, BadgeTone> = { created: 'neutral', delivered: 'orange', activated: 'neutral', cancelled: 'red' };
const COLS = 'grid-cols-[1.2fr_0.9fr_0.7fr_1.1fr_0.8fr_0.8fr_1.4fr]';

function agentName(b: ScratchBatch) {
  if (!b.agent || typeof b.agent === 'string') return DASH;
  return [b.agent.firstName, b.agent.lastName].filter(Boolean).join(' ') || DASH;
}

/** The printer file is the only place where the codes exist in clear: saved once, never shown again. */
function download(csv: string, reference: string) {
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `${reference}-imprimeur.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function BatchesTab() {
  const { t } = useTranslation('prepaid');
  const f = useFormat();
  const { run, busy } = useRun();
  const [items, setItems] = useState<ScratchBatch[] | null>(null);
  const [agents, setAgents] = useState<PaymentAgentListItem[]>([]);
  const [value, setValue] = useState('');
  const [quantity, setQuantity] = useState('');
  const [agentId, setAgentId] = useState('');
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  const loadList = () =>
    prepaidService
      .listBatches()
      .then((r) => setItems(r.data?.items ?? null))
      .catch((error) => loadError(error, t('errors.loadFailed')));

  useEffect(() => {
    loadList();
    adminAgentService
      .listPaymentAgents({ limit: 100 })
      .then((r) => setAgents(r.agents.filter((a) => a.isActive)))
      .catch(() => setAgents([]));
  }, []);

  const v = toAmount(value);
  const n = toAmount(quantity);
  const total = v && n ? v * n : null;

  const create = async () => {
    if (!v || !n || !agentId) return;
    let csv: string | null = null;
    let reference = 'lot';
    const ok = await run(async () => {
      const res = await prepaidService.createBatch(v, n, agentId);
      csv = res.csv;
      reference = res.batch.reference;
    }, t('batches.created'));
    if (ok && csv) {
      download(csv, reference);
      setValue('');
      setQuantity('');
      setAgentId('');
      loadList();
    }
  };

  const act = async (id: string, action: 'deliver' | 'activate' | 'cancel', reason?: string) => {
    const ok = await run(() => prepaidService.batchAction(id, action, reason), t('batches.done'));
    if (ok) {
      setCancelId(null);
      setCancelReason('');
      loadList();
    }
  };

  const nextAction = (b: ScratchBatch) => {
    if (b.status === 'created') return <PillButton size="sm" disabled={busy} onClick={() => act(b._id, 'deliver')}>{t('batches.deliver')}</PillButton>;
    if (b.status === 'delivered') return <PillButton size="sm" disabled={busy} onClick={() => act(b._id, 'activate')}>{t('batches.activate')}</PillButton>;
    if (b.status === 'activated') return <PillButton size="sm" variant="outline" disabled={busy} onClick={() => setCancelId(b._id)}>{t('batches.cancel')}</PillButton>;
    return null;
  };

  return (
    <>
      <div className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
        {STEPS.map((s) => (
          <div key={s} className="p-4 rounded-3xl bg-[rgba(28,24,23,0.9)] border border-white/[0.08] flex flex-col gap-1">
            <b className="text-white">{t(`batches.steps.${s}.title`)}</b>
            <span className="text-[13px] text-[#C4C4C4]">{t(`batches.steps.${s}.text`)}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-[18px] items-start">
        <Card label={t('batches.listLabel')} className="flex-[1.6_1_560px] min-w-0 p-5 flex flex-col gap-3">
          <CardTitle>{t('batches.listLabel')}</CardTitle>
          <div className="overflow-x-auto">
            <div className="min-w-[640px] text-[13px]">
              <div className={`grid ${COLS} gap-x-3 py-2 text-xs text-[#C4C4C4] border-b border-white/[0.07]`}>
                {(['batch', 'value', 'cards', 'agent', 'used', 'status', 'action'] as const).map((c) => (
                  <span key={c}>{t(`batches.columns.${c}`)}</span>
                ))}
              </div>
              {items && items.length > 0 ? (
                items.map((b) => (
                  <div key={b._id} className="border-b border-white/[0.07] py-2.5">
                    <div className={`grid ${COLS} gap-x-3 items-center`}>
                      <b className="text-white">{b.reference}</b>
                      <span className="tabular-nums">{f.fcfa(b.value)}</span>
                      <span className="tabular-nums">{f.count(b.quantity)}</span>
                      <span className="truncate">{agentName(b)}</span>
                      <span className="tabular-nums">{f.count(b.usedCount)} / {f.count(b.quantity)}</span>
                      <span><StatusBadge tone={TONE[b.status]}>{t(`batches.status.${b.status}`)}</StatusBadge></span>
                      <span>{nextAction(b)}</span>
                    </div>
                    {cancelId === b._id && (
                      <div className="flex flex-wrap gap-2 mt-2.5">
                        <input
                          value={cancelReason}
                          onChange={(e) => setCancelReason(e.target.value)}
                          placeholder={t('batches.cancelReason')}
                          className={`${inputClass} flex-1 min-w-[220px]`}
                        />
                        <PillButton size="sm" variant="outline" disabled={!cancelReason.trim() || busy} onClick={() => act(b._id, 'cancel', cancelReason.trim())}>
                          {t('batches.cancel')}
                        </PillButton>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="py-3 text-sm text-[#C4C4C4]">{items ? t('batches.empty') : t('notConnected')}</div>
              )}
            </div>
          </div>
        </Card>

        <Card className="flex-[1_1_320px] min-w-0 p-5 flex flex-col gap-3.5">
          <CardTitle>{t('batches.createTitle')}</CardTitle>
          <Field label={t('batches.value')}>
            <input inputMode="numeric" value={value} onChange={(e) => setValue(e.target.value)} className={inputClass} />
          </Field>
          <Field label={t('batches.quantity')}>
            <input inputMode="numeric" value={quantity} onChange={(e) => setQuantity(e.target.value)} className={inputClass} />
          </Field>
          <Field label={t('batches.agent')}>
            <select value={agentId} onChange={(e) => setAgentId(e.target.value)} className={inputClass}>
              <option value="">{agents.length ? t('batches.chooseAgent') : t('batches.noAgents')}</option>
              {agents.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </Field>
          <span className="text-sm text-white">{t('batches.total', { total: f.fcfa(total) })}</span>
          <PendingNote>{t('batches.createNote')}</PendingNote>
          <PillButton disabled={!v || !n || !agentId || busy} onClick={create}>{t('batches.create')}</PillButton>
        </Card>
      </div>
    </>
  );
}
