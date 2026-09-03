import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { AuthLayout } from '@/layouts/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/authService';
import { getPostLoginPath } from '@/lib/roles';

export const ChangePassword = () => {
  const { t } = useTranslation('auth');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const changePasswordSchema = useMemo(
    () =>
      z
        .object({
          currentPassword: z.string().min(1, t('changePassword.validation.currentPasswordRequired')),
          newPassword: z.string().min(8, t('changePassword.validation.newPasswordTooShort')),
          confirmPassword: z.string().min(1, t('changePassword.validation.confirmPasswordRequired')),
        })
        .refine((data) => data.newPassword === data.confirmPassword, {
          message: t('changePassword.validation.passwordsDoNotMatch'),
          path: ['confirmPassword'],
        })
        .refine((data) => data.currentPassword !== data.newPassword, {
          message: t('changePassword.validation.newPasswordMustDiffer'),
          path: ['newPassword'],
        }),
    [t]
  );

  type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    setIsLoading(true);
    try {
      await authService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      const updatedUser = user ? { ...user, mustChangePassword: false } : null;
      useAuthStore.setState({ user: updatedUser });

      toast.success(t('changePassword.updateSuccess'));
      if (updatedUser) {
        navigate(getPostLoginPath(updatedUser), { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    } catch (error: any) {
      toast.error(error.message || t('changePassword.updateError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-14 h-14 bg-asra-red/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-7 h-7 text-asra-red" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">{t('changePassword.heading')}</h1>
          <p className="text-asra-gray-6 text-sm">
            {t('changePassword.subheading')}
          </p>
        </div>

        {user && (
          <p className="text-center text-asra-gray-6 text-sm">
            {t('changePassword.loggedInAs')} <span className="text-white">{user.email}</span>
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="text-white">
              {t('changePassword.currentPasswordLabel')}
            </Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrent ? 'text' : 'password'}
                className="bg-asra-gray-2 border-asra-gray-5 text-white pr-10"
                {...register('currentPassword')}
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-asra-gray-6 hover:text-white"
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-asra-red text-sm">{errors.currentPassword.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-white">
              {t('changePassword.newPasswordLabel')}
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNew ? 'text' : 'password'}
                className="bg-asra-gray-2 border-asra-gray-5 text-white pr-10"
                {...register('newPassword')}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-asra-gray-6 hover:text-white"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-asra-red text-sm">{errors.newPassword.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-white">
              {t('changePassword.confirmPasswordLabel')}
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              className="bg-asra-gray-2 border-asra-gray-5 text-white"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-asra-red text-sm">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-asra-red hover:bg-asra-red/90 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t('changePassword.submitButtonLoading')}
              </>
            ) : (
              t('changePassword.submitButton')
            )}
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
};
