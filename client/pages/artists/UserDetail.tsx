import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Calendar, User, Edit3, Play, Heart, Share, MoreHorizontal } from 'lucide-react';

import { useAuth } from '@/hooks/useAuth';
// Mock data for user detail
const mockUserDetail = {
  id: '52166565161',
  name: 'Basheer',
  age: 20,
  email: 'basheer@example.com',
  joinDate: '2023-01-15',
  lastActive: '2024-01-10',
  avatar: 'https://api.builder.io/api/v1/image/assets/TEMP/77784d2e1616758f6b0d5b70a64186f75a3b7ce5?width=200',
  playlistsCreated: 0,
  songsLiked: 0,
  totalPlayTime: '0 heure',
  favoriteGenres: ['Afrobeats', 'Hip-Hop', 'R&B'],
  recentActivity: [] as {
    id: string;
    type: string;
    description: string;
    date: string;
  }[],
  playlists: [] as {
    id: string;
    title: string;
    songCount: number;
    duration: string;
    createdAt: string;
  }[],
  likedSongs: [] as {
    id: string;
    title: string;
    artist: string;
    album: string;
    duration: string;
    likedDate: string;
  }[],
};

const UserDetail = () => {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'playlists' | 'activity'>('overview');

  const handleGoBack = () => {
    navigate('/artist-management');
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

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
        {/* User Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-6">
            <img
              src={mockUserDetail.avatar}
              alt={mockUserDetail.name}
              className="w-32 h-32 rounded-full object-cover border-4 border-asra-gray-700"
            />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">{mockUserDetail.name}</h1>
          <div className="text-asra-gray-300 text-lg mb-6">
            Âge : {mockUserDetail.age} • Membre depuis {new Date(mockUserDetail.joinDate).toLocaleDateString()}
          </div>

          {/* Stats Bar */}
          <div className="flex items-center justify-center space-x-6 text-white text-sm mb-8">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-asra-red rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">S</span>
              </div>
              <span>{formatNumber(mockUserDetail.songsLiked)} titres aimés</span>
            </div>
            <div className="w-1 h-1 bg-asra-gray-400 rounded-full"></div>
            <div className="flex items-center space-x-2">
              <span>{mockUserDetail.playlistsCreated} playlists créées</span>
            </div>
            <div className="w-1 h-1 bg-asra-gray-400 rounded-full"></div>
            <div className="flex items-center space-x-2">
              <span>{mockUserDetail.totalPlayTime} de temps d'écoute total</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-8 mb-8 border-b border-asra-gray-700">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 text-lg font-medium border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'text-asra-red border-asra-red'
                : 'text-asra-gray-400 border-transparent hover:text-white'
            }`}
          >
            Aperçu
          </button>
          <button
            onClick={() => setActiveTab('playlists')}
            className={`pb-3 text-lg font-medium border-b-2 transition-colors ${
              activeTab === 'playlists'
                ? 'text-asra-red border-asra-red'
                : 'text-asra-gray-400 border-transparent hover:text-white'
            }`}
          >
            Playlists
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`pb-3 text-lg font-medium border-b-2 transition-colors ${
              activeTab === 'activity'
                ? 'text-asra-red border-asra-red'
                : 'text-asra-gray-400 border-transparent hover:text-white'
            }`}
          >
            Activité récente
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* User Info */}
              <div className="bg-asra-gray-900 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-6">Informations sur l'utilisateur</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">E-mail</h4>
                    <p className="text-asra-gray-300">{mockUserDetail.email}</p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Date d'inscription</h4>
                    <p className="text-asra-gray-300">{new Date(mockUserDetail.joinDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Dernière activité</h4>
                    <p className="text-asra-gray-300">{new Date(mockUserDetail.lastActive).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Genres préférés</h4>
                    <div className="flex flex-wrap gap-2">
                      {mockUserDetail.favoriteGenres.map((genre, index) => (
                        <span key={index} className="bg-asra-red text-white px-3 py-1 rounded-full text-sm">
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="bg-asra-gray-900 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-6">Statistiques</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-asra-gray-300">Titres aimés</span>
                    <span className="text-white font-semibold">{formatNumber(mockUserDetail.songsLiked)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-asra-gray-300">Playlists créées</span>
                    <span className="text-white font-semibold">{mockUserDetail.playlistsCreated}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-asra-gray-300">Temps d'écoute total</span>
                    <span className="text-white font-semibold">{mockUserDetail.totalPlayTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'playlists' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-asra-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-6">Playlists de l'utilisateur</h3>
              <div className="space-y-4">
                {mockUserDetail.playlists.length === 0 ? (
                  <p className="text-asra-gray-400 text-sm">Aucune playlist pour le moment</p>
                ) : (
                  mockUserDetail.playlists.map((playlist) => (
                    <div key={playlist.id} className="flex items-center justify-between p-4 bg-asra-gray-800 rounded-lg hover:bg-asra-gray-700 transition-colors">
                      <div>
                        <div className="text-white font-medium">{playlist.title}</div>
                        <div className="text-asra-gray-400 text-sm">{playlist.songCount} titres • {playlist.duration}</div>
                      </div>
                      <div className="text-asra-gray-400 text-sm">
                        Créée le {new Date(playlist.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-asra-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-6">Activité récente</h3>
              <div className="space-y-4">
                {mockUserDetail.recentActivity.length === 0 ? (
                  <p className="text-asra-gray-400 text-sm">Aucune activité récente</p>
                ) : (
                  mockUserDetail.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 bg-asra-gray-800 rounded-lg">
                      <div>
                        <div className="text-white font-medium">{activity.description}</div>
                        <div className="text-asra-gray-400 text-sm">{new Date(activity.date).toLocaleDateString()}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetail;
