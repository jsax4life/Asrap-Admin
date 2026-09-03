import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { AuthLayout } from '@/layouts/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/authStore';
import { LoginRequest } from '@/types';
import { getPostLoginPath } from '@/lib/roles';

const loginSchema = z.object({
  email: z.string().email('Veuillez saisir une adresse e-mail valide'),
  password: z.string().min(6, 'Le mot de passe doit comporter au moins 6 caractères'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

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
      toast.success('Connexion réussie !');
      const currentUser = useAuthStore.getState().user;
      const redirectTo = currentUser
        ? getPostLoginPath(currentUser)
        : from;
      navigate(redirectTo, { replace: true });
    } catch (error: any) {
      toast.error(error.message || 'Échec de la connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Content de vous revoir</h1>
          <p className="text-asra-gray-6">Connectez-vous à votre compte administrateur ou agent</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              Adresse e-mail
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@asrapa.com"
              className="bg-asra-gray-2 border-asra-gray-5 text-white placeholder:text-asra-gray-6"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-asra-red text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">
              Mot de passe
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Entrez votre mot de passe"
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
                Connexion en cours...
              </>
            ) : (
              'Se connecter'
            )}
          </Button>
        </form>

        <div className="text-center">
          <button className="text-asra-gray-6 hover:text-white text-sm">
            Mot de passe oublié ?
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};
