import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, User, ChevronLeft, ChevronRight, Loader2, Ban, RotateCcw, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { artistService, type ArtistItem } from '@/services/artistService';
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

// Mock data for users
const mockUsers = [
  {
    id: '52166565161',
    name: 'Basheer',
    age: 20,
    playlistsCreated: 1,
    songsLiked: 914,
  },
  {
    id: '52166565161',
    name: 'Djerabe Ndigngar',
    age: 40,
    playlistsCreated: 0,
    songsLiked: 500,
  },
  {
    id: '52166565161',
    name: 'Ndigngar',
    age: 17,
    playlistsCreated: 2,
    songsLiked: 871,
  },
  {
    id: '52166565161',
    name: 'Danjuma',
    age: 20,
    playlistsCreated: 12,
    songsLiked: 900,
  },
  {
    id: '52166565161',
    name: 'John Doe',
    age: 34,
    playlistsCreated: 5,
    songsLiked: 40,
  },
  {
    id: '52166565161',
    name: 'Listener',
    age: 35,
    playlistsCreated: 1,
    songsLiked: 34,
  },
  {
    id: '52166565161',
    name: 'Sunday',
    age: 54,
    playlistsCreated: 0,
    songsLiked: 50,
  },
  {
    id: '52166565161',
    name: 'Sule Madu',
    age: 21,
    playlistsCreated: 5,
    songsLiked: 823,
  },
  {
    id: '52166565161',
    name: 'Gana Gana',
    age: 24,
    playlistsCreated: 0,
    songsLiked: 500,
  },
];

