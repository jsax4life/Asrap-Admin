import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Printer, Edit, Trash2, Loader2, Power } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';

import { useAuth } from '@/hooks/useAuth';
import { LanguageToggle } from '@/components/common/LanguageToggle';
import { adminManagementService, AdminMember } from '@/services/adminManagementService';

function Initials({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="w-24 h-24 rounded-full bg-asra-red/30 border-2 border-asra-red flex items-center justify-center text-2xl font-bold text-white">
      {initials}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-asra-gray-300 mb-2">{label}</label>
      <p className="text-white text-lg break-words">{value}</p>
    </div>
  );
}

const ViewUser = () => {
  const { t, i18n } = useTranslation('admin');
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const locale = i18n.language === 'en' ? 'en-GB' : 'fr-FR';

  const [admin, setAdmin] = useState<AdminMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = () => {
    if (!id) return;
    setLoading(true);
    adminManagementService
      .getAdmin(id)
      .then(setAdmin)
      .catch((err: Error) => toast.error(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  const isSelf = admin?.id === user?.id;
  const backPath = admin?.role === 'payment_agent' ? '/admin-users?tab=payment-agents' : '/admin-users';
  const formatDate = (iso?: string | null) =>
    iso ? new Date(iso).toLocaleString(locale, { dateStyle: 'short', timeStyle: 'short' }) : t('usersList.table.never');

  const handleDelete = async () => {
    if (!admin || !window.confirm(t('usersList.confirmDelete', { name: admin.name }))) return;
    setBusy(true);
    try {
      await adminManagementService.deleteAdmin(admin.id);
      toast.success(t('usersList.deleted'));
      navigate(backPath);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t('usersList.deleteFailed'));
    } finally {
      setBusy(false);
    }
  };

  const handleToggleActive = async () => {
    if (!admin) return;
    setBusy(true);
    try {
      await adminManagementService.setActive(admin.id, !admin.isActive);
      toast.success(admin.isActive ? t('viewUser.deactivated') : t('viewUser.activated'));
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t('viewUser.statusFailed'));
    } finally {
      setBusy(false);
    }
  };

  const roleLabel = admin ? t(`roles.${admin.role}`, { ns: 'common', defaultValue: admin.role }) : '';

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
            <h1 className="text-2xl font-bold text-white">{t('viewUser.pageTitle')}</h1>
          </div>

          <LanguageToggle />
          <div
            onClick={() => navigate('/settings')}
            className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-asra-red rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-white text-sm">{user?.name || t('viewUser.defaultUserName')}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(backPath)}
            className="text-asra-red hover:text-red-400 text-sm font-medium flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('viewUser.backLink')}</span>
          </button>
          <button
            onClick={() => window.print()}
            disabled={!admin}
            className="bg-asra-red hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            <Printer className="w-4 h-4" />
            <span>{t('viewUser.printButton')}</span>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-asra-red animate-spin" />
          </div>
        ) : !admin ? (
          <div className="bg-asra-gray-900 rounded-lg p-8 text-center text-asra-gray-400">{t('viewUser.notFound')}</div>
        ) : (
          <div className="bg-asra-gray-900 rounded-lg p-8">
            <div className="flex items-start space-x-6 mb-8">
              {admin.profilePicture ? (
                <img
                  src={admin.profilePicture}
                  alt={admin.name}
                  className="w-24 h-24 rounded-full object-cover border-2 border-asra-red"
                />
              ) : (
                <Initials name={admin.name} />
              )}
              <div>
                <h2 className="text-lg font-medium text-asra-gray-300 mb-1">{t('viewUser.userNameLabel')}</h2>
                <h3 className="text-2xl font-bold text-white">{admin.name}</h3>
                <span
                  className={`inline-block mt-2 text-xs px-2 py-1 rounded-full ${
                    admin.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {admin.isActive ? t('usersList.table.statusActive') : t('usersList.table.statusInactive')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Field label={t('viewUser.fields.role')} value={roleLabel} />
              <Field label={t('viewUser.fields.email')} value={admin.email} />
              <Field label={t('viewUser.fields.phoneNumber')} value={admin.phoneNumber || '—'} />
              <Field
                label={t('viewUser.fields.department')}
                value={admin.department ? t(`departments.${admin.department}`, { defaultValue: admin.department }) : '—'}
              />
              <Field label={t('viewUser.fields.lastLogin')} value={formatDate(admin.lastLoginAt)} />
              <Field label={t('viewUser.fields.createdAt')} value={formatDate(admin.createdAt)} />
              {admin.createdBy && <Field label={t('viewUser.fields.createdBy')} value={admin.createdBy} />}
              <Field
                label={t('viewUser.fields.password')}
                value={admin.mustChangePassword ? t('usersList.table.passwordToChange') : t('usersList.table.passwordSet')}
              />
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-asra-gray-300 mb-2">{t('viewUser.fields.accessLevel')}</label>
                {admin.role === 'super_admin' ? (
                  <p className="text-white text-lg">{t('viewUser.fullAccess')}</p>
                ) : admin.permissions.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {admin.permissions.map((p) => (
                      <span key={p} className="text-xs px-2 py-1 rounded-full bg-asra-gray-800 text-asra-gray-300">
                        {p}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-white text-lg">—</p>
                )}
              </div>
              {admin.bio && (
                <div className="md:col-span-2">
                  <Field label={t('viewUser.fields.bio')} value={admin.bio} />
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate(`/admin-users/edit/${admin.id}`)}
                className="bg-asra-red hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <Edit className="w-5 h-5" />
                <span>{t('viewUser.editButton')}</span>
              </button>
              <button
                onClick={handleToggleActive}
                disabled={busy || isSelf}
                className="bg-transparent border border-white text-white hover:bg-white hover:text-black px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Power className="w-5 h-5" />
                <span>{admin.isActive ? t('viewUser.deactivateButton') : t('viewUser.activateButton')}</span>
              </button>
              <button
                onClick={handleDelete}
                disabled={busy || isSelf}
                className="bg-transparent border border-white text-white hover:bg-white hover:text-black px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-5 h-5" />
                <span>{t('viewUser.deleteButton')}</span>
              </button>
            </div>
            {isSelf && <p className="text-asra-gray-400 text-sm mt-3">{t('viewUser.selfNote')}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewUser;
