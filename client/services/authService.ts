import axios from 'axios';
import { apiClient } from './apiClient';
import { API_ENDPOINTS, API_BASE_URL, REFRESH_TOKEN_KEY } from '@/constants';
import { LoginRequest, LoginResponse, User, ApiResponse, AdminLoginResponse, AdminProfileResponse, ChangePasswordRequest } from '@/types';

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<AdminLoginResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials
      ) as any; // Temporary fix - apiClient returns wrong type

      if (response.status === 'success' && response.data) {
        const { admin, accessToken, refreshToken } = response.data;
        
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
          mustChangePassword: admin.mustChangePassword ?? false,
        };
        
        // Store tokens
        apiClient.setAuthToken(accessToken);
        if (refreshToken) {
          localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        }
        
        return {
          user,
          accessToken,
          refreshToken: refreshToken || '',
        };
      }

      throw new Error(response.message || 'Login failed');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Login failed');
    }
  }

  async changePassword(data: ChangePasswordRequest): Promise<void> {
    try {
      const response = await apiClient.post<{ status: string; message: string }>(
        API_ENDPOINTS.AUTH.CHANGE_PASSWORD,
        data
      ) as any;

      if (response.status !== 'success') {
        throw new Error(response.message || 'Failed to change password');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to change password');
    }
  }

  async logout(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, refreshToken ? { refreshToken } : undefined);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local tokens
      apiClient.clearAuthToken();
    }
  }

  private mapAdminToUser(admin: AdminProfileResponse['data']): User {
    return {
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
      mustChangePassword: admin.mustChangePassword ?? false,
    };
  }

  async getProfile(): Promise<User> {
    try {
      const response = await apiClient.get<AdminProfileResponse>(API_ENDPOINTS.AUTH.PROFILE) as any; // Temporary fix - apiClient returns wrong type

      if (response.status === 'success' && response.data) {
        return this.mapAdminToUser(response.data);
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

  async updateProfile(data: { firstName?: string; lastName?: string; phoneNumber?: string }): Promise<User> {
    try {
      const response = await apiClient.patch<AdminProfileResponse>(
        API_ENDPOINTS.AUTH.UPDATE_PROFILE,
        data
      ) as any;

      if (response.status === 'success' && response.data) {
        return this.mapAdminToUser(response.data);
      }

      throw new Error(response.message || 'Failed to update profile');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to update profile');
    }
  }

  async uploadAvatar(file: File): Promise<User> {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await apiClient.post<AdminProfileResponse>(
        API_ENDPOINTS.AUTH.UPLOAD_AVATAR,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      ) as any;

      if (response.status === 'success' && response.data) {
        return this.mapAdminToUser(response.data);
      }

      throw new Error(response.message || 'Failed to upload avatar');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to upload avatar');
    }
  }

  async refreshToken(): Promise<string> {
    try {
      const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

      // Use axios directly to avoid circular dependency and interceptor loops
      const response = await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`,
        storedRefreshToken ? { refreshToken: storedRefreshToken } : {},
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      const responseData = response.data as AdminLoginResponse;

      if (responseData.status === 'success' && responseData.data) {
        const { accessToken, refreshToken } = responseData.data;
        apiClient.setAuthToken(accessToken);
        
        if (refreshToken) {
          localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
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
