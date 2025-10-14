import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Calendar, User, Edit3, Play, Heart, Share, MoreHorizontal } from 'lucide-react';

// Mock data for user detail
const mockUserDetail = {
  id: '52166565161',
  name: 'Basheer',
  age: 20,
  email: 'basheer@example.com',
  joinDate: '2023-01-15',
  lastActive: '2024-01-10',
  avatar: 'https://api.builder.io/api/v1/image/assets/TEMP/77784d2e1616758f6b0d5b70a64186f75a3b7ce5?width=200',
  playlistsCreated: 1,
  songsLiked: 914,
  totalPlayTime: '2,450 hours',
  favoriteGenres: ['Afrobeats', 'Hip-Hop', 'R&B'],
  recentActivity: [
    {
      id: '1',
      type: 'playlist_created',
      description: 'Created playlist "My Favorites"',
      date: '2024-01-08',
    },
    {
      id: '2',
      type: 'song_liked',
      description: 'Liked "Essence" by Wizkid',
      date: '2024-01-07',
    },
    {
      id: '3',
      type: 'song_liked',
      description: 'Liked "Joro" by Wizkid',
      date: '2024-01-06',
    },
  ],
  playlists: [
    {
      id: '1',
      title: 'My Favorites',
      songCount: 25,
      duration: '1:23:45',
      createdAt: '2024-01-08',
    },
  ],
  likedSongs: [
    {
      id: '1',
      title: 'Essence',
      artist: 'Wizkid',
      album: 'Made in Lagos',
      duration: '3:45',
      likedDate: '2024-01-07',
    },
    {
      id: '2',
      title: 'Joro',
      artist: 'Wizkid',
      album: 'Made in Lagos',
      duration: '3:15',
      likedDate: '2024-01-06',
    },
    {
      id: '3',
      title: 'Fever',
      artist: 'Wizkid',
      album: 'Made in Lagos',
      duration: '4:12',
      likedDate: '2024-01-05',
    },
  ],
};

const UserDetail = () => {
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
              <span>Go Back</span>
            </button>
          </div>

          {/* Right side - Search and Profile */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-asra-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search"
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
            Age: {mockUserDetail.age} • Member since {new Date(mockUserDetail.joinDate).toLocaleDateString()}
          </div>

          {/* Stats Bar */}
          <div className="flex items-center justify-center space-x-6 text-white text-sm mb-8">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-asra-red rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">S</span>
              </div>
              <span>{formatNumber(mockUserDetail.songsLiked)} Songs Liked</span>
            </div>
            <div className="w-1 h-1 bg-asra-gray-400 rounded-full"></div>
            <div className="flex items-center space-x-2">
              <span>{mockUserDetail.playlistsCreated} Playlists Created</span>
            </div>
            <div className="w-1 h-1 bg-asra-gray-400 rounded-full"></div>
            <div className="flex items-center space-x-2">
              <span>{mockUserDetail.totalPlayTime} Total Play Time</span>
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
            Overview
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
            Recent Activity
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* User Info */}
              <div className="bg-asra-gray-900 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-6">User Information</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Email</h4>
                    <p className="text-asra-gray-300">{mockUserDetail.email}</p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Join Date</h4>
                    <p className="text-asra-gray-300">{new Date(mockUserDetail.joinDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Last Active</h4>
                    <p className="text-asra-gray-300">{new Date(mockUserDetail.lastActive).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Favorite Genres</h4>
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
                <h3 className="text-xl font-bold text-white mb-6">Statistics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-asra-gray-300">Songs Liked</span>
                    <span className="text-white font-semibold">{formatNumber(mockUserDetail.songsLiked)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-asra-gray-300">Playlists Created</span>
                    <span className="text-white font-semibold">{mockUserDetail.playlistsCreated}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-asra-gray-300">Total Play Time</span>
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
              <h3 className="text-xl font-bold text-white mb-6">User Playlists</h3>
              <div className="space-y-4">
                {mockUserDetail.playlists.map((playlist) => (
                  <div key={playlist.id} className="flex items-center justify-between p-4 bg-asra-gray-800 rounded-lg hover:bg-asra-gray-700 transition-colors">
                    <div>
                      <div className="text-white font-medium">{playlist.title}</div>
                      <div className="text-asra-gray-400 text-sm">{playlist.songCount} songs • {playlist.duration}</div>
                    </div>
                    <div className="text-asra-gray-400 text-sm">
                      Created {new Date(playlist.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-asra-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {mockUserDetail.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 bg-asra-gray-800 rounded-lg">
                    <div>
                      <div className="text-white font-medium">{activity.description}</div>
                      <div className="text-asra-gray-400 text-sm">{new Date(activity.date).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetail;
