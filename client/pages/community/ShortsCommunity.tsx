import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';
import {
  PageShell,
  PageHeader,
  Card,
  CardTitle,
  KpiCard,
  PillButton,
  StatusBadge,
  GridTable,
  PendingNote,
  DASH,
  formatCount,
} from '@/components/community/CommunityUI';
import {
  communityService,
  CommunityApiUnavailableError,
  LandingStats,
  CommunityStats,
  CommunityChallenge,
  TopSound,
  CommunityCreator,
} from '@/services/communityService';

const CITY_FILTERS = [
  { id: 'all', city: undefined },
  { id: 'ndjamena', city: "N'Djamena" },
  { id: 'moundou', city: 'Moundou' },
  { id: 'diaspora', city: 'diaspora' },
] as const;

type CityFilterId = (typeof CITY_FILTERS)[number]['id'];

export default function ShortsCommunity() {
  const { t, i18n } = useTranslation('community');
  const navigate = useNavigate();
  const locale = i18n.language === 'en' ? 'en-US' : 'fr-FR';

  const [platform, setPlatform] = useState<LandingStats | null>(null);
  const [platformDate, setPlatformDate] = useState<Date | null>(null);
  const [stats, setStats] = useState<CommunityStats | null>(null);
  const [challenges, setChallenges] = useState<CommunityChallenge[] | null>(null);
  const [creators, setCreators] = useState<CommunityCreator[] | null>(null);
  const [sounds, setSounds] = useState<TopSound[] | null>(null);
  const [soundsConnected, setSoundsConnected] = useState(false);
  const [city, setCity] = useState<CityFilterId>('all');

  useEffect(() => {
    communityService
      .getLandingStats()
      .then((data) => {
        setPlatform(data);
        setPlatformDate(new Date());
      })
      .catch(() => setPlatform(null));

    Promise.all([
      communityService.getCommunityStats(),
      communityService.getChallenges(),
      communityService.getCreators(),
    ])
      .then(([s, c, cr]) => {
        setStats(s.data);
        setChallenges(c.data);
        setCreators(cr.data);
      })
      .catch((error) => toast.error(error instanceof Error ? error.message : t('errors.loadFailed')));
  }, []);

  useEffect(() => {
    const filter = CITY_FILTERS.find((f) => f.id === city);
    communityService
      .getTopSounds(filter?.city)
      .then((result) => {
        setSounds(result.data);
        setSoundsConnected(!result.unavailable);
      })
      .catch((error) => toast.error(error instanceof Error ? error.message : t('errors.loadFailed')));
  }, [city]);

  const runAction = async (action: () => Promise<void>, success: string) => {
    try {
      await action();
      toast.success(success);
    } catch (error) {
      toast.error(
        error instanceof CommunityApiUnavailableError
          ? t('errors.apiUnavailable')
          : error instanceof Error ? error.message : t('errors.actionFailed')
      );
    }
  };

  const featuredCandidate = challenges?.find((c) => c.status === 'active') ?? challenges?.[0];

  const platformFigures = [
    { id: 'songs', value: platform?.songs },
    { id: 'artists', value: platform?.artists },
    { id: 'listeners', value: platform?.listeners },
    { id: 'cities', value: platform?.cities },
  ];

  return (
    <PageShell>
      <PageHeader eyebrow={t('community.eyebrow')} title={t('community.title')} />

      <Card label={t('community.platformTitle')} className="px-5 py-[18px] flex flex-col gap-3">
        <div className="flex justify-between flex-wrap gap-2">
          <CardTitle>{t('community.platformTitle')}</CardTitle>
          <span className="text-xs text-[#C4C4C4]">
            {t('community.platformSource', {
              date: platformDate ? platformDate.toLocaleDateString(locale) : DASH,
            })}
          </span>
        </div>
        <div className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(150px,1fr))]">
          {platformFigures.map((f) => (
            <div key={f.id} className="flex flex-col gap-1">
              <b className="text-[34px] leading-none text-white tabular-nums">{formatCount(f.value, locale)}</b>
              <span className="text-xs tracking-[0.18em] text-[#C4C4C4]">{t(`community.platform.${f.id}`)}</span>
            </div>
          ))}
        </div>
      </Card>

      <section aria-label={t('community.kpiLabel')} className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
        <KpiCard
          label={t('community.kpi.shortsPerDay')}
          value={formatCount(stats?.shortsPerDay, locale)}
          caption={t('community.kpi.shortsPerDayCaption')}
        />
        <KpiCard
          label={t('community.kpi.creatorsRate')}
          value={`${formatCount(stats?.creatorsRate, locale)} %`}
          caption={t('community.kpi.creatorsRateCaption')}
        />
        <KpiCard
          highlight
          label={t('community.kpi.streamsFromShorts')}
          value={formatCount(stats?.streamsFromShorts, locale)}
          caption={t('community.kpi.streamsFromShortsCaption')}
        />
        <KpiCard
          label={t('community.kpi.retention')}
          value={`${formatCount(stats?.retention7d, locale)} %`}
          caption={t('community.kpi.retentionCaption')}
        />
      </section>

      <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(min(380px,100%),1fr))]">
        <Card className="p-5 flex flex-col gap-2.5">
          <div className="flex justify-between items-baseline">
            <CardTitle>{t('community.challengesTitle')}</CardTitle>
            <Link to="/moderation/defis" className="text-[13px] text-[#C4C4C4] hover:text-white">
              {t('community.challengesToReview')}
            </Link>
          </div>
          <GridTable
            minWidth={460}
            columns={[
              t('community.challenges.challenge'),
              t('community.challenges.artist'),
              t('community.challenges.participations'),
              t('community.challenges.status'),
            ]}
            isEmpty={!challenges || challenges.length === 0}
            empty={challenges ? t('community.challenges.empty') : t('community.notConnected')}
          >
            {challenges?.map((c) => (
              <div key={c._id} className="contents">
                <span className="text-white font-bold">{c.title}</span>
                <span className="text-[#E0E0E0]">{c.artistName}</span>
                <span className="text-[#E0E0E0]">{formatCount(c.participations, locale)}</span>
                <StatusBadge tone={c.status === 'pending' ? 'orange' : 'red'}>
                  {t(`community.challenges.statuses.${c.status}`)}
                </StatusBadge>
              </div>
            ))}
          </GridTable>
          <PillButton
            className="self-start mt-1 h-[42px]"
            disabled={!featuredCandidate}
            onClick={() =>
              featuredCandidate &&
              runAction(() => communityService.featureChallenge(featuredCandidate._id), t('community.challengeFeatured'))
            }
          >
            {t('community.featureChallenge')}
          </PillButton>
        </Card>

        <Card className="p-5 flex flex-col gap-3">
          <div className="flex justify-between items-baseline flex-wrap gap-2">
            <CardTitle>{t('community.topSoundsTitle')}</CardTitle>
            <span className="flex gap-1.5">
              {CITY_FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setCity(f.id)}
                  className={cn(
                    'text-xs px-2.5 py-[5px] rounded-full',
                    city === f.id ? 'bg-[#FF0000] text-white font-bold' : 'bg-white/[0.07] text-[#E0E0E0] hover:text-white'
                  )}
                >
                  {t(`community.cities.${f.id}`)}
                </button>
              ))}
            </span>
          </div>
          {sounds?.map((s, i) => (
            <div key={s.songId} className="flex gap-3 items-center">
              <span className="w-[22px] font-bold text-[#FF3B30]">{i + 1}</span>
              {s.coverUrl ? (
                <img src={s.coverUrl} alt="" className="w-11 h-11 rounded-xl object-cover" />
              ) : (
                <span className="w-11 h-11 rounded-xl bg-[#2A2422]" />
              )}
              <span className="flex-grow flex flex-col gap-0.5 min-w-0">
                <b className="text-sm text-white truncate">{s.title}</b>
                <span className="text-xs text-[#C4C4C4]">
                  {[s.artistName, s.genre].filter(Boolean).join(' · ')}
                </span>
              </span>
              <span className="text-[13px] text-[#E0E0E0] whitespace-nowrap">
                {t('community.shortsCount', { count: s.shortsCount, formatted: formatCount(s.shortsCount, locale) })}
              </span>
            </div>
          ))}
          <PendingNote>
            {!soundsConnected
              ? t('community.topSoundsPending')
              : sounds && sounds.length === 0 ? t('community.topSoundsPending') : null}
          </PendingNote>
        </Card>
      </div>

      <Card className="p-5 flex flex-col gap-2.5">
        <CardTitle>{t('community.creatorsTitle')}</CardTitle>
        {creators && creators.length > 0 ? (
          <div className="grid gap-2.5 grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))]">
            {creators.map((c) => {
              const verification = c.kind === 'verification';
              return (
                <div
                  key={c._id}
                  className={cn(
                    'flex gap-3 items-center px-3 py-2.5 rounded-[18px]',
                    verification ? 'bg-[rgba(255,0,0,0.08)] border border-[rgba(255,0,0,0.3)]' : 'bg-white/[0.04]'
                  )}
                >
                  {c.avatarUrl ? (
                    <img src={c.avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <span className="w-10 h-10 rounded-full bg-[#2A2422] flex items-center justify-center text-[13px] font-bold text-white">
                      {c.name.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                  <span className="flex-grow text-sm text-white min-w-0">
                    {c.name}
                    {c.detail && <span className="text-[#C4C4C4]"> · {c.detail}</span>}
                  </span>
                  {verification ? (
                    <PillButton size="sm" onClick={() => navigate(`/artist-management/${c._id}`)}>
                      {t('community.verify')}
                    </PillButton>
                  ) : (
                    <PillButton
                      size="sm"
                      variant="outline"
                      onClick={() => runAction(() => communityService.featureCreator(c._id), t('community.creatorFeatured'))}
                    >
                      {t('community.feature')}
                    </PillButton>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <PendingNote>{creators ? t('community.creatorsEmpty') : t('community.notConnected')}</PendingNote>
        )}
      </Card>
    </PageShell>
  );
}
