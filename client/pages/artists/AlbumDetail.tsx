import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Search, User, Play, Heart, Share, MoreHorizontal, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { artistService, type AdminAlbumDetailData } from '@/services/artistService';
import { useAuth } from '@/hooks/useAuth';
import { LanguageToggle } from '@/components/common/LanguageToggle';

const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const formatStatusLabel = (status: string, t: (key: string) => string): string => {
  const normalized = (status || '').toLowerCase();
  if (normalized === 'approved') return t('detail.statusPublished');
  if (normalized === 'pending') return t('detail.statusPending');
  if (normalized === 'rejected') return t('detail.statusRejected');
  return status || '—';
};

const statusBadgeClass = (status: string): string => {
  const normalized = (status || '').toLowerCase();
  if (normalized === 'approved' || normalized === 'published') {
    return 'bg-green-500/20 text-green-400';
  }
  if (normalized === 'pending') return 'bg-yellow-500/20 text-yellow-400';
  if (normalized === 'rejected') return 'bg-red-500/20 text-red-400';
  return 'bg-asra-gray-700 text-asra-gray-300';
};

const AlbumDetail = () => {
  const { t } = useTranslation('artists');
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const artistIdFromState = (location.state as { artistId?: string } | null)?.artistId;

  const [activeTab, setActiveTab] = useState<'songs' | 'details'>('songs');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [album, setAlbum] = useState<AdminAlbumDetailData | null>(null);

  useEffect(() => {
    const fetchAlbum = async () => {
      if (!id) {
        setError(t('albumDetail.errors.invalidId'));
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await artistService.getAlbumDetail(id);
        setAlbum(data);
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : t('albumDetail.errors.loadFailed');
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbum();
  }, [id, t]);

  const handleGoBack = () => {
    const artistId = artistIdFromState || album?.artist?._id;
    if (artistId) {
      navigate(`/artist-management/${artistId}`);
    } else {
      navigate('/artist-management');
    }
  };

  const releaseYear = album?.releaseDate ? new Date(album.releaseDate).getFullYear() : '—';
  const releaseDateFormatted = album?.releaseDate
    ? new Date(album.releaseDate).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '—';

  const totalDurationFormatted =
    album?.totalDurationFormatted ||
    formatDuration(album?.totalDuration ?? album?.songs?.reduce((sum, s) => sum + (s.duration || 0), 0) ?? 0);
  const songCount = album?.songCount ?? album?.songs?.length ?? 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-asra-dark flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-asra-red animate-spin" />
        <span className="ml-3 text-white">{t('detail.loading')}</span>
      </div>
    );
  }

  if (error || !album) {
    return (
      <div className="min-h-screen bg-asra-dark flex flex-col items-center justify-center gap-4 px-6">
        <button
          onClick={handleGoBack}
          className="flex items-center space-x-2 text-asra-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t('shared.back')}</span>
        </button>
        <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded max-w-lg text-center">
          {error || t('albumDetail.errors.notFound')}
        </div>
      </div>
    );
  }

  const artistName = album.artist?.stageName || t('albumDetail.unknownArtist');
  const artistAvatar = album.artist?.profilePicture || album.coverPhotoUrl;

  return (
    <div className="min-h-screen bg-asra-dark">
      <div className="bg-gradient-to-b from-purple-900/50 to-black px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={handleGoBack}
            className="flex items-center space-x-2 text-asra-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{t('shared.back')}</span>
          </button>

          <div className="relative flex-1 max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-asra-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={t('shared.searchPlaceholder')}
              className="bg-asra-gray-2 text-white pl-10 pr-4 py-2 rounded-lg border border-asra-gray-5 focus:outline-none focus:border-asra-red w-full"
            />
          </div>

          <div className="flex items-center space-x-2">
            <LanguageToggle />
            <div
              onClick={() => navigate('/settings')}
              className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 bg-asra-red rounded-full flex items-center justify-center relative">
                <User className="w-4 h-4 text-white" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-asra-dark" />
              </div>
              <span className="text-white text-sm hidden sm:inline">
                {user?.name || t('shared.defaultAdminName')}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-b from-purple-900/30 to-black px-6 py-8">
        <div className="flex items-start space-x-8 flex-wrap gap-6">
          <div className="flex-shrink-0">
            <img
              src={album.coverPhotoUrl}
              alt={album.title}
              className="w-64 h-64 object-cover rounded-lg shadow-2xl"
            />
          </div>

          <div className="flex-1 min-w-[280px]">
            <h1 className="text-5xl font-bold text-white mb-2">{album.title}</h1>
            <div className="flex items-center space-x-3 mb-4">
              {artistAvatar ? (
                <img src={artistAvatar} alt={artistName} className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-asra-gray-700" />
              )}
              <button
                type="button"
                onClick={() => album.artist?._id && navigate(`/artist-management/${album.artist._id}`)}
                className="text-white text-xl hover:underline"
              >
                {artistName}
              </button>
            </div>
            <div className="text-asra-gray-300 text-lg mb-6">
              {t('detail.album')} • {releaseYear}
            </div>

            <div className="flex items-center space-x-6 text-white text-sm mb-8 flex-wrap gap-y-2">
              <span className={`text-xs px-2 py-1 rounded ${statusBadgeClass(album.status)}`}>
                {formatStatusLabel(album.status, t)}
              </span>
              <div className="w-1 h-1 bg-asra-gray-400 rounded-full hidden sm:block" />
              <span>
                {t('albumDetail.songsAndDuration', { count: songCount, duration: totalDurationFormatted })}
              </span>
              {album.genre && (
                <>
                  <div className="w-1 h-1 bg-asra-gray-400 rounded-full hidden sm:block" />
                  <span className="text-asra-gray-300">{album.genre}</span>
                </>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <button
                type="button"
                className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
                aria-label={t('albumDetail.playAlbum')}
              >
                <Play className="w-6 h-6 text-white ml-1" />
              </button>
              <button
                type="button"
                className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center space-x-2"
              >
                <MoreHorizontal className="w-5 h-5" />
                <span>{t('albumDetail.more')}</span>
              </button>
              <button type="button" className="text-asra-gray-400 hover:text-white transition-colors" aria-label="Like">
                <Heart className="w-6 h-6" />
              </button>
              <button type="button" className="text-asra-gray-400 hover:text-white transition-colors" aria-label="Share">
                <Share className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 border-b border-asra-gray-700">
        <div className="flex space-x-8">
          <button
            type="button"
            onClick={() => setActiveTab('songs')}
            className={`pb-3 text-lg font-medium border-b-2 transition-colors ${
              activeTab === 'songs'
                ? 'text-white border-white'
                : 'text-asra-gray-400 border-transparent hover:text-white'
            }`}
          >
            {t('albumDetail.tabs.songs')}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('details')}
            className={`pb-3 text-lg font-medium border-b-2 transition-colors ${
              activeTab === 'details'
                ? 'text-white border-white'
                : 'text-asra-gray-400 border-transparent hover:text-white'
            }`}
          >
            {t('albumDetail.tabs.details')}
          </button>
        </div>
      </div>

      {activeTab === 'songs' && (
        <div className="px-6 py-6">
          <div className="bg-black/50 backdrop-blur-sm rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-asra-gray-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                      {t('albumDetail.table.number')}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                      {t('albumDetail.table.title')}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                      {t('albumDetail.table.artist')}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                      {t('albumDetail.table.duration')}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                      {t('albumDetail.table.dateAdded')}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                      {t('albumDetail.table.status')}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                      {t('albumDetail.table.plays')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-asra-gray-800">
                  {album.songs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-asra-gray-400">
                        {t('albumDetail.noTracks')}
                      </td>
                    </tr>
                  ) : (
                    album.songs.map((song, index) => (
                      <tr key={song._id} className="hover:bg-asra-gray-800/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-asra-gray-300">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <img
                              src={song.coverPhotoUrl || album.coverPhotoUrl}
                              alt={song.title}
                              className="w-10 h-10 rounded object-cover"
                            />
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-white">{song.title}</span>
                              {song.songUrlPresigned && (
                                <a
                                  href={song.songUrlPresigned}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-asra-gray-400 hover:text-white transition-colors"
                                  aria-label={`Play ${song.title}`}
                                >
                                  <Play className="w-4 h-4" />
                                </a>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-asra-gray-300">{artistName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-asra-gray-300">
                          {song.durationFormatted || formatDuration(song.duration || 0)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-asra-gray-300">
                          {song.createdAt ? new Date(song.createdAt).toLocaleDateString() : '—'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-xs px-2 py-1 rounded ${statusBadgeClass(song.status)}`}>
                            {formatStatusLabel(song.status, t)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-asra-gray-300">
                          {(song.streams ?? 0).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'details' && (
        <div className="px-6 py-6">
          <div className="bg-asra-gray-900 rounded-lg p-8 max-w-3xl">
            <h3 className="text-xl font-bold text-white mb-6">{t('albumDetail.details.title')}</h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div>
                <dt className="text-asra-gray-400 mb-1">{t('albumDetail.details.releaseDate')}</dt>
                <dd className="text-white">{releaseDateFormatted}</dd>
              </div>
              <div>
                <dt className="text-asra-gray-400 mb-1">{t('albumDetail.details.genre')}</dt>
                <dd className="text-white">{album.genre || '—'}</dd>
              </div>
              <div>
                <dt className="text-asra-gray-400 mb-1">{t('albumDetail.details.uploaded')}</dt>
                <dd className="text-white">
                  {album.createdAt ? new Date(album.createdAt).toLocaleString() : '—'}
                </dd>
              </div>
              <div>
                <dt className="text-asra-gray-400 mb-1">{t('albumDetail.details.moderationStatus')}</dt>
                <dd className="text-white">{formatStatusLabel(album.status, t)}</dd>
              </div>
            </dl>
            {album.caption && (
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-white mb-2">{t('albumDetail.details.caption')}</h4>
                <p className="text-asra-gray-300 whitespace-pre-line">{album.caption}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AlbumDetail;
