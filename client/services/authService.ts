import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '@/constants';
import { LoginRequest, LoginResponse, User, ApiResponse } from '@/types';

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    // TEMPORARY: Return mock response when backend is not ready
    // TODO: Uncomment when backend is ready
    /*
    try {
      const response = await apiClient.post<LoginResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials
      );

      if (response.success && response.data) {
        // Store tokens
        apiClient.setAuthToken(response.data.accessToken);
        localStorage.setItem('asra_refresh_token', response.data.refreshToken);
        
        return response.data;
      }

      throw new Error(response.message || 'Login failed');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Login failed');
    }
    */
    
    // Mock login response for development
    const mockUser: User = {
      id: '1',
      email: credentials.email,
      name: 'System Admin',
      role: 'super_admin',
      avatar: 'https://api.builder.io/api/v1/image/assets/TEMP/77784d2e1616758f6b0d5b70a64186f75a3b7ce5?width=75',
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    return {
      user: mockUser,
      accessToken: 'mock-token',
      refreshToken: 'mock-refresh-token',
    };
  }

  async logout(): Promise<void> {
    // TEMPORARY: Skip API call when backend is not ready
    // TODO: Uncomment when backend is ready
    /*
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local tokens
      apiClient.clearAuthToken();
    }
    */
    
    // Just clear local tokens for now
    apiClient.clearAuthToken();
  }

  async getProfile(): Promise<User> {
    // TEMPORARY: Return mock user when backend is not ready
    // TODO: Uncomment when backend is ready
    /*
    try {
      const response = await apiClient.get<User>(API_ENDPOINTS.AUTH.PROFILE);
      
      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to fetch profile');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch profile');
    }
    */
    
    // Mock user for development
    return {
      id: '1',
      email: 'admin@asramusic.com',
      name: 'System Admin',
      role: 'super_admin',
      avatar: 'https://api.builder.io/api/v1/image/assets/TEMP/77784d2e1616758f6b0d5b70a64186f75a3b7ce5?width=75',
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };
  }

  async refreshToken(): Promise<string> {
    try {
      const refreshToken = localStorage.getItem('asra_refresh_token');
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiClient.post<{ accessToken: string }>(
        API_ENDPOINTS.AUTH.REFRESH,
        { refreshToken }
      );

      if (response.success && response.data) {
        apiClient.setAuthToken(response.data.accessToken);
        return response.data.accessToken;
      }

      throw new Error(response.message || 'Token refresh failed');
    } catch (error: any) {
      // Clear tokens on refresh failure
      apiClient.clearAuthToken();
      throw new Error(error.response?.data?.message || error.message || 'Token refresh failed');
    }
  }

  isAuthenticated(): boolean {
    const token = apiClient.getAuthToken();
    return !!token;
  }

  getStoredToken(): string | null {
    return apiClient.getAuthToken();
  }
}

export const authService = new AuthService();
export default authService;
