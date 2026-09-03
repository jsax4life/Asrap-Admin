import { useTranslation } from 'react-i18next';

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const current = i18n.language?.startsWith('en') ? 'en' : 'fr';

  return (
    <div className="flex items-center gap-1 bg-asra-gray-2 rounded-full p-1">
      <button
        onClick={() => i18n.changeLanguage('fr')}
        className={`px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${
          current === 'fr' ? 'bg-asra-red text-white' : 'text-asra-gray-6 hover:text-white'
        }`}
      >
        FR
      </button>
      <button
        onClick={() => i18n.changeLanguage('en')}
        className={`px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${
          current === 'en' ? 'bg-asra-red text-white' : 'text-asra-gray-6 hover:text-white'
        }`}
      >
        EN
      </button>
    </div>
  );
}
