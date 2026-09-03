import { useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { AuthLayout } from '@/layouts/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/authStore';
import { LoginRequest } from '@/types';
import { getPostLoginPath } from '@/lib/roles';

export const Login = () => {
  const { t } = useTranslation('auth');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const loginSchema = useMemo(
    () =>
      z.object({
        email: z.string().email(t('login.validation.invalidEmail')),
        password: z.string().min(6, t('login.validation.passwordTooShort')),
      }),
    [t]
  );

  type LoginFormData = z.infer<typeof loginSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      await login(data as LoginRequest);
      toast.success(t('login.loginSuccess'));
      const currentUser = useAuthStore.getState().user;
      const redirectTo = currentUser
        ? getPostLoginPath(currentUser)
        : from;
      navigate(redirectTo, { replace: true });
    } catch (error: any) {
      toast.error(error.message || t('login.loginError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">{t('login.heading')}</h1>
          <p className="text-asra-gray-6">{t('login.subheading')}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              {t('login.emailLabel')}
            </Label>
            <Input
              id="email"
              type="email"
              placeholder={t('login.emailPlaceholder')}
              className="bg-asra-gray-2 border-asra-gray-5 text-white placeholder:text-asra-gray-6"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-asra-red text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">
              {t('login.passwordLabel')}
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder={t('login.passwordPlaceholder')}
                className="bg-asra-gray-2 border-asra-gray-5 text-white placeholder:text-asra-gray-6 pr-10"
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-asra-gray-6 hover:text-white"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-asra-red text-sm">{errors.password.message}</p>
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
                {t('login.submitButtonLoading')}
              </>
            ) : (
              t('login.submitButton')
            )}
          </Button>
        </form>

        <div className="text-center">
          <button className="text-asra-gray-6 hover:text-white text-sm">
            {t('login.forgotPassword')}
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};
