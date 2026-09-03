import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, User, ChevronLeft, ChevronRight, Loader2, Ban, RotateCcw, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { artistService, type ArtistItem } from '@/services/artistService';
import { useAuth } from '@/hooks/useAuth';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type ArtistStatusFilter = 'active' | 'deactivated';
type ArtistAction = 'deactivate' | 'reactivate' | 'delete';

// API-backed state for artists

// Utilisateurs (à connecter au service backend)
const mockUsers: {
  id: string;
  name: string;
  age: number;
  playlistsCreated: number;
  songsLiked: number;
}[] = [];

const ArtistManagement = () => {
  const { t } = useTranslation('artists');
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'artists' | 'users'>('artists');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState<'createdAt' | 'stageName' | 'followers' | 'monthlyListeners' | 'songCount'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [statusFilter, setStatusFilter] = useState<ArtistStatusFilter>('active');
  const [artists, setArtists] = useState<ArtistItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debounceId, setDebounceId] = useState<number | undefined>(undefined);
  const [actionTarget, setActionTarget] = useState<{ artist: ArtistItem; action: ArtistAction } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const navigate = useNavigate();

  const handleArtistClick = (artistId: string) => {
    navigate(`/artist-management/${artistId}`);
  };

  const handleUserClick = (userId: string) => {
    navigate(`/user-management/${userId}`);
  };

  const loadArtists = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await artistService.listArtists({
        search: searchQuery || undefined,
        page: currentPage,
        limit,
        sortBy,
        sortOrder,
        status: statusFilter,
      });
      setArtists(res.data);
      setTotalPages(res.totalPages);
      setTotalResults(res.totalResults);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : t('management.errors.loadFailed'));
    } finally {
      setLoading(false);
    }
  }, [searchQuery, currentPage, limit, sortBy, sortOrder, statusFilter]);

  // Fetch artists
  useEffect(() => {
    if (debounceId) window.clearTimeout(debounceId);
    const id = window.setTimeout(loadArtists, searchQuery ? 500 : 0);
    setDebounceId(id);
    return () => window.clearTimeout(id);
  }, [loadArtists, searchQuery]);

  const handleArtistAction = async () => {
    if (!actionTarget) return;
    const { artist, action } = actionTarget;
    setActionLoading(true);
    try {
      if (action === 'deactivate') {
        const res = await artistService.deactivateArtist(artist._id);
        toast.success(res.message || t('management.toasts.deactivated', { name: artist.stageName }));
      } else if (action === 'reactivate') {
        const res = await artistService.reactivateArtist(artist._id);
        toast.success(res.message || t('management.toasts.reactivated', { name: artist.stageName }));
      } else {
        const res = await artistService.deleteArtist(artist._id);
        toast.success(res.message || t('management.toasts.deleted', { name: artist.stageName }));
      }
      setActionTarget(null);
      await loadArtists();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : t('management.errors.actionFailed'));
    } finally {
      setActionLoading(false);
    }
  };

  const isArtistDeactivated = (artist: ArtistItem) =>
    artist.isDeleted === true || artist.isActive === false;

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-asra-dark">
      {/* Header */}
      <div className="bg-asra-dark border-b border-asra-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and Date */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-asra-red rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-white text-xl font-bold">Asrapa</span>
            </div>
            <div className="flex items-center space-x-2 text-asra-gray-400">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">03/02/2023</span>
            </div>
          </div>

          {/* Center - Title */}
          <div className="flex-1 flex justify-center">
            <h1 className="text-2xl font-bold text-white">{t('management.title')}</h1>
          </div>

          {/* Right side - Search and Profile */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-asra-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={t('shared.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-asra-gray-800 text-white pl-10 pr-4 py-2 rounded-lg border border-asra-gray-700 focus:outline-none focus:border-asra-red w-64"
              />
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-asra-red rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-white text-sm">{user?.name || t('shared.defaultAdminName')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Tabs */}
        <div className="flex space-x-8 mb-6">
          <button
            onClick={() => setActiveTab('artists')}
            className={`pb-2 text-lg font-medium border-b-2 transition-colors ${
              activeTab === 'artists'
                ? 'text-asra-red border-asra-red'
                : 'text-asra-gray-400 border-transparent hover:text-white'
            }`}
          >
            {t('management.tabs.artists')}
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-2 text-lg font-medium border-b-2 transition-colors ${
              activeTab === 'users'
                ? 'text-asra-red border-asra-red'
                : 'text-asra-gray-400 border-transparent hover:text-white'
            }`}
          >
            {t('management.tabs.users')}
          </button>
        </div>

        {/* Filters per swagger: search, sortBy, sortOrder, limit */}
        {activeTab === 'artists' && (
          <div className="mb-4 flex flex-wrap gap-3 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-asra-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={t('management.filters.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => { setCurrentPage(1); setSearchQuery(e.target.value); }}
                className="bg-asra-gray-800 text-white pl-10 pr-4 py-2 rounded-lg border border-asra-gray-700 focus:outline-none focus:border-asra-red w-72"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => { setCurrentPage(1); setStatusFilter(e.target.value as ArtistStatusFilter); }}
              className="bg-asra-gray-2 text-white px-3 py-2 rounded-lg border border-asra-gray-5 focus:outline-none"
            >
              <option value="active">{t('management.filters.statusActive')}</option>
              <option value="deactivated">{t('management.filters.statusDeactivated')}</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => { setCurrentPage(1); setSortBy(e.target.value as typeof sortBy); }}
              className="bg-asra-gray-2 text-white px-3 py-2 rounded-lg border border-asra-gray-5 focus:outline-none"
            >
              <option value="createdAt">{t('management.filters.sortCreatedAt')}</option>
              <option value="stageName">{t('management.filters.sortStageName')}</option>
              <option value="followers">{t('management.filters.sortFollowers')}</option>
              <option value="monthlyListeners">{t('management.filters.sortMonthlyListeners')}</option>
              <option value="songCount">{t('management.filters.sortSongCount')}</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => { setCurrentPage(1); setSortOrder(e.target.value as 'asc' | 'desc'); }}
              className="bg-asra-gray-2 text-white px-3 py-2 rounded-lg border border-asra-gray-5 focus:outline-none"
            >
              <option value="desc">{t('management.filters.orderDesc')}</option>
              <option value="asc">{t('management.filters.orderAsc')}</option>
            </select>
            <select
              value={limit}
              onChange={(e) => { setCurrentPage(1); setLimit(parseInt(e.target.value, 10)); }}
              className="bg-asra-gray-2 text-white px-3 py-2 rounded-lg border border-asra-gray-5 focus:outline-none"
            >
              <option value={10}>{t('management.filters.limit10')}</option>
              <option value={20}>{t('management.filters.limit20')}</option>
              <option value={50}>{t('management.filters.limit50')}</option>
            </select>
            {loading && (
              <span className="inline-flex items-center text-asra-gray-400 text-sm">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> {t('management.filters.loading')}
              </span>
            )}
            {error && (
              <span className="text-red-400 text-sm">{error}</span>
            )}
            {!loading && !error && (
              <span className="text-asra-gray-400 text-sm">{t('management.filters.resultsCount', { count: totalResults.toLocaleString() })}</span>
            )}
          </div>
        )}

        {/* Table */}
        <div className="bg-asra-gray-900 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-asra-gray-800">
                <tr>
                  {activeTab === 'artists' ? (
                    <>
                      <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                        {t('management.table.artistId')}
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                        {t('management.table.artistName')}
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                        {t('management.table.status')}
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                        {t('management.table.followers')}
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                        {t('management.table.monthlyListeners')}
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                        {t('management.table.songCount')}
                      </th>
                    </>
                  ) : (
                    <>
                      <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                        {t('management.table.userId')}
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                        {t('management.table.userName')}
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                        {t('management.table.age')}
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                        {t('management.table.playlistsCreated')}
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                        {t('management.table.songsLiked')}
                      </th>
                    </>
                  )}
                  <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider whitespace-nowrap sticky right-0 bg-asra-gray-800">
                    {t('management.table.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-asra-gray-800">
                {activeTab === 'artists' ? (
                  artists.length === 0 && !loading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-asra-gray-400 text-sm">
                        {statusFilter === 'active' ? t('management.table.noArtistsActive') : t('management.table.noArtistsDeactivated')}
                      </td>
                    </tr>
                  ) : (
                  artists.map((artist) => {
                    const deactivated = isArtistDeactivated(artist);
                    return (
                    <tr key={artist._id} className="group hover:bg-asra-gray-800 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-asra-gray-300">
                        {artist.artistId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          {artist.profilePicture ? (
                            <img
                              src={artist.profilePicture}
                              alt={artist.stageName}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-asra-gray-2 flex items-center justify-center">
                              <User className="w-5 h-5 text-asra-gray-6" />
                            </div>
                          )}
                          <div>
                            <span className="text-sm font-medium text-white block">{artist.stageName}</span>
                            <span className="text-xs text-asra-gray-6">{artist.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          deactivated
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-green-500/20 text-green-400'
                        }`}>
                          {deactivated ? t('management.table.statusDeactivated') : t('management.table.statusActive')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-asra-gray-300">
                        {formatNumber(artist.followers || 0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-asra-gray-300">
                        {formatNumber(artist.monthlyListeners || 0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-asra-gray-300">
                        {formatNumber(artist.songCount || 0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap sticky right-0 bg-asra-gray-900 group-hover:bg-asra-gray-800">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleArtistClick(artist._id)}
                            className="bg-asra-red text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                          >
                            {t('shared.view')}
                          </button>
                          {deactivated ? (
                            <button
                              onClick={() => setActionTarget({ artist, action: 'reactivate' })}
                              className="text-green-400 hover:text-green-300 p-1.5 rounded-lg hover:bg-asra-gray-2 transition-colors"
                              title={t('management.actions.reactivateTitle')}
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => setActionTarget({ artist, action: 'deactivate' })}
                              className="text-amber-400 hover:text-amber-300 p-1.5 rounded-lg hover:bg-asra-gray-2 transition-colors"
                              title={t('management.actions.deactivateTitle')}
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => setActionTarget({ artist, action: 'delete' })}
                            className="text-asra-gray-6 hover:text-red-400 p-1.5 rounded-lg hover:bg-asra-gray-2 transition-colors"
                            title={t('management.actions.deleteTitle')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );})
                  )
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-asra-gray-400 text-sm">
                      {t('management.table.noUsers')}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user, index) => (
                    <tr key={index} className="hover:bg-asra-gray-800 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-asra-gray-300">
                        {user.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-white">{user.name}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-asra-gray-300">
                        {user.age}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-asra-gray-300">
                        {user.playlistsCreated}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-asra-gray-300">
                        {formatNumber(user.songsLiked)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleUserClick(user.id)}
                          className="bg-asra-red text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                        >
                          {t('shared.view')}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="bg-asra-red text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{t('shared.previous')}</span>
            </button>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="bg-asra-red text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <span>{t('shared.next')}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="text-asra-gray-400 text-sm">
            {t('management.pagination.pageOf', { current: currentPage, total: totalPages })}
          </div>
        </div>
      </div>

      <AlertDialog open={!!actionTarget} onOpenChange={(open) => !open && !actionLoading && setActionTarget(null)}>
        <AlertDialogContent className="bg-asra-gray-1 border-asra-gray-2 text-white max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionTarget?.action === 'deactivate' && t('management.dialog.deactivateTitle')}
              {actionTarget?.action === 'reactivate' && t('management.dialog.reactivateTitle')}
              {actionTarget?.action === 'delete' && t('management.dialog.deleteTitle')}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-asra-gray-6 space-y-2">
              {actionTarget?.action === 'deactivate' && (
                <>
                  <span className="block">
                    {t('management.dialog.deactivateDescription', { name: actionTarget.artist.stageName })}
                  </span>
                </>
              )}
              {actionTarget?.action === 'reactivate' && (
                <span className="block">
                  {t('management.dialog.reactivateDescription', { name: actionTarget.artist.stageName })}
                </span>
              )}
              {actionTarget?.action === 'delete' && (
                <span className="block text-red-400">
                  {t('management.dialog.deleteDescription', { name: actionTarget.artist.stageName })}
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={actionLoading}
              className="bg-asra-gray-2 border-asra-gray-2 text-white hover:bg-asra-gray-800"
            >
              {t('management.dialog.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleArtistAction}
              disabled={actionLoading}
              className={
                actionTarget?.action === 'delete'
                  ? 'bg-red-600 hover:bg-red-700'
                  : actionTarget?.action === 'reactivate'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-amber-600 hover:bg-amber-700'
              }
            >
              {actionLoading ? t('management.dialog.processing') : (
                actionTarget?.action === 'deactivate' ? t('management.dialog.deactivate') :
                actionTarget?.action === 'reactivate' ? t('management.dialog.reactivate') :
                t('management.dialog.deletePermanently')
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ArtistManagement;
