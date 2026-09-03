import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Calendar, User, Edit3, Loader2 } from 'lucide-react';
import { artistService, type ArtistDetailData } from '@/services/artistService';

import { useAuth } from '@/hooks/useAuth';
const ArtistDetail = () => {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'about' | 'albums' | 'videos' | 'tagged'>('about');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [artist, setArtist] = useState<ArtistDetailData | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const res = await artistService.getArtistDetail(id);
        setArtist(res.data);
      } catch (e: any) {
        setError(e.message || 'Échec du chargement de l\'artiste');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleGoBack = () => {
    navigate('/artist-management');
  };

  const handleAlbumClick = (albumId: string) => {
    navigate(`/album/${albumId}`);
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-asra-dark flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-asra-red animate-spin" />
        <span className="ml-3 text-white">Chargement de l'artiste...</span>
      </div>
    );
  }

  if (error || !artist) {
    return (
      <div className="min-h-screen bg-asra-dark flex items-center justify-center">
        <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded">{error || 'Artiste introuvable'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-asra-dark">
      {/* Header */}
      <div className="bg-asra-dark border-b border-asra-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Back button */}
          <div className="flex items-center space-x-6">
            <button
              onClick={handleGoBack}
              className="flex items-center space-x-2 text-asra-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Retour</span>
            </button>
          </div>

          {/* Right side - Search and Profile */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-asra-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher"
                className="bg-asra-gray-800 text-white pl-10 pr-4 py-2 rounded-lg border border-asra-gray-700 focus:outline-none focus:border-asra-red w-64"
              />
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-asra-red rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-white text-sm">{user?.name || 'Administrateur système'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Artist Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">{artist.stageName}</h1>
          {false && (
            <div className="inline-flex items-center space-x-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-6">
              <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                <span className="text-green-500 text-xs">✓</span>
              </div>
              <span>Artiste vérifié</span>
            </div>
          )}
          
          {/* Artist Avatar with Green Glow */}
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-green-500 rounded-full blur-lg opacity-30 scale-110"></div>
            {artist.profilePicture ? (
              <img
                src={artist.profilePicture}
                alt={artist.stageName}
                className="relative w-48 h-48 rounded-full object-cover border-4 border-green-500"
              />
            ) : (
              <div className="relative w-48 h-48 rounded-full bg-asra-gray-800 border-4 border-green-500 flex items-center justify-center">
                <User className="w-20 h-20 text-asra-gray-6" />
              </div>
            )}
          </div>

          {/* Stats Bar */}
          <div className="flex items-center justify-center space-x-6 text-white text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-asra-red rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">S</span>
              </div>
              <span>{formatNumber(artist.statistics.monthlyListeners || 0)} auditeurs mensuels</span>
            </div>
            <div className="w-1 h-1 bg-asra-gray-400 rounded-full"></div>
            <div className="flex items-center space-x-2">
              <span>{formatNumber(artist.statistics.likes || 0)} mentions J'aime</span>
            </div>
            <div className="w-1 h-1 bg-asra-gray-400 rounded-full"></div>
            <div className="flex items-center space-x-2">
              <span>{artist.statistics.songs} titres, {artist.statistics.totalDurationFormatted}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-8 mb-8 border-b border-asra-gray-700">
          <button
            onClick={() => setActiveTab('about')}
            className={`pb-3 text-lg font-medium border-b-2 transition-colors ${
              activeTab === 'about'
                ? 'text-asra-red border-asra-red'
                : 'text-asra-gray-400 border-transparent hover:text-white'
            }`}
          >
            À propos
          </button>
          <button
            onClick={() => setActiveTab('albums')}
            className={`pb-3 text-lg font-medium border-b-2 transition-colors ${
              activeTab === 'albums'
                ? 'text-asra-red border-asra-red'
                : 'text-asra-gray-400 border-transparent hover:text-white'
            }`}
          >
            Albums, EPs et titres téléversés
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`pb-3 text-lg font-medium border-b-2 transition-colors ${
              activeTab === 'videos'
                ? 'text-asra-red border-asra-red'
                : 'text-asra-gray-400 border-transparent hover:text-white'
            }`}
          >
            Vidéos
          </button>
          <button
            onClick={() => setActiveTab('tagged')}
            className={`pb-3 text-lg font-medium border-b-2 transition-colors ${
              activeTab === 'tagged'
                ? 'text-asra-red border-asra-red'
                : 'text-asra-gray-400 border-transparent hover:text-white'
            }`}
          >
            Mentions
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'about' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-asra-gray-900 rounded-lg p-8">
              <h3 className="text-xl font-bold text-white mb-6">Biographie</h3>
              <div className="text-asra-gray-300 leading-relaxed mb-8 whitespace-pre-line">
                {artist.bio || 'Aucune biographie fournie.'}
              </div>

              {/* Key Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Date de naissance</h4>
                  <p className="text-asra-gray-300">—</p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Ville d'origine</h4>
                  <p className="text-asra-gray-300">{artist.hometown || '—'}</p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Genre</h4>
                  <p className="text-asra-gray-300">{artist.genre || '—'}</p>
                </div>
              </div>

              {/* Edit Bio Button */}
              <button className="bg-asra-red text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center space-x-2">
                <Edit3 className="w-5 h-5" />
                <span>Modifier la biographie</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'albums' && (
          <div className="max-w-7xl mx-auto">
            {/* Albums Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-white mb-6">Albums</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {artist.albumsAndEPs.items.map((album) => (
                  <div 
                    key={album._id} 
                    className="bg-asra-gray-900 rounded-lg p-4 hover:bg-asra-gray-800 transition-colors cursor-pointer"
                    onClick={() => handleAlbumClick(album._id)}
                  >
                    <div className="aspect-square mb-4">
                      <img
                        src={album.coverPhotoUrl}
                        alt={album.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-lg font-semibold text-white truncate">{album.title}</h4>
                      <div className="flex items-center justify-between text-sm text-asra-gray-400">
                        <span>{album.year}</span>
                        <span className="bg-asra-red text-white px-2 py-1 rounded text-xs">{album.type}</span>
                      </div>
                      <div className="text-sm text-asra-gray-300">
                        {album.songCount} titres • {album.durationFormatted}
                      </div>
                      <div className="text-sm text-asra-gray-400">
                        {formatNumber(album.plays)} écoutes
                      </div>
                      <div className="flex items-center justify-between">
                        <button
                          className="text-asra-red hover:text-red-400 text-sm font-medium"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAlbumClick(album._id);
                          }}
                        >
                          Voir les détails
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Songs Section */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Titres</h3>
              <div className="bg-asra-gray-900 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-asra-gray-800">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                          #
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                          Titre
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                          Album
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                          Année
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                          Durée
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                          Écoutes
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                          Genre
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                          Téléversé
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-asra-gray-800">
                      {artist.songs.items.map((song, index) => (
                        <tr key={song._id} className="hover:bg-asra-gray-800 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-asra-gray-300">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-white">{song.title}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-asra-gray-300">
                            {song.album}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-asra-gray-300">
                            {song.year}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-asra-gray-300">
                            {song.durationFormatted}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {(() => {
                              const status = (song.status || '').toLowerCase();
                              const classes =
                                status === 'approved' || status === 'published'
                                  ? 'bg-green-500/20 text-green-400'
                                  : status === 'rejected'
                                  ? 'bg-red-500/20 text-red-400'
                                  : 'bg-yellow-500/20 text-yellow-400'; // pending/others
                              return (
                                <span className={`text-xs px-2 py-1 rounded ${classes}`}>
                                  {song.status}
                                </span>
                              );
                            })()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-asra-gray-300">
                            {formatNumber(song.plays)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-asra-gray-300">
                            —
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-asra-gray-300">
                            {new Date(song.uploadedAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button className="text-asra-red hover:text-red-400 text-sm font-medium">
                              Voir
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'videos' && (
          <div className="max-w-7xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-6">Vidéos</h3>
            <div className="bg-asra-gray-900 rounded-lg p-8">
              <p className="text-asra-gray-400">Contenu à venir...</p>
            </div>
          </div>
        )}

        {activeTab === 'tagged' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-asra-gray-900 rounded-lg p-8">
              <h3 className="text-xl font-bold text-white mb-6">Mentions</h3>
              <p className="text-asra-gray-400">Contenu à venir...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtistDetail;
