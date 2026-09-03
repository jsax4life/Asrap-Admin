import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, User, Play, Heart, Share, MoreHorizontal, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useAuth } from '@/hooks/useAuth';
// Mock data for album detail
const mockAlbumDetail = {
  id: '1',
  title: 'More Love Less Ego',
  artist: 'Wizkid',
  artistId: '52166565161',
  year: 2022,
  type: 'Album',
  coverArt: 'https://api.builder.io/api/v1/image/assets/TEMP/77784d2e1616758f6b0d5b70a64186f75a3b7ce5?width=400',
  artistAvatar: 'https://api.builder.io/api/v1/image/assets/TEMP/77784d2e1616758f6b0d5b70a64186f75a3b7ce5?width=75',
  releaseDate: '11 November 2022',
  totalPlays: 0,
  likes: 0,
  songsCount: 11,
  totalDuration: '40:55',
  songs: [
    {
      id: '1',
      title: 'More Love Less Ego',
      artist: 'Wizkid',
      plays: 0,
      duration: '3:15',
      dateAdded: '2022-11-11',
      status: 'Publié',
    },
    {
      id: '2',
      title: 'Bad To Me',
      artist: 'Wizkid',
      plays: 0,
      duration: '3:28',
      dateAdded: '2022-11-11',
      status: 'Publié',
    },
    {
      id: '3',
      title: 'Everyday',
      artist: 'Wizkid',
      plays: 0,
      duration: '3:45',
      dateAdded: '2022-11-11',
      status: 'Publié',
    },
    {
      id: '4',
      title: 'Money & Love',
      artist: 'Wizkid feat. Ayra Starr',
      plays: 0,
      duration: '3:32',
      dateAdded: '2022-11-11',
      status: 'Publié',
    },
    {
      id: '5',
      title: 'Pressure',
      artist: 'Wizkid',
      plays: 0,
      duration: '3:18',
      dateAdded: '2022-11-11',
      status: 'Publié',
    },
    {
      id: '6',
      title: 'Flower Pads',
      artist: 'Wizkid, Skillibeng, Shenseea',
      plays: 0,
      duration: '3:55',
      dateAdded: '2022-11-11',
      status: 'Publié',
    },
    {
      id: '7',
      title: 'Deep',
      artist: 'Wizkid',
      plays: 0,
      duration: '3:42',
      dateAdded: '2022-11-11',
      status: 'Publié',
    },
    {
      id: '8',
      title: 'Balance',
      artist: 'Wizkid',
      plays: 0,
      duration: '3:25',
      dateAdded: '2022-11-11',
      status: 'Publié',
    },
    {
      id: '9',
      title: 'Slip N Slide',
      artist: 'Wizkid',
      plays: 0,
      duration: '3:38',
      dateAdded: '2022-11-11',
      status: 'Publié',
    },
    {
      id: '10',
      title: 'Plenty Loving',
      artist: 'Wizkid',
      plays: 0,
      duration: '3:12',
      dateAdded: '2022-11-11',
      status: 'Publié',
    },
    {
      id: '11',
      title: 'Sweet',
      artist: 'Wizkid',
      plays: 0,
      duration: '3:15',
      dateAdded: '2022-11-11',
      status: 'Publié',
    },
  ],
};

