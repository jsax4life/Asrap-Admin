import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  PageShell,
  PageHeader,
  Card,
  CardTitle,
  PillButton,
  StatusBadge,
  BadgeTone,
  DASH,
  formatCount,
} from '@/components/community/CommunityUI';
import { CommunityApiUnavailableError } from '@/services/communityService';
import {
  awardsService,
  AwardLevel,
  AwardDecision,
  AwardsSettings,
  CommitteeMemberVote,
  EligibleCertification,
  FundData,
  PayoutStatus,
} from '@/services/awardsService';

type TabSlug = 'controle' | 'seuils' | 'fonds';
const TABS: TabSlug[] = ['controle', 'seuils', 'fonds'];

const DISC_GRADIENT: Record<AwardLevel, string> = {
  silver: 'radial-gradient(circle at 35% 30%, #FFFFFF 0%, #C0C0C0 40%, #6E6E6E 100%)',
  gold: 'radial-gradient(circle at 35% 30%, #FFF4C2 0%, #E6C25A 35%, #8A6512 100%)',
  platinum: 'radial-gradient(circle at 35% 30%, #FFFFFF 0%, #E5E4E2 40%, #8F8E8C 100%)',
  diamond: 'radial-gradient(circle at 35% 30%, #FFFFFF 0%, #9BE7F5 40%, #3A8FA3 100%)',
};

const LEVEL_COLOR: Record<AwardLevel, string> = {
  silver: 'text-[#C4C4C4]',
  gold: 'text-[#E9C35A]',
  platinum: 'text-[#E5E4E2]',
  diamond: 'text-[#9BE7F5]',
};

const LEVELS: AwardLevel[] = ['silver', 'gold', 'platinum', 'diamond'];

const PAYOUT_TONE: Record<PayoutStatus, BadgeTone> = { to_pay: 'orange', paid: 'neutral', deferred: 'red' };

const VERIFICATION_DAYS = 15;

// Values of the AsraPa Legend rules v1.1, shown until the server sends its own settings.
const DEFAULT_SETTINGS: AwardsSettings = {
  minPlaysPerSubscriber: 3,
  minArtistsPerPack: 3,
  streamsPerSale: 10,
  networkTriggerShare: 30,
  networkMinShare: 10,
  networkFloor: 3,
  activeDays: 90,
  activeAsraPoints: null,
  thresholds: {
    silver: { firstPeriod: 100, secondPeriod: 200 },
    gold: { firstPeriod: 250, secondPeriod: 600 },
    platinum: { firstPeriod: 500, secondPeriod: 1500 },
    diamond: { firstPeriod: 1000, secondPeriod: 3000 },
  },
  primes: { silver: 15000, gold: 50000, platinum: 125000, diamond: 300000 },
  published: false,
};

type NumericSetting =
  | 'minPlaysPerSubscriber'
  | 'minArtistsPerPack'
  | 'streamsPerSale'
  | 'networkTriggerShare'
  | 'networkMinShare'
  | 'networkFloor'
  | 'activeDays';

const QUALIFIED_FIELDS: [NumericSetting, string][] = [
  ['minPlaysPerSubscriber', 'minPlays'],
  ['minArtistsPerPack', 'minArtists'],
  ['streamsPerSale', 'streamsPerSale'],
];

const NETWORK_FIELDS: [NumericSetting, string][] = [
  ['networkTriggerShare', 'networkTrigger'],
  ['networkMinShare', 'networkShare'],
  ['networkFloor', 'networkFloor'],
  ['activeDays', 'activeDays'],
];

const inputClass =
  'h-[42px] px-3.5 rounded-full border border-white/[0.14] bg-black/40 text-white text-sm placeholder:text-[#8A8A8A] focus:outline-none focus:border-[#FF0000]';

function toNumber(value: string): number | null {
  const digits = value.replace(/\s/g, '');
  if (!digits) return null;
  const n = Number(digits);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

function daysLeft(iso: string | null | undefined): number | null {
  if (!iso) return null;
  return Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000));
}

function Disc({ level, size = 34 }: { level: AwardLevel; size?: number }) {
  return (
    <span
      role="img"
      aria-label={level}
      className="rounded-full flex-shrink-0"
      style={{ width: size, height: size, background: DISC_GRADIENT[level] }}
    />
  );
}

