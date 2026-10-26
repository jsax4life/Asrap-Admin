import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardTitle, PillButton, StatusBadge, BadgeTone, DASH, PendingNote } from '@/components/community/CommunityUI';
import { prepaidService, CardRequest, RequestChecks, RequestStatus, RejectionReason } from '@/services/prepaidService';
import { CheckRow, DefList, Field, Pill, RowButton, inputClass, loadError, textareaClass, useFormat, useRun } from './shared';

const FILTERS: RequestStatus[] = ['submitted', 'under_review', 'approved', 'rejected'];
const REASONS: RejectionReason[] = ['phone_unreachable', 'duplicate_account', 'incomplete_information', 'other'];
export const REQUEST_TONE: Record<RequestStatus, BadgeTone> = {
  submitted: 'neutral', under_review: 'orange', approved: 'neutral', rejected: 'red', cancelled: 'neutral',
};
const COLS = 'grid-cols-[1fr_1.4fr_0.9fr_0.9fr_0.9fr]';

export default function RequestsTab() {
  const { t } = useTranslation('prepaid');
  const f = useFormat();
  const { run, busy } = useRun();
  const [status, setStatus] = useState<RequestStatus>('submitted');
  const [q, setQ] = useState('');
  const [items, setItems] = useState<CardRequest[] | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<{ request: CardRequest; checks: RequestChecks } | null>(null);
  const [note, setNote] = useState('');
  const [reason, setReason] = useState<RejectionReason | null>(null);
  const [reasonNote, setReasonNote] = useState('');

  const loadList = () =>
    prepaidService
      .listRequests({ status, q: q.trim() || undefined })
      .then((r) => setItems(r.data?.items ?? null))
      .catch((error) => loadError(error, t('errors.loadFailed')));

  useEffect(() => {
    loadList();
  }, [status]);

  useEffect(() => {
    setDetail(null);
    setNote('');
    setReason(null);
    setReasonNote('');
    if (!selectedId) return;
    prepaidService
      .getRequest(selectedId)
      .then((r) => setDetail(r.data))
      .catch((error) => loadError(error, t('errors.loadFailed')));
  }, [selectedId]);

  const request = detail?.request ?? null;
  const checks = detail?.checks ?? null;
  const open = request ? request.status === 'submitted' || request.status === 'under_review' : false;
  const yesNo = (v: boolean | null | undefined) => (v == null ? DASH : v ? t('requests.yes') : t('requests.no'));

  const after = async (ok: boolean) => {
    if (!ok) return;
    setSelectedId(null);
    await loadList();
  };

  const approve = async () => request && after(await run(() => prepaidService.approve(request._id, note || undefined), t('requests.approved')));
  const startReview = async () => {
    if (!request) return;
    const ok = await run(() => prepaidService.startReview(request._id), t('requests.reviewStarted'));
    if (ok) setDetail((d) => (d ? { ...d, request: { ...d.request, status: 'under_review' } } : d));
  };
  const reject = async () => {
    if (!request || !reason) return;
    if (reason === 'other' && !reasonNote.trim()) {
      loadError(new Error(t('errors.reasonRequired')), '');
      return;
    }
    after(await run(() => prepaidService.reject(request._id, reason, reasonNote.trim() || undefined), t('requests.rejected')));
  };

  return (
    <div className="flex flex-wrap gap-[18px] items-start">
      <Card label={t('requests.listLabel')} className="flex-[1.35_1_480px] min-w-0 overflow-hidden">
        <div className="p-4 flex flex-wrap gap-2 justify-between items-center border-b border-white/[0.07]">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((s) => (
              <Pill key={s} active={s === status} onClick={() => { setStatus(s); setSelectedId(null); }}>
                {t(`requestStatus.${s}`)}
              </Pill>
            ))}
          </div>
          <form
            className="flex gap-2"
            onSubmit={(e) => { e.preventDefault(); loadList(); }}
          >
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('requests.search')} className={`${inputClass} w-[220px]`} />
          </form>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[560px]">
            <div className={`grid ${COLS} gap-x-3 px-4 py-2.5 text-xs text-[#C4C4C4] border-b border-white/[0.07]`}>
              {(['reference', 'holder', 'account', 'received', 'status'] as const).map((c) => (
                <span key={c}>{t(`requests.columns.${c}`)}</span>
              ))}
            </div>
            {items && items.length > 0 ? (
              items.map((r) => (
                <RowButton key={r._id} selected={r._id === selectedId} onClick={() => setSelectedId(r._id)}>
                  <span className={`grid ${COLS} gap-x-3 items-center col-span-full`}>
                    <b className="text-white">{r.reference}</b>
                    <span className="truncate">{r.nameOnCard}</span>
                    <span><StatusBadge tone={r.ownerType === 'Artist' ? 'red' : 'neutral'}>{t(`owner.${r.ownerType}`)}</StatusBadge></span>
                    <span>{f.date(r.createdAt)}</span>
                    <span><StatusBadge tone={REQUEST_TONE[r.status]}>{t(`requestStatus.${r.status}`)}</StatusBadge></span>
                  </span>
                </RowButton>
              ))
            ) : (
              <div className="px-4 py-3.5 text-sm text-[#C4C4C4]">{items ? t('requests.empty') : t('notConnected')}</div>
            )}
          </div>
        </div>
      </Card>

      <Card label={t('requests.detailTitle', { reference: '' })} className="flex-[1_1_360px] min-w-0 p-5 flex flex-col gap-3.5">
        <div className="flex justify-between items-center gap-3">
          <CardTitle>{request ? t('requests.detailTitle', { reference: request.reference }) : t('requests.nothingSelected')}</CardTitle>
          {request && <StatusBadge tone={REQUEST_TONE[request.status]}>{t(`requestStatus.${request.status}`)}</StatusBadge>}
        </div>
        <DefList
          rows={[
            [t('requests.nameOnCard'), request?.nameOnCard ?? DASH],
            [t('requests.account'), request ? `${t(`owner.${request.ownerType}`)} · ${checks?.accountEmail ?? DASH}` : DASH],
            [t('requests.phone'), request?.phone ?? DASH],
            [t('requests.city'), request?.city || DASH],
            [t('requests.terms'), request ? t('requests.termsAccepted', { date: f.date(request.termsAcceptedAt) }) : DASH],
          ]}
        />
        <CardTitle>{t('requests.checksTitle')}</CardTitle>
        <div className="flex flex-col gap-2">
          <CheckRow label={t('requests.checks.accountCreatedAt')} value={f.date(checks?.accountCreatedAt)} />
          <CheckRow label={t('requests.checks.phoneMatches')} value={yesNo(checks?.phoneMatchesAccount)} />
          <CheckRow label={t('requests.checks.samePhone')} value={f.count(checks?.samePhoneRequests)} />
          <CheckRow label={t('requests.checks.hasCard')} value={yesNo(checks?.hasCard)} />
        </div>

        {request && !open && (
          <PendingNote>
            {t('requests.decided', { date: f.date(request.decidedAt) })}
            {request.rejectionReason ? ` · ${t(`requests.reasons.${request.rejectionReason}`)}` : ''}
          </PendingNote>
        )}

        {(!request || open) && (
          <>
            {request?.status === 'submitted' && (
              <PillButton variant="outline" disabled={busy} onClick={startReview}>{t('requests.startReview')}</PillButton>
            )}
            <Field label={t('requests.internalNote')}>
              <textarea value={note} onChange={(e) => setNote(e.target.value)} disabled={!request} className={textareaClass} />
            </Field>
            <PillButton className="bg-[#34C759] hover:bg-[#34C759]/90 text-[#00230B]" disabled={!request || busy} onClick={approve}>
              {t('requests.approve')}
            </PillButton>
            <PendingNote>{t('requests.approveNote')}</PendingNote>
            <div className="p-4 rounded-2xl bg-white/[0.04] flex flex-col gap-3">
              <span className="text-[13px] text-[#C4C4C4]">{t('requests.rejectTitle')}</span>
              <div className="flex flex-wrap gap-2">
                {REASONS.map((r) => (
                  <Pill key={r} active={reason === r} onClick={() => setReason(r)}>{t(`requests.reasons.${r}`)}</Pill>
                ))}
              </div>
              {reason && (
                <textarea
                  value={reasonNote}
                  onChange={(e) => setReasonNote(e.target.value)}
                  placeholder={t('requests.rejectNote')}
                  className={textareaClass}
                />
              )}
              <PillButton variant="outline" className="border-[rgba(255,59,48,0.6)] text-[#FF8A80]" disabled={!request || !reason || busy} onClick={reject}>
                {t('requests.reject')}
              </PillButton>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
