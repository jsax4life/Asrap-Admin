import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AudioPlayer } from '@/components/music-upload/AudioPlayer';
import { ArrowLeft, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';

// Mock data for the specific upload
const uploadData = {
  id: '1',
  artistId: '52166565161',
  artistName: 'Wizkid',
  uploadType: 'Song',
  name: 'Wizkid Fever - Single',
  genre: 'Afrobeats',
  dateSent: '08/03/2023',
  status: 'Pending',
  albumArt: 'https://api.builder.io/api/v1/image/assets/TEMP/5cfb76ba25d6351d27d525c323f0a49d59c44167?width=300',
  audioUrl: '/api/audio/fever.mp3', // Mock audio URL
  duration: '03:55',
  currentTime: '03:15',
  lyrics: `Uhn uhn, yeah yeah
Starboy dey for you
Ooh, oooh

Baby girl you fine, you set oh
Girl, you make my eye dey red oh
Nwalicha, oh say, nwalicha, nwalicha, oh say nwaanyi ocha
Everywhere you go baby girl you be my handbag
Gone are the days wey me and you dey stand far, yeah, yeah

[Chorus]
Fever, fever, fever
You give me fever
Fever, fever, fever
You give me fever

[Verse 2]
Girl you know say you be my queen
Everywhere we go, you be my scene
From Lagos to London, you be my dream
Girl you make my heart dey scream

[Chorus]
Fever, fever, fever
You give me fever
Fever, fever, fever
You give me fever

[Bridge]
Ooh, baby girl
You make me feel so good
Ooh, baby girl
You make me feel so good

[Outro]
Fever, fever, fever
You give me fever
Fever, fever, fever
You give me fever`,
};

export default function MusicApprovalDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<'audio' | 'lyrics'>('audio');
  const [comment, setComment] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Music approved successfully!');
      navigate('/music-upload/success', { 
        state: { 
          action: 'approved', 
          songName: uploadData.name,
          artistName: uploadData.artistName 
        } 
      });
    } catch (error) {
      toast.error('Failed to approve music');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDecline = async () => {
    if (!comment.trim()) {
      toast.error('Please provide a reason for declining');
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Music declined successfully!');
      navigate('/music-upload/success', { 
        state: { 
          action: 'declined', 
          songName: uploadData.name,
          artistName: uploadData.artistName 
        } 
      });
    } catch (error) {
      toast.error('Failed to decline music');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGoBack = () => {
    navigate('/music-upload');
  };

  return (
    <div className="space-y-6">
      {/* Go Back Button */}
      <button
        onClick={handleGoBack}
        className="text-asra-red hover:text-asra-red/80 text-sm font-medium flex items-center gap-2 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Go Back
      </button>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-asra-gray-5">
        <button
          onClick={() => setActiveTab('audio')}
          className={`pb-3 px-1 text-sm font-medium transition-colors ${
            activeTab === 'audio'
              ? 'text-asra-red border-b-2 border-asra-red'
              : 'text-asra-gray-6 hover:text-white'
          }`}
        >
          Audio
        </button>
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
      </div>

      {/* Content */}
      {activeTab === 'audio' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Album Art and Audio Player */}
          <div className="space-y-6">
            {/* Album Art */}
            <div className="relative">
              <img
                src={uploadData.albumArt}
                alt={uploadData.name}
                className="w-full max-w-md mx-auto rounded-lg shadow-lg"
              />
            </div>

            {/* Audio Player */}
            <div className="bg-asra-gray-1 rounded-lg p-6">
              <AudioPlayer
                audioUrl={uploadData.audioUrl}
                currentTime={uploadData.currentTime}
                duration={uploadData.duration}
              />
            </div>
          </div>

          {/* Right Column - Approval Actions and Comments */}
          <div className="space-y-6">
            {/* Song Info */}
            <div className="bg-asra-gray-1 rounded-lg p-6">
              <h3 className="text-white text-xl font-bold mb-4">{uploadData.name}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-asra-gray-6">Artist:</span>
                  <span className="text-white">{uploadData.artistName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-asra-gray-6">Genre:</span>
                  <span className="text-white">{uploadData.genre}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-asra-gray-6">Upload Type:</span>
                  <span className="text-white">{uploadData.uploadType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-asra-gray-6">Date Sent:</span>
                  <span className="text-white">{uploadData.dateSent}</span>
                </div>
              </div>
            </div>

            {/* Approval Actions */}
            <div className="flex gap-4">
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
            </div>

            {/* Comment Section */}
            <div className="space-y-4">
              <h4 className="text-white text-lg font-semibold">Leave a comment</h4>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Comment here"
                className="bg-asra-gray-2 border-asra-gray-5 text-white placeholder:text-asra-gray-6 min-h-[120px]"
              />
              <div className="flex justify-end">
                <Button
                  onClick={() => {
                    if (comment.trim()) {
                      toast.success('Comment sent!');
                      setComment('');
                    }
                  }}
                  size="sm"
                  className="bg-asra-red hover:bg-asra-red/90 text-white"
                >
                  <Send className="w-4 h-4 mr-1" />
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Lyrics Tab Content */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Lyrics Display */}
          <div className="lg:col-span-2">
            <div className="bg-asra-gray-1 rounded-lg border border-asra-gray-5 p-6 h-[500px] overflow-y-auto">
              <div className="text-white whitespace-pre-line leading-relaxed">
                {uploadData.lyrics}
              </div>
            </div>
          </div>

          {/* Right Column - Actions and Comments */}
          <div className="space-y-6">
            {/* Edit Lyrics Button */}
            <Button
              className="w-full bg-asra-red hover:bg-asra-red/90 text-white"
              onClick={() => toast.info('Edit lyrics functionality coming soon!')}
            >
              Edit Lyrics
            </Button>

            {/* Comment Section */}
            <div className="space-y-4">
              <h4 className="text-white text-lg font-semibold">Leave a comment</h4>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Comment here"
                className="bg-asra-gray-2 border-asra-gray-5 text-white placeholder:text-asra-gray-6 min-h-[120px]"
              />
              <div className="flex justify-end">
                <Button
                  onClick={() => {
                    if (comment.trim()) {
                      toast.success('Comment sent!');
                      setComment('');
                    }
                  }}
                  size="sm"
                  className="bg-asra-red hover:bg-asra-red/90 text-white"
                >
                  <Send className="w-4 h-4 mr-1" />
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
