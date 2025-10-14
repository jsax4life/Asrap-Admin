import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, User, ChevronLeft, ChevronRight } from 'lucide-react';

// Mock data for artists
const mockArtists = [
  {
    id: '52166565161',
    name: 'Wizkid',
    followers: 500,
    monthlyListeners: 526925,
    songsCount: 914,
    avatar: 'https://api.builder.io/api/v1/image/assets/TEMP/77784d2e1616758f6b0d5b70a64186f75a3b7ce5?width=75',
  },
  {
    id: '52166565161',
    name: 'Ice Prince',
    followers: 400,
    monthlyListeners: 526925,
    songsCount: 500,
    avatar: 'https://api.builder.io/api/v1/image/assets/TEMP/77784d2e1616758f6b0d5b70a64186f75a3b7ce5?width=75',
  },
  {
    id: '52166565161',
    name: 'Olamide',
    followers: 200,
    monthlyListeners: 526925,
    songsCount: 871,
    avatar: 'https://api.builder.io/api/v1/image/assets/TEMP/77784d2e1616758f6b0d5b70a64186f75a3b7ce5?width=75',
  },
  {
    id: '52166565161',
    name: 'Davido',
    followers: 322,
    monthlyListeners: 526925,
    songsCount: 900,
    avatar: 'https://api.builder.io/api/v1/image/assets/TEMP/77784d2e1616758f6b0d5b70a64186f75a3b7ce5?width=75',
  },
  {
    id: '52166565161',
    name: 'Timaya',
    followers: 123,
    monthlyListeners: 526925,
    songsCount: 40,
    avatar: 'https://api.builder.io/api/v1/image/assets/TEMP/77784d2e1616758f6b0d5b70a64186f75a3b7ce5?width=75',
  },
  {
    id: '52166565161',
    name: 'Tems',
    followers: 189,
    monthlyListeners: 526925,
    songsCount: 34,
    avatar: 'https://api.builder.io/api/v1/image/assets/TEMP/77784d2e1616758f6b0d5b70a64186f75a3b7ce5?width=75',
  },
  {
    id: '52166565161',
    name: 'Ruger',
    followers: 488,
    monthlyListeners: 526925,
    songsCount: 50,
    avatar: 'https://api.builder.io/api/v1/image/assets/TEMP/77784d2e1616758f6b0d5b70a64186f75a3b7ce5?width=75',
  },
  {
    id: '52166565161',
    name: 'Adekunle Gold',
    followers: 123,
    monthlyListeners: 526925,
    songsCount: 823,
    avatar: 'https://api.builder.io/api/v1/image/assets/TEMP/77784d2e1616758f6b0d5b70a64186f75a3b7ce5?width=75',
  },
];

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
  const navigate = useNavigate();

  const handleArtistClick = (artistId: string) => {
    navigate(`/artist-management/${artistId}`);
  };

  const handleUserClick = (userId: string) => {
    navigate(`/user-management/${userId}`);
  };

  const filteredArtists = mockArtists.filter(artist =>
    artist.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <span className="text-white text-xl font-bold">AsraMusic</span>
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
            Artists on Asra
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-2 text-lg font-medium border-b-2 transition-colors ${
              activeTab === 'users'
                ? 'text-asra-red border-asra-red'
                : 'text-asra-gray-400 border-transparent hover:text-white'
            }`}
          >
            Users on Asra
          </button>
        </div>

        {/* Table */}
        <div className="bg-asra-gray-900 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
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
                        Followers
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                        Monthly Listeners
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                        No. of Songs on Asra
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
                  <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-asra-gray-800">
                {activeTab === 'artists' ? (
                  filteredArtists.map((artist, index) => (
                    <tr key={index} className="hover:bg-asra-gray-800 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-asra-gray-300">
                        {artist.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <img
                            src={artist.avatar}
                            alt={artist.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <span className="text-sm font-medium text-white">{artist.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-asra-gray-300">
                        {formatNumber(artist.followers)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-asra-gray-300">
                        {formatNumber(artist.monthlyListeners)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-asra-gray-300">
                        {formatNumber(artist.songsCount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleArtistClick(artist.id)}
                          className="bg-asra-red text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
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
              className="bg-asra-red text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors flex items-center space-x-2"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="text-asra-gray-400 text-sm">
            Page {currentPage}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistManagement;
