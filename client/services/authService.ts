import axios from 'axios';
import { apiClient } from './apiClient';
import { API_ENDPOINTS, API_BASE_URL } from '@/constants';
import { LoginRequest, LoginResponse, User, ApiResponse, AdminLoginResponse, AdminProfileResponse } from '@/types';

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<AdminLoginResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials
      ) as any; // Temporary fix - apiClient returns wrong type

      if (response.status === 'success' && response.data) {
        const { admin, accessToken } = response.data;
        
        // Transform API response to match frontend User type
        const user: User = {
          id: admin.id,
          email: admin.email,
          name: `${admin.firstName} ${admin.lastName}`,
          role: admin.role as any,
          firstName: admin.firstName,
          lastName: admin.lastName,
          department: admin.department,
          permissions: admin.permissions,
          isEmailVerified: admin.isEmailVerified,
          isActive: true,
          createdAt: new Date().toISOString(),
          lastLogin: admin.lastLoginAt,
          lastLoginAt: admin.lastLoginAt,
        };
        
        // Store tokens
        apiClient.setAuthToken(accessToken);
        localStorage.setItem('asra_refresh_token', accessToken); // Using accessToken as refresh for now
        
        return {
          user,
          accessToken,
          refreshToken: accessToken, // TODO: Update when separate refresh token is available
        };
      }

      throw new Error(response.message || 'Login failed');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Login failed');
    }
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local tokens
      apiClient.clearAuthToken();
    }
  }

  async getProfile(): Promise<User> {
    try {
      const response = await apiClient.get<AdminProfileResponse>(API_ENDPOINTS.AUTH.PROFILE) as any; // Temporary fix - apiClient returns wrong type
      
      if (response.status === 'success' && response.data) {
        const admin = response.data;
        
        // Transform API response to match frontend User type
        const user: User = {
          id: admin.id || admin._id,
          email: admin.email,
          name: admin.fullName || `${admin.firstName} ${admin.lastName}`,
          role: admin.role as any,
          avatar: admin.profilePicture?.url || undefined,
          firstName: admin.firstName,
          lastName: admin.lastName,
          department: admin.department,
          permissions: admin.permissions,
          isEmailVerified: admin.isEmailVerified,
          isActive: admin.isActive,
          phoneNumber: admin.phoneNumber,
          passwordChangedAt: admin.passwordChangedAt,
          updatedAt: admin.updatedAt,
          loginAttempts: admin.loginAttempts,
          fullName: admin.fullName,
          isLocked: admin.isLocked,
          createdAt: admin.createdAt,
          lastLogin: admin.lastLoginAt,
          lastLoginAt: admin.lastLoginAt,
        };
        
        return user;
      }

      throw new Error(response.message || 'Failed to fetch profile');
    } catch (error: any) {
      console.error('getProfile error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: API_ENDPOINTS.AUTH.PROFILE,
      });
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch profile');
    }
  }

  async refreshToken(): Promise<string> {
    try {
      // Use axios directly to avoid circular dependency and interceptor loops
      const response = await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const responseData = response.data as AdminLoginResponse;

      if (responseData.status === 'success' && responseData.data) {
        const { accessToken } = responseData.data;
        apiClient.setAuthToken(accessToken);
        
        // Update refresh token if provided (some implementations return new refresh token)
        if (responseData.data.accessToken) {
          localStorage.setItem('asra_refresh_token', responseData.data.accessToken);
        }
        
        return accessToken;
      }

      throw new Error(responseData.message || 'Token refresh failed');
    } catch (error: any) {
      console.error('Token refresh error:', error);
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
