import { useCallback, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/authService';
import { LoginRequest } from '@/types';

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    login: storeLogin,
    logout: storeLogout,
    setUser,
    setLoading,
    clearAuth,
  } = useAuthStore();

  // Initialize auth state on mount
  useEffect(() => {
    // TEMPORARY: Skip API calls when backend is not ready
    // TODO: Uncomment when backend authentication is ready
    /*
    const initializeAuth = async () => {
      if (authService.isAuthenticated()) {
        setLoading(true);
        try {
          const userProfile = await authService.getProfile();
          setUser(userProfile);
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          clearAuth();
        } finally {
          setLoading(false);
        }
      }
    };

    initializeAuth();
    */
  }, [setUser, setLoading, clearAuth]);

  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      await storeLogin(credentials);
    } catch (error) {
      throw error;
    }
  }, [storeLogin]);

  const logout = useCallback(async () => {
    try {
      await storeLogout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [storeLogout]);

  const hasRole = useCallback((role: string) => {
    return user?.role === role;
  }, [user?.role]);

  const hasAnyRole = useCallback((roles: string[]) => {
    return user?.role ? roles.includes(user.role) : false;
  }, [user?.role]);

  const canAccess = useCallback((requiredRoles: string[]) => {
    if (!user) return false;
    return requiredRoles.includes(user.role);
  }, [user]);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    hasRole,
    hasAnyRole,
    canAccess,
  };
};
