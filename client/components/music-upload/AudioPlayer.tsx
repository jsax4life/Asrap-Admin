import { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, RotateCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AudioPlayerProps {
  audioUrl: string;
  currentTime?: string;
  duration?: string;
  className?: string;
}

export const AudioPlayer = ({ 
  audioUrl, 
  currentTime = '00:00', 
  duration = '00:00',
  className 
}: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTimeDisplay, setCurrentTimeDisplay] = useState(currentTime);
  const [durationDisplay, setDurationDisplay] = useState(duration);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Reset error and loading when URL changes
  useEffect(() => {
    setError(null);
    setIsLoading(true);
    setIsPlaying(false);
    setProgress(0);
    setCurrentTimeDisplay('00:00');
  }, [audioUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Clear previous error when audio loads
    const handleLoadStart = () => {
      setIsLoading(true);
      setError(null);
    };

    const handleLoadedMetadata = () => {
      setIsLoading(false);
      setError(null);
      if (audio.duration) {
        setDurationDisplay(formatTime(audio.duration));
      }
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      setError(null);
    };

    const updateTime = () => {
      const current = audio.currentTime;
      const total = audio.duration;
      
      if (total && !isNaN(total)) {
        setProgress((current / total) * 100);
        setCurrentTimeDisplay(formatTime(current));
        setDurationDisplay(formatTime(total));
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTimeDisplay('00:00');
    };

    const handleError = (e: Event) => {
      setIsLoading(false);
      setIsPlaying(false);
      
      const audioError = audio.error;
      let errorMessage = 'Unable to play audio';
      
      if (audioError) {
        switch (audioError.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            errorMessage = 'Audio playback was aborted';
            break;
          case MediaError.MEDIA_ERR_NETWORK:
            errorMessage = 'Network error while loading audio. Please check your connection or try refreshing the page.';
            break;
          case MediaError.MEDIA_ERR_DECODE:
            errorMessage = 'Audio file is corrupted or in an unsupported format';
            break;
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMessage = 'Audio format not supported or URL is invalid. The presigned URL may have expired.';
            break;
          default:
            errorMessage = 'Unable to play audio. The file may be corrupted or the URL may have expired.';
        }
      }
      
      // Check if it's a CORS error by examining the URL and error
      const isCorsError = audioUrl.includes('s3.') || audioUrl.includes('amazonaws.com');
      
      console.error('Audio player error:', {
        code: audioError?.code,
        message: errorMessage,
        url: audioUrl,
        isCorsError,
        error: audioError
      });
      
      // Provide more specific message for potential CORS issues
      if (isCorsError && !audioError) {
        errorMessage = 'CORS error: Unable to load audio from S3. Please contact support if this persists.';
      }
      
      setError(errorMessage);
    };

    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    // Set source when URL changes
    // Note: S3 presigned URLs should work without crossOrigin attribute
    // If CORS issues persist, the S3 bucket needs proper CORS configuration
    audio.src = audioUrl;
    audio.load();
    
    // Monitor for CORS errors via timeout fallback
    // CORS errors may not trigger the error event, so we check if audio fails to load
    const loadTimeout = setTimeout(() => {
      if (audio.readyState === 0) {
        // Audio hasn't started loading after 5 seconds - likely CORS or network issue
        const isS3Url = audioUrl.includes('s3.') || audioUrl.includes('amazonaws.com');
        if (isS3Url && !audio.error) {
          setError('Unable to load audio. This may be a CORS configuration issue with the S3 bucket. Please contact support.');
          setIsLoading(false);
        }
      }
    }, 5000);
    
    const clearTimeoutOnLoad = () => {
      clearTimeout(loadTimeout);
    };
    
    audio.addEventListener('loadedmetadata', clearTimeoutOnLoad);
    audio.addEventListener('canplay', clearTimeoutOnLoad);
    audio.addEventListener('error', clearTimeoutOnLoad);

    return () => {
      clearTimeout(loadTimeout);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('loadedmetadata', clearTimeoutOnLoad);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('canplay', clearTimeoutOnLoad);
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('error', clearTimeoutOnLoad);
    };
  }, [audioUrl]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        setIsLoading(true);
        await audio.play();
        setIsPlaying(true);
        setIsLoading(false);
        setError(null);
      } catch (err: any) {
        console.error('Play error:', err);
        setIsLoading(false);
        setIsPlaying(false);
        setError(err.message || 'Failed to play audio. Please try again.');
      }
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * audio.duration;
    
    audio.currentTime = newTime;
    setProgress((newTime / audio.duration) * 100);
  };

  const skipBackward = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.currentTime = Math.max(0, audio.currentTime - 10);
  };

  const skipForward = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Hidden audio element - crossOrigin removed to avoid CORS issues with S3 */}
      <audio ref={audioRef} preload="metadata" />
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
      
      {/* Progress Bar */}
      <div className="space-y-2">
        <div
          className={cn(
            "w-full h-2 bg-asra-gray-2 rounded-full transition-all",
            error ? "cursor-not-allowed opacity-50" : "cursor-pointer"
          )}
          onClick={!error ? handleProgressClick : undefined}
        >
          <div
            className="h-full bg-asra-red rounded-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Time Display */}
        <div className="flex justify-between text-sm text-asra-gray-6">
          <span>{currentTimeDisplay}</span>
          <span>{durationDisplay}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <Button
          onClick={skipBackward}
          variant="outline"
          size="sm"
          disabled={!!error || isLoading}
          className="w-10 h-10 rounded-full border-asra-gray-5 text-white hover:bg-asra-gray-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>

        <Button
          onClick={togglePlayPause}
          disabled={!!error || isLoading}
          className="w-12 h-12 rounded-full bg-asra-red hover:bg-asra-red/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5 ml-0.5" />
          )}
        </Button>

        <Button
          onClick={skipForward}
          variant="outline"
          size="sm"
          disabled={!!error || isLoading}
          className="w-10 h-10 rounded-full border-asra-gray-5 text-white hover:bg-asra-gray-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RotateCw className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
