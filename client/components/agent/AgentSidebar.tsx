import { useNavigate, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AGENT_MENU_ITEMS, AGENT_ACCOUNT_MENU_ITEMS, ICON_MAP } from '@/constants';
import { User } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { LanguageToggle } from '@/components/common/LanguageToggle';
import asrapaLogo from '@/assets/images/asrapa-logo-white.png';

interface AgentSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  user?: User | null;
}

export function AgentSidebar({ isOpen = true, onClose, user }: AgentSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { t } = useTranslation('common');

  const handleMenuClick = (path: string) => {
    if (path === '/logout') {
      logout();
    } else {
      navigate(path);
    }
    onClose?.();
  };

  const isActiveRoute = (path: string) => {
    if (path === '/agent/onboarding') {
      return location.pathname.startsWith('/agent/onboard');
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`
        w-[315px] h-screen bg-asra-gray-1 flex-shrink-0 
        fixed left-0 top-0 border-r border-asra-gray-2 flex flex-col z-50
        transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white lg:hidden"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="h-[150px] border-b border-asra-gray-2 flex flex-col items-center justify-center gap-2 px-10">
          <img
            src={asrapaLogo}
            alt="Asrapa"
            className="h-20 w-auto object-contain"
          />
          <span className="text-asra-red text-xs font-bold uppercase tracking-widest">{t('sidebar.agentPortalTag')}</span>
          <LanguageToggle />
        </div>

        <div className="flex-1 px-8 lg:px-12 py-8 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-6">
            <div className="text-asra-gray-6 text-base font-bold tracking-[0.13px]">{t('sidebar.menuSection')}</div>

            <nav className="space-y-6">
              {AGENT_MENU_ITEMS.map((item) => {
                const IconComponent = ICON_MAP[item.icon as keyof typeof ICON_MAP];
                const isActive = isActiveRoute(item.path);

                return (
                  <button
                    key={item.id}
                    onClick={() => handleMenuClick(item.path)}
                    className={`flex items-center gap-5 w-full text-left transition-colors ${
                      isActive ? 'text-white' : 'text-asra-gray-6 hover:text-white'
                    }`}
                  >
                    <IconComponent className="w-6 h-6 flex-shrink-0" strokeWidth={isActive ? 1.87 : 1.5} />
                    <span className="text-base font-bold tracking-[0.13px]">{t(`menu.${item.id}`, item.label)}</span>
                    {isActive && <div className="w-1 h-6 bg-white ml-auto -mr-8 lg:-mr-12" />}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="space-y-6 mt-12 lg:mt-40">
            <div className="text-asra-gray-6 text-base font-bold tracking-[0.13px]">{t('sidebar.accountSection')}</div>

            <nav className="space-y-6">
              {AGENT_ACCOUNT_MENU_ITEMS.map((item) => {
                const IconComponent = ICON_MAP[item.icon as keyof typeof ICON_MAP];
                const isActive = isActiveRoute(item.path);

                return (
                  <button
                    key={item.id}
                    onClick={() => handleMenuClick(item.path)}
                    className={`flex items-center gap-5 w-full text-left transition-colors ${
                      isActive ? 'text-white' : 'text-asra-gray-6 hover:text-white'
                    }`}
                  >
                    <IconComponent className="w-6 h-6 flex-shrink-0" strokeWidth={isActive ? 1.87 : 1.5} />
                    <span className="text-base font-bold tracking-[0.13px]">{t(`menu.${item.id}`, item.label)}</span>
                    {isActive && <div className="w-1 h-6 bg-white ml-auto -mr-8 lg:-mr-12" />}
                  </button>
                );
              })}
            </nav>

            {user && (
              <div className="pt-4 border-t border-asra-gray-2">
                <p className="text-white text-sm font-medium">{user.name}</p>
                <p className="text-asra-gray-6 text-xs">{user.email}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
