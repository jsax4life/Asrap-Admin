import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlaylistCard } from '@/components/playlist/PlaylistCard';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';

// Mock data for playlists
const playlists = [
  {
    id: '1',
    title: 'Discover Weekly',
    artists: 'Asake, Khaid, Simi, Bexn, Tems and more',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/5cfb76ba25d6351d27d525c323f0a49d59c44167?width=300',
    banner: null,
    songCount: 30,
    duration: '1hr 45min',
    likes: '2.5M',
    isPublic: true,
  },
  {
    id: '2',
    title: 'This is Wizkid',
    artists: 'Wizkid, Olamide, Tems, Drake and more',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/5cfb76ba25d6351d27d525c323f0a49d59c44167?width=300',
    banner: 'THIS IS Wizkid',
    songCount: 34,
    duration: '2hr 01min',
    likes: '5.8M',
    isPublic: true,
  },
  {
    id: '3',
    title: 'Top 100 Weekly',
    artists: 'Asake, Khaid, Simi, Bexn, Tems and more',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/5cfb76ba25d6351d27d525c323f0a49d59c44167?width=300',
    banner: null,
    songCount: 100,
    duration: '5hr 30min',
    likes: '8.2M',
    isPublic: true,
  },
  {
    id: '4',
    title: 'Workout',
    artists: 'Julia Wolf, Khalid, Simi ayokay and more',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/5cfb76ba25d6351d27d525c323f0a49d59c44167?width=300',
    banner: null,
    songCount: 25,
    duration: '1hr 30min',
    likes: '1.8M',
    isPublic: true,
  },
  {
    id: '5',
    title: 'Fresh out Wizkid',
    artists: 'Wizkid, Olamide, Tems, Drake and more',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/5cfb76ba25d6351d27d525c323f0a49d59c44167?width=300',
    banner: 'Fresh Out Wizkid',
    songCount: 28,
    duration: '1hr 50min',
    likes: '3.2M',
    isPublic: true,
  },
  {
    id: '6',
    title: 'Essentials',
    artists: 'Wizkid, Olamide, Tems, Drake and more',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/5cfb76ba25d6351d27d525c323f0a49d59c44167?width=300',
    banner: 'Essentials',
    songCount: 40,
    duration: '2hr 45min',
    likes: '4.1M',
    isPublic: true,
  },
  {
    id: '7',
    title: 'Party',
    artists: 'Asake, Khaid, Simi, Bexn, Tems and more',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/5cfb76ba25d6351d27d525c323f0a49d59c44167?width=300',
    banner: null,
    songCount: 35,
    duration: '2hr 15min',
    likes: '2.9M',
    isPublic: true,
  },
  {
    id: '8',
    title: 'Workout',
    artists: 'Asake, Khaid, Simi, Bexn, Tems and more',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/5cfb76ba25d6351d27d525c323f0a49d59c44167?width=300',
    banner: null,
    songCount: 22,
    duration: '1hr 20min',
    likes: '1.5M',
    isPublic: true,
  },
  {
    id: '9',
    title: 'Jazz',
    artists: 'Asake, Khaid, Simi, Bexn, Tems and more',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/5cfb76ba25d6351d27d525c323f0a49d59c44167?width=300',
    banner: null,
    songCount: 18,
    duration: '1hr 10min',
    likes: '890K',
    isPublic: true,
  },
  {
    id: '10',
    title: 'Travel',
    artists: 'Asake, Khaid, Simi, Bexn, Tems and more',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/5cfb76ba25d6351d27d525c323f0a49d59c44167?width=300',
    banner: null,
    songCount: 32,
    duration: '2hr 00min',
    likes: '2.1M',
    isPublic: true,
  },
];

export default function PlaylistManagement() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPlaylists = playlists.filter(playlist =>
    playlist.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    playlist.artists.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePlaylistClick = (playlistId: string) => {
    navigate(`/playlist-management/${playlistId}`);
  };

  const handleNewPlaylist = () => {
    // TODO: Implement new playlist creation
    console.log('Create new playlist');
  };

  return (
    <div className="min-h-screen bg-asra-dark">
      {/* Custom Header */}
      <div className="bg-asra-dark border-b border-asra-gray-5 p-6">
        <div className="flex items-center justify-between">
          {/* Left Side - Date and Title */}
          <div className="space-y-2">
            <div className="text-white text-sm">Date: 03/02/2023</div>
            <h1 className="text-white text-3xl font-bold">Asra Playlist Manager</h1>
          </div>

          {/* Center - Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-asra-gray-6 w-4 h-4" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-asra-gray-1 border border-asra-gray-5 rounded-lg text-white placeholder:text-asra-gray-6 focus:outline-none focus:border-asra-red"
              />
            </div>
          </div>

          {/* Right Side - New Playlist Button and User Profile */}
          <div className="flex items-center gap-4">
            <Button
              onClick={handleNewPlaylist}
              className="bg-asra-red hover:bg-asra-red/90 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Playlist
            </Button>

            {/* User Profile */}
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8">
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center border border-white">
                  <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">S</span>
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <span className="text-white text-sm font-medium">System Admin</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">

      {/* Playlists Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPlaylists.map((playlist) => (
          <PlaylistCard
            key={playlist.id}
            playlist={playlist}
            onClick={() => handlePlaylistClick(playlist.id)}
          />
        ))}
      </div>

        {/* Empty State */}
        {filteredPlaylists.length === 0 && (
          <div className="text-center py-12">
            <div className="text-asra-gray-6 text-lg mb-4">
              No playlists found matching your search
            </div>
            <Button
              onClick={() => setSearchQuery('')}
              variant="outline"
              className="border-asra-gray-5 text-white hover:bg-asra-gray-2"
            >
              Clear Search
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
