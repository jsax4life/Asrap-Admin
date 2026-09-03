import { Calendar, User, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { LanguageToggle } from '@/components/common/LanguageToggle';

interface AgentPageHeaderProps {
  title: string;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  showSearch?: boolean;
}

export function AgentPageHeader({
  title,
  searchPlaceholder,
  searchValue = '',
  onSearchChange,
  showSearch = false,
}: AgentPageHeaderProps) {
  const { t } = useTranslation('agent');
  const { user } = useAuth();
  const today = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <div className="bg-asra-dark border-b border-asra-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-asra-red rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <div>
              <span className="text-white text-xl font-bold">Asrapa</span>
              <span className="ml-2 text-asra-red text-xs font-bold uppercase tracking-wider">Agent</span>
            </div>
          </div>
          <div className="hidden sm:flex items-center space-x-2 text-asra-gray-400">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{today}</span>
          </div>
        </div>

        <div className="flex-1 flex justify-center">
          <h1 className="text-xl lg:text-2xl font-bold text-white">{title}</h1>
        </div>

        <div className="flex items-center space-x-4">
          {showSearch && onSearchChange && (
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-asra-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={searchPlaceholder ?? t('pageHeader.searchDefault')}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="bg-asra-gray-800 text-white pl-10 pr-4 py-2 rounded-lg border border-asra-gray-700 focus:outline-none focus:border-asra-red w-64"
              />
            </div>
          )}
          <LanguageToggle />
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-asra-red rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-white text-sm hidden sm:inline">{user?.name || t('pageHeader.agentFallback')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
