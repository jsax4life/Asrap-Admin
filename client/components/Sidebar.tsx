import { useNavigate, useLocation } from 'react-router-dom';
import { X } from "lucide-react";
import { MENU_ITEMS, ACCOUNT_MENU_ITEMS, ICON_MAP } from '@/constants';
import { User } from '@/types';
import { useAuth } from '@/hooks/useAuth';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  user?: User | null;
}

export function Sidebar({ isOpen = true, onClose, user }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  // Filter menu items based on user role
  const filteredMenuItems = MENU_ITEMS.filter(item => 
    !user || item.roles.includes(user.role)
  );

  const handleMenuClick = (path: string) => {
    if (path === '/logout') {
      // TEMPORARY: Show alert instead of actual logout when backend is not ready
      alert('Logout functionality will be available when backend authentication is connected');
      // logout(); // Uncomment when backend is ready
    } else {
      navigate(path);
    }
    onClose?.();
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        w-[315px] h-screen bg-asra-gray-1 flex-shrink-0 
        fixed left-0 top-0 border-r border-asra-gray-2 flex flex-col z-50
        transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Close button for mobile */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-white lg:hidden"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="h-[150px] border-b border-asra-gray-2 flex items-center justify-center px-10">
          <img 
            src="https://api.builder.io/api/v1/image/assets/TEMP/2f1510a347aa5bfec3416f59e81b157d9997dfa5?width=464" 
            alt="AsraMusic" 
            className="w-[232px] h-[52px]"
          />
        </div>
        
        <div className="flex-1 px-8 lg:px-12 py-8 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-6">
            <div className="text-asra-gray-6 text-base font-bold tracking-[0.13px]">
              MENU
            </div>
            
            <nav className="space-y-6">
              {filteredMenuItems.map((item) => {
                const IconComponent = ICON_MAP[item.icon as keyof typeof ICON_MAP];
                const isActive = isActiveRoute(item.path);
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleMenuClick(item.path)}
                    className={`flex items-center gap-5 w-full text-left transition-colors ${
                      isActive 
                        ? "text-white" 
                        : "text-asra-gray-6 hover:text-white"
                    }`}
                  >
                    <IconComponent className="w-6 h-6 flex-shrink-0" strokeWidth={isActive ? 1.87 : 1.5} />
                    <span className="text-base font-bold tracking-[0.13px]">
                      {item.label}
                    </span>
                    {isActive && (
                      <div className="w-1 h-6 bg-white ml-auto -mr-8 lg:-mr-12" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="space-y-6 mt-12 lg:mt-40">
            <div className="text-asra-gray-6 text-base font-bold tracking-[0.13px]">
              YOUR ACCOUNT
            </div>
            
            <nav className="space-y-6">
              {ACCOUNT_MENU_ITEMS.map((item) => {
                const IconComponent = ICON_MAP[item.icon as keyof typeof ICON_MAP];
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleMenuClick(item.path)}
                    className="flex items-center gap-5 w-full text-left text-asra-gray-6 hover:text-white transition-colors"
                  >
                    <IconComponent className="w-6 h-6 flex-shrink-0" strokeWidth={2} />
                    <span className="text-base font-bold tracking-[0.13px]">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
