import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus, Search, Loader2, Upload } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { PlaylistCard } from '@/components/playlist/PlaylistCard';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { useAuth } from '@/hooks/useAuth';
import { LanguageToggle } from '@/components/common/LanguageToggle';
import { playlistService, Playlist } from '@/services/playlistService';

function formatDuration(seconds?: number): string {
  const total = Math.max(0, Math.floor(seconds || 0));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}min`;
  return `${minutes}min`;
}

export default function PlaylistManagement() {
  const { t } = useTranslation('playlist');
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);

  const [createOpen, setCreateOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadPlaylists = async () => {
    setLoading(true);
    try {
      const data = await playlistService.listPlaylists();
      setPlaylists(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('management.errors.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlaylists();
  }, []);

  const filteredPlaylists = playlists.filter(
    (playlist) =>
      playlist.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (playlist.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePlaylistClick = (playlistId: string) => {
    navigate(`/playlist-management/${playlistId}`);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setIsPublic(true);
    setCoverImage(null);
  };

  const closeCreateDialog = (force = false) => {
    if (!force && submitting) return;
    setCreateOpen(false);
    resetForm();
  };

  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error(t('management.errors.titleRequired'));
      return;
    }

    setSubmitting(true);
    try {
      const playlist = await playlistService.createPlaylist({
        title,
        description: description || undefined,
        isPublic,
        coverImage: coverImage || undefined,
      });
      toast.success(t('management.success.created'));
      closeCreateDialog(true);
      await loadPlaylists();
      navigate(`/playlist-management/${playlist._id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('management.errors.createFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-asra-dark">
      {/* Custom Header */}
      <div className="bg-asra-dark border-b border-asra-gray-5 p-6">
        <div className="flex items-center justify-between">
          {/* Left Side - Date and Title */}
          <div className="space-y-2">
            <div className="text-white text-sm">{t('management.header.date')}</div>
            <h1 className="text-white text-3xl font-bold">{t('management.header.title')}</h1>
          </div>

          {/* Center - Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-asra-gray-6 w-4 h-4" />
              <input
                type="text"
                placeholder={t('management.header.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-asra-gray-1 border border-asra-gray-5 rounded-lg text-white placeholder:text-asra-gray-6 focus:outline-none focus:border-asra-red"
              />
            </div>
          </div>

          {/* Right Side - New Playlist Button and User Profile */}
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setCreateOpen(true)}
              className="bg-asra-red hover:bg-asra-red/90 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('management.newPlaylist')}
            </Button>

            {/* User Profile */}
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
              <span className="text-white text-sm font-medium">{user?.name || t('management.header.defaultUser')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-asra-red animate-spin" />
          </div>
        ) : (
          <>
            {/* Playlists Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPlaylists.map((playlist) => (
                <PlaylistCard
                  key={playlist._id}
                  playlist={{
                    id: playlist._id,
                    title: playlist.title,
                    artists: playlist.description || '',
                    image: playlist.coverImageUrl || '',
                    banner: playlist.bannerText,
                    songCount: playlist.songCount || playlist.songs?.length || 0,
                    duration: formatDuration(
                      playlist.songs?.reduce((sum, s) => sum + (s.duration || 0), 0)
                    ),
                    likes: String(playlist.likes ?? 0),
                    isPublic: playlist.isPublic,
                  }}
                  onClick={() => handlePlaylistClick(playlist._id)}
                />
              ))}
            </div>

            {/* Empty State */}
            {filteredPlaylists.length === 0 && (
              <div className="text-center py-12">
                <div className="text-asra-gray-6 text-lg mb-4">
                  {t('management.emptyState.message')}
                </div>
                {searchQuery && (
                  <Button
                    onClick={() => setSearchQuery('')}
                    variant="outline"
                    className="border-asra-gray-5 text-white hover:bg-asra-gray-2"
                  >
                    {t('management.emptyState.clearSearch')}
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <Dialog open={createOpen} onOpenChange={(open) => !open && closeCreateDialog()}>
        <DialogContent className="bg-asra-gray-1 border-asra-gray-2 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">{t('management.createDialog.title')}</DialogTitle>
            <DialogDescription className="text-asra-gray-6">
              {t('management.createDialog.description')}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreatePlaylist} className="space-y-4">
            <div>
              <label className="text-white text-sm font-medium mb-1 block">
                {t('management.createDialog.titleLabel')}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t('management.createDialog.titlePlaceholder')}
                className="w-full px-4 py-3 bg-asra-gray-2 border border-asra-gray-5 rounded-lg text-white placeholder:text-asra-gray-6 caret-white focus:outline-none focus:border-asra-red"
              />
            </div>

            <div>
              <label className="text-white text-sm font-medium mb-1 block">
                {t('management.createDialog.descriptionLabel')}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('management.createDialog.descriptionPlaceholder')}
                rows={2}
                className="w-full px-4 py-3 bg-asra-gray-2 border border-asra-gray-5 rounded-lg text-white placeholder:text-asra-gray-6 caret-white focus:outline-none focus:border-asra-red resize-none"
              />
            </div>

            <div>
              <label className="text-white text-sm font-medium mb-1 block">
                {t('management.createDialog.coverImageLabel')}
              </label>
              <label className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-asra-gray-2 border border-dashed border-asra-gray-5 rounded-lg text-asra-gray-6 cursor-pointer hover:border-asra-red transition-colors">
                <Upload className="w-4 h-4" />
                {coverImage ? coverImage.name : t('management.createDialog.coverImageUpload')}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
                />
              </label>
            </div>

            <label className="flex items-center gap-2 text-sm text-white">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="accent-asra-red"
              />
              {t('management.createDialog.isPublicLabel')}
            </label>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => closeCreateDialog()}
                disabled={submitting}
                className="border-asra-gray-5 text-white hover:bg-asra-gray-2 hover:text-white"
              >
                {t('management.createDialog.cancel')}
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-asra-red hover:bg-asra-red/90 text-white"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t('management.createDialog.submitting')}
                  </>
                ) : (
                  t('management.createDialog.submit')
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
