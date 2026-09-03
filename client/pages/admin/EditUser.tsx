import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Save, UserCheck, Mail, Phone, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useAuth } from '@/hooks/useAuth';
import { LanguageToggle } from '@/components/common/LanguageToggle';
// Mock data for user detail
const mockUserDetail = {
  id: 1,
  name: 'Bashir Muhammad',
  userType: 'Utilisateur administrateur',
  email: 'hasmad6806@gmail.com',
  phoneNumber: '+234 7068061724',
  role: 'Administrateur du support',
  accessLevel: 'Tableau de bord, Analytique, Aide et assistance',
  password: 'david@124)(',
  avatar: 'https://api.builder.io/api/v1/image/assets/TEMP/77784d2e1616758f6b0d5b70a64186f75a3b7ce5?width=200',
  status: 'Actif',
  lastLogin: '10/02/2023 9.00AM',
  createdAt: '2023-01-15',
};

const EditUser = () => {
  const { t } = useTranslation('admin');
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: mockUserDetail.name,
    userType: mockUserDetail.userType,
    email: mockUserDetail.email,
    phoneNumber: mockUserDetail.phoneNumber,
    role: mockUserDetail.role,
    accessLevel: mockUserDetail.accessLevel,
    password: mockUserDetail.password,
    avatar: null as File | null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const userTypeOptions = [
    'Utilisateur administrateur',
    'Agent de paiement',
    'Personnel de support',
    'Modérateur',
    'Analyste',
  ];

  const accessLevelOptions = [
    'Tableau de bord, Analytique, Aide et assistance',
    'Tableau de bord, Analytique',
    'Tableau de bord uniquement',
    'Accès complet',
    'Lecture seule',
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, avatar: file }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = t('editUser.errors.nameRequired');
    if (!formData.userType) newErrors.userType = t('editUser.errors.userTypeRequired');
    if (!formData.email) newErrors.email = t('editUser.errors.emailRequired');
    if (!formData.phoneNumber) newErrors.phoneNumber = t('editUser.errors.phoneNumberRequired');
    if (!formData.role) newErrors.role = t('editUser.errors.roleRequired');
    if (!formData.accessLevel) newErrors.accessLevel = t('editUser.errors.accessLevelRequired');
    if (!formData.password) newErrors.password = t('editUser.errors.passwordRequired');

    // Validation de l'e-mail
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('editUser.errors.emailInvalid');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Updating user:', formData);
      // TODO: Implement update user API call
      // For now, just navigate back to view user
      navigate(`/admin-users/view/${id}`);
    }
  };

  const handleGoBack = () => {
    navigate(`/admin-users/view/${id}`);
  };

  return (
    <div className="min-h-screen bg-asra-dark text-white">
      {/* Header */}
      <div className="bg-asra-dark border-b border-asra-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and Date */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-asra-red rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-white text-xl font-bold">Asrapa</span>
            </div>
            <div className="flex items-center space-x-2 text-asra-gray-400">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">{t('editUser.dateLabel')}</span>
            </div>
          </div>

          {/* Center - Page Title */}
          <div className="flex-1 flex justify-center">
            <h1 className="text-2xl font-bold text-white">{t('editUser.pageTitle')}</h1>
          </div>

          {/* Right side - Profile */}
          <LanguageToggle />
          <div
            onClick={() => navigate('/settings')}
            className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-asra-red rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-white text-sm">{user?.name || t('editUser.defaultUserName')}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 max-w-4xl mx-auto">
        {/* Back Link */}
        <button
          onClick={handleGoBack}
          className="text-asra-red hover:text-red-400 text-sm font-medium mb-6 flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('editUser.backLink')}</span>
        </button>

        {/* Form Title */}
        <h2 className="text-3xl font-bold text-white mb-8">{t('editUser.formTitle')}</h2>

        {/* Avatar Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-24 h-24 bg-asra-gray-800 rounded-full flex items-center justify-center border-2 border-asra-gray-700">
                {formData.avatar ? (
                  <img
                    src={URL.createObjectURL(formData.avatar)}
                    alt={t('editUser.avatar.previewAlt')}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <img
                    src={mockUserDetail.avatar}
                    alt={mockUserDetail.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                )}
              </div>
              <input
                type="file"
                id="avatar"
                accept="image/*"
                onChange={handleAvatarChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <div>
              <label htmlFor="avatar" className="text-white text-lg font-medium">
                {t('editUser.avatar.label')}
              </label>
              <p className="text-asra-gray-400 text-sm mt-1">
                {t('editUser.avatar.hint')}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* User Type */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  {t('editUser.form.userType')} <span className="text-asra-red">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.userType}
                    onChange={(e) => handleInputChange('userType', e.target.value)}
                    className={`w-full px-4 py-3 bg-asra-gray-800 border rounded-lg text-white focus:outline-none focus:border-asra-red ${
                      errors.userType ? 'border-red-500' : 'border-asra-gray-700'
                    }`}
                  >
                    <option value="" className="text-asra-gray-400 bg-asra-gray-800">{t('editUser.form.selectPlaceholder')}</option>
                    {userTypeOptions.map((option) => (
                      <option key={option} value={option} className="text-white bg-asra-gray-800">
                        {option}
                      </option>
                    ))}
                  </select>
                  <UserCheck className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-asra-gray-400 pointer-events-none" />
                </div>
                {errors.userType && (
                  <p className="text-red-500 text-sm mt-1">{errors.userType}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  {t('editUser.form.email')} <span className="text-asra-red">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder={t('editUser.form.emailPlaceholder')}
                    className={`w-full px-4 py-3 pl-12 bg-asra-gray-800 border rounded-lg text-white placeholder:text-asra-gray-400 focus:outline-none focus:border-asra-red ${
                      errors.email ? 'border-red-500' : 'border-asra-gray-700'
                    }`}
                  />
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-asra-gray-400" />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Role */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  {t('editUser.form.role')} <span className="text-asra-red">*</span>
                </label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  placeholder={t('editUser.form.rolePlaceholder')}
                  className={`w-full px-4 py-3 bg-asra-gray-800 border rounded-lg text-white placeholder:text-asra-gray-400 focus:outline-none focus:border-asra-red ${
                    errors.role ? 'border-red-500' : 'border-asra-gray-700'
                  }`}
                />
                {errors.role && (
                  <p className="text-red-500 text-sm mt-1">{errors.role}</p>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  {t('editUser.form.name')} <span className="text-asra-red">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder={t('editUser.form.namePlaceholder')}
                  className={`w-full px-4 py-3 bg-asra-gray-800 border rounded-lg text-white placeholder:text-asra-gray-400 focus:outline-none focus:border-asra-red ${
                    errors.name ? 'border-red-500' : 'border-asra-gray-700'
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  {t('editUser.form.phoneNumber')} <span className="text-asra-red">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    placeholder={t('editUser.form.phoneNumberPlaceholder')}
                    className={`w-full px-4 py-3 pl-12 bg-asra-gray-800 border rounded-lg text-white placeholder:text-asra-gray-400 focus:outline-none focus:border-asra-red ${
                      errors.phoneNumber ? 'border-red-500' : 'border-asra-gray-700'
                    }`}
                  />
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-asra-gray-400" />
                </div>
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
                )}
              </div>

              {/* Access Level */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  {t('editUser.form.accessLevel')} <span className="text-asra-red">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.accessLevel}
                    onChange={(e) => handleInputChange('accessLevel', e.target.value)}
                    className={`w-full px-4 py-3 bg-asra-gray-800 border rounded-lg text-white focus:outline-none focus:border-asra-red ${
                      errors.accessLevel ? 'border-red-500' : 'border-asra-gray-700'
                    }`}
                  >
                    <option value="" className="text-asra-gray-400 bg-asra-gray-800">{t('editUser.form.selectPlaceholder')}</option>
                    {accessLevelOptions.map((option) => (
                      <option key={option} value={option} className="text-white bg-asra-gray-800">
                        {option}
                      </option>
                    ))}
                  </select>
                  <Shield className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-asra-gray-400 pointer-events-none" />
                </div>
                {errors.accessLevel && (
                  <p className="text-red-500 text-sm mt-1">{errors.accessLevel}</p>
                )}
              </div>
            </div>
          </div>

          {/* Password Section */}
          <div className="border-t border-asra-gray-700 pt-8">
            <h3 className="text-lg font-semibold text-white mb-4">{t('editUser.credentials.title')}</h3>
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                {t('editUser.credentials.password')} <span className="text-asra-red">*</span>
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder={t('editUser.credentials.passwordPlaceholder')}
                className={`w-full px-4 py-3 bg-asra-gray-800 border rounded-lg text-white placeholder:text-asra-gray-400 focus:outline-none focus:border-asra-red ${
                  errors.password ? 'border-red-500' : 'border-asra-gray-700'
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-8">
            <button
              type="submit"
              className="bg-asra-red hover:bg-red-600 text-white px-12 py-4 rounded-lg text-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Save className="w-6 h-6" />
              <span>{t('editUser.saveChanges')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
