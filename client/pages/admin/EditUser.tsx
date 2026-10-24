import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Save, Mail, Phone, Shield, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';

import { useAuth } from '@/hooks/useAuth';
import { LanguageToggle } from '@/components/common/LanguageToggle';
import { adminManagementService, AdminMember, AdminUpdatePayload } from '@/services/adminManagementService';

// Departments accepted by PATCH /admin/management/admins/:adminId
const DEPARTMENTS = ['technical', 'content', 'support', 'management'] as const;

type FormState = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  department: string;
  bio: string;
};

const inputClass = (hasError: boolean) =>
  `w-full px-4 py-3 bg-asra-gray-800 border rounded-lg text-white placeholder:text-asra-gray-400 focus:outline-none focus:border-asra-red ${
    hasError ? 'border-red-500' : 'border-asra-gray-700'
  }`;

const EditUser = () => {
  const { t, i18n } = useTranslation('admin');
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const locale = i18n.language === 'en' ? 'en-GB' : 'fr-FR';

  const [admin, setAdmin] = useState<AdminMember | null>(null);
  const [formData, setFormData] = useState<FormState>({ firstName: '', lastName: '', phoneNumber: '', department: '', bio: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    adminManagementService
      .getAdmin(id)
      .then((data) => {
        setAdmin(data);
        setFormData({
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phoneNumber || '',
          department: data.department || '',
          bio: data.bio || '',
        });
      })
      .catch((err: Error) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleInputChange = (field: keyof FormState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    // Same rules as the API: 2 to 50 characters
    if (formData.firstName.trim().length < 2) newErrors.firstName = t('editUser.errors.firstNameRequired');
    if (formData.lastName.trim().length < 2) newErrors.lastName = t('editUser.errors.lastNameRequired');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const buildPayload = (): AdminUpdatePayload => {
    if (!admin) return {};
    const payload: AdminUpdatePayload = {};
    if (formData.firstName.trim() !== admin.firstName) payload.firstName = formData.firstName.trim();
    if (formData.lastName.trim() !== admin.lastName) payload.lastName = formData.lastName.trim();
    if (formData.phoneNumber.trim() !== (admin.phoneNumber || '')) payload.phoneNumber = formData.phoneNumber.trim();
    if (formData.department !== (admin.department || '')) payload.department = formData.department;
    if (formData.bio.trim() !== (admin.bio || '')) payload.bio = formData.bio.trim();
    return payload;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!admin || !validateForm()) return;

    const payload = buildPayload();
    if (Object.keys(payload).length === 0) {
      toast(t('editUser.noChanges'));
      return;
    }

    setSaving(true);
    try {
      await adminManagementService.updateAdmin(admin.id, payload);
      toast.success(t('editUser.saved'));
      navigate(`/admin-users/view/${admin.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t('editUser.saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  const departmentOptions: string[] =
    formData.department && !DEPARTMENTS.includes(formData.department as (typeof DEPARTMENTS)[number])
      ? [formData.department, ...DEPARTMENTS]
      : [...DEPARTMENTS];

  return (
    <div className="min-h-screen bg-asra-dark text-white">
      {/* Header */}
      <div className="bg-asra-dark border-b border-asra-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-asra-red rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-white text-xl font-bold">Asrapa</span>
            </div>
            <div className="flex items-center space-x-2 text-asra-gray-400">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">{new Date().toLocaleDateString(locale)}</span>
            </div>
          </div>

          <div className="flex-1 flex justify-center">
            <h1 className="text-2xl font-bold text-white">{t('editUser.pageTitle')}</h1>
          </div>

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
        <button
          onClick={() => navigate(`/admin-users/view/${id}`)}
          className="text-asra-red hover:text-red-400 text-sm font-medium mb-6 flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('editUser.backToProfile')}</span>
        </button>

        <h2 className="text-3xl font-bold text-white mb-8">{t('editUser.formTitle')}</h2>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-asra-red animate-spin" />
          </div>
        ) : !admin ? (
          <div className="bg-asra-gray-900 rounded-lg p-8 text-center text-asra-gray-400">{t('viewUser.notFound')}</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    {t('editUser.form.firstName')} <span className="text-asra-red">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    maxLength={50}
                    className={inputClass(!!errors.firstName)}
                  />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">{t('editUser.form.email')}</label>
                  <div className="relative">
                    <input type="email" value={admin.email} readOnly className={`${inputClass(false)} pl-12 opacity-60`} />
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-asra-gray-400" />
                  </div>
                  <p className="text-asra-gray-400 text-xs mt-1">{t('editUser.readOnlyHint')}</p>
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">{t('editUser.form.role')}</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={t(`roles.${admin.role}`, { ns: 'common', defaultValue: admin.role })}
                      readOnly
                      className={`${inputClass(false)} opacity-60`}
                    />
                    <Shield className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-asra-gray-400 pointer-events-none" />
                  </div>
                  <p className="text-asra-gray-400 text-xs mt-1">{t('editUser.roleHint')}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    {t('editUser.form.lastName')} <span className="text-asra-red">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    maxLength={50}
                    className={inputClass(!!errors.lastName)}
                  />
                  {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">{t('editUser.form.phoneNumber')}</label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      placeholder={t('editUser.form.phoneNumberPlaceholder')}
                      className={`${inputClass(false)} pl-12`}
                    />
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-asra-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">{t('editUser.form.department')}</label>
                  <select
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className={inputClass(false)}
                  >
                    <option value="" className="bg-asra-gray-800">{t('editUser.form.selectPlaceholder')}</option>
                    {departmentOptions.map((d) => (
                      <option key={d} value={d} className="bg-asra-gray-800">
                        {t(`departments.${d}`, { defaultValue: d })}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">{t('editUser.form.bio')}</label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={3}
                maxLength={500}
                className={`${inputClass(false)} resize-none`}
              />
            </div>

            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={saving}
                className="bg-asra-red hover:bg-red-600 text-white px-12 py-4 rounded-lg text-lg font-medium transition-colors flex items-center space-x-2 disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
                <span>{t('editUser.saveChanges')}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditUser;
