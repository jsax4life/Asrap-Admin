import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { AuthLayout } from '@/layouts/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/authService';
import { getPostLoginPath } from '@/lib/roles';

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Le mot de passe actuel est requis'),
    newPassword: z.string().min(8, 'Le nouveau mot de passe doit comporter au moins 8 caractères'),
    confirmPassword: z.string().min(1, 'Veuillez confirmer votre nouveau mot de passe'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'Le nouveau mot de passe doit être différent du mot de passe temporaire',
    path: ['newPassword'],
  });

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export const ChangePassword = () => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

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

      toast.success('Mot de passe mis à jour avec succès');
      if (updatedUser) {
        navigate(getPostLoginPath(updatedUser), { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    } catch (error: any) {
      toast.error(error.message || 'Échec du changement de mot de passe');
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
          <h1 className="text-2xl font-bold text-white mb-2">Définissez votre nouveau mot de passe</h1>
          <p className="text-asra-gray-6 text-sm">
            Votre compte a été créé par un administrateur. Pour des raisons de sécurité, vous devez
            changer votre mot de passe temporaire avant de continuer.
          </p>
        </div>

        {user && (
          <p className="text-center text-asra-gray-6 text-sm">
            Connecté en tant que <span className="text-white">{user.email}</span>
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="text-white">
              Mot de passe temporaire / actuel
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
              Nouveau mot de passe
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
              Confirmer le nouveau mot de passe
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
                Mise à jour...
              </>
            ) : (
              'Mettre à jour le mot de passe et continuer'
            )}
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
};
