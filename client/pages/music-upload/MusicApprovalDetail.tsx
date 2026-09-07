import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AudioPlayer } from '@/components/music-upload/AudioPlayer';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { musicUploadService, MusicUploadDetail, AlbumSong, SongDetail, AlbumDetail } from '@/services/musicUploadService';

// Helper function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

// Helper function to format duration from seconds to MM:SS
const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Type guards
const isSong = (upload: MusicUploadDetail): upload is MusicUploadDetail & SongDetail => {
  return upload.uploadType === 'song' && 'songUrlPresigned' in upload;
};

const isAlbum = (upload: MusicUploadDetail): upload is MusicUploadDetail & AlbumDetail => {
  return upload.uploadType === 'album' && 'songs' in upload;
};

export default function MusicApprovalDetail() {
  const { t } = useTranslation('musicUpload');
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'audio' | 'lyrics'>('audio');
  const [comment, setComment] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadData, setUploadData] = useState<MusicUploadDetail | null>(null);
  const [isEditingLyrics, setIsEditingLyrics] = useState(false);
  const [editedLyrics, setEditedLyrics] = useState('');
  const [isSavingLyrics, setIsSavingLyrics] = useState(false);

  // Helper function to format status display
  const formatStatus = (status: string): string => {
    const statusMap: Record<string, string> = {
      'pending': t('status.pending'),
      'approved': t('status.approved'),
      'rejected': t('status.rejected'),
    };
    return statusMap[status] || status;
  };

  // Fetch upload detail function
  const fetchUploadDetail = async () => {
    if (!id) {
      setError(t('detail.invalidId'));
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await musicUploadService.getMusicUploadDetail(id);
      if (response.status === 'success' && response.data) {
        setUploadData(response.data);
      } else {
        setError(t('detail.errorLoadingDetail'));
      }
    } catch (err: any) {
      console.error('Error fetching upload detail:', err);
      setError(err.message || t('detail.errorLoadingDetail'));
    } finally {
      setLoading(false);
    }
  };

  // Fetch upload detail on mount and when id changes
  useEffect(() => {
    fetchUploadDetail();
  }, [id]);

  // Reset tab to 'audio' if it's an album (albums don't have lyrics)
  useEffect(() => {
    if (uploadData && uploadData.uploadType === 'album' && activeTab === 'lyrics') {
      setActiveTab('audio');
    }
  }, [uploadData, activeTab]);

  const handleApprove = async () => {
    if (!uploadData || !id) return;

    setIsProcessing(true);
    try {
      const response = await musicUploadService.updateUploadStatus(
        id,
        'approved',
        comment.trim() || t('detail.defaultApproveComment')
      );

      if (response.status === 'success') {
        toast.success(response.message || t('detail.toasts.approveSuccess'));
        // Clear comment and refetch data to show updated status
        setComment('');
        await fetchUploadDetail();
      } else {
        throw new Error(response.message || t('detail.toasts.approveError'));
      }
    } catch (error: any) {
      console.error('Approve error:', error);
      toast.error(error.message || t('detail.toasts.approveError'));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDecline = async () => {
    if (!uploadData || !id) return;

    if (!comment.trim()) {
      const message = uploadData.status === 'approved'
        ? t('detail.toasts.rejectReasonRequiredApproved')
        : t('detail.toasts.rejectReasonRequired');
      toast.error(message);
      return;
    }

    setIsProcessing(true);
    try {
      const response = await musicUploadService.updateUploadStatus(
        id,
        'rejected',
        comment.trim()
      );

      if (response.status === 'success') {
        toast.success(response.message || t('detail.toasts.declineSuccess'));
        // Clear comment and refetch data to show updated status
        setComment('');
        await fetchUploadDetail();
      } else {
        throw new Error(response.message || t('detail.toasts.declineError'));
      }
    } catch (error: any) {
      console.error('Decline error:', error);
      toast.error(error.message || t('detail.toasts.declineError'));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGoBack = () => {
    navigate('/music-upload');
  };

  const openEditLyrics = () => {
    if (!uploadData || !isSong(uploadData)) return;
    setEditedLyrics(uploadData.lyrics || '');
    setIsEditingLyrics(true);
  };

  const handleSaveLyrics = async () => {
    if (!id) return;

    setIsSavingLyrics(true);
    try {
      const response = await musicUploadService.updateLyrics(id, editedLyrics.trim());

      if (response.status === 'success') {
        toast.success(response.message || t('detail.toasts.lyricsSaveSuccess'));
        setIsEditingLyrics(false);
        await fetchUploadDetail();
      } else {
        throw new Error(response.message || t('detail.toasts.lyricsSaveError'));
      }
    } catch (error: any) {
      console.error('Save lyrics error:', error);
      if (error.statusCode === 404 || error.statusCode === 501) {
        toast(t('detail.editLyricsComingSoon'));
      } else {
        toast.error(error.message || t('detail.toasts.lyricsSaveError'));
      }
    } finally {
      setIsSavingLyrics(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-asra-red animate-spin" />
        <span className="ml-3 text-white">{t('detail.loading')}</span>
      </div>
    );
  }

  // Error state
  if (error || !uploadData) {
    return (
      <div className="space-y-4">
        <button
          onClick={handleGoBack}
          className="text-asra-red hover:text-asra-red/80 text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('detail.goBack')}
        </button>
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-6">
          <p className="text-red-400">{error || t('detail.notFound')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 m-6">
      {/* Go Back Button */}
      <button
        onClick={handleGoBack}
        className="text-asra-red hover:text-asra-red/80 text-sm font-medium flex items-center gap-2 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('detail.goBack')}
      </button>

      {/* Tabs - Only show lyrics tab for songs */}
      <div className="flex gap-4 border-b border-asra-gray-5">
        <button
          onClick={() => setActiveTab('audio')}
          className={`pb-3 px-1 text-sm font-medium transition-colors ${
            activeTab === 'audio'
              ? 'text-asra-red border-b-2 border-asra-red'
              : 'text-asra-gray-6 hover:text-white'
          }`}
        >
          {uploadData.uploadType === 'album' ? t('detail.tabs.songs') : t('detail.tabs.audio')}
        </button>
        {isSong(uploadData) && (
          <button
            onClick={() => setActiveTab('lyrics')}
            className={`pb-3 px-1 text-sm font-medium transition-colors ${
              activeTab === 'lyrics'
                ? 'text-asra-red border-b-2 border-asra-red'
                : 'text-asra-gray-6 hover:text-white'
            }`}
          >
            {t('detail.tabs.lyrics')}
          </button>
        )}
      </div>

      {/* Content */}
      {activeTab === 'audio' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Album Art and Audio Player / Songs List */}
          <div className="space-y-6">
            {/* Album Art */}
            <div className="relative">
              <img
                src={uploadData.coverPhotoUrl}
                alt={uploadData.title}
                className="w-full max-w-md mx-auto max-h-80 object-cover rounded-lg shadow-lg"
              />
            </div>

            {/* Audio Player (for songs) */}
            {isSong(uploadData) && (
              <div className="bg-asra-gray-1 rounded-lg p-6">
                <AudioPlayer
                  audioUrl={uploadData.songUrlPresigned}
                  currentTime="0:00"
                  duration={formatDuration(uploadData.duration)}
                />
              </div>
            )}

            {/* Songs List (for albums) */}
            {isAlbum(uploadData) && (
              <div className="bg-asra-gray-1 rounded-lg p-6">
                <h4 className="text-white text-lg font-semibold mb-4">
                  {t('detail.albumSongsTitle', { count: uploadData.songCount })}
                </h4>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {uploadData.songs.map((song, index) => (
                    <div
                      key={song._id}
                      className="bg-asra-gray-2 rounded-lg p-4 border border-asra-gray-5 space-y-3"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 w-16 h-16 rounded overflow-hidden">
                          <img
                            src={song.coverPhotoUrl}
                            alt={song.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">
                            {index + 1}. {song.title}
                          </p>
                          <p className="text-asra-gray-6 text-sm">
                            {formatDuration(song.duration)}
                          </p>
                        </div>
                      </div>
                      <div className="bg-asra-gray-1 rounded p-3">
                        <AudioPlayer
                          audioUrl={song.songUrlPresigned}
                          currentTime="0:00"
                          duration={formatDuration(song.duration)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Approval Actions and Comments */}
          <div className="space-y-6">
            {/* Song/Album Info */}
            <div className="bg-asra-gray-1 rounded-lg p-6">
              <h3 className="text-white text-xl font-bold mb-4">{uploadData.title}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-asra-gray-6">{t('detail.info.artist')}</span>
                  <span className="text-white">{uploadData.artist.stageName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-asra-gray-6">{t('detail.info.fullName')}</span>
                  <span className="text-white">{uploadData.artist.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-asra-gray-6">{t('detail.info.genre')}</span>
                  <span className="text-white">{uploadData.genre}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-asra-gray-6">{t('detail.info.uploadType')}</span>
                  <span className="text-white capitalize">{uploadData.uploadType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-asra-gray-6">{t('detail.info.dateSent')}</span>
                  <span className="text-white">{formatDate(uploadData.dateSent)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-asra-gray-6">{t('detail.info.status')}</span>
                  <span className="text-white">{formatStatus(uploadData.status)}</span>
                </div>

                {/* Song-specific fields */}
                {isSong(uploadData) && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-asra-gray-6">{t('detail.info.duration')}</span>
                      <span className="text-white">{formatDuration(uploadData.duration)}</span>
                    </div>
                    {uploadData.collaborators && uploadData.collaborators.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-asra-gray-6">{t('detail.info.collaborators')}</span>
                        <span className="text-white">
                          {uploadData.collaborators.map(c => c.stageName).join(', ')}
                        </span>
                      </div>
                    )}
                    {uploadData.isExplicit && (
                      <div className="flex justify-between">
                        <span className="text-asra-gray-6">{t('detail.info.content')}</span>
                        <span className="text-orange-500 font-semibold">{t('detail.info.explicit')}</span>
                      </div>
                    )}
                    {uploadData.streams !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-asra-gray-6">{t('detail.info.streams')}</span>
                        <span className="text-white">{uploadData.streams.toLocaleString()}</span>
                      </div>
                    )}
                    {uploadData.downloads !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-asra-gray-6">{t('detail.info.downloads')}</span>
                        <span className="text-white">{uploadData.downloads.toLocaleString()}</span>
                      </div>
                    )}
                  </>
                )}

                {/* Album-specific fields */}
                {isAlbum(uploadData) && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-asra-gray-6">{t('detail.info.songCount')}</span>
                      <span className="text-white">{uploadData.songCount}</span>
                    </div>
                    {uploadData.caption && (
                      <div className="flex flex-col">
                        <span className="text-asra-gray-6 mb-1">{t('detail.info.caption')}</span>
                        <span className="text-white">{uploadData.caption}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Comment Section */}
            <div className="space-y-4">
              <h4 className="text-white text-lg font-semibold">
                {t('detail.comment.label')}
                {uploadData.status === 'pending' && (
                  <span className="text-asra-gray-6 text-sm font-normal">{t('detail.comment.requiredToReject')}</span>
                )}
                {uploadData.status === 'approved' && (
                  <span className="text-asra-gray-6 text-sm font-normal">{t('detail.comment.requiredToChangeStatus')}</span>
                )}
              </h4>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={t('detail.comment.placeholder')}
                className="bg-asra-gray-2 border-asra-gray-5 text-white placeholder:text-asra-gray-6 min-h-[120px]"
              />
            </div>

            {/* Current Status Display */}
            {uploadData.status !== 'pending' && (
              <div className={`rounded-lg p-4 ${
                uploadData.status === 'approved'
                  ? 'bg-green-500/20 border border-green-500'
                  : 'bg-red-500/20 border border-red-500'
              }`}>
                <p className={`font-semibold ${
                  uploadData.status === 'approved' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {t('detail.currentStatus')}<span className="capitalize">{formatStatus(uploadData.status)}</span>
                  {uploadData.comment && (
                    <span className="block mt-2 text-sm font-normal text-white">
                      {t('detail.previousComment')}{uploadData.comment}
                    </span>
                  )}
                </p>
              </div>
            )}

            {/* Approval Actions */}
            <div className="flex gap-4">
              {uploadData.status === 'pending' && (
                <>
                  <Button
                    onClick={handleApprove}
                    disabled={isProcessing}
                    className="flex-1 bg-asra-red hover:bg-asra-red/90 text-white"
                  >
                    {isProcessing ? t('detail.actions.processing') : t('detail.actions.approve')}
                  </Button>
                  <Button
                    onClick={handleDecline}
                    disabled={isProcessing}
                    variant="outline"
                    className="flex-1 border-asra-gray-5 text-white hover:bg-asra-gray-2"
                  >
                    {isProcessing ? t('detail.actions.processing') : t('detail.actions.decline')}
                  </Button>
                </>
              )}

              {uploadData.status === 'approved' && (
                <Button
                  onClick={handleDecline}
                  disabled={isProcessing || !comment.trim()}
                  variant="outline"
                  className="flex-1 border-red-500 text-red-400 hover:bg-red-500/20 hover:text-red-300"
                >
                  {isProcessing ? t('detail.actions.processing') : t('detail.actions.declineReject')}
                </Button>
              )}

              {uploadData.status === 'rejected' && (
                <Button
                  onClick={handleApprove}
                  disabled={isProcessing}
                  className="flex-1 bg-asra-red hover:bg-asra-red/90 text-white"
                >
                  {isProcessing ? t('detail.actions.processing') : t('detail.actions.approve')}
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Lyrics Tab Content - Only for songs */
        isSong(uploadData) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Lyrics Display */}
          <div className="lg:col-span-2">
            <div className="bg-asra-gray-1 rounded-lg border border-asra-gray-5 p-6 h-[500px] overflow-y-auto">
              {uploadData.lyrics ? (
                <div className="text-white whitespace-pre-line leading-relaxed">
                  {uploadData.lyrics}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-asra-gray-6">{t('detail.noLyrics')}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Actions and Comments */}
          <div className="space-y-6">
            {/* Edit Lyrics Button */}
            <Button
              className="w-full bg-asra-red hover:bg-asra-red/90 text-white"
              onClick={openEditLyrics}
            >
              {t('detail.editLyrics')}
            </Button>

            {/* Comment Section */}
            <div className="space-y-4">
              <h4 className="text-white text-lg font-semibold">
                {t('detail.comment.label')}
                {uploadData.status === 'pending' && (
                  <span className="text-asra-gray-6 text-sm font-normal">{t('detail.comment.requiredToReject')}</span>
                )}
                {uploadData.status === 'approved' && (
                  <span className="text-asra-gray-6 text-sm font-normal">{t('detail.comment.requiredToChangeStatus')}</span>
                )}
              </h4>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={t('detail.comment.placeholder')}
                className="bg-asra-gray-2 border-asra-gray-5 text-white placeholder:text-asra-gray-6 min-h-[120px]"
              />
            </div>

            {/* Current Status Display */}
            {uploadData.status !== 'pending' && (
              <div className={`rounded-lg p-4 ${
                uploadData.status === 'approved'
                  ? 'bg-green-500/20 border border-green-500'
                  : 'bg-red-500/20 border border-red-500'
              }`}>
                <p className={`font-semibold ${
                  uploadData.status === 'approved' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {t('detail.currentStatus')}<span className="capitalize">{formatStatus(uploadData.status)}</span>
                  {uploadData.comment && (
                    <span className="block mt-2 text-sm font-normal text-white">
                      {t('detail.previousComment')}{uploadData.comment}
                    </span>
                  )}
                </p>
              </div>
            )}

            {/* Approval Actions */}
            <div className="flex flex-col gap-4">
              {uploadData.status === 'pending' && (
                <>
                  <Button
                    onClick={handleApprove}
                    disabled={isProcessing}
                    className="w-full bg-asra-red hover:bg-asra-red/90 text-white"
                  >
                    {isProcessing ? t('detail.actions.processing') : t('detail.actions.approve')}
                  </Button>
                  <Button
                    onClick={handleDecline}
                    disabled={isProcessing}
                    variant="outline"
                    className="w-full border-asra-gray-5 text-white hover:bg-asra-gray-2"
                  >
                    {isProcessing ? t('detail.actions.processing') : t('detail.actions.decline')}
                  </Button>
                </>
              )}

              {uploadData.status === 'approved' && (
                <Button
                  onClick={handleDecline}
                  disabled={isProcessing || !comment.trim()}
                  variant="outline"
                  className="w-full border-red-500 text-red-400 hover:bg-red-500/20 hover:text-red-300"
                >
                  {isProcessing ? t('detail.actions.processing') : t('detail.actions.declineReject')}
                </Button>
              )}

              {uploadData.status === 'rejected' && (
                <Button
                  onClick={handleApprove}
                  disabled={isProcessing}
                  className="w-full bg-asra-red hover:bg-asra-red/90 text-white"
                >
                  {isProcessing ? t('detail.actions.processing') : t('detail.actions.approve')}
                </Button>
              )}
            </div>
          </div>
        </div>
        )
      )}

      {/* Edit Lyrics Dialog */}
      <Dialog open={isEditingLyrics} onOpenChange={(open) => !open && !isSavingLyrics && setIsEditingLyrics(false)}>
        <DialogContent className="bg-asra-gray-1 border-asra-gray-2 text-white sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('detail.editLyricsDialog.title')}</DialogTitle>
          </DialogHeader>
          <Textarea
            value={editedLyrics}
            onChange={(e) => setEditedLyrics(e.target.value)}
            placeholder={t('detail.editLyricsDialog.placeholder')}
            className="bg-asra-gray-2 border-asra-gray-5 text-white placeholder:text-asra-gray-6 min-h-[300px]"
          />
          <DialogFooter>
            <Button
              variant="outline"
              disabled={isSavingLyrics}
              onClick={() => setIsEditingLyrics(false)}
              className="border-asra-gray-5 text-white hover:bg-asra-gray-2"
            >
              {t('detail.editLyricsDialog.cancel')}
            </Button>
            <Button
              onClick={handleSaveLyrics}
              disabled={isSavingLyrics}
              className="bg-asra-red hover:bg-asra-red/90 text-white"
            >
              {isSavingLyrics ? t('detail.editLyricsDialog.saving') : t('detail.editLyricsDialog.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
