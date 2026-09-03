import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { exitDevPreview, isDevPreview } from '@/lib/devPreview';

export function AgentPreviewBanner() {
  const navigate = useNavigate();
  const { t } = useTranslation('agent');

  if (!isDevPreview()) return null;

  const handleExit = () => {
    exitDevPreview();
    navigate('/login');
  };

  return (
    <div className="bg-amber-600 text-white px-4 py-2 flex items-center justify-between text-sm">
      <span>
        <strong>{t('previewBanner.title')}</strong> — {t('previewBanner.description')}
      </span>
      <button
        onClick={handleExit}
        className="flex items-center gap-1 hover:underline font-medium"
      >
        {t('previewBanner.exit')} <X className="w-4 h-4" />
      </button>
    </div>
  );
}
