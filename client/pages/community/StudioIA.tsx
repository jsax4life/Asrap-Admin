import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import {
  PageShell,
  PageHeader,
  Card,
  CardTitle,
  KpiCard,
  PillButton,
  StatusBadge,
  BadgeTone,
  GridTable,
  DASH,
  formatCount,
} from '@/components/community/CommunityUI';
import {
  communityService,
  CommunityApiUnavailableError,
  StudioStats,
  StudioSettings,
  StudioGeneration,
} from '@/services/communityService';

// Real AsraPa artist plans (yearly prices).
const PLANS = [
  { id: 'title', priceFcfa: 10000 },
  { id: 'ep', priceFcfa: 15000 },
  { id: 'album', priceFcfa: 25000 },
] as const;

const DEFAULT_SETTINGS: StudioSettings = {
  packs: [
    { name: 'Pack 1', credits: null, priceFcfa: null },
    { name: 'Pack 2', credits: null, priceFcfa: null },
  ],
  planCredits: { title: null, ep: null, album: null },
  monthlyCapPerAccount: null,
  requireAdminReview: true,
  requireAiLabel: true,
  requireArtistConsent: true,
  budgetAlert: true,
};

const RULES = ['requireAdminReview', 'requireAiLabel', 'requireArtistConsent', 'budgetAlert'] as const;

const STATUS_TONE: Record<StudioGeneration['status'], BadgeTone> = {
  generating: 'neutral',
  pending_review: 'orange',
  rejected: 'red',
  published: 'neutral',
};

const inputClass =
  'w-full h-[38px] px-3 rounded-full border border-white/[0.14] bg-black/40 text-white placeholder:text-[#8A8A8A] focus:outline-none focus:border-[#FF0000]';

