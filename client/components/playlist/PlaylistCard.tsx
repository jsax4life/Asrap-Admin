import { cn } from '@/lib/utils';

interface Playlist {
  id: string;
  title: string;
  artists: string;
  image: string;
  banner?: string | null;
  songCount: number;
  duration: string;
  likes: string;
  isPublic: boolean;
}

interface PlaylistCardProps {
  playlist: Playlist;
  onClick: () => void;
  className?: string;
}

export const PlaylistCard = ({ playlist, onClick, className }: PlaylistCardProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-asra-gray-1 rounded-lg overflow-hidden cursor-pointer',
        'hover:bg-asra-gray-2 transition-colors duration-200',
        'group',
        className
      )}
    >
      {/* Playlist Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={playlist.image}
          alt={playlist.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
        
        {/* Banner Overlay */}
        {playlist.banner && (
          <div className="absolute top-0 left-0 right-0 bg-asra-red text-white text-xs font-bold py-1 px-2 text-center">
            {playlist.banner}
          </div>
        )}
        
        {/* Asra Logo */}
        <div className="absolute top-2 left-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
          <span className="text-asra-red text-xs font-bold">S</span>
        </div>
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <div className="w-12 h-12 bg-asra-red rounded-full flex items-center justify-center">
            <div className="w-0 h-0 border-l-[8px] border-l-white border-y-[6px] border-y-transparent ml-1" />
          </div>
        </div>
      </div>

      {/* Playlist Info */}
      <div className="p-4">
        <h3 className="text-white font-semibold text-sm mb-1 line-clamp-1">
          {playlist.title}
        </h3>
        <p className="text-asra-gray-6 text-xs line-clamp-2">
          {playlist.artists}
        </p>
      </div>
    </div>
  );
};
