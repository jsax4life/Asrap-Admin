import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { DataTable } from '@/components/common/DataTable';
import { Pagination } from '@/components/common/Pagination';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ChevronLeft, ChevronRight, Eye, Trash2, Search, Loader2 } from 'lucide-react';
import { TableColumn } from '@/types';
import { musicUploadService, MusicUploadItem, MusicUploadFilters } from '@/services/musicUploadService';

import { useAuth } from '@/hooks/useAuth';
import { LanguageToggle } from '@/components/common/LanguageToggle';
// Helper function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

export default function MusicUploadApproval() {
  const { t } = useTranslation('musicUpload');
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<MusicUploadItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState<MusicUploadItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Helper function to format status display
  const formatStatus = (status: string): string => {
    const statusMap: Record<string, string> = {
      'pending': t('status.pending'),
      'approved': t('status.approved'),
      'rejected': t('status.rejected'),
    };
    return statusMap[status] || status;
  };

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
        setError(err.message || t('approval.errorLoading'));
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
      label: t('approval.columns.artistId'),
      sortable: true,
    },
    {
      key: 'artistName' as keyof MusicUploadItem,
      label: t('approval.columns.artistName'),
      sortable: true,
    },
    {
      key: 'uploadType' as keyof MusicUploadItem,
      label: t('approval.columns.uploadType'),
      sortable: true,
      render: (value: string) => (
        <span className="capitalize">{value}</span>
      ),
    },
    {
      key: 'title' as keyof MusicUploadItem,
      label: t('approval.columns.title'),
      sortable: true,
    },
    {
      key: 'genre' as keyof MusicUploadItem,
      label: t('approval.columns.genre'),
      sortable: true,
    },
    {
      key: 'dateSent' as keyof MusicUploadItem,
      label: t('approval.columns.dateSent'),
      sortable: true,
      render: (value: string) => formatDate(value),
    },
    {
      key: 'status' as keyof MusicUploadItem,
      label: t('approval.columns.status'),
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
      label: t('approval.columns.action'),
      render: (_, item) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="bg-asra-red hover:bg-asra-red/90 text-white"
            onClick={() => navigate(`/music-upload/${item._id}`)}
          >
            <Eye className="w-4 h-4 mr-1" />
            {t('approval.viewButton')}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-red-500 text-red-400 hover:bg-red-500/20 hover:text-red-300"
            onClick={() => setDeleteTarget(item)}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            {t('approval.removeButton')}
          </Button>
        </div>
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

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      const response = await musicUploadService.deleteMusicUpload(deleteTarget._id);
      toast.success(response.message || t('approval.toasts.deleteSuccess', { title: deleteTarget.title }));
      setData((prev) => prev.filter((item) => item._id !== deleteTarget._id));
      setTotalResults((prev) => Math.max(0, prev - 1));
      setDeleteTarget(null);
    } catch (error: any) {
      console.error('Error removing music upload:', error);
      const notReady = error?.statusCode === 404 || error?.statusCode === 501;
      toast.error(notReady ? t('approval.toasts.deleteComingSoon') : (error?.message || t('approval.toasts.deleteError')));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-asra-dark">
      {/* Custom Header */}
      <div className="bg-asra-dark border-b border-asra-gray-5 p-6">
        <div className="flex items-center justify-between">
          {/* Left Side - Date and Title */}
          <div className="space-y-2">
            <div className="text-white text-sm">{t('approval.header.date')}</div>
            <h1 className="text-white text-3xl font-bold">{t('approval.header.title')}</h1>
          </div>

          {/* Center - Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-asra-gray-6 w-4 h-4" />
              <input
                type="text"
                placeholder={t('approval.header.searchPlaceholder')}
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
          <LanguageToggle />
          <div
            onClick={() => navigate('/settings')}
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="relative w-8 h-8">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center border border-white">
                <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">S</span>
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <span className="text-white text-sm font-medium">{user?.name || t('approval.header.defaultUser')}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Filters */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-white text-sm font-medium">{t('approval.filters.uploadType')}</label>
            <select
              value={uploadType}
              onChange={(e) => handleFilterChange('uploadType', e.target.value)}
              className="px-3 py-2 bg-asra-gray-800 border border-asra-gray-700 rounded-lg text-white focus:outline-none focus:border-asra-red"
            >
              <option value="">{t('approval.filters.uploadTypeAll')}</option>
              <option value="song">{t('approval.filters.uploadTypeSong')}</option>
              <option value="album">{t('approval.filters.uploadTypeAlbum')}</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-white text-sm font-medium">{t('approval.filters.status')}</label>
            <select
              value={status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="px-3 py-2 bg-asra-gray-800 border border-asra-gray-700 rounded-lg text-white focus:outline-none focus:border-asra-red"
            >
              <option value="">{t('approval.filters.statusAll')}</option>
              <option value="pending">{t('status.pending')}</option>
              <option value="approved">{t('status.approved')}</option>
              <option value="rejected">{t('status.rejected')}</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-white text-sm font-medium">{t('approval.filters.sortBy')}</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-3 py-2 bg-asra-gray-800 border border-asra-gray-700 rounded-lg text-white focus:outline-none focus:border-asra-red"
            >
              <option value="createdAt">{t('approval.filters.sortByDate')}</option>
              <option value="title">{t('approval.filters.sortByTitle')}</option>
              <option value="artistName">{t('approval.filters.sortByArtist')}</option>
              <option value="genre">{t('approval.filters.sortByGenre')}</option>
              <option value="status">{t('approval.filters.sortByStatus')}</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-white text-sm font-medium">{t('approval.filters.order')}</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="px-3 py-2 bg-asra-gray-800 border border-asra-gray-700 rounded-lg text-white focus:outline-none focus:border-asra-red"
            >
              <option value="desc">{t('approval.filters.orderDesc')}</option>
              <option value="asc">{t('approval.filters.orderAsc')}</option>
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
            <span className="ml-3 text-white">{t('approval.loading')}</span>
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
                  {t('approval.pagination.previous')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-asra-red border-asra-red hover:bg-asra-red hover:text-white"
                  disabled={currentPage >= totalPages || loading}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  {t('approval.pagination.next')}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>

              <div className="text-asra-gray-6 text-sm">
                {t('approval.pagination.summary', { currentPage, totalPages, totalResults })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Remove Confirmation Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && !isDeleting && setDeleteTarget(null)}>
        <AlertDialogContent className="bg-asra-gray-1 border-asra-gray-2 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>{t('approval.deleteDialog.title')}</AlertDialogTitle>
            <AlertDialogDescription className="text-asra-gray-6">
              {t('approval.deleteDialog.description', { title: deleteTarget?.title })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isDeleting}
              className="bg-asra-gray-2 border-asra-gray-2 text-white hover:bg-asra-gray-800"
            >
              {t('approval.deleteDialog.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? t('approval.deleteDialog.deleting') : t('approval.deleteDialog.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
