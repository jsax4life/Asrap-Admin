import { User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Settings = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-asra-dark text-white">
      {/* Header */}
      <div className="bg-asra-dark border-b border-asra-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Paramètres</h1>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-asra-red rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-white text-sm">{user?.name || 'Administrateur système'}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-asra-gray-900 rounded-lg p-8">
          <h2 className="text-xl font-bold text-white mb-4">Informations du compte</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-asra-gray-400 text-sm mb-1">Nom</h3>
              <p className="text-white text-lg">{user?.name || '—'}</p>
            </div>
            <div>
              <h3 className="text-asra-gray-400 text-sm mb-1">E-mail</h3>
              <p className="text-white text-lg">{user?.email || '—'}</p>
            </div>
            <div>
              <h3 className="text-asra-gray-400 text-sm mb-1">Rôle</h3>
              <p className="text-white text-lg capitalize">{user?.role?.replace('_', ' ') || '—'}</p>
            </div>
          </div>
          <p className="text-asra-gray-400">Contenu à venir...</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
