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
  DASH,
  formatCount,
} from '@/components/community/CommunityUI';
import { CommunityApiUnavailableError } from '@/services/communityService';
import {
  awardsService,
  AwardLevel,
  AwardDecision,
  AwardsSettings,
  CeremonyData,
  CeremonyPrize,
  EligibleCertification,
} from '@/services/awardsService';

type TabSlug = 'controle' | 'seuils' | 'ceremonie';
const TABS: TabSlug[] = ['controle', 'seuils', 'ceremonie'];

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

// Gold = 2 × Silver, Platinum = 2 × Gold, Diamond = 5 × Platinum (rules, section 3).
const LEVEL_MULTIPLIER: Record<AwardLevel, number> = { silver: 1, gold: 2, platinum: 4, diamond: 20 };
const LEVELS: AwardLevel[] = ['silver', 'gold', 'platinum', 'diamond'];

const PRIZES: CeremonyPrize[] = ['title', 'artist', 'revelation', 'challenge', 'short', 'diaspora', 'maquis'];

const DEFAULT_SETTINGS: AwardsSettings = {
  minSeconds: 30,
  dailyCapPerAccount: null,
  observationStart: null,
  observationEnd: null,
  silverThresholdTitle: null,
  silverThresholdAlbum: null,
  published: false,
};

const inputClass =
  'h-[42px] px-3.5 rounded-full border border-white/[0.14] bg-black/40 text-white text-sm placeholder:text-[#8A8A8A] focus:outline-none focus:border-[#FF0000]';

