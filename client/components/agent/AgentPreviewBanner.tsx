import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { exitDevPreview, isDevPreview } from '@/lib/devPreview';

export function AgentPreviewBanner() {
  const navigate = useNavigate();

  if (!isDevPreview()) return null;

  const handleExit = () => {
    exitDevPreview();
    navigate('/login');
  };

  return (
    <div className="bg-amber-600 text-white px-4 py-2 flex items-center justify-between text-sm">
      <span>
        <strong>Mode aperçu</strong> — Interface uniquement, données fictives. Aucune connexion au serveur requise.
      </span>
      <button
        onClick={handleExit}
        className="flex items-center gap-1 hover:underline font-medium"
      >
        Quitter l'aperçu <X className="w-4 h-4" />
      </button>
    </div>
  );
}
