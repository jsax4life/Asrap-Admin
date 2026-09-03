import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import frCommon from '@/locales/fr/common.json';
import frAuth from '@/locales/fr/auth.json';
import frSettings from '@/locales/fr/settings.json';
import frDashboard from '@/locales/fr/dashboard.json';
import frAnalytics from '@/locales/fr/analytics.json';
import frGenres from '@/locales/fr/genres.json';
import frPayments from '@/locales/fr/payments.json';
import frPromotion from '@/locales/fr/promotion.json';
import frArtists from '@/locales/fr/artists.json';
import frAdmin from '@/locales/fr/admin.json';
import frAgent from '@/locales/fr/agent.json';
import frMusicUpload from '@/locales/fr/musicUpload.json';
import frPlaylist from '@/locales/fr/playlist.json';
import frSupport from '@/locales/fr/support.json';

import enCommon from '@/locales/en/common.json';
import enAuth from '@/locales/en/auth.json';
import enSettings from '@/locales/en/settings.json';
import enDashboard from '@/locales/en/dashboard.json';
import enAnalytics from '@/locales/en/analytics.json';
import enGenres from '@/locales/en/genres.json';
import enPayments from '@/locales/en/payments.json';
import enPromotion from '@/locales/en/promotion.json';
import enArtists from '@/locales/en/artists.json';
import enAdmin from '@/locales/en/admin.json';
import enAgent from '@/locales/en/agent.json';
import enMusicUpload from '@/locales/en/musicUpload.json';
import enPlaylist from '@/locales/en/playlist.json';
import enSupport from '@/locales/en/support.json';

export const LANGUAGE_STORAGE_KEY = 'asra_admin_language';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'fr',
    supportedLngs: ['fr', 'en'],
    ns: [
      'common', 'auth', 'settings', 'dashboard', 'analytics', 'genres',
      'payments', 'promotion', 'artists', 'admin', 'agent', 'musicUpload',
      'playlist', 'support',
    ],
    defaultNS: 'common',
    resources: {
      fr: {
        common: frCommon,
        auth: frAuth,
        settings: frSettings,
        dashboard: frDashboard,
        analytics: frAnalytics,
        genres: frGenres,
        payments: frPayments,
        promotion: frPromotion,
        artists: frArtists,
        admin: frAdmin,
        agent: frAgent,
        musicUpload: frMusicUpload,
        playlist: frPlaylist,
        support: frSupport,
      },
      en: {
        common: enCommon,
        auth: enAuth,
        settings: enSettings,
        dashboard: enDashboard,
        analytics: enAnalytics,
        genres: enGenres,
        payments: enPayments,
        promotion: enPromotion,
        artists: enArtists,
        admin: enAdmin,
        agent: enAgent,
        musicUpload: enMusicUpload,
        playlist: enPlaylist,
        support: enSupport,
      },
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: LANGUAGE_STORAGE_KEY,
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