const AlbumDetail = () => {
  const { t } = useTranslation('artists');
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'songs' | 'details'>('songs');
  const [currentPage, setCurrentPage] = useState(1);

  const handleGoBack = () => {
    navigate('/artist-management');
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatPlays = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(0) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-asra-dark">
      {/* Header */}
      <div className="bg-gradient-to-b from-purple-900/50 to-black px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Back button */}
          <div className="flex items-center space-x-6">
            <button
              onClick={handleGoBack}
              className="flex items-center space-x-2 text-asra-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>{t('shared.back')}</span>
            </button>
          </div>

          {/* Center - Search */}
          <div className="flex-1 flex justify-center">
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-asra-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={t('shared.searchPlaceholder')}
                className="bg-asra-gray-800 text-white pl-10 pr-4 py-2 rounded-lg border border-asra-gray-700 focus:outline-none focus:border-asra-red w-full"
              />
            </div>
          </div>

          {/* Right side - Profile */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-asra-red rounded-full flex items-center justify-center relative">
              <User className="w-4 h-4 text-white" />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-asra-dark"></div>
            </div>
            <span className="text-white text-sm">{user?.name || t('shared.defaultAdminName')}</span>
          </div>
        </div>
      </div>

      {/* Album Banner */}
      <div className="bg-gradient-to-b from-purple-900/30 to-black px-6 py-8">
        <div className="flex items-start space-x-8">
          {/* Album Cover */}
          <div className="flex-shrink-0">
            <img
              src={mockAlbumDetail.coverArt}
              alt={mockAlbumDetail.title}
              className="w-64 h-64 object-cover rounded-lg shadow-2xl"
            />
          </div>

          {/* Album Info */}
          <div className="flex-1">
            <h1 className="text-5xl font-bold text-white mb-2">{mockAlbumDetail.title}</h1>
            <div className="flex items-center space-x-3 mb-4">
              <img
                src={mockAlbumDetail.artistAvatar}
                alt={mockAlbumDetail.artist}
                className="w-8 h-8 rounded-full"
              />
              <span className="text-white text-xl">{mockAlbumDetail.artist}</span>
            </div>
            <div className="text-asra-gray-300 text-lg mb-6">
              {mockAlbumDetail.type} • {mockAlbumDetail.year}
            </div>

            {/* Stats Bar */}
            <div className="flex items-center space-x-6 text-white text-sm mb-8">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-asra-red rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">S</span>
                </div>
                <span>{t('albumDetail.plays', { count: formatPlays(mockAlbumDetail.totalPlays) })}</span>
              </div>
              <div className="w-1 h-1 bg-asra-gray-400 rounded-full"></div>
              <div className="flex items-center space-x-2">
                <span>{t('albumDetail.likes', { count: formatNumber(mockAlbumDetail.likes) })}</span>
              </div>
              <div className="w-1 h-1 bg-asra-gray-400 rounded-full"></div>
              <div className="flex items-center space-x-2">
                <span>{t('albumDetail.songsAndDuration', { count: mockAlbumDetail.songsCount, duration: mockAlbumDetail.totalDuration })}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              <button className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                <Play className="w-6 h-6 text-white ml-1" />
              </button>
              <button className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center space-x-2">
                <MoreHorizontal className="w-5 h-5" />
                <span>{t('albumDetail.more')}</span>
              </button>
              <button className="text-asra-gray-400 hover:text-white transition-colors">
                <Heart className="w-6 h-6" />
              </button>
              <button className="text-asra-gray-400 hover:text-white transition-colors">
                <Share className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 py-4 border-b border-asra-gray-700">
        <div className="flex space-x-8">
          <button
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

      {/* Tab Content */}
      {activeTab === 'songs' && (
        <div className="px-6 py-6">
          {/* Songs Table */}
          <div className="bg-black/50 backdrop-blur-sm rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
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
                      {t('albumDetail.table.plays')}
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
                      {t('albumDetail.table.action')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-asra-gray-800">
                  {mockAlbumDetail.songs.map((song, index) => (
                    <tr key={song.id} className="hover:bg-asra-gray-800/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-asra-gray-300">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <img
                            src={mockAlbumDetail.coverArt}
                            alt={song.title}
                            className="w-10 h-10 rounded object-cover"
                          />
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-white">{song.title}</span>
                            <button className="text-asra-gray-400 hover:text-white transition-colors">
                              <Play className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-asra-gray-300">
                        {song.artist}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-asra-gray-300">
                        {formatPlays(song.plays)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-asra-gray-300">
                        {song.duration}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-asra-gray-300">
                        {new Date(song.dateAdded).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400">
                          {song.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="text-asra-gray-400 hover:text-white transition-colors">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
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
                className="bg-asra-red text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('shared.previous')}
              </button>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                className="bg-asra-red text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
              >
                {t('shared.next')}
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-asra-gray-400 text-sm">{t('albumDetail.pagination.page')}</span>
              <div className="flex space-x-1">
                {[1, 2, 3].map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded text-sm font-medium ${
                      currentPage === page
                        ? 'bg-asra-red text-white'
                        : 'text-asra-gray-400 hover:text-white'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <span className="text-asra-gray-400 text-sm">...</span>
                <button className="w-8 h-8 rounded text-sm font-medium text-asra-gray-400 hover:text-white">
                  10
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'details' && (
        <div className="px-6 py-6">
          <div className="bg-asra-gray-900 rounded-lg p-8">
            <h3 className="text-xl font-bold text-white mb-6">{t('albumDetail.details.title')}</h3>
            <p className="text-asra-gray-400">{t('albumDetail.details.comingSoon')}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlbumDetail;
