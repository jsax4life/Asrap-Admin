import { Search, Menu } from "lucide-react";
import { useLocation } from 'react-router-dom';
import { User } from '@/types';
import { ThemeToggle } from '@/components/common/ThemeToggle';

interface DashboardHeaderProps {
  onMenuClick?: () => void;
  user?: User | null;
}

export function DashboardHeader({ onMenuClick, user }: DashboardHeaderProps) {
  const location = useLocation();
  
  // Get page title based on current route
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Dashboard';
      case '/analytics':
        return 'Analytics';
      case '/music-upload':
        return 'Music Upload Approval';
      case '/playlist-management':
        return 'Asra Playlist Manager';
      case '/artist-management':
        return 'Artist/User Management';
      case '/payments':
        return 'Payment';
      case '/users':
        return 'User Management';
      case '/artists':
        return 'Artist Management';
      case '/songs':
        return 'Song Management';
      case '/admin-users':
        return 'Admin Users';
      case '/admin-users/create':
        return 'Create New User';
      case '/help-support':
        return 'Help & Support';
      case '/promotion':
        return 'Promotion Management';
      default:
        return 'Dashboard';
    }
  };
  return (
    <div className="mb-8 lg:mb-16">
      <div className="flex items-center justify-between mb-6 lg:mb-8">
        <div className="flex items-center gap-3">
          <button 
            onClick={onMenuClick}
            className="lg:hidden text-white mr-2"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="text-asra-gray-7 text-sm lg:text-base font-bold tracking-[0.13px]">Date:</span>
          <span className="text-asra-gray-7 text-sm lg:text-base font-bold tracking-[0.13px]">03/02/2023</span>
        </div>
        
        <div className="flex items-center gap-2 lg:gap-3">
          <ThemeToggle />
          <div className="relative w-8 h-8 lg:w-[38px] lg:h-[38px]">
            <img
              src={user?.avatar || "https://api.builder.io/api/v1/image/assets/TEMP/77784d2e1616758f6b0d5b70a64186f75a3b7ce5?width=75"}
              alt={user?.name || "Admin"}
              className="w-full h-full rounded-full"
            />
            <div className="absolute bottom-0.5 right-0.5 lg:bottom-1 lg:right-1 w-[5px] h-[5px] lg:w-[6px] lg:h-[6px] bg-green-500 rounded-full"></div>
          </div>
          <span className="text-asra-gray-7 text-sm lg:text-xl font-bold hidden sm:inline">
            {user?.name || "System Admin"}
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <h1 className="text-white text-2xl lg:text-[32px] font-bold leading-9">{getPageTitle()}</h1>
        
        <div className="flex items-center gap-4 bg-asra-gray-7/16 rounded-lg px-4 lg:px-8 py-3 lg:py-4 w-full lg:w-[518px]">
          <Search className="w-5 h-5 lg:w-6 lg:h-6 text-asra-gray-7 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent text-asra-gray-7 text-sm outline-none flex-1 placeholder:text-asra-gray-7"
          />
        </div>
      </div>

      <div className="w-full h-px bg-asra-gray-7 mt-6 lg:mt-8"></div>
    </div>
  );
}
