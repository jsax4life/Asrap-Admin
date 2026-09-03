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

// Utilisateurs (à connecter au service backend)
const mockUsers: {
  id: string;
  name: string;
  age: number;
  playlistsCreated: number;
  songsLiked: number;
}[] = [];

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
      setError(e instanceof Error ? e.message : 'Échec du chargement des artistes');
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
        toast.success(res.message || `"${artist.stageName}" désactivé`);
      } else if (action === 'reactivate') {
        const res = await artistService.reactivateArtist(artist._id);
        toast.success(res.message || `"${artist.stageName}" réactivé`);
      } else {
        const res = await artistService.deleteArtist(artist._id);
        toast.success(res.message || `"${artist.stageName}" supprimé définitivement`);
      }
      setActionTarget(null);
      await loadArtists();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Échec de l\'action');
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
            <h1 className="text-2xl font-bold text-white">Gestion des artistes/utilisateurs</h1>
          </div>

          {/* Right side - Search and Profile */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-asra-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-asra-gray-800 text-white pl-10 pr-4 py-2 rounded-lg border border-asra-gray-700 focus:outline-none focus:border-asra-red w-64"
              />
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-asra-red rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-white text-sm">Administrateur système</span>
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
            Artistes sur Asrapa
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-2 text-lg font-medium border-b-2 transition-colors ${
              activeTab === 'users'
                ? 'text-asra-red border-asra-red'
                : 'text-asra-gray-400 border-transparent hover:text-white'
            }`}
          >
            Utilisateurs sur Asrapa
          </button>
        </div>

        {/* Filters per swagger: search, sortBy, sortOrder, limit */}
        {activeTab === 'artists' && (
          <div className="mb-4 flex flex-wrap gap-3 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-asra-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher par nom d'artiste, nom de scène ou e-mail"
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
              <option value="active">Artistes actifs</option>
              <option value="deactivated">Artistes désactivés</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => { setCurrentPage(1); setSortBy(e.target.value as typeof sortBy); }}
              className="bg-asra-gray-2 text-white px-3 py-2 rounded-lg border border-asra-gray-5 focus:outline-none"
            >
              <option value="createdAt">Trier par : Date de création</option>
              <option value="stageName">Nom de scène</option>
              <option value="followers">Abonnés</option>
              <option value="monthlyListeners">Auditeurs mensuels</option>
              <option value="songCount">Nombre de titres</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => { setCurrentPage(1); setSortOrder(e.target.value as 'asc' | 'desc'); }}
              className="bg-asra-gray-2 text-white px-3 py-2 rounded-lg border border-asra-gray-5 focus:outline-none"
            >
              <option value="desc">Décroissant</option>
              <option value="asc">Croissant</option>
            </select>
            <select
              value={limit}
              onChange={(e) => { setCurrentPage(1); setLimit(parseInt(e.target.value, 10)); }}
              className="bg-asra-gray-2 text-white px-3 py-2 rounded-lg border border-asra-gray-5 focus:outline-none"
            >
              <option value={10}>10 par page</option>
              <option value={20}>20 par page</option>
              <option value={50}>50 par page</option>
            </select>
            {loading && (
              <span className="inline-flex items-center text-asra-gray-400 text-sm">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Chargement
              </span>
            )}
            {error && (
              <span className="text-red-400 text-sm">{error}</span>
            )}
            {!loading && !error && (
              <span className="text-asra-gray-400 text-sm">{totalResults.toLocaleString()} résultats</span>
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
                        Id Artiste
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                        Nom de l'artiste
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                        Abonnés
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                        Auditeurs mensuels
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                        Nb. de titres sur Asrapa
                      </th>
                    </>
                  ) : (
                    <>
                      <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                        Id Utilisateur
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                        Nom de l'utilisateur
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                        Âge
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                        Playlist créée
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                        Titres aimés
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
                        Aucun artiste {statusFilter === 'active' ? 'actif' : 'désactivé'} trouvé
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
                          {deactivated ? 'Désactivé' : 'Actif'}
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
                            Voir
                          </button>
                          {deactivated ? (
                            <button
                              onClick={() => setActionTarget({ artist, action: 'reactivate' })}
                              className="text-green-400 hover:text-green-300 p-1.5 rounded-lg hover:bg-asra-gray-2 transition-colors"
                              title="Réactiver l'artiste"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => setActionTarget({ artist, action: 'deactivate' })}
                              className="text-amber-400 hover:text-amber-300 p-1.5 rounded-lg hover:bg-asra-gray-2 transition-colors"
                              title="Désactiver l'artiste"
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => setActionTarget({ artist, action: 'delete' })}
                            className="text-asra-gray-6 hover:text-red-400 p-1.5 rounded-lg hover:bg-asra-gray-2 transition-colors"
                            title="Supprimer définitivement l'artiste"
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
                      Aucun utilisateur trouvé
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
                          Voir
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
              <span>Précédent</span>
            </button>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="bg-asra-red text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <span>Suivant</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="text-asra-gray-400 text-sm">
            Page {currentPage} sur {totalPages}
          </div>
        </div>
      </div>

      <AlertDialog open={!!actionTarget} onOpenChange={(open) => !open && !actionLoading && setActionTarget(null)}>
        <AlertDialogContent className="bg-asra-gray-1 border-asra-gray-2 text-white max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionTarget?.action === 'deactivate' && 'Désactiver l\'artiste ?'}
              {actionTarget?.action === 'reactivate' && 'Réactiver l\'artiste ?'}
              {actionTarget?.action === 'delete' && 'Supprimer définitivement l\'artiste ?'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-asra-gray-6 space-y-2">
              {actionTarget?.action === 'deactivate' && (
                <>
                  <span className="block">
                    &quot;{actionTarget.artist.stageName}&quot; sera désactivé : catalogue masqué, connexion bloquée,
                    titres retirés des playlists, et abonnements annulés. Vous pourrez le réactiver plus tard.
                  </span>
                </>
              )}
              {actionTarget?.action === 'reactivate' && (
                <span className="block">
                  &quot;{actionTarget.artist.stageName}&quot; sera restauré avec ses titres et albums.
                </span>
              )}
              {actionTarget?.action === 'delete' && (
                <span className="block text-red-400">
                  &quot;{actionTarget.artist.stageName}&quot; et toutes les données du catalogue seront supprimés définitivement.
                  Cette action est irréversible.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={actionLoading}
              className="bg-asra-gray-2 border-asra-gray-2 text-white hover:bg-asra-gray-800"
            >
              Annuler
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
              {actionLoading ? 'Traitement...' : (
                actionTarget?.action === 'deactivate' ? 'Désactiver' :
                actionTarget?.action === 'reactivate' ? 'Réactiver' :
                'Supprimer définitivement'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ArtistManagement;
