import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, Info } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { AnalyticsMetricCard } from '@/components/analytics/AnalyticsMetricCard';
import { FilterDropdown } from '@/components/analytics/FilterDropdown';
import {
  analyticsService,
  AdminOverviewResponse,
  TopArtist,
  TopSong,
} from '@/services/analyticsService';

// Periods accepted by /analytics/admin/top-songs and /top-artists ("<days>d")
const PERIODS = [
  { id: '7d', key: 'filters.last7Days' },
  { id: '30d', key: 'filters.last30Days' },
  { id: '90d', key: 'filters.last3Months' },
  { id: '365d', key: 'filters.lastYear' },
] as const;

const TOP_LIMIT = 10;

export default function Analytics() {
  const { t, i18n } = useTranslation('analytics');
  const locale = i18n.language === 'en' ? 'en-US' : 'fr-FR';
  const formatNumber = (n: number | undefined) => (n === undefined ? '—' : new Intl.NumberFormat(locale).format(n));

  const [overview, setOverview] = useState<AdminOverviewResponse['data'] | null>(null);
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [period, setPeriod] = useState<(typeof PERIODS)[number]['id']>('30d');
  const [topSongs, setTopSongs] = useState<TopSong[]>([]);
  const [topArtists, setTopArtists] = useState<TopArtist[]>([]);
  const [topLoading, setTopLoading] = useState(true);

  useEffect(() => {
    analyticsService
      .getAdminOverview()
      .then((res) => setOverview(res.data))
      .catch((err: Error) => toast.error(err.message))
      .finally(() => setOverviewLoading(false));
  }, []);

  useEffect(() => {
    setTopLoading(true);
    Promise.all([analyticsService.getTopSongs(TOP_LIMIT, period), analyticsService.getTopArtists(TOP_LIMIT, period)])
      .then(([songs, artists]) => {
        setTopSongs(songs.data || []);
        setTopArtists(artists.data || []);
      })
      .catch((err: Error) => toast.error(err.message))
      .finally(() => setTopLoading(false));
  }, [period]);

  const activityMetrics = [
    { label: t('live.plays30d'), value: formatNumber(overview?.streams.songsStreamedLast30d) },
    { label: t('live.activeUsers30d'), value: formatNumber(overview?.users.activeLast30d) },
    { label: t('live.newSignups30d'), value: formatNumber(overview?.users.newSignupsLast30d) },
    { label: t('metrics.downloads'), value: formatNumber(overview?.totals.downloads) },
    {
      label: t('live.revenue'),
      value: overview ? `${formatNumber(overview.revenueGenerated)} FCFA` : '—',
    },
  ];

  const catalogueMetrics = [
    { label: t('live.artists'), value: formatNumber(overview?.totals.artists) },
    { label: t('live.albums'), value: formatNumber(overview?.totals.albums) },
    { label: t('live.songs'), value: formatNumber(overview?.totals.songs) },
  ];

  const periodLabel = (id: string) => t(PERIODS.find((p) => p.id === id)!.key);

  return (
    <div className="space-y-8">
      {/* Activity */}
      <div className="space-y-6">
        <h2 className="text-white text-xl lg:text-2xl font-bold">{t('sections.statsOverview')}</h2>
        {overviewLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-8 h-8 text-asra-red animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {activityMetrics.map((metric) => (
              <AnalyticsMetricCard key={metric.label} label={metric.label} value={metric.value} />
            ))}
          </div>
        )}
      </div>

      {/* Rankings */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-white text-xl lg:text-2xl font-bold">{t('sections.rankings')}</h2>
          <FilterDropdown
            value={periodLabel(period)}
            onChange={(label) => {
              const match = PERIODS.find((p) => t(p.key) === label);
              if (match) setPeriod(match.id);
            }}
            options={PERIODS.map((p) => t(p.key))}
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <RankingList
            title={t('live.topSongs')}
            unit={t('live.playsUnit')}
            loading={topLoading}
            empty={t('live.emptyRanking')}
            items={topSongs.map((s) => ({
              id: s._id,
              title: s.title,
              subtitle: s.artist,
              image: s.coverPhotoUrl,
              value: s.plays,
            }))}
            formatNumber={formatNumber}
          />
          <RankingList
            title={t('live.topArtists')}
            unit={t('live.listenersUnit')}
            loading={topLoading}
            empty={t('live.emptyRanking')}
            items={topArtists.map((a) => ({
              id: a._id,
              title: a.name,
              image: a.profilePicture,
              value: a.monthlyListeners,
            }))}
            formatNumber={formatNumber}
          />
        </div>
      </div>

      {/* Catalogue */}
      <div className="space-y-6">
        <h2 className="text-white text-xl lg:text-2xl font-bold">{t('sections.catalogue')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {catalogueMetrics.map((metric) => (
            <AnalyticsMetricCard key={metric.label} label={metric.label} value={metric.value} />
          ))}
        </div>
      </div>

      <div className="flex items-start gap-3 p-4 rounded-lg border border-asra-gray-5 bg-asra-gray-1">
        <Info className="w-5 h-5 text-asra-red flex-shrink-0 mt-0.5" />
        <p className="text-asra-gray-6 text-sm">{t('live.notAvailable')}</p>
      </div>
    </div>
  );
}

interface RankingItem {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  value: number;
}

function RankingList({
  title,
  unit,
  items,
  loading,
  empty,
  formatNumber,
}: {
  title: string;
  unit: string;
  items: RankingItem[];
  loading: boolean;
  empty: string;
  formatNumber: (n: number) => string;
}) {
  return (
    <div className="bg-asra-gray-1 rounded-lg p-6 space-y-4">
      <h3 className="text-white text-lg font-semibold">{title}</h3>
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 text-asra-red animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <p className="text-asra-gray-6 text-sm">{empty}</p>
      ) : (
        <ol className="space-y-3">
          {items.map((item, index) => (
            <li key={item.id} className="flex items-center gap-3">
              <span className="w-6 text-asra-red font-bold text-sm">{index + 1}</span>
              {item.image ? (
                <img src={item.image} alt="" className="w-10 h-10 rounded object-cover flex-shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded bg-asra-gray-2 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm font-medium truncate">{item.title}</div>
                {item.subtitle && <div className="text-asra-gray-6 text-xs truncate">{item.subtitle}</div>}
              </div>
              <span className="text-white text-sm font-semibold whitespace-nowrap">
                {formatNumber(item.value)} <span className="text-asra-gray-6 font-normal">{unit}</span>
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
