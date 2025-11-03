import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '@/components/common/DataTable';
import { Pagination } from '@/components/common/Pagination';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Eye, Search, Loader2 } from 'lucide-react';
import { TableColumn } from '@/types';
import { musicUploadService, MusicUploadItem, MusicUploadFilters } from '@/services/musicUploadService';

// Helper function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  });
};

// Helper function to format status display
const formatStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'pending': 'Pending',
    'approved': 'Approved',
    'rejected': 'Rejected',
  };
  return statusMap[status] || status;
};

export default function MusicUploadApproval() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<MusicUploadItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  
  // Filters
  const [search, setSearch] = useState('');
  const [uploadType, setUploadType] = useState<'song' | 'album' | ''>('');
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected' | ''>('');
  const [sortBy, setSortBy] = useState<'createdAt' | 'title' | 'artistName' | 'genre' | 'status'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Search debounce
  const [searchDebounce, setSearchDebounce] = useState<NodeJS.Timeout | null>(null);

  // Fetch data
  useEffect(() => {
    // Clear any existing search debounce
    if (searchDebounce) {
      clearTimeout(searchDebounce);
      setSearchDebounce(null);
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const filters: MusicUploadFilters = {
          search: search || undefined,
          uploadType: uploadType || undefined,
          status: status || undefined,
          page: currentPage,
          limit: pageSize,
          sortBy,
          sortOrder,
        };
        
        const response = await musicUploadService.getMusicUploads(filters);
        setData(response.data);
        setTotalPages(response.totalPages);
        setTotalResults(response.totalResults);
      } catch (err: any) {
        console.error('Error fetching music uploads:', err);
        setError(err.message || 'Failed to load music uploads');
      } finally {
        setLoading(false);
      }
    };

    // Debounce search, but not other filters
    if (search) {
      const timeout = setTimeout(() => {
        fetchData();
      }, 500);
      setSearchDebounce(timeout);
    } else {
      fetchData();
    }
    
    return () => {
      if (searchDebounce) {
        clearTimeout(searchDebounce);
      }
    };
  }, [currentPage, pageSize, uploadType, status, sortBy, sortOrder, search]);

  // Reset page when filters change (but not when page changes)
  useEffect(() => {
    setCurrentPage(1);
  }, [uploadType, status, sortBy, sortOrder]);

  const columns: TableColumn<MusicUploadItem>[] = [
    {
      key: 'artistId' as keyof MusicUploadItem,
      label: 'Artist Id',
      sortable: true,
    },
    {
      key: 'artistName' as keyof MusicUploadItem,
      label: 'Name of Artist',
      sortable: true,
    },
    {
      key: 'uploadType' as keyof MusicUploadItem,
      label: 'Upload Type',
      sortable: true,
      render: (value: string) => (
        <span className="capitalize">{value}</span>
      ),
    },
    {
      key: 'title' as keyof MusicUploadItem,
      label: 'Name of Song/Album/Ep',
      sortable: true,
    },
    {
      key: 'genre' as keyof MusicUploadItem,
      label: 'Genre',
      sortable: true,
    },
    {
      key: 'dateSent' as keyof MusicUploadItem,
      label: 'Date sent',
      sortable: true,
      render: (value: string) => formatDate(value),
    },
    {
      key: 'status' as keyof MusicUploadItem,
      label: 'Status',
      sortable: true,
      render: (value: string) => {
        const statusColors: Record<string, string> = {
          'pending': 'bg-orange-500 hover:bg-orange-600',
          'approved': 'bg-green-500 hover:bg-green-600',
          'rejected': 'bg-red-500 hover:bg-red-600',
        };
        
        return (
          <Badge 
            className={`${statusColors[value] || 'bg-gray-500'} text-white`}
          >
            {formatStatus(value)}
          </Badge>
        );
      },
    },
    {
      key: '_id' as keyof MusicUploadItem,
      label: 'Action',
      render: (_, item) => (
        <Button
          size="sm"
          className="bg-asra-red hover:bg-asra-red/90 text-white"
          onClick={() => navigate(`/music-upload/${item._id}`)}
        >
          <Eye className="w-4 h-4 mr-1" />
          View
        </Button>
      ),
    },
  ];

  const handleFilterChange = (filterType: 'uploadType' | 'status', value: string) => {
    if (filterType === 'uploadType') {
      setUploadType(value as 'song' | 'album' | '');
    } else {
      setStatus(value as 'pending' | 'approved' | 'rejected' | '');
    }
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleSortChange = (newSortBy: typeof sortBy) => {
    if (sortBy === newSortBy) {
      // Toggle sort order if same column
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc'); // Default to desc for new column
    }
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
                placeholder="Search by song/album title, artist name, or genre"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1); // Reset to page 1 on search
                }}
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
        {/* Filters */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-white text-sm font-medium">Upload Type:</label>
            <select
              value={uploadType}
              onChange={(e) => handleFilterChange('uploadType', e.target.value)}
              className="px-3 py-2 bg-asra-gray-800 border border-asra-gray-700 rounded-lg text-white focus:outline-none focus:border-asra-red"
            >
              <option value="">All</option>
              <option value="song">Song</option>
              <option value="album">Album</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-white text-sm font-medium">Status:</label>
            <select
              value={status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="px-3 py-2 bg-asra-gray-800 border border-asra-gray-700 rounded-lg text-white focus:outline-none focus:border-asra-red"
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-white text-sm font-medium">Sort By:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-3 py-2 bg-asra-gray-800 border border-asra-gray-700 rounded-lg text-white focus:outline-none focus:border-asra-red"
            >
              <option value="createdAt">Date</option>
              <option value="title">Title</option>
              <option value="artistName">Artist</option>
              <option value="genre">Genre</option>
              <option value="status">Status</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-white text-sm font-medium">Order:</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="px-3 py-2 bg-asra-gray-800 border border-asra-gray-700 rounded-lg text-white focus:outline-none focus:border-asra-red"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-4">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 text-asra-red animate-spin" />
            <span className="ml-3 text-white">Loading music uploads...</span>
          </div>
        ) : (
          <>
            {/* Upload Requests Table */}
            <div className="bg-asra-gray-1 rounded-lg border border-asra-gray-5 overflow-hidden">
              <DataTable
                data={data}
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
                  disabled={currentPage === 1 || loading}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-asra-red border-asra-red hover:bg-asra-red hover:text-white"
                  disabled={currentPage >= totalPages || loading}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              
              <div className="text-asra-gray-6 text-sm">
                Page {currentPage} of {totalPages} ({totalResults} total results)
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
