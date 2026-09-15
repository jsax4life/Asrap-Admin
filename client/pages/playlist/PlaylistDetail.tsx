import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Clock, Plus, Search, Loader2, X, ImagePlus, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/common/DataTable';
import { TableColumn } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';

import { useAuth } from '@/hooks/useAuth';
import { LanguageToggle } from '@/components/common/LanguageToggle';
import { playlistService, Playlist, PlaylistSongItem } from '@/services/playlistService';
import { songService, SongItem } from '@/services/songService';

function formatDuration(seconds?: number): string {
  const total = Math.max(0, Math.floor(seconds || 0));
  const minutes = Math.floor(total / 60);
  const secs = total % 60;
  return `${minutes}:${String(secs).padStart(2, '0')}`;
}

function formatTotalDuration(seconds: number): string {
  const total = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}min`;
  return `${minutes}min`;
}

function artistLabel(artist?: SongItem['artist'] | PlaylistSongItem['artist']): string {
  if (!artist) return '';
  return artist.stageName || artist.name || '';
}

export default function PlaylistDetail() {
  const { t } = useTranslation('playlist');
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState(true);

  const [coverOpen, setCoverOpen] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const mutationPending = useRef(false);

  useEffect(() => {
    if (!coverFile) { setCoverPreview(''); return; }
    const url = URL.createObjectURL(coverFile);
    setCoverPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [coverFile]);

  const handleSaveCover = async () => {
    if (!id || !coverFile || mutationPending.current) return;
    mutationPending.current = true;
    setSaving(true);
    try {
      const updated = await playlistService.updatePlaylist(id, { coverImage: coverFile });
      setPlaylist(updated);
      setCoverOpen(false);
      setCoverFile(null);
      toast.success(t('detail.photo.updated'));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('detail.photo.failed'));
    } finally { mutationPending.current = false; setSaving(false); }
  };

  const handleDeletePlaylist = async () => {
    if (!id || mutationPending.current) return;
    mutationPending.current = true;
    setSaving(true);
    try {
      await playlistService.deletePlaylist(id);
      toast.success(t('detail.delete.deleted'));
      navigate('/playlist-management', { replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('detail.delete.failed'));
    } finally { mutationPending.current = false; setSaving(false); }
  };

  const [addOpen, setAddOpen] = useState(false);
  const [catalogSongs, setCatalogSongs] = useState<SongItem[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [songSearch, setSongSearch] = useState('');
  const [addingSongId, setAddingSongId] = useState<string | null>(null);

  const loadPlaylist = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await playlistService.getPlaylist(id);
      setPlaylist(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('detail.errors.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlaylist();
  }, [id]);

  const handleGoBack = () => {
    navigate('/playlist-management');
  };

  const openAddDialog = async () => {
    setAddOpen(true);
    if (catalogSongs.length > 0) return;
    setCatalogLoading(true);
    try {
      const songs = await songService.listSongs();
      setCatalogSongs(songs);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('detail.errors.catalogLoadFailed'));
    } finally {
      setCatalogLoading(false);
    }
  };

  const playlistSongIds = new Set((playlist?.songs || []).map((s) => s._id));

  const filteredCatalogSongs = catalogSongs.filter(
    (song) =>
      !playlistSongIds.has(song._id) &&
      (song.title.toLowerCase().includes(songSearch.toLowerCase()) ||
        artistLabel(song.artist).toLowerCase().includes(songSearch.toLowerCase()))
  );

  const handleAddSong = async (songId: string) => {
    if (!id) return;
    setAddingSongId(songId);
    try {
      const updated = await playlistService.addSongs(id, [songId]);
      setPlaylist(updated);
      toast.success(t('detail.success.songAdded'));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('detail.errors.addSongFailed'));
    } finally {
      setAddingSongId(null);
    }
  };

  const handleRemoveSong = async (songId: string) => {
    if (!id) return;
    try {
      await playlistService.removeSong(id, songId);
      await loadPlaylist();
      toast.success(t('detail.success.songRemoved'));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('detail.errors.removeSongFailed'));
    }
  };

  const songs = playlist?.songs || [];
  const totalDurationSeconds = songs.reduce((sum, s) => sum + (s.duration || 0), 0);

  const columns: TableColumn<PlaylistSongItem>[] = [
    {
      key: 'title',
      label: t('detail.columns.title'),
      render: (_, song) => (
        <div className="flex items-center gap-3">
          <img
            src={song.coverPhotoUrl || playlist?.coverImageUrl || ''}
            alt={song.title}
            className="w-10 h-10 rounded object-cover bg-asra-gray-2"
          />
          <div>
            <div className="text-white text-sm font-medium">{song.title}</div>
            <div className="text-asra-gray-6 text-xs">{artistLabel(song.artist)}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'album',
      label: t('detail.columns.album'),
      render: (_, song) => (
        <span className="text-asra-gray-6 text-sm">{song.album?.title || '—'}</span>
      ),
    },
    {
      key: 'duration',
      label: t('detail.columns.duration'),
      render: (_, song) => (
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-asra-gray-6" />
          <span className="text-asra-gray-6 text-sm">{formatDuration(song.duration)}</span>
        </div>
      ),
    },
    {
      key: '_id',
      label: '',
      render: (_, song) => (
        <button
          onClick={() => handleRemoveSong(song._id)}
          className="text-asra-gray-6 hover:text-red-400 transition-colors"
          title={t('detail.removeSong')}
        >
          <X className="w-4 h-4" />
        </button>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-asra-red to-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-asra-red to-black flex flex-col items-center justify-center gap-4">
        <p className="text-white">{t('detail.errors.loadFailed')}</p>
        <Button onClick={handleGoBack} className="bg-white text-asra-red hover:bg-white/90">
          {t('detail.goBack')}
        </Button>
      </div>
    );
  }

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
          {t('detail.goBack')}
        </button>

        {/* User Profile */}
        <LanguageToggle />
        <div
          onClick={() => navigate('/settings')}
          className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div className="relative w-8 h-8">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-asra-gray-1 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">S</span>
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <span className="text-white text-sm font-medium">{user?.name || t('detail.defaultUser')}</span>
        </div>
      </div>

      {/* Playlist Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-6 pb-8">
        {/* Left Column - Playlist Cover */}
        <div className="lg:col-span-1">
          <div className="relative">
            <div className="aspect-square bg-asra-red rounded-lg overflow-hidden">
              {playlist.coverImageUrl ? (
                <img
                  src={playlist.coverImageUrl}
                  alt={playlist.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-white/60 text-sm">{t('detail.noCover')}</span>
                </div>
              )}
            </div>

            <Button onClick={() => setCoverOpen(true)} disabled={saving}
              className="w-full mt-4 bg-asra-red hover:bg-asra-red/90 text-white">
              <ImagePlus className="w-4 h-4 mr-2" />{t('detail.photo.edit')}
            </Button>
            <Button onClick={() => setDeleteOpen(true)} disabled={saving}
              variant="outline" className="w-full mt-3 border-white/40 bg-black/30 text-white hover:bg-black/50 hover:text-white">
              <Trash2 className="w-4 h-4 mr-2" />{t('detail.delete.title')}
            </Button>

            {/* Add to Playlist Button */}
            <Button
              onClick={openAddDialog}
              className="w-full mt-4 bg-asra-red hover:bg-asra-red/90 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('detail.addToPlaylist')}
            </Button>
          </div>
        </div>

        {/* Right Column - Playlist Information */}
        <div className="lg:col-span-2 flex flex-col justify-center space-y-6">
          <div>
            <div className="text-white text-sm mb-3 font-medium">
              {playlist.isPublic ? t('detail.publicPlaylist') : t('detail.privatePlaylist')}
            </div>
            <h1 className="text-white text-5xl font-bold mb-6 leading-tight">{playlist.title}</h1>
            {playlist.description && (
              <p className="text-white text-lg mb-8 leading-relaxed">{playlist.description}</p>
            )}
          </div>

          <div className="flex items-center gap-3 text-sm flex-wrap">
            <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
              <span className="text-asra-red text-xs font-bold">S</span>
            </div>
            <span className="text-white font-medium">AsraPa</span>
            <span className="text-white text-lg">•</span>
            <span className="text-white">
              {t('detail.songsAndDuration', {
                songCount: songs.length,
                duration: formatTotalDuration(totalDurationSeconds),
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Songs Table */}
      <div className="bg-black/50 backdrop-blur-sm rounded-lg border border-asra-gray-5 overflow-hidden mx-6 mb-8">
        {songs.length > 0 ? (
          <DataTable data={songs} columns={columns} className="min-w-full" />
        ) : (
          <p className="text-center text-white/70 py-12">{t('detail.emptySongs')}</p>
        )}
      </div>

      <Dialog open={coverOpen} onOpenChange={(open) => {
        if (mutationPending.current) return;
        setCoverOpen(open);
        if (!open) setCoverFile(null);
      }}>
        <DialogContent className="bg-asra-gray-1 border-asra-gray-2 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('detail.photo.edit')}</DialogTitle>
            <DialogDescription className="text-asra-gray-6">{t('detail.photo.help')}</DialogDescription>
          </DialogHeader>
          {(coverPreview || playlist.coverImageUrl) && <img src={coverPreview || playlist.coverImageUrl || ''}
            alt={playlist.title} className="w-48 h-48 mx-auto rounded-lg object-cover" />}
          <label htmlFor="playlist-cover-file">{t('detail.photo.choose')}</label>
          <input id="playlist-cover-file" type="file" accept="image/jpeg,image/png,image/webp" disabled={saving}
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = '';
              if (!file) return;
              if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size === 0 || file.size > 5 * 1024 * 1024) {
                setCoverFile(null);
                toast.error(t('detail.photo.invalid'));
                return;
              }
              setCoverFile(file);
            }} />
          {coverFile && <p className="text-sm break-all">{coverFile.name}</p>}
          <DialogFooter>
            <Button variant="outline" disabled={saving} onClick={() => { setCoverOpen(false); setCoverFile(null); }}
              className="bg-transparent text-white hover:bg-white/10 hover:text-white">{t('detail.photo.cancel')}</Button>
            <Button disabled={saving || !coverFile} onClick={handleSaveCover} className="bg-asra-red hover:bg-asra-red/90 text-white">
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}{t('detail.photo.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={(open) => { if (!mutationPending.current) setDeleteOpen(open); }}>
        <AlertDialogContent className="bg-asra-gray-1 border-asra-gray-2 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>{t('detail.delete.title')}</AlertDialogTitle>
            <AlertDialogDescription className="text-asra-gray-6">{t('detail.delete.confirm', { title: playlist.title })}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={saving} className="bg-transparent text-white hover:bg-white/10 hover:text-white">{t('detail.photo.cancel')}</AlertDialogCancel>
            <AlertDialogAction disabled={saving} onClick={(event) => { event.preventDefault(); void handleDeletePlaylist(); }}
              className="bg-asra-red hover:bg-asra-red/90 text-white">
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}{t('detail.delete.action')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="bg-asra-gray-1 border-asra-gray-2 text-white sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">{t('detail.addDialog.title')}</DialogTitle>
            <DialogDescription className="text-asra-gray-6">
              {t('detail.addDialog.description')}
            </DialogDescription>
          </DialogHeader>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-asra-gray-6 w-4 h-4" />
            <input
              type="text"
              value={songSearch}
              onChange={(e) => setSongSearch(e.target.value)}
              placeholder={t('detail.searchPlaceholder')}
              className="w-full pl-10 pr-4 py-2 bg-asra-gray-2 border border-asra-gray-5 rounded-lg text-white placeholder:text-asra-gray-6 caret-white focus:outline-none focus:border-asra-red"
            />
          </div>

          <div className="max-h-80 overflow-y-auto space-y-1">
            {catalogLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 text-asra-red animate-spin" />
              </div>
            ) : filteredCatalogSongs.length === 0 ? (
              <p className="text-center text-asra-gray-6 py-8 text-sm">{t('detail.addDialog.empty')}</p>
            ) : (
              filteredCatalogSongs.map((song) => (
                <div
                  key={song._id}
                  className="flex items-center justify-between gap-3 px-2 py-2 rounded-lg hover:bg-asra-gray-2"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={song.coverPhotoUrl || ''}
                      alt={song.title}
                      className="w-9 h-9 rounded object-cover bg-asra-gray-2 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-white text-sm font-medium truncate">{song.title}</div>
                      <div className="text-asra-gray-6 text-xs truncate">{artistLabel(song.artist)}</div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleAddSong(song._id)}
                    disabled={addingSongId === song._id}
                    className="bg-asra-red hover:bg-asra-red/90 text-white flex-shrink-0"
                  >
                    {addingSongId === song._id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Plus className="w-3.5 h-3.5" />
                    )}
                  </Button>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
