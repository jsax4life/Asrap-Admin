import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
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

// Helper function to format status display
const formatStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'pending': 'Pending',
    'approved': 'Approved',
    'rejected': 'Rejected',
  };
  return statusMap[status] || status;
};

// Type guards
const isSong = (upload: MusicUploadDetail): upload is MusicUploadDetail & SongDetail => {
  return upload.uploadType === 'song' && 'songUrlPresigned' in upload;
};

const isAlbum = (upload: MusicUploadDetail): upload is MusicUploadDetail & AlbumDetail => {
  return upload.uploadType === 'album' && 'songs' in upload;
};

export default function MusicApprovalDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'audio' | 'lyrics'>('audio');
  const [comment, setComment] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadData, setUploadData] = useState<MusicUploadDetail | null>(null);

  // Fetch upload detail function
  const fetchUploadDetail = async () => {
    if (!id) {
      setError('Invalid upload ID');
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
        setError('Failed to load upload details');
      }
    } catch (err: any) {
      console.error('Error fetching upload detail:', err);
      setError(err.message || 'Failed to load upload details');
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
        comment.trim() || 'Approved for release'
      );
      
      if (response.status === 'success') {
        toast.success(response.message || 'Music approved successfully!');
        // Clear comment and refetch data to show updated status
        setComment('');
        await fetchUploadDetail();
      } else {
        throw new Error(response.message || 'Failed to approve music');
      }
    } catch (error: any) {
      console.error('Approve error:', error);
      toast.error(error.message || 'Failed to approve music');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDecline = async () => {
    if (!uploadData || !id) return;

    if (!comment.trim()) {
      const message = uploadData.status === 'approved' 
        ? 'Please provide a reason for rejecting this approved upload'
        : 'Please provide a reason for declining';
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
        toast.success(response.message || 'Music declined successfully!');
        // Clear comment and refetch data to show updated status
        setComment('');
        await fetchUploadDetail();
      } else {
        throw new Error(response.message || 'Failed to decline music');
      }
    } catch (error: any) {
      console.error('Decline error:', error);
      toast.error(error.message || 'Failed to decline music');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGoBack = () => {
    navigate('/music-upload');
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-asra-red animate-spin" />
        <span className="ml-3 text-white">Loading upload details...</span>
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
          Go Back
        </button>
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-6">
          <p className="text-red-400">{error || 'Upload not found'}</p>
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
        Go Back
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
          {uploadData.uploadType === 'album' ? 'Songs' : 'Audio'}
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
            Lyrics
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
                  Album Songs ({uploadData.songCount})
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
                  <span className="text-asra-gray-6">Artist:</span>
                  <span className="text-white">{uploadData.artist.stageName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-asra-gray-6">Full Name:</span>
                  <span className="text-white">{uploadData.artist.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-asra-gray-6">Genre:</span>
                  <span className="text-white">{uploadData.genre}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-asra-gray-6">Upload Type:</span>
                  <span className="text-white capitalize">{uploadData.uploadType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-asra-gray-6">Date Sent:</span>
                  <span className="text-white">{formatDate(uploadData.dateSent)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-asra-gray-6">Status:</span>
                  <span className="text-white">{formatStatus(uploadData.status)}</span>
                </div>
                
                {/* Song-specific fields */}
                {isSong(uploadData) && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-asra-gray-6">Duration:</span>
                      <span className="text-white">{formatDuration(uploadData.duration)}</span>
                    </div>
                    {uploadData.collaborators && uploadData.collaborators.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-asra-gray-6">Collaborators:</span>
                        <span className="text-white">
                          {uploadData.collaborators.map(c => c.stageName).join(', ')}
                        </span>
                      </div>
                    )}
                    {uploadData.isExplicit && (
                      <div className="flex justify-between">
                        <span className="text-asra-gray-6">Content:</span>
                        <span className="text-orange-500 font-semibold">Explicit</span>
                      </div>
                    )}
                    {uploadData.streams !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-asra-gray-6">Streams:</span>
                        <span className="text-white">{uploadData.streams.toLocaleString()}</span>
                      </div>
                    )}
                    {uploadData.downloads !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-asra-gray-6">Downloads:</span>
                        <span className="text-white">{uploadData.downloads.toLocaleString()}</span>
                      </div>
                    )}
                  </>
                )}

                {/* Album-specific fields */}
                {isAlbum(uploadData) && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-asra-gray-6">Song Count:</span>
                      <span className="text-white">{uploadData.songCount}</span>
                    </div>
                    {uploadData.caption && (
                      <div className="flex flex-col">
                        <span className="text-asra-gray-6 mb-1">Caption:</span>
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
                Leave a comment
                {uploadData.status === 'pending' && (
                  <span className="text-asra-gray-6 text-sm font-normal"> (required for decline)</span>
                )}
                {uploadData.status === 'approved' && (
                  <span className="text-asra-gray-6 text-sm font-normal"> (required to change status)</span>
                )}
              </h4>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Enter your comment here..."
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
                  Current Status: <span className="capitalize">{uploadData.status}</span>
                  {uploadData.comment && (
                    <span className="block mt-2 text-sm font-normal text-white">
                      Previous Comment: {uploadData.comment}
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
                    {isProcessing ? 'Processing...' : 'Approve'}
                  </Button>
                  <Button
                    onClick={handleDecline}
                    disabled={isProcessing}
                    variant="outline"
                    className="flex-1 border-asra-gray-5 text-white hover:bg-asra-gray-2"
                  >
                    {isProcessing ? 'Processing...' : 'Decline'}
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
                  {isProcessing ? 'Processing...' : 'Decline / Reject'}
                </Button>
              )}
              
              {uploadData.status === 'rejected' && (
                <Button
                  onClick={handleApprove}
                  disabled={isProcessing}
                  className="flex-1 bg-asra-red hover:bg-asra-red/90 text-white"
                >
                  {isProcessing ? 'Processing...' : 'Approve'}
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
                  <p className="text-asra-gray-6">No lyrics available for this upload</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Actions and Comments */}
          <div className="space-y-6">
            {/* Edit Lyrics Button */}
            <Button
              className="w-full bg-asra-red hover:bg-asra-red/90 text-white"
              onClick={() => toast('Edit lyrics functionality coming soon!')}
            >
              Edit Lyrics
            </Button>

            {/* Comment Section */}
            <div className="space-y-4">
              <h4 className="text-white text-lg font-semibold">
                Leave a comment
                {uploadData.status === 'pending' && (
                  <span className="text-asra-gray-6 text-sm font-normal"> (required for decline)</span>
                )}
                {uploadData.status === 'approved' && (
                  <span className="text-asra-gray-6 text-sm font-normal"> (required to change status)</span>
                )}
              </h4>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Enter your comment here..."
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
                  Current Status: <span className="capitalize">{uploadData.status}</span>
                  {uploadData.comment && (
                    <span className="block mt-2 text-sm font-normal text-white">
                      Previous Comment: {uploadData.comment}
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
                    {isProcessing ? 'Processing...' : 'Approve'}
                  </Button>
                  <Button
                    onClick={handleDecline}
                    disabled={isProcessing}
                    variant="outline"
                    className="w-full border-asra-gray-5 text-white hover:bg-asra-gray-2"
                  >
                    {isProcessing ? 'Processing...' : 'Decline'}
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
                  {isProcessing ? 'Processing...' : 'Decline / Reject'}
                </Button>
              )}
              
              {uploadData.status === 'rejected' && (
                <Button
                  onClick={handleApprove}
                  disabled={isProcessing}
                  className="w-full bg-asra-red hover:bg-asra-red/90 text-white"
                >
                  {isProcessing ? 'Processing...' : 'Approve'}
                </Button>
              )}
            </div>
          </div>
        </div>
        )
      )}
    </div>
  );
}