function toNumber(value: string): number | null {
  const digits = value.replace(/\s/g, '');
  if (!digits) return null;
  const n = Number(digits);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

export default function StudioIA() {
  const { t, i18n } = useTranslation('community');
  const locale = i18n.language === 'en' ? 'en-US' : 'fr-FR';

  const [stats, setStats] = useState<StudioStats | null>(null);
  const [settings, setSettings] = useState<StudioSettings>(DEFAULT_SETTINGS);
  const [generations, setGenerations] = useState<StudioGeneration[] | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      communityService.getStudioStats(),
      communityService.getStudioSettings(),
      communityService.getGenerations(),
    ])
      .then(([s, st, g]) => {
        setStats(s.data);
        if (st.data) setSettings(st.data);
        setGenerations(g.data);
      })
      .catch((error) => toast.error(error instanceof Error ? error.message : t('errors.loadFailed')));
  }, []);

  const updatePack = (index: number, field: 'credits' | 'priceFcfa', value: string) => {
    setSettings((prev) => ({
      ...prev,
      packs: prev.packs.map((p, i) => (i === index ? { ...p, [field]: toNumber(value) } : p)),
    }));
  };

  const save = async () => {
    setSaving(true);
    try {
      await communityService.saveStudioSettings(settings);
      toast.success(t('studio.saved'));
    } catch (error) {
      toast.error(
        error instanceof CommunityApiUnavailableError
          ? t('errors.apiUnavailable')
          : error instanceof Error ? error.message : t('errors.actionFailed')
      );
    } finally {
      setSaving(false);
    }
  };

  const numberValue = (n: number | null) => (n === null ? '' : String(n));

  return (
    <PageShell>
      <PageHeader eyebrow={t('studio.eyebrow')} title={t('studio.title')} />

      <section aria-label={t('studio.spendLabel')} className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
        <KpiCard
          label={t('studio.kpi.generations')}
          value={formatCount(stats?.generationsThisMonth, locale)}
          caption={t('studio.kpi.generationsCaption')}
        />
        <KpiCard
          label={t('studio.kpi.higgsfieldCost')}
          value={formatCount(stats?.higgsfieldCredits, locale)}
          unit={<span className="text-[15px] text-[#C4C4C4]">{t('studio.kpi.credits')}</span>}
          caption={t('studio.kpi.higgsfieldCostCaption')}
        />
        <KpiCard
          label={t('studio.kpi.creditsSold')}
          value={formatCount(stats?.creditsSoldFcfa, locale)}
          unit={<span className="text-[15px] text-[#FF3B30]">FCFA</span>}
          caption={t('studio.kpi.creditsSoldCaption')}
        />
        <KpiCard
          highlight
          label={t('studio.kpi.alerts')}
          value={formatCount(stats?.alerts, locale)}
          caption={t('studio.kpi.alertsCaption')}
        />
      </section>

      <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(min(380px,100%),1fr))]">
        <Card className="p-5 flex flex-col gap-3">
          <CardTitle>{t('studio.packsTitle')}</CardTitle>
          <div className="overflow-x-auto">
            <div className="min-w-[420px] grid grid-cols-3 gap-x-3.5 gap-y-2.5 text-[13px] items-center">
              <span className="text-[#C4C4C4]">{t('studio.packs.pack')}</span>
              <span className="text-[#C4C4C4]">{t('studio.packs.credits')}</span>
              <span className="text-[#C4C4C4]">{t('studio.packs.price')}</span>
              {settings.packs.map((pack, i) => (
                <div key={i} className="contents">
                  <span className="text-white font-bold">{pack.name}</span>
                  <label>
                    <span className="sr-only">{t('studio.packs.creditsOf', { name: pack.name })}</span>
                    <input
                      inputMode="numeric"
                      value={numberValue(pack.credits)}
                      onChange={(e) => updatePack(i, 'credits', e.target.value)}
                      placeholder={t('studio.packs.creditsPlaceholder')}
                      className={inputClass}
                    />
                  </label>
                  <label>
                    <span className="sr-only">{t('studio.packs.priceOf', { name: pack.name })}</span>
                    <input
                      inputMode="numeric"
                      value={numberValue(pack.priceFcfa)}
                      onChange={(e) => updatePack(i, 'priceFcfa', e.target.value)}
                      placeholder={t('studio.packs.pricePlaceholder')}
                      className={inputClass}
                    />
                  </label>
                </div>
              ))}
            </div>
          </div>

          <h3 className="mt-1.5 text-sm font-bold text-white">{t('studio.planCreditsTitle')}</h3>
          <div className="grid grid-cols-3 gap-2">
            {PLANS.map((plan) => (
              <div key={plan.id} className="p-3 rounded-2xl bg-white/[0.05] flex flex-col gap-[3px]">
                <b className="text-sm text-white">{t(`studio.plans.${plan.id}`)}</b>
                <span className="text-xs text-[#C4C4C4]">
                  {t('studio.planPrice', { price: formatCount(plan.priceFcfa, 'fr-FR') })}
                </span>
                <label>
                  <span className="sr-only">{t('studio.planCreditsOf', { plan: t(`studio.plans.${plan.id}`) })}</span>
                  <input
                    inputMode="numeric"
                    value={numberValue(settings.planCredits[plan.id])}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        planCredits: { ...prev.planCredits, [plan.id]: toNumber(e.target.value) },
                      }))
                    }
                    placeholder={t('studio.planCreditsPlaceholder')}
                    className="w-full bg-transparent text-[13px] text-[#E0E0E0] placeholder:text-[#E0E0E0] focus:outline-none focus:placeholder:text-[#8A8A8A]"
                  />
                </label>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 flex flex-col gap-3.5">
          <CardTitle>{t('studio.rulesTitle')}</CardTitle>
          <label className="flex flex-col gap-1.5 text-[13px] text-[#C4C4C4]">
            {t('studio.monthlyCap')}
            <input
              inputMode="numeric"
              value={numberValue(settings.monthlyCapPerAccount)}
              onChange={(e) => setSettings((prev) => ({ ...prev, monthlyCapPerAccount: toNumber(e.target.value) }))}
              placeholder={t('studio.packs.creditsPlaceholder')}
              className="h-[42px] px-3.5 rounded-full border border-white/[0.14] bg-black/40 text-white text-sm placeholder:text-[#8A8A8A] focus:outline-none focus:border-[#FF0000]"
            />
          </label>
          {RULES.map((rule) => (
            <label key={rule} className="flex gap-2.5 items-center text-sm text-[#E0E0E0] cursor-pointer">
              <input
                type="checkbox"
                checked={settings[rule]}
                onChange={(e) => setSettings((prev) => ({ ...prev, [rule]: e.target.checked }))}
                className="w-5 h-5 accent-[#FF0000]"
              />
              {t(`studio.rules.${rule}`)}
            </label>
          ))}
          <PillButton className="self-start px-5" disabled={saving} onClick={save}>
            {t('studio.save')}
          </PillButton>
        </Card>
      </div>

      <Card className="p-5 flex flex-col gap-2.5">
        <div className="flex justify-between items-baseline flex-wrap gap-2">
          <CardTitle>{t('studio.historyTitle')}</CardTitle>
          <span className="text-[13px] text-[#C4C4C4]">{t('studio.historyAside')}</span>
        </div>
        <GridTable
          minWidth={760}
          columns={[
            t('studio.history.date'),
            t('studio.history.artist'),
            t('studio.history.type'),
            t('studio.history.title'),
            t('studio.history.credits'),
            t('studio.history.status'),
          ]}
          isEmpty={!generations || generations.length === 0}
          empty={generations ? t('studio.history.empty') : t('studio.notConnected')}
        >
          {generations?.map((g) => (
            <div key={g._id} className="contents">
              <span className="text-[#E0E0E0]">{new Date(g.createdAt).toLocaleDateString(locale)}</span>
              <span className="text-white">{g.artistName}</span>
              <span className="text-[#E0E0E0]">{t(`studio.types.${g.type}`)}</span>
              <span className="text-[#E0E0E0]">{g.songTitle}</span>
              <span className="text-[#E0E0E0]">{g.credits === null ? DASH : formatCount(g.credits, locale)}</span>
              {g.status === 'pending_review' ? (
                <Link to="/moderation/ia" className="justify-self-start">
                  <StatusBadge tone="orange">{t('studio.statuses.pending_review')}</StatusBadge>
                </Link>
              ) : (
                <StatusBadge tone={STATUS_TONE[g.status]}>{t(`studio.statuses.${g.status}`)}</StatusBadge>
              )}
            </div>
          ))}
        </GridTable>
      </Card>
    </PageShell>
  );
}