function toNumber(value: string): number | null {
  const digits = value.replace(/\s/g, '');
  if (!digits) return null;
  const n = Number(digits);
  return Number.isFinite(n) && n >= 0 ? n : null;
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

export default function Awards() {
  const { t, i18n } = useTranslation('awards');
  const { tab } = useParams<{ tab?: string }>();
  const active: TabSlug = TABS.includes(tab as TabSlug) ? (tab as TabSlug) : 'controle';
  const locale = i18n.language === 'en' ? 'en-US' : 'fr-FR';

  const [eligible, setEligible] = useState<EligibleCertification[] | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [settings, setSettings] = useState<AwardsSettings>(DEFAULT_SETTINGS);
  const [ceremony, setCeremony] = useState<CeremonyData | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState('');

  const loadAll = async () => {
    try {
      const [e, s, c] = await Promise.all([
        awardsService.getEligible(),
        awardsService.getSettings(),
        awardsService.getCeremony(),
      ]);
      setEligible(e.data);
      if (s.data) setSettings(s.data);
      setCeremony(c.data);
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
  const toFix = t('toFix');

  const thresholdCell = (level: AwardLevel, base: number | null) => {
    if (level === 'silver') return base === null ? toFix : formatCount(base, locale);
    if (base !== null) return formatCount(base * LEVEL_MULTIPLIER[level], locale);
    return t(`thresholds.rule.${level}`);
  };

  const signals = selected?.signals;
  const signalCards = [
    { id: 'qualified', value: formatCount(signals?.qualifiedStreams, locale), note: t('control.signals.qualifiedNote', {
        level: selected ? t(`levels.${selected.level}`) : t('levels.gold'),
        threshold: signals?.threshold != null ? formatCount(signals.threshold, locale) : toFix,
      }) },
    { id: 'topAccounts', value: `${formatCount(signals?.topAccountsShare, locale)} %` },
    { id: 'recentAccounts', value: `${formatCount(signals?.recentAccountsShare, locale)} %` },
    { id: 'loop', value: formatCount(signals?.loopListeners, locale) },
    { id: 'cities', value: formatCount(signals?.citiesCount, locale) },
    { id: 'discarded', value: formatCount(signals?.discardedStreams, locale) },
  ];

  const controlLevel: AwardLevel = selected?.level ?? 'gold';

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
                      {t('control.eligibleOn', { artist: c.artistName, date: formatDate(c.eligibleAt) ?? DASH })}
                    </span>
                  </span>
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
              {t('control.checkEyebrow', { level: t(`levels.${controlLevel}`).toUpperCase() })}
            </span>
            <h2 className="m-0 text-[22px] font-bold text-white">
              {selected ? `${selected.songTitle} · ${selected.artistName}` : t('control.nothingSelected')}
            </h2>
            <div className="grid gap-2.5 grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">
              {signalCards.map((card) => (
                <div key={card.id} className="p-3 rounded-2xl bg-white/[0.04] flex flex-col gap-1">
                  <span className="text-xs text-[#C4C4C4]">{t(`control.signals.${card.id}`)}</span>
                  <b className="text-xl text-white tabular-nums">{card.value}</b>
                  <span className="text-xs text-[#C4C4C4]">{card.note ?? t(`control.signals.${card.id}Note`)}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <PillButton className="px-5" disabled={!selected || submitting} onClick={() => decide('certify')}>
                {t('control.certify')}
              </PillButton>
              <PillButton variant="outline" disabled={!selected || submitting} onClick={() => decide('postpone')}>
                {t('control.postpone')}
              </PillButton>
              <PillButton variant="outline" disabled={!selected || submitting} onClick={() => setRejectOpen(true)}>
                {t('control.reject')}
              </PillButton>
            </div>
            <span className="text-xs text-[#C4C4C4]">{t('control.footnote')}</span>
          </Card>
        </div>
      )}

      {active === 'seuils' && (
        <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(min(380px,100%),1fr))]">
          <Card className="p-5 flex flex-col gap-3">
            <CardTitle>{t('thresholds.qualifiedTitle')}</CardTitle>
            <label className="flex flex-col gap-1.5 text-[13px] text-[#C4C4C4]">
              {t('thresholds.minSeconds')}
              <input
                inputMode="numeric"
                value={settings.minSeconds ?? ''}
                onChange={(e) => setSettings((p) => ({ ...p, minSeconds: toNumber(e.target.value) }))}
                className={inputClass}
              />
            </label>
            <label className="flex flex-col gap-1.5 text-[13px] text-[#C4C4C4]">
              {t('thresholds.dailyCap')}
              <input
                inputMode="numeric"
                value={settings.dailyCapPerAccount ?? ''}
                onChange={(e) => setSettings((p) => ({ ...p, dailyCapPerAccount: toNumber(e.target.value) }))}
                placeholder="[N]"
                className={inputClass}
              />
            </label>
            <span className="text-xs text-[#C4C4C4]">
              {t('thresholds.observation', {
                start: formatDate(settings.observationStart) ?? t('start'),
                end: formatDate(settings.observationEnd) ?? t('end'),
              })}
            </span>
          </Card>

          <Card className="p-5 flex flex-col gap-3">
            <CardTitle>{t('thresholds.publishedTitle')}</CardTitle>
            <div className="overflow-x-auto">
              <div className="min-w-[380px] grid grid-cols-3 gap-x-3.5 gap-y-2.5 text-[13px] items-center">
                <span className="text-[#C4C4C4]">{t('thresholds.level')}</span>
                <span className="text-[#C4C4C4]">{t('thresholds.title')}</span>
                <span className="text-[#C4C4C4]">{t('thresholds.album')}</span>
                {LEVELS.map((level) => (
                  <div key={level} className="contents">
                    <b className={LEVEL_COLOR[level]}>{t(`levels.${level}`)}</b>
                    {level === 'silver' && !settings.published ? (
                      <>
                        <input
                          inputMode="numeric"
                          aria-label={t('thresholds.silverTitleLabel')}
                          value={settings.silverThresholdTitle ?? ''}
                          onChange={(e) => setSettings((p) => ({ ...p, silverThresholdTitle: toNumber(e.target.value) }))}
                          placeholder={toFix}
                          className={cn(inputClass, 'h-[38px]')}
                        />
                        <input
                          inputMode="numeric"
                          aria-label={t('thresholds.silverAlbumLabel')}
                          value={settings.silverThresholdAlbum ?? ''}
                          onChange={(e) => setSettings((p) => ({ ...p, silverThresholdAlbum: toNumber(e.target.value) }))}
                          placeholder={toFix}
                          className={cn(inputClass, 'h-[38px]')}
                        />
                      </>
                    ) : (
                      <>
                        <span className="text-[#E0E0E0]">{thresholdCell(level, settings.silverThresholdTitle)}</span>
                        <span className="text-[#E0E0E0]">{thresholdCell(level, settings.silverThresholdAlbum)}</span>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="px-3 py-2.5 rounded-[14px] bg-[rgba(255,0,0,0.1)] border border-[rgba(255,0,0,0.35)] text-[13px] text-[#E0E0E0]">
              {t('thresholds.commitment')}
            </div>
            <PillButton
              className="self-start h-[42px]"
              disabled={submitting || settings.published || settings.silverThresholdTitle === null}
              onClick={() => runAction(() => awardsService.publishThresholds(settings), t('thresholds.publishedToast'))}
            >
              {settings.published ? t('thresholds.alreadyPublished') : t('thresholds.publish')}
            </PillButton>
          </Card>
        </div>
      )}

      {active === 'ceremonie' && (
        <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(min(380px,100%),1fr))]">
          <Card className="p-5 flex flex-col gap-2.5">
            <div className="flex justify-between items-baseline">
              <CardTitle>{t('ceremony.prizesTitle')}</CardTitle>
              <span className="text-xs text-[#C4C4C4]">
                {t('ceremony.computedAt', { date: formatDate(ceremony?.computedAt) ?? DASH })}
              </span>
            </div>
            {PRIZES.map((prize) => (
              <div key={prize} className="flex items-center gap-3 py-[9px] border-b border-white/[0.07]">
                <span className="flex-grow text-sm text-white">{t(`ceremony.prizes.${prize}`)}</span>
                <span className="text-[13px] text-[#C4C4C4]">
                  {t('ceremony.leader', { name: ceremony?.leaders[prize] || DASH })}
                </span>
              </div>
            ))}
            <span className="text-xs text-[#C4C4C4]">{t('ceremony.confidential')}</span>
          </Card>

          <section className="p-5 rounded-3xl border border-[rgba(255,0,0,0.4)] flex flex-col gap-3 bg-[linear-gradient(140deg,rgba(204,0,0,0.25)_0%,rgba(28,24,23,0.95)_60%)]">
            <CardTitle>{t('ceremony.organisationTitle')}</CardTitle>
            <div className="flex flex-col gap-2 text-sm text-[#E0E0E0]">
              <span>
                {t('ceremony.dateVenue', {
                  date: formatDate(ceremony?.date) ?? toFix,
                  venue: ceremony?.venue || t('ceremony.defaultVenue'),
                })}
              </span>
              <span>
                {t('ceremony.reference', {
                  start: formatDate(ceremony?.referenceStart) ?? t('start'),
                  end: formatDate(ceremony?.referenceEnd) ?? t('end'),
                })}
              </span>
              <span>{t('ceremony.jury', { prizes: ceremony?.juryPrizes || t('toDefine') })}</span>
              <span>{t('ceremony.guarantors')}</span>
            </div>
            <PillButton
              className="self-start h-[42px]"
              disabled={submitting}
              onClick={() => runAction(() => awardsService.preparePlaques(), t('ceremony.plaquesToast'))}
            >
              {t('ceremony.preparePlaques')}
            </PillButton>
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
