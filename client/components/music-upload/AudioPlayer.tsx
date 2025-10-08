import { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, RotateCw } from 'lucide-react';
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
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      const current = audio.currentTime;
      const total = audio.duration;
      
      if (total) {
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

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
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
      {/* Hidden audio element */}
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      {/* Progress Bar */}
      <div className="space-y-2">
        <div
          className="w-full h-2 bg-asra-gray-2 rounded-full cursor-pointer"
          onClick={handleProgressClick}
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
          className="w-10 h-10 rounded-full border-asra-gray-5 text-white hover:bg-asra-gray-2"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>

        <Button
          onClick={togglePlayPause}
          className="w-12 h-12 rounded-full bg-asra-red hover:bg-asra-red/90 text-white"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5 ml-0.5" />
          )}
        </Button>

        <Button
          onClick={skipForward}
          variant="outline"
          size="sm"
          className="w-10 h-10 rounded-full border-asra-gray-5 text-white hover:bg-asra-gray-2"
        >
          <RotateCw className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