const ArtistManagement = () => {
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
      setError(e instanceof Error ? e.message : 'Failed to load artists');
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
        toast.success(res.message || `"${artist.stageName}" deactivated`);
      } else if (action === 'reactivate') {
        const res = await artistService.reactivateArtist(artist._id);
        toast.success(res.message || `"${artist.stageName}" reactivated`);
      } else {
        const res = await artistService.deleteArtist(artist._id);
        toast.success(res.message || `"${artist.stageName}" permanently deleted`);
      }
      setActionTarget(null);
      await loadArtists();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Action failed');
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
            <h1 className="text-2xl font-bold text-white">Artist/User Management</h1>
          </div>

          {/* Right side - Search and Profile */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-asra-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-asra-gray-800 text-white pl-10 pr-4 py-2 rounded-lg border border-asra-gray-700 focus:outline-none focus:border-asra-red w-64"
              />
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-asra-red rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-white text-sm">System Admin</span>
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
            Artists on Asrapa
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-2 text-lg font-medium border-b-2 transition-colors ${
              activeTab === 'users'
                ? 'text-asra-red border-asra-red'
                : 'text-asra-gray-400 border-transparent hover:text-white'
            }`}
          >
            Users on Asrapa
          </button>
        </div>

        {/* Filters per swagger: search, sortBy, sortOrder, limit */}
        {activeTab === 'artists' && (
          <div className="mb-4 flex flex-wrap gap-3 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-asra-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by artist name, stage name, or email"
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
              <option value="active">Active artists</option>
              <option value="deactivated">Deactivated artists</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => { setCurrentPage(1); setSortBy(e.target.value as typeof sortBy); }}
              className="bg-asra-gray-2 text-white px-3 py-2 rounded-lg border border-asra-gray-5 focus:outline-none"
            >
              <option value="createdAt">Sort by: Created At</option>
              <option value="stageName">Stage Name</option>
              <option value="followers">Followers</option>
              <option value="monthlyListeners">Monthly Listeners</option>
              <option value="songCount">Song Count</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => { setCurrentPage(1); setSortOrder(e.target.value as 'asc' | 'desc'); }}
              className="bg-asra-gray-2 text-white px-3 py-2 rounded-lg border border-asra-gray-5 focus:outline-none"
            >
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>
            <select
              value={limit}
              onChange={(e) => { setCurrentPage(1); setLimit(parseInt(e.target.value, 10)); }}
              className="bg-asra-gray-2 text-white px-3 py-2 rounded-lg border border-asra-gray-5 focus:outline-none"
            >
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>
            {loading && (
              <span className="inline-flex items-center text-asra-gray-400 text-sm">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Loading
              </span>
            )}
            {error && (
              <span className="text-red-400 text-sm">{error}</span>
            )}
            {!loading && !error && (
              <span className="text-asra-gray-400 text-sm">{totalResults.toLocaleString()} results</span>
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
                        Artist Id
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                        Name of Artist
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                        Followers
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                        Monthly Listeners
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                        No. of Songs on Asrapa
                      </th>
                    </>
                  ) : (
                    <>
                      <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                        User Id
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                        Name of User
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                        Age
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                        Playlist Created
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                        Songs Liked
                      </th>
                    </>
                  )}
                  <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider whitespace-nowrap sticky right-0 bg-asra-gray-800">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-asra-gray-800">
                {activeTab === 'artists' ? (
                  artists.length === 0 && !loading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-asra-gray-400 text-sm">
                        No {statusFilter === 'active' ? 'active' : 'deactivated'} artists found
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
                          {deactivated ? 'Deactivated' : 'Active'}
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
                            View
                          </button>
                          {deactivated ? (
                            <button
                              onClick={() => setActionTarget({ artist, action: 'reactivate' })}
                              className="text-green-400 hover:text-green-300 p-1.5 rounded-lg hover:bg-asra-gray-2 transition-colors"
                              title="Reactivate artist"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => setActionTarget({ artist, action: 'deactivate' })}
                              className="text-amber-400 hover:text-amber-300 p-1.5 rounded-lg hover:bg-asra-gray-2 transition-colors"
                              title="Deactivate artist"
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => setActionTarget({ artist, action: 'delete' })}
                            className="text-asra-gray-6 hover:text-red-400 p-1.5 rounded-lg hover:bg-asra-gray-2 transition-colors"
                            title="Permanently delete artist"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );})
                  )
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
                          View
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
              <span>Previous</span>
            </button>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="bg-asra-red text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="text-asra-gray-400 text-sm">
            Page {currentPage} of {totalPages}
          </div>
        </div>
      </div>

      <AlertDialog open={!!actionTarget} onOpenChange={(open) => !open && !actionLoading && setActionTarget(null)}>
        <AlertDialogContent className="bg-asra-gray-1 border-asra-gray-2 text-white max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionTarget?.action === 'deactivate' && 'Deactivate artist?'}
              {actionTarget?.action === 'reactivate' && 'Reactivate artist?'}
              {actionTarget?.action === 'delete' && 'Permanently delete artist?'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-asra-gray-6 space-y-2">
              {actionTarget?.action === 'deactivate' && (
                <>
                  <span className="block">
                    &quot;{actionTarget.artist.stageName}&quot; will be soft-deleted: catalog hidden, login blocked,
                    songs removed from playlists, and subscriptions canceled. You can reactivate later.
                  </span>
                </>
              )}
              {actionTarget?.action === 'reactivate' && (
                <span className="block">
                  &quot;{actionTarget.artist.stageName}&quot; will be restored with their songs and albums.
                </span>
              )}
              {actionTarget?.action === 'delete' && (
                <span className="block text-red-400">
                  &quot;{actionTarget.artist.stageName}&quot; and all catalog data will be permanently removed.
                  This cannot be undone.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={actionLoading}
              className="bg-asra-gray-2 border-asra-gray-2 text-white hover:bg-asra-gray-800"
            >
              Cancel
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
              {actionLoading ? 'Processing...' : (
                actionTarget?.action === 'deactivate' ? 'Deactivate' :
                actionTarget?.action === 'reactivate' ? 'Reactivate' :
                'Delete permanently'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ArtistManagement;
