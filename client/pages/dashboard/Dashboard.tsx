import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MetricCard } from "@/components/MetricCard";
import {
  Banknote,
  Users,
  Disc,
  Music,
  Download,
  UserCheck,
  UserPlus,
  Radio,
  User as UserIcon,
  Music2,
} from "lucide-react";
import { analyticsService, AdminOverviewResponse, TopArtistsResponse, TopSongsResponse } from "@/services/analyticsService";

// Helper function to format large numbers
const formatNumber = (num: number): string => {
  if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}Md`;
  if (num >= 1000000) return `${(num / 1000000).toFixed(0)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(0)}k`;
  return num.toString();
};

// Helper function to format revenue in FCFA
const formatRevenue = (num: number): string => `${formatNumber(num)} FCFA`;

export default function Dashboard() {
  const { t } = useTranslation('dashboard');

  // Helper function to format listeners
  const formatListeners = (listeners: number): string => {
    if (listeners >= 1000000) return `${(listeners / 1000000).toFixed(1)}M ${t('units.listeners')}`;
    if (listeners >= 1000) return `${(listeners / 1000).toFixed(0)}k ${t('units.listeners')}`;
    return `${listeners} ${t('units.listeners')}`;
  };

  // Helper function to format plays
  const formatPlays = (plays: number): string => {
    if (plays >= 1000000) return `${(plays / 1000000).toFixed(1)}M ${t('units.plays')}`;
    if (plays >= 1000) return `${(plays / 1000).toFixed(0)}k ${t('units.plays')}`;
    return `${plays} ${t('units.plays')}`;
  };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [overviewData, setOverviewData] = useState<AdminOverviewResponse | null>(null);
  const [topArtistsData, setTopArtistsData] = useState<TopArtistsResponse | null>(null);
  const [topSongsData, setTopSongsData] = useState<TopSongsResponse | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all dashboard data in parallel
        const [overview, artists, songs] = await Promise.all([
          analyticsService.getAdminOverview(),
          analyticsService.getTopArtists(10, '30d'),
          analyticsService.getTopSongs(10, '30d'),
        ]);

        setOverviewData(overview);
        setTopArtistsData(artists);
        setTopSongsData(songs);
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Prepare metrics data
  const metrics = overviewData?.data ? [
    { icon: Banknote, value: formatRevenue(overviewData.data.revenueGenerated), label: "Revenus générés" },
    { icon: Users, value: overviewData.data.totals.artists.toString(), label: "Total artistes" },
    { icon: Disc, value: formatNumber(overviewData.data.totals.albums), label: "Total albums" },
    { icon: Music, value: formatNumber(overviewData.data.totals.songs), label: "Total titres" },
    { icon: Download, value: formatNumber(overviewData.data.totals.downloads), label: "Total téléchargements" },
    { icon: UserCheck, value: formatNumber(overviewData.data.users.activeLast30d), label: "Utilisateurs actifs" },
    { icon: UserPlus, value: overviewData.data.users.newSignupsLast30d.toString(), label: "Nouvelles inscriptions" },
    { icon: Radio, value: formatNumber(overviewData.data.streams.songsStreamedLast30d), label: "Titres écoutés" },
  ] : [];

  // Prepare top artists data
  const topArtists = topArtistsData?.data.map((artist, index) => ({
    no: index + 1,
    name: artist.name,
    streams: formatListeners(artist.monthlyListeners),
    image: artist.profilePicture || null,
    faded: false,
  })) || [];

  // Prepare top songs data
  const topSongs = topSongsData?.data.map((song, index) => ({
    no: index + 1,
    name: song.title.length > 30 ? `${song.title.substring(0, 30)}...` : song.title,
    streams: formatPlays(song.plays),
    image: song.coverPhotoUrl || null,
  })) || [];

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-white text-lg">Chargement des données...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-500 text-lg">Erreur : {error}</div>
      </div>
    );
  }
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-[30px] lg:gap-y-4 mb-8 lg:mb-12">
        {metrics.map((metric, index) => (
          <MetricCard 
            key={index}
            icon={metric.icon}
            value={metric.value}
            label={metric.label}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-[89px] mt-8">
        <div className="overflow-x-auto">
          <h2 className="text-white text-xl lg:text-2xl font-bold mb-4 lg:mb-6">Top 10 artistes</h2>
          <div className="rounded-lg bg-asra-gray-1 shadow-[0_1px_3px_rgba(16,24,40,0.10),0_1px_2px_rgba(16,24,40,0.06)] min-w-[500px]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-asra-gray-5">
                  <th className="text-white text-xs font-bold tracking-[0.24px] leading-4 px-4 lg:px-6 py-3 text-center">N°</th>
                  <th className="text-white text-xs font-bold tracking-[0.24px] leading-4 px-4 lg:px-6 py-3 text-left">NOM DE L'ARTISTE</th>
                  <th className="text-white text-xs font-bold tracking-[0.24px] leading-4 px-4 lg:px-6 py-3 text-center">AUDITEURS MENSUELS</th>
                </tr>
              </thead>
              <tbody>
                {topArtists.map((artist, index) => (
                  <tr key={index} className={`border-b border-asra-gray-5 ${index % 2 === 0 ? 'bg-asra-gray-1' : 'bg-transparent'}`}>
                    <td className="text-white text-sm px-4 lg:px-6 py-3 lg:py-4 text-center">{artist.no}</td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4">
                      <div className="flex items-center gap-3">
                        {artist.image ? (
                          <img src={artist.image} alt={artist.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-asra-gray-2 flex items-center justify-center flex-shrink-0">
                            <UserIcon className="w-4 h-4 text-asra-gray-6" />
                          </div>
                        )}
                        <span className="text-white text-sm">{artist.name}</span>
                      </div>
                    </td>
                    <td className={`text-sm px-4 lg:px-6 py-3 lg:py-4 text-center ${artist.faded ? 'text-asra-gray-5' : 'text-white'}`}>
                      {artist.streams}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="overflow-x-auto">
          <h2 className="text-white text-xl lg:text-2xl font-bold mb-4 lg:mb-6">Top 10 titres</h2>
          <div className="rounded-lg bg-asra-gray-1 border border-asra-gray-5 shadow-[0_1px_3px_rgba(16,24,40,0.10),0_1px_2px_rgba(16,24,40,0.06)] min-w-[500px]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-asra-gray-5">
                  <th className="text-white text-xs font-bold tracking-[0.24px] leading-4 px-4 lg:px-6 py-3 text-center">N°</th>
                  <th className="text-white text-xs font-bold tracking-[0.24px] leading-4 px-4 lg:px-6 py-3 text-left">NOM DU TITRE</th>
                  <th className="text-white text-xs font-bold tracking-[0.24px] leading-4 px-4 lg:px-6 py-3 text-center">AUDITEURS MENSUELS</th>
                </tr>
              </thead>
              <tbody>
                {topSongs.map((song, index) => (
                  <tr key={index} className={`border-b border-asra-gray-5 ${index % 2 === 0 ? 'bg-asra-gray-1' : 'bg-transparent'}`}>
                    <td className="text-white text-sm px-4 lg:px-6 py-3 lg:py-4 text-center">{song.no}</td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4">
                      <div className="flex items-center gap-3">
                        {song.image ? (
                          <img src={song.image} alt={song.name} className="w-8 h-8 rounded object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-8 h-8 rounded bg-asra-gray-2 flex items-center justify-center flex-shrink-0">
                            <Music2 className="w-4 h-4 text-asra-gray-6" />
                          </div>
                        )}
                        <span className="text-white text-sm">{song.name}</span>
                      </div>
                    </td>
                    <td className="text-white text-sm px-4 lg:px-6 py-3 lg:py-4 text-center">{song.streams}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