function Metric({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="p-3 rounded-2xl bg-white/[0.04] flex flex-col gap-1">
      <span className="text-xs text-[#C4C4C4]">{label}</span>
      <b className="text-xl text-white tabular-nums">{value}</b>
      <span className="text-xs text-[#C4C4C4]">{note}</span>
    </div>
  );
}

export default function Awards() {
  const { t, i18n } = useTranslation('awards');
  const { tab } = useParams<{ tab?: string }>();
  const active: TabSlug = TABS.includes(tab as TabSlug) ? (tab as TabSlug) : 'controle';
  const locale = i18n.language === 'en' ? 'en-US' : 'fr-FR';

  const [eligible, setEligible] = useState<EligibleCertification[] | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [settings, setSettings] = useState<AwardsSettings>(DEFAULT_SETTINGS);
  const [fund, setFund] = useState<FundData | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState('');

  const loadAll = async () => {
    try {
      const [e, s, f] = await Promise.all([
        awardsService.getEligible(),
        awardsService.getSettings(),
        awardsService.getFund(),
      ]);
      setEligible(e.data);
      if (s.data) setSettings({ ...DEFAULT_SETTINGS, ...s.data });
      setFund(f.data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('errors.loadFailed'));
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const selected = eligible?.find((c) => c._id === selectedId) ?? eligible?.[0] ?? null;

  const runAction = async (action: () => Promise<void>, success: string) => {
    setSubmitting(true);
    try {
      await action();
      toast.success(success);
      return true;
    } catch (error) {
      toast.error(
        error instanceof CommunityApiUnavailableError
          ? t('errors.apiUnavailable')
          : error instanceof Error ? error.message : t('errors.actionFailed')
      );
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const decide = async (decision: AwardDecision, why?: string) => {
    if (!selected) return;
    const ok = await runAction(() => awardsService.decide(selected._id, decision, why), t('control.decisionSaved'));
    if (ok) {
      setRejectOpen(false);
      setReason('');
      setSelectedId(null);
      await loadAll();
    }
  };

  const formatDate = (iso?: string | null) => (iso ? new Date(iso).toLocaleDateString(locale) : null);
  const count = (value: number | null | undefined) => formatCount(value, locale);
  const fcfa = (value: number | null | undefined) => (value == null ? DASH : `${count(value)} FCFA`);
  const toFix = t('toFix');
  const toFill = t('toFill');
  const daysLabel = (iso?: string | null) => {
    const left = daysLeft(iso);
    return t('control.daysLeft', { n: left ?? '[n]' });
  };

  const requiredPoints =
    settings.activeAsraPoints == null || settings.networkMinShare == null
      ? null
      : Math.max(settings.networkFloor ?? 0, Math.ceil((settings.networkMinShare / 100) * settings.activeAsraPoints));

  const signals = selected?.signals;
  const controlLevel: AwardLevel = selected?.level ?? 'gold';
  const signalCards = [
    {
      id: 'qualified',
      value: count(signals?.qualifiedListeners),
      note: t('control.signals.qualifiedNote', {
        level: t(`levels.${controlLevel}`),
        threshold: count(signals?.threshold ?? settings.thresholds[controlLevel].firstPeriod),
      }),
    },
    {
      id: 'audience',
      value: `${count(signals?.subscribers)} · ${count(signals?.phones)}`,
      note: t('control.signals.audienceNote', { n: count(signals?.duplicatesRemoved) }),
    },
    {
      id: 'offline',
      value: `${count(signals?.offlineShare)} %`,
      note: t('control.signals.offlineNote', { share: count(settings.networkTriggerShare) }),
    },
    {
      id: 'network',
      value: count(signals?.asraPointsSold),
      note: t('control.signals.networkNote', {
        required: signals?.asraPointsRequired != null ? count(signals.asraPointsRequired) : requiredPoints != null ? count(requiredPoints) : toFill,
        share: count(settings.networkMinShare),
        floor: count(settings.networkFloor),
      }),
    },
    { id: 'concentration', value: `${count(signals?.concentrationShare)} %` },
    { id: 'peaks', value: count(signals?.suddenPeaks) },
    { id: 'selfPurchases', value: count(signals?.selfPurchases) },
    { id: 'removed', value: count(signals?.removedSales) },
  ];

  const committee: CommitteeMemberVote[] = selected?.committee?.length
    ? selected.committee
    : [
        { memberName: t('control.member', { n: 1 }), vote: 'pending' },
        { memberName: t('control.member', { n: 2 }), vote: 'pending' },
        { memberName: t('control.diasporaMember'), vote: 'pending' },
      ];

  const setNumeric = (key: NumericSetting, value: string) =>
    setSettings((p) => ({ ...p, [key]: toNumber(value) }));

  const numericField = ([key, label]: [NumericSetting, string]) => (
    <label key={key} className="flex flex-col gap-1.5 text-[13px] text-[#C4C4C4]">
      {t(`thresholds.${label}`)}
      <input
        inputMode="numeric"
        value={settings[key] ?? ''}
        disabled={settings.published}
        onChange={(e) => setNumeric(key, e.target.value)}
        className={cn(inputClass, 'disabled:opacity-60')}
      />
    </label>
  );

  const fundCards: [string, number | null | undefined][] = [
    ['revenue', fund?.revenue],
    ['fund', fund?.fund],
    ['reserve', fund?.reserve],
    ['available', fund?.available],
    ['paid', fund?.paid],
    ['deferred', fund?.deferred],
  ];

  const benefits: [string, string][] = [
    ['clip', t('fund.toPrice')],
    ['radios', t('fund.toConfirm')],
    ['documentary', t('fund.toPrice')],
    ['trophy', t('fund.sponsorToConfirm')],
  ];

  return (
    <PageShell>
      <PageHeader eyebrow={t('eyebrow')} title={t('title')} />

      <div role="tablist" aria-label={t('tabsLabel')} className="flex gap-2 flex-wrap">
        {TABS.map((slug) => (
          <Link
            key={slug}
            to={`/awards/${slug}`}
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

      {active === 'controle' && (
        <div className="flex flex-wrap gap-[18px] items-start">
          <Card label={t('control.listLabel')} className="flex-[1_1_360px] min-w-0 overflow-hidden">
            <div className="px-4 py-3.5 border-b border-white/[0.07] text-[13px] text-[#C4C4C4]">{t('control.listTitle')}</div>
            {eligible && eligible.length > 0 ? (
              eligible.map((c) => (
                <button
                  key={c._id}
                  type="button"
                  onClick={() => setSelectedId(c._id)}
                  className={cn(
                    'w-full text-left flex gap-3 items-center px-4 py-3.5 border-b border-white/[0.07]',
                    c._id === selected?._id ? 'bg-[rgba(255,0,0,0.08)]' : 'hover:bg-white/[0.03]'
                  )}
                >
                  <Disc level={c.level} />
                  <span className="flex-grow flex flex-col gap-0.5 min-w-0">
                    <b className="text-sm text-white truncate">{c.songTitle} · {t(`levels.${c.level}`)}</b>
                    <span className="text-xs text-[#C4C4C4]">
                      {t('control.reachedOn', { artist: c.artistName, date: formatDate(c.thresholdReachedAt) ?? DASH })}
                    </span>
                  </span>
                  <span className="text-xs font-bold text-[#F0995A] tabular-nums">{daysLabel(c.verificationEndsAt)}</span>
                </button>
              ))
            ) : (
              <div className="px-4 py-3.5 text-sm text-[#C4C4C4]">
                {eligible ? t('control.empty') : t('notConnected')}
              </div>
            )}
          </Card>

          <Card label={t('control.checkLabel')} className="flex-[2_1_520px] min-w-0 p-5 flex flex-col gap-3.5">
            <span className={cn('text-xs tracking-[0.18em]', LEVEL_COLOR[controlLevel])}>
              {t('control.checkEyebrow', {
                level: t(`levels.${controlLevel}`).toUpperCase(),
                days: daysLabel(selected?.verificationEndsAt),
              })}
            </span>
            <h2 className="m-0 text-[22px] font-bold text-white">
              {selected ? `${selected.songTitle} · ${selected.artistName}` : t('control.nothingSelected')}
            </h2>
            <div className="grid gap-2.5 grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">
              {signalCards.map((card) => (
                <Metric
                  key={card.id}
                  label={t(`control.signals.${card.id}`)}
                  value={card.value}
                  note={card.note ?? t(`control.signals.${card.id}Note`)}
                />
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[13px] text-[#C4C4C4]">{t('control.committeeTitle')}</span>
              <div className="grid gap-2 grid-cols-[repeat(auto-fit,minmax(150px,1fr))]">
                {committee.map((member) => (
                  <div key={member.memberName} className="px-3 py-2.5 rounded-[14px] bg-white/[0.04] flex flex-col gap-0.5">
                    <b className="text-[13px] text-white">{member.memberName}</b>
                    <span className="text-xs text-[#C4C4C4]">{t(`control.votes.${member.vote}`)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <PillButton className="px-5" disabled={!selected || submitting} onClick={() => decide('submit')}>
                {t('control.submit')}
              </PillButton>
              <PillButton variant="outline" disabled={!selected || submitting} onClick={() => decide('extend')}>
                {t('control.extend')}
              </PillButton>
              <PillButton variant="outline" disabled={!selected || submitting} onClick={() => setRejectOpen(true)}>
                {t('control.reject')}
              </PillButton>
            </div>
            <span className="text-xs text-[#C4C4C4]">{t('control.footnote')}</span>
            <span className="text-xs text-[#C4C4C4]">{t('control.sanctions')}</span>
          </Card>
        </div>
      )}

      {active === 'seuils' && (
        <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(min(360px,100%),1fr))]">
          <Card className="p-5 flex flex-col gap-3">
            <CardTitle>{t('thresholds.qualifiedTitle')}</CardTitle>
            {QUALIFIED_FIELDS.map(numericField)}
            <span className="text-xs text-[#C4C4C4]">{t('thresholds.qualifiedNote')}</span>
          </Card>

          <Card className="p-5 flex flex-col gap-3">
            <CardTitle>{t('thresholds.networkTitle')}</CardTitle>
            {NETWORK_FIELDS.map(numericField)}
            <span className="text-xs text-[#C4C4C4]">
              {t('thresholds.activePoints', {
                n: settings.activeAsraPoints != null ? count(settings.activeAsraPoints) : toFill,
              })}
            </span>
          </Card>

          <Card className="p-5 flex flex-col gap-3">
            <CardTitle>{t('thresholds.publishedTitle')}</CardTitle>
            <div className="overflow-x-auto">
              <div className="min-w-[360px] grid grid-cols-4 gap-x-3.5 gap-y-2.5 text-[13px] items-center">
                <span className="text-[#C4C4C4]">{t('thresholds.level')}</span>
                <span className="text-[#C4C4C4]">{t('thresholds.firstPeriod')}</span>
                <span className="text-[#C4C4C4]">{t('thresholds.secondPeriod')}</span>
                <span className="text-[#C4C4C4]">{t('thresholds.prime')}</span>
                {LEVELS.map((level) => (
                  <div key={level} className="contents">
                    <b className={LEVEL_COLOR[level]}>{t(`levels.${level}`)}</b>
                    <span className="text-[#E0E0E0] tabular-nums">{count(settings.thresholds[level]?.firstPeriod)}</span>
                    <span className="text-[#E0E0E0] tabular-nums">{count(settings.thresholds[level]?.secondPeriod)}</span>
                    <span className="text-[#E0E0E0] tabular-nums">{count(settings.primes[level])}</span>
                  </div>
                ))}
              </div>
            </div>
            <span className="text-xs text-[#C4C4C4]">{t('thresholds.tableNote')}</span>
            <div className="px-3 py-2.5 rounded-[14px] bg-[rgba(255,0,0,0.1)] border border-[rgba(255,0,0,0.35)] text-[13px] text-[#E0E0E0]">
              {t('thresholds.commitment')}
            </div>
            <div className="flex flex-wrap gap-2">
              <PillButton
                className="h-[42px]"
                disabled={submitting || settings.published}
                onClick={() => runAction(() => awardsService.publishThresholds(settings), t('thresholds.publishedToast'))}
              >
                {settings.published ? t('thresholds.alreadyPublished') : t('thresholds.publish')}
              </PillButton>
              <PillButton
                variant="outline"
                className="h-[42px]"
                disabled={submitting || settings.published}
                onClick={() => runAction(() => awardsService.saveSettings(settings), t('thresholds.savedToast'))}
              >
                {t('thresholds.save')}
              </PillButton>
            </div>
          </Card>
        </div>
      )}

      {active === 'fonds' && (
        <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(min(380px,100%),1fr))]">
          <Card className="p-5 flex flex-col gap-3">
            <div className="flex justify-between items-baseline gap-3 flex-wrap">
              <CardTitle>{t('fund.title')}</CardTitle>
              <span className="text-xs text-[#C4C4C4]">
                {t('fund.period', {
                  start: formatDate(fund?.periodStart) ?? t('start'),
                  end: formatDate(fund?.periodEnd) ?? t('end'),
                })}
              </span>
            </div>
            <div className="grid gap-2.5 grid-cols-[repeat(auto-fit,minmax(150px,1fr))]">
              {fundCards.map(([id, value]) => (
                <Metric key={id} label={t(`fund.${id}`)} value={fcfa(value)} note={t(`fund.${id}Note`)} />
              ))}
            </div>
            <div className="px-3 py-2.5 rounded-[14px] bg-[rgba(255,0,0,0.1)] border border-[rgba(255,0,0,0.35)] text-[13px] text-[#E0E0E0]">
              {t('fund.rule')}
            </div>
          </Card>

          <Card className="p-5 flex flex-col gap-2.5">
            <CardTitle>{t('fund.payoutsTitle')}</CardTitle>
            {fund && fund.payouts.length > 0 ? (
              fund.payouts.map((p) => (
                <div key={p._id} className="flex items-center gap-3 py-[9px] border-b border-white/[0.07]">
                  <Disc level={p.level} size={28} />
                  <span className="flex-grow flex flex-col gap-0.5 min-w-0">
                    <span className="text-sm text-white truncate">{p.songTitle} · {t(`levels.${p.level}`)}</span>
                    <span className="text-xs text-[#C4C4C4]">
                      {t('fund.validatedOn', { artist: p.artistName, date: formatDate(p.validatedAt) ?? DASH })}
                    </span>
                  </span>
                  <span className="flex flex-col items-end gap-1">
                    <b className="text-[13px] text-white tabular-nums">{fcfa(p.amount)}</b>
                    <StatusBadge tone={PAYOUT_TONE[p.status]}>{t(`fund.status.${p.status}`)}</StatusBadge>
                  </span>
                </div>
              ))
            ) : (
              <span className="text-sm text-[#C4C4C4]">{fund ? t('fund.noPayouts') : t('notConnected')}</span>
            )}
            <span className="text-xs text-[#C4C4C4]">{t('fund.payoutsNote')}</span>
          </Card>

          <section className="p-5 rounded-3xl border border-[rgba(255,0,0,0.4)] flex flex-col gap-3 bg-[linear-gradient(140deg,rgba(204,0,0,0.25)_0%,rgba(28,24,23,0.95)_60%)]">
            <CardTitle>{t('fund.benefitsTitle')}</CardTitle>
            <div className="flex flex-col gap-2 text-sm text-[#E0E0E0]">
              {benefits.map(([id, status]) => (
                <div key={id} className="flex justify-between gap-3">
                  <span>{t(`fund.benefits.${id}`)}</span>
                  <span className="text-[#C4C4C4] text-right">{status}</span>
                </div>
              ))}
              <div className="flex justify-between gap-3">
                <span>{t('fund.committee')}</span>
                <span className="text-[#C4C4C4] text-right">
                  {fund?.committee?.length
                    ? fund.committee.map((m) => (m.diaspora ? `${m.name} (${t('fund.diaspora')})` : m.name)).join(', ')
                    : t('fund.toAppoint')}
                </span>
              </div>
            </div>
          </section>
        </div>
      )}

      <Dialog open={rejectOpen} onOpenChange={(open) => !open && !submitting && setRejectOpen(false)}>
        <DialogContent className="bg-asra-gray-1 border-asra-gray-2 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">{t('control.rejectTitle')}</DialogTitle>
            <DialogDescription className="text-asra-gray-6">{t('control.rejectHelp')}</DialogDescription>
          </DialogHeader>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            placeholder={t('control.reasonPlaceholder')}
            className="w-full px-4 py-3 bg-asra-gray-2 border border-asra-gray-5 rounded-lg text-white placeholder:text-asra-gray-6 focus:outline-none focus:border-asra-red resize-none"
          />
          <DialogFooter className="gap-2 sm:gap-0">
            <PillButton variant="outline" disabled={submitting} onClick={() => setRejectOpen(false)}>
              {t('control.cancel')}
            </PillButton>
            <PillButton disabled={submitting || !reason.trim()} onClick={() => decide('reject', reason.trim())}>
              {t('control.confirmReject')}
            </PillButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
