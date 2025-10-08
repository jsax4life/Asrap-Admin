import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MoreHorizontal, Clock, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/common/DataTable';
import { TableColumn } from '@/types';

// Mock data for the specific playlist
const playlistData = {
  id: '2',
  title: 'This is Wizkid',
  description: 'Hits to boost your mood and fill you with happiness!',
  image: 'https://api.builder.io/api/v1/image/assets/TEMP/5cfb76ba25d6351d27d525c323f0a49d59c44167?width=300',
  banner: 'THIS IS Wizkid',
  isPublic: true,
  likes: '5,865,865',
  songCount: 34,
  duration: '2hr 01 min',
  createdBy: 'AsraMusic',
};

// Mock data for songs in the playlist
const songs = [
  {
    id: '1',
    number: 1,
    title: 'Money & Love',
    artist: 'Wizkid',
    album: 'More Love Less Ego',
    dateAdded: '11 November 2022',
    duration: '2:12',
  },
  {
    id: '2',
    number: 2,
    title: 'Balance',
    artist: 'Wizkid',
    album: 'More Love Less Ego',
    dateAdded: '11 November 2022',
    duration: '2:12',
  },
  {
    id: '3',
    number: 3,
    title: 'Bad to Me',
    artist: 'Wizkid',
    album: 'More Love Less Ego',
    dateAdded: '11 November 2022',
    duration: '2:12',
  },
  {
    id: '4',
    number: 4,
    title: '2 Sugar',
    artist: 'Wizkid feat. Ayra Starr',
    album: 'More Love Less Ego',
    dateAdded: '11 November 2022',
    duration: '2:12',
  },
  {
    id: '5',
    number: 5,
    title: 'Everyday',
    artist: 'Wizkid',
    album: 'More Love Less Ego',
    dateAdded: '11 November 2022',
    duration: '2:12',
  },
  {
    id: '6',
    number: 6,
    title: 'Slip N Slide',
    artist: 'Wizkid, Skillibeng, Shenseea',
    album: 'More Love Less Ego',
    dateAdded: '11 November 2022',
    duration: '2:12',
  },
  {
    id: '7',
    number: 7,
    title: 'Deep',
    artist: 'Wizkid',
    album: 'More Love Less Ego',
    dateAdded: '11 November 2022',
    duration: '2:12',
  },
  {
    id: '8',
    number: 8,
    title: 'Flower Pads',
    artist: 'Wizkid',
    album: 'More Love Less Ego',
    dateAdded: '11 November 2022',
    duration: '2:12',
  },
];

type Song = typeof songs[0];

export default function PlaylistDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleGoBack = () => {
    navigate('/playlist-management');
  };

  const handleAddToPlaylist = () => {
    // TODO: Implement add to playlist functionality
    console.log('Add to playlist');
  };

  const columns: TableColumn<Song>[] = [
    {
      key: 'number',
      label: '#',
      render: (value: number) => (
        <span className="text-asra-gray-6 text-sm">{value}</span>
      ),
    },
    {
      key: 'title',
      label: 'TITLE',
      render: (_, song) => (
        <div className="flex items-center gap-3">
          <img
            src={playlistData.image}
            alt={song.title}
            className="w-10 h-10 rounded object-cover"
          />
          <div>
            <div className="text-white text-sm font-medium">{song.title}</div>
            <div className="text-asra-gray-6 text-xs">{song.artist}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'album',
      label: 'ALBUM',
      render: (value: string) => (
        <span className="text-asra-gray-6 text-sm">{value}</span>
      ),
    },
    {
      key: 'dateAdded',
      label: 'DATE ADDED',
      render: (value: string) => (
        <span className="text-asra-gray-6 text-sm">{value}</span>
      ),
    },
    {
      key: 'duration',
      label: 'DURATION',
      render: (value: string) => (
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-asra-gray-6" />
          <span className="text-asra-gray-6 text-sm">{value}</span>
        </div>
      ),
    },
    {
      key: 'id',
      label: '',
      render: () => (
        <button className="text-asra-gray-6 hover:text-white transition-colors">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-asra-red to-black">
      {/* Header Bar within Gradient */}
      <div className="flex items-center justify-between p-6">
        {/* Go Back Button */}
        <button
          onClick={handleGoBack}
          className="text-white hover:text-asra-red text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </button>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white w-4 h-4" />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 bg-asra-red/80 border border-asra-red rounded-lg text-white placeholder:text-white/80 focus:outline-none focus:border-white"
            />
          </div>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-asra-gray-1 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">S</span>
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <span className="text-white text-sm font-medium">System Admin</span>
        </div>
      </div>

      {/* Playlist Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-6 pb-8">
        {/* Left Column - Playlist Cover */}
        <div className="lg:col-span-1">
          <div className="relative">
            <div className="aspect-[3/4] bg-asra-red rounded-lg overflow-hidden">
              {/* Asra Logo */}
              <div className="absolute top-6 left-6 z-10">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-asra-red text-lg font-bold">S</span>
                </div>
              </div>
              
              {/* Banner Text */}
              <div className="absolute top-6 left-16 right-6 z-10">
                <div className="text-white text-sm font-bold leading-tight">
                  <div>THIS IS</div>
                  <div className="text-lg">Wizkid</div>
                </div>
              </div>
              
              {/* Artist Image */}
              <div className="absolute bottom-6 left-6 right-6">
                <img
                  src={playlistData.image}
                  alt={playlistData.title}
                  className="w-full h-40 object-cover rounded"
                />
              </div>
            </div>
            
            {/* Add to Playlist Button */}
            <Button
              onClick={handleAddToPlaylist}
              className="w-full mt-4 bg-asra-red hover:bg-asra-red/90 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add to Playlist
            </Button>
          </div>
        </div>

        {/* Right Column - Playlist Information */}
        <div className="lg:col-span-2 flex flex-col justify-center space-y-6">
          <div>
            <div className="text-white text-sm mb-3 font-medium">PUBLIC PLAYLIST</div>
            <h1 className="text-white text-5xl font-bold mb-6 leading-tight">{playlistData.title}</h1>
            <p className="text-white text-lg mb-8 leading-relaxed">{playlistData.description}</p>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
              <span className="text-asra-red text-xs font-bold">S</span>
            </div>
            <span className="text-white font-medium">{playlistData.createdBy}</span>
            <span className="text-white text-lg">•</span>
            <span className="text-white">{playlistData.likes} likes</span>
            <span className="text-white text-lg">•</span>
            <span className="text-white">{playlistData.songCount} songs, {playlistData.duration}</span>
          </div>
        </div>
      </div>

      {/* Songs Table */}
      <div className="bg-black/50 backdrop-blur-sm rounded-lg border border-asra-gray-5 overflow-hidden mx-6 mb-8">
        <DataTable
          data={songs}
          columns={columns}
          className="min-w-full"
        />
      </div>
    </div>
  );
}
