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

  // Initialize auth state on mount - only runs once
  useEffect(() => {
    let mounted = true;
    
    const initializeAuth = async () => {
      // Get current state from store to avoid stale closures
      const currentState = useAuthStore.getState();
      const hasToken = authService.isAuthenticated();
      
      // Only fetch profile if we have a token but no user (fresh page load)
      // If user already exists (e.g., from login or persisted state), skip profile fetch
      if (hasToken && !currentState.user) {
        setLoading(true);
        try {
          const userProfile = await authService.getProfile();
          if (mounted) {
            setUser(userProfile);
          }
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          // Only clear auth if we still don't have a user and component is mounted
          // This prevents logout after successful login if profile fetch fails
          if (mounted) {
            const stateAfterError = useAuthStore.getState();
            if (!stateAfterError.user) {
              clearAuth();
            }
          }
        } finally {
          if (mounted) {
            setLoading(false);
          }
        }
      } else if (!hasToken && currentState.user) {
        // We have a user but no token - clear auth (token expired or removed)
        if (mounted) {
          clearAuth();
        }
      } else if (hasToken && currentState.user) {
        // We have both token and user - ensure loading is false
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();
    
    return () => {
      mounted = false;
    };
  }, []); // Empty deps - only run once on mount

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
