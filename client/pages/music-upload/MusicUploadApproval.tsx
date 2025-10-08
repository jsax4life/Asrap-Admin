import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '@/components/common/DataTable';
import { Pagination } from '@/components/common/Pagination';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Eye, Search } from 'lucide-react';
import { TableColumn } from '@/types';

// Mock data for music upload requests
const uploadRequests = [
  {
    id: '1',
    artistId: '52166565161',
    artistName: 'Wizkid',
    uploadType: 'Song',
    name: 'Fever',
    genre: 'Afrobeats',
    dateSent: '08/03/2023',
    status: 'Answered',
  },
  {
    id: '2',
    artistId: '52166565161',
    artistName: 'Wizkid',
    uploadType: 'Song',
    name: '2 Sugar ft Ayra Starr',
    genre: 'Afrobeats',
    dateSent: '08/03/2023',
    status: 'Answered',
  },
  {
    id: '3',
    artistId: '52166565161',
    artistName: 'Wizkid',
    uploadType: 'Album',
    name: 'More Love Less Ego',
    genre: 'Afrobeats',
    dateSent: '08/03/2023',
    status: 'Pending',
  },
  {
    id: '4',
    artistId: '52166565161',
    artistName: 'Wizkid',
    uploadType: 'Song',
    name: 'Bad To Me',
    genre: 'Afrobeats',
    dateSent: '08/03/2023',
    status: 'Answered',
  },
  {
    id: '5',
    artistId: '52166565161',
    artistName: 'Wizkid',
    uploadType: 'Song',
    name: 'Special (feat. Don Toliver)',
    genre: 'Afrobeats',
    dateSent: '08/03/2023',
    status: 'Pending',
  },
  {
    id: '6',
    artistId: '52166565161',
    artistName: 'Wizkid',
    uploadType: 'Song',
    name: 'True Love',
    genre: 'Afrobeats',
    dateSent: '08/03/2023',
    status: 'Answered',
  },
  {
    id: '7',
    artistId: '52166565161',
    artistName: 'Wizkid',
    uploadType: 'Song',
    name: 'Slip N Slide',
    genre: 'Afrobeats',
    dateSent: '08/03/2023',
    status: 'Pending',
  },
  {
    id: '8',
    artistId: '52166565161',
    artistName: 'Wizkid',
    uploadType: 'Song',
    name: 'Deep',
    genre: 'Afrobeats',
    dateSent: '08/03/2023',
    status: 'Answered',
  },
  {
    id: '9',
    artistId: '52166565161',
    artistName: 'Wizkid',
    uploadType: 'Song',
    name: 'Money & Love',
    genre: 'Afrobeats',
    dateSent: '08/03/2023',
    status: 'Pending',
  },
];

type UploadRequest = typeof uploadRequests[0];

export default function MusicUploadApproval() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const columns: TableColumn<UploadRequest>[] = [
    {
      key: 'artistId',
      label: 'Artist Id',
      sortable: true,
    },
    {
      key: 'artistName',
      label: 'Name of Artist',
      sortable: true,
    },
    {
      key: 'uploadType',
      label: 'Upload Type',
      sortable: true,
    },
    {
      key: 'name',
      label: 'Name of Song/Album/Ep',
      sortable: true,
    },
    {
      key: 'genre',
      label: 'Genre',
      sortable: true,
    },
    {
      key: 'dateSent',
      label: 'Date sent',
      sortable: true,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: string) => (
        <Badge 
          variant={value === 'Answered' ? 'default' : 'secondary'}
          className={value === 'Answered' 
            ? 'bg-green-500 hover:bg-green-600 text-white' 
            : 'bg-orange-500 hover:bg-orange-600 text-white'
          }
        >
          {value}
        </Badge>
      ),
    },
    {
      key: 'id',
      label: 'Action',
      render: (_, item) => (
        <Button
          size="sm"
          className="bg-asra-red hover:bg-asra-red/90 text-white"
          onClick={() => navigate(`/music-upload/${item.id}`)}
        >
          <Eye className="w-4 h-4 mr-1" />
          View
        </Button>
      ),
    },
  ];

  const handleViewDetails = (id: string) => {
    navigate(`/music-upload/${id}`);
  };

  return (
    <div className="min-h-screen bg-asra-dark">
      {/* Custom Header */}
      <div className="bg-asra-dark border-b border-asra-gray-5 p-6">
        <div className="flex items-center justify-between">
          {/* Left Side - Date and Title */}
          <div className="space-y-2">
            <div className="text-white text-sm">Date: 03/02/2023</div>
            <h1 className="text-white text-3xl font-bold">Music Upload Approval</h1>
          </div>

          {/* Center - Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-asra-gray-6 w-4 h-4" />
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-10 pr-4 py-2 bg-asra-gray-1 border border-asra-gray-5 rounded-lg text-white placeholder:text-asra-gray-6 focus:outline-none focus:border-asra-red"
              />
            </div>
          </div>

          {/* Right Side - User Profile */}
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

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Upload Requests Table */}
        <div className="bg-asra-gray-1 rounded-lg border border-asra-gray-5 overflow-hidden">
          <DataTable
            data={uploadRequests}
            columns={columns}
            className="min-w-full"
          />
        </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-asra-red border-asra-red hover:bg-asra-red hover:text-white"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-asra-red border-asra-red hover:bg-asra-red hover:text-white"
            disabled={currentPage >= Math.ceil(uploadRequests.length / pageSize)}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        
        <div className="text-asra-gray-6 text-sm">
          Page {currentPage}
        </div>
      </div>
      </div>
    </div>
  );
}
