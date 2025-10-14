import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Calendar, User, Edit3, Play } from 'lucide-react';

// Mock data for artist detail
const mockArtistDetail = {
  id: '52166565161',
  name: 'Wizkid',
  realName: 'Ayodeji Ibrahim Balogun',
  monthlyListeners: 5865865,
  likes: 5865865,
  songsCount: 914,
  totalDuration: '2hr 01 min',
  avatar: 'https://api.builder.io/api/v1/image/assets/TEMP/77784d2e1616758f6b0d5b70a64186f75a3b7ce5?width=200',
  verified: true,
  bio: `Wizkid, born Ayodeji Ibrahim Balogun on July 16, 1990, in Lagos, Nigeria, is a globally acclaimed Nigerian singer, songwriter, and record producer. He is widely regarded as one of the most influential figures in contemporary African music and a key ambassador of the Afrobeats genre.

Wizkid's musical journey began in his early teens when he started performing in church and local talent shows. His breakthrough came in 2010 with the release of "Holla at Your Boy," the lead single from his debut studio album "Superstar" (2011). The album established him as a rising star in the Nigerian music scene.

However, it was his 2016 hit single "Ojuelegba" that catapulted him to international fame. The song, which tells the story of his humble beginnings in the Ojuelegba area of Lagos, resonated with audiences worldwide and caught the attention of international artists.

Wizkid's global breakthrough came with his collaboration with Canadian rapper Drake on "One Dance" (2016), which topped charts in multiple countries and became one of the best-selling singles of all time. This collaboration opened doors for more international partnerships, including work with artists like Ty Dolla $ign, Major Lazer, and Beyoncé.

In 2020, Wizkid released his fourth studio album "Made in Lagos," which received critical acclaim and commercial success. The album's lead single "Essence" featuring Tems became a global hit and further solidified his position as a leading figure in Afrobeats.

Throughout his career, Wizkid has received numerous awards and recognitions, including multiple BET Awards, MTV Africa Music Awards, and an Apple Music Award for Artist of the Year - Africa. He has also been credited with popularizing Afrobeats on the global stage and inspiring a new generation of African artists.

Wizkid's influence extends beyond music; he has become a cultural icon and fashion trendsetter, known for his distinctive style and charismatic personality. His success has paved the way for other African artists to gain international recognition and has contributed significantly to the global acceptance of African music.`,
  dateOfBirth: '16 July 1990',
  homeTown: 'Lagos, Nigeria',
  genre: 'Afrobeats',
  albums: [
    {
      id: '1',
      title: 'Made in Lagos',
      year: 2020,
      type: 'Album',
      coverArt: 'https://api.builder.io/api/v1/image/assets/TEMP/77784d2e1616758f6b0d5b70a64186f75a3b7ce5?width=200',
      songsCount: 14,
      duration: '47:23',
      status: 'Published',
      plays: 1250000,
    },
    {
      id: '2',
      title: 'Soundman Vol. 2',
      year: 2019,
      type: 'EP',
      coverArt: 'https://api.builder.io/api/v1/image/assets/TEMP/77784d2e1616758f6b0d5b70a64186f75a3b7ce5?width=200',
      songsCount: 8,
      duration: '28:45',
      status: 'Published',
      plays: 980000,
    },
    {
      id: '3',
      title: 'Sounds from the Other Side',
      year: 2017,
      type: 'Album',
      coverArt: 'https://api.builder.io/api/v1/image/assets/TEMP/77784d2e1616758f6b0d5b70a64186f75a3b7ce5?width=200',
      songsCount: 12,
      duration: '42:18',
      status: 'Published',
      plays: 850000,
    },
    {
      id: '4',
      title: 'Superstar',
      year: 2011,
      type: 'Album',
      coverArt: 'https://api.builder.io/api/v1/image/assets/TEMP/77784d2e1616758f6b0d5b70a64186f75a3b7ce5?width=200',
      songsCount: 18,
      duration: '65:32',
      status: 'Published',
      plays: 720000,
    },
  ],
  songs: [
    {
      id: '1',
      title: 'Essence',
      album: 'Made in Lagos',
      year: 2020,
      duration: '3:45',
      status: 'Published',
      plays: 1250000,
      genre: 'Afrobeats',
      uploadedDate: '2020-10-30',
    },
    {
      id: '2',
      title: 'Joro',
      album: 'Made in Lagos',
      year: 2020,
      duration: '3:15',
      status: 'Published',
      plays: 980000,
      genre: 'Afrobeats',
      uploadedDate: '2020-10-30',
    },
    {
      id: '3',
      title: 'Fever',
      album: 'Made in Lagos',
      year: 2020,
      duration: '4:12',
      status: 'Published',
      plays: 850000,
      genre: 'Afrobeats',
      uploadedDate: '2020-10-30',
    },
    {
      id: '4',
      title: 'Ginger',
      album: 'Made in Lagos',
      year: 2020,
      duration: '3:28',
      status: 'Published',
      plays: 720000,
      genre: 'Afrobeats',
      uploadedDate: '2020-10-30',
    },
    {
      id: '5',
      title: 'No Stress',
      album: 'Made in Lagos',
      year: 2020,
      duration: '3:22',
      status: 'Published',
      plays: 650000,
      genre: 'Afrobeats',
      uploadedDate: '2020-10-30',
    },
    {
      id: '6',
      title: 'Ojuelegba',
      album: 'Sounds from the Other Side',
      year: 2017,
      duration: '3:58',
      status: 'Published',
      plays: 1200000,
      genre: 'Afrobeats',
      uploadedDate: '2017-07-14',
    },
    {
      id: '7',
      title: 'Holla at Your Boy',
      album: 'Superstar',
      year: 2011,
      duration: '3:45',
      status: 'Published',
      plays: 800000,
      genre: 'Afrobeats',
      uploadedDate: '2011-01-01',
    },
    {
      id: '8',
      title: 'Pakurumo',
      album: 'Superstar',
      year: 2011,
      duration: '3:32',
      status: 'Published',
      plays: 750000,
      genre: 'Afrobeats',
      uploadedDate: '2011-01-01',
    },
  ],
  videos: [
    {
      id: '1',
      title: 'Essence (feat Tems)',
      year: 2021,
      thumbnail: 'https://api.builder.io/api/v1/image/assets/TEMP/77784d2e1616758f6b0d5b70a64186f75a3b7ce5?width=300',
      duration: '4:08',
      views: 125000000,
      status: 'Published',
    },
    {
      id: '2',
      title: 'Joro',
      year: 2020,
      thumbnail: 'https://api.builder.io/api/v1/image/assets/TEMP/77784d2e1616758f6b0d5b70a64186f75a3b7ce5?width=300',
      duration: '3:15',
      views: 85000000,
      status: 'Published',
    },
    {
      id: '3',
      title: 'Fever',
      year: 2020,
      thumbnail: 'https://api.builder.io/api/v1/image/assets/TEMP/77784d2e1616758f6b0d5b70a64186f75a3b7ce5?width=300',
      duration: '4:12',
      views: 72000000,
      status: 'Published',
    },
    {
      id: '4',
      title: 'Ginger',
      year: 2020,
      thumbnail: 'https://api.builder.io/api/v1/image/assets/TEMP/77784d2e1616758f6b0d5b70a64186f75a3b7ce5?width=300',
      duration: '3:28',
      views: 65000000,
      status: 'Published',
    },
    {
      id: '5',
      title: 'Ojuelegba',
      year: 2017,
      thumbnail: 'https://api.builder.io/api/v1/image/assets/TEMP/77784d2e1616758f6b0d5b70a64186f75a3b7ce5?width=300',
      duration: '3:58',
      views: 95000000,
      status: 'Published',
    },
    {
      id: '6',
      title: 'Holla at Your Boy',
      year: 2011,
      thumbnail: 'https://api.builder.io/api/v1/image/assets/TEMP/77784d2e1616758f6b0d5b70a64186f75a3b7ce5?width=300',
      duration: '3:45',
      views: 45000000,
      status: 'Published',
    },
  ],
};

const ArtistDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'about' | 'albums' | 'videos' | 'tagged'>('about');

  const handleGoBack = () => {
    navigate('/artist-management');
  };

  const handleAlbumClick = (albumId: string) => {
    navigate(`/album/${albumId}`);
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
        {/* Artist Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">{mockArtistDetail.name}</h1>
          {mockArtistDetail.verified && (
            <div className="inline-flex items-center space-x-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-6">
              <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                <span className="text-green-500 text-xs">✓</span>
              </div>
              <span>Verified Artist</span>
            </div>
          )}
          
          {/* Artist Avatar with Green Glow */}
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-green-500 rounded-full blur-lg opacity-30 scale-110"></div>
            <img
              src={mockArtistDetail.avatar}
              alt={mockArtistDetail.name}
              className="relative w-48 h-48 rounded-full object-cover border-4 border-green-500"
            />
          </div>

          {/* Stats Bar */}
          <div className="flex items-center justify-center space-x-6 text-white text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-asra-red rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">S</span>
              </div>
              <span>{formatNumber(mockArtistDetail.monthlyListeners)} Monthly listeners</span>
            </div>
            <div className="w-1 h-1 bg-asra-gray-400 rounded-full"></div>
            <div className="flex items-center space-x-2">
              <span>{formatNumber(mockArtistDetail.likes)} likes</span>
            </div>
            <div className="w-1 h-1 bg-asra-gray-400 rounded-full"></div>
            <div className="flex items-center space-x-2">
              <span>{mockArtistDetail.songsCount} songs, {mockArtistDetail.totalDuration}</span>
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
            About
          </button>
          <button
            onClick={() => setActiveTab('albums')}
            className={`pb-3 text-lg font-medium border-b-2 transition-colors ${
              activeTab === 'albums'
                ? 'text-asra-red border-asra-red'
                : 'text-asra-gray-400 border-transparent hover:text-white'
            }`}
          >
            Albums, EPs and Songs Uploads
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`pb-3 text-lg font-medium border-b-2 transition-colors ${
              activeTab === 'videos'
                ? 'text-asra-red border-asra-red'
                : 'text-asra-gray-400 border-transparent hover:text-white'
            }`}
          >
            Videos
          </button>
          <button
            onClick={() => setActiveTab('tagged')}
            className={`pb-3 text-lg font-medium border-b-2 transition-colors ${
              activeTab === 'tagged'
                ? 'text-asra-red border-asra-red'
                : 'text-asra-gray-400 border-transparent hover:text-white'
            }`}
          >
            Tagged on
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'about' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-asra-gray-900 rounded-lg p-8">
              <h3 className="text-xl font-bold text-white mb-6">Biography</h3>
              <div className="text-asra-gray-300 leading-relaxed mb-8 whitespace-pre-line">
                {mockArtistDetail.bio}
              </div>
              
              {/* Key Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Date of Birth</h4>
                  <p className="text-asra-gray-300">{mockArtistDetail.dateOfBirth}</p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Home Town</h4>
                  <p className="text-asra-gray-300">{mockArtistDetail.homeTown}</p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Genre</h4>
                  <p className="text-asra-gray-300">{mockArtistDetail.genre}</p>
                </div>
              </div>

              {/* Edit Bio Button */}
              <button className="bg-asra-red text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center space-x-2">
                <Edit3 className="w-5 h-5" />
                <span>Edit Bio</span>
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
                {mockArtistDetail.albums.map((album) => (
                  <div 
                    key={album.id} 
                    className="bg-asra-gray-900 rounded-lg p-4 hover:bg-asra-gray-800 transition-colors cursor-pointer"
                    onClick={() => handleAlbumClick(album.id)}
                  >
                    <div className="aspect-square mb-4">
                      <img
                        src={album.coverArt}
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
                        {album.songsCount} songs • {album.duration}
                      </div>
                      <div className="text-sm text-asra-gray-400">
                        {formatNumber(album.plays)} plays
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs px-2 py-1 rounded ${
                          album.status === 'Published' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {album.status}
                        </span>
                        <button 
                          className="text-asra-red hover:text-red-400 text-sm font-medium"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAlbumClick(album.id);
                          }}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Songs Section */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Songs</h3>
              <div className="bg-asra-gray-900 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-asra-gray-800">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                          #
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                          Album
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                          Year
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                          Duration
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                          Plays
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                          Genre
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                          Uploaded
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-asra-gray-800">
                      {mockArtistDetail.songs.map((song, index) => (
                        <tr key={song.id} className="hover:bg-asra-gray-800 transition-colors">
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
                            {song.duration}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`text-xs px-2 py-1 rounded ${
                              song.status === 'Published' 
                                ? 'bg-green-500/20 text-green-400' 
                                : 'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {song.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-asra-gray-300">
                            {formatNumber(song.plays)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-asra-gray-300">
                            {song.genre}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-asra-gray-300">
                            {new Date(song.uploadedDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button className="text-asra-red hover:text-red-400 text-sm font-medium">
                              View
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
            <h3 className="text-2xl font-bold text-white mb-6">Videos</h3>
            <div className="overflow-x-auto">
              <div className="flex space-x-6 pb-4">
                {mockArtistDetail.videos.map((video) => (
                  <div key={video.id} className="flex-shrink-0 w-64">
                    <div className="bg-asra-gray-900 rounded-lg overflow-hidden hover:bg-asra-gray-800 transition-colors cursor-pointer group">
                      <div className="relative">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-36 object-cover"
                        />
                        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                          {video.duration}
                        </div>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play className="w-6 h-6 text-black ml-1" />
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="text-white font-medium text-sm mb-1 line-clamp-2">{video.title}</h4>
                        <p className="text-asra-gray-400 text-xs">{video.year}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tagged' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-asra-gray-900 rounded-lg p-8">
              <h3 className="text-xl font-bold text-white mb-6">Tagged on</h3>
              <p className="text-asra-gray-400">Content coming soon...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtistDetail;
