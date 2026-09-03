import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Camera, Loader2, KeyRound, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/authService';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { LanguageToggle } from '@/components/common/LanguageToggle';

const Settings = () => {
  const { t } = useTranslation('settings');
  const { t: tCommon } = useTranslation('common');
  const { user } = useAuth();
  const setUser = useAuthStore((s) => s.setUser);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarSaving, setAvatarSaving] = useState(false);

  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [profileSaving, setProfileSaving] = useState(false);

  const handleChoosePhoto = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSavePhoto = async () => {
    if (!avatarFile) return;
    setAvatarSaving(true);
    try {
      const updatedUser = await authService.uploadAvatar(avatarFile);
      setUser(updatedUser);
      setAvatarFile(null);
      setAvatarPreview(null);
      toast.success(t('settings.photoSaved'));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('settings.photoSaveError'));
    } finally {
      setAvatarSaving(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      const updatedUser = await authService.updateProfile({ firstName, lastName, phoneNumber });
      setUser(updatedUser);
      toast.success(t('settings.profileSaved'));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('settings.profileSaveError'));
    } finally {
      setProfileSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-asra-dark text-white">
      {/* Header */}
      <div className="bg-asra-dark border-b border-asra-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">{t('settings.title')}</h1>

          <div className="flex items-center space-x-4">
            <LanguageToggle />
            <Link to="/settings" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <div className="w-8 h-8 bg-asra-red rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
              <span className="text-white text-sm">{user?.name || t('settings.defaultUserName')}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Profile photo */}
        <div className="bg-asra-gray-900 rounded-lg p-8">
          <h2 className="text-xl font-bold text-white mb-4">{t('settings.photoTitle')}</h2>
          <div className="flex items-center gap-6">
            <div className="relative">
              {avatarPreview || user?.avatar ? (
                <img
                  src={avatarPreview || user?.avatar}
                  alt={user?.name}
                  className="w-24 h-24 rounded-full object-cover border-2 border-asra-red"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-asra-gray-800 border-2 border-asra-red flex items-center justify-center">
                  <User className="w-10 h-10 text-asra-gray-6" />
                </div>
              )}
              <button
                type="button"
                onClick={handleChoosePhoto}
                className="absolute bottom-0 right-0 w-8 h-8 bg-asra-red rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                aria-label={t('settings.changePhoto')}
              >
                <Camera className="w-4 h-4 text-white" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handlePhotoSelected}
                className="hidden"
              />
            </div>
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleChoosePhoto}
                className="text-asra-red hover:text-red-400 text-sm font-medium"
              >
                {t('settings.changePhoto')}
              </button>
              {avatarFile && (
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleSavePhoto}
                    disabled={avatarSaving}
                    className="bg-asra-red hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {avatarSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                    {t('settings.savePhoto')}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAvatarFile(null); setAvatarPreview(null); }}
                    className="text-asra-gray-400 hover:text-white text-sm"
                  >
                    {t('settings.cancel')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Personal information */}
        <form onSubmit={handleSaveProfile} className="bg-asra-gray-900 rounded-lg p-8">
          <h2 className="text-xl font-bold text-white mb-4">{t('settings.accountInfoTitle')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-asra-gray-400 text-sm mb-2">{t('settings.firstNameLabel')}</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-asra-gray-800 border border-asra-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-asra-red"
              />
            </div>
            <div>
              <label className="block text-asra-gray-400 text-sm mb-2">{t('settings.lastNameLabel')}</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full bg-asra-gray-800 border border-asra-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-asra-red"
              />
            </div>
            <div>
              <label className="block text-asra-gray-400 text-sm mb-2">{t('settings.phoneLabel')}</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full bg-asra-gray-800 border border-asra-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-asra-red"
              />
            </div>
            <div>
              <label className="block text-asra-gray-400 text-sm mb-2">{t('settings.emailLabel')}</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full bg-asra-gray-800/50 border border-asra-gray-700 rounded-lg px-4 py-2 text-asra-gray-400 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-asra-gray-400 text-sm mb-2">{t('settings.roleLabel')}</label>
              <p className="text-white text-lg pt-2">
                {user?.role ? tCommon(`roles.${user.role}`, user.role) : t('settings.emptyValue')}
              </p>
            </div>
          </div>
          <button
            type="submit"
            disabled={profileSaving}
            className="bg-asra-red hover:bg-red-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {profileSaving && <Loader2 className="w-4 h-4 animate-spin" />}
            {t('settings.saveChanges')}
          </button>
        </form>

        {/* Security */}
        <div className="bg-asra-gray-900 rounded-lg p-8">
          <h2 className="text-xl font-bold text-white mb-4">{t('settings.securityTitle')}</h2>
          <Link
            to="/change-password"
            className="flex items-center justify-between p-4 bg-asra-gray-800 rounded-lg hover:bg-asra-gray-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <KeyRound className="w-5 h-5 text-asra-red" />
              <span className="text-white font-medium">{t('settings.changePassword')}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-asra-gray-400" />
          </Link>
        </div>

        {/* Preferences */}
        <div className="bg-asra-gray-900 rounded-lg p-8">
          <h2 className="text-xl font-bold text-white mb-4">{t('settings.preferencesTitle')}</h2>
          <div className="flex items-center justify-between p-4 bg-asra-gray-800 rounded-lg mb-3">
            <span className="text-white font-medium">{t('settings.themeLabel')}</span>
            <ThemeToggle />
          </div>
          <div className="flex items-center justify-between p-4 bg-asra-gray-800 rounded-lg">
            <span className="text-white font-medium">{t('settings.languageLabel')}</span>
            <LanguageToggle />
          </div>
        </div>

        {/* Account details */}
        <div className="bg-asra-gray-900 rounded-lg p-8">
          <h2 className="text-xl font-bold text-white mb-4">{t('settings.accountDetailsTitle')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-asra-gray-400 text-sm mb-1">{t('settings.createdAtLabel')}</h3>
              <p className="text-white">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : t('settings.emptyValue')}
              </p>
            </div>
            <div>
              <h3 className="text-asra-gray-400 text-sm mb-1">{t('settings.lastLoginLabel')}</h3>
              <p className="text-white">
                {user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : t('settings.emptyValue')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
