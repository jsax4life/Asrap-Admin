import axios from 'axios';
import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '@/constants';

// Admin team (all admin accounts except payment agents), served by
// /admin/management/admins on the AsraPa API.

export interface AdminMember {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  role: string;
  phoneNumber?: string;
  department?: string;
  bio?: string;
  profilePicture?: string | null;
  isActive: boolean;
  mustChangePassword: boolean;
  permissions: string[];
  lastLoginAt?: string | null;
  createdAt?: string;
  createdBy?: string | null;
}

export interface AdminUpdatePayload {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  role?: string;
  department?: string;
  bio?: string;
}

interface AdminRecord {
  _id?: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: string;
  phoneNumber?: string;
  department?: string;
  bio?: string;
  profilePicture?: string | null;
  isActive?: boolean;
  mustChangePassword?: boolean;
  permissions?: string[];
  lastLoginAt?: string | null;
  createdAt?: string;
  createdBy?: { firstName?: string; lastName?: string; email?: string } | null;
}

interface ApiEnvelope<T> {
  status: string;
  message?: string;
  data?: T;
}

function toMember(admin: AdminRecord): AdminMember {
  const firstName = admin.firstName || '';
  const lastName = admin.lastName || '';
  const creator = admin.createdBy
    ? `${admin.createdBy.firstName || ''} ${admin.createdBy.lastName || ''}`.trim() || admin.createdBy.email || null
    : null;
  return {
    id: admin.id || admin._id || '',
    firstName,
    lastName,
    name: `${firstName} ${lastName}`.trim() || admin.email,
    email: admin.email,
    role: admin.role,
    phoneNumber: admin.phoneNumber,
    department: admin.department,
    bio: admin.bio,
    profilePicture: /^https?:\/\//.test(admin.profilePicture || '') ? admin.profilePicture! : null,
    isActive: admin.isActive !== false,
    mustChangePassword: Boolean(admin.mustChangePassword),
    permissions: Array.isArray(admin.permissions) ? admin.permissions : [],
    lastLoginAt: admin.lastLoginAt ?? null,
    createdAt: admin.createdAt,
    createdBy: creator,
  };
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}

function adminUrl(adminId: string, suffix = ''): string {
  return `${API_ENDPOINTS.ADMIN.ADMINS}/${encodeURIComponent(adminId)}${suffix}`;
}

class AdminManagementService {
  /** Admin team without payment agents (they have their own tab). */
  async listTeam(search?: string): Promise<AdminMember[]> {
    const params = new URLSearchParams({ page: '1', limit: '100' });
    if (search) params.set('search', search);
    try {
      const response = (await apiClient.get(
        `${API_ENDPOINTS.ADMIN.ADMINS}?${params.toString()}`
      )) as unknown as ApiEnvelope<AdminRecord[]>;
      if (response.status !== 'success' || !Array.isArray(response.data)) {
        throw new Error(response.message || 'Failed to load admin users');
      }
      return response.data.filter((a) => a.role !== 'payment_agent').map(toMember);
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to load admin users'));
    }
  }

  async getAdmin(adminId: string): Promise<AdminMember> {
    try {
      const response = (await apiClient.get(adminUrl(adminId))) as unknown as ApiEnvelope<AdminRecord>;
      if (response.status !== 'success' || !response.data) {
        throw new Error(response.message || 'Failed to load admin');
      }
      return toMember(response.data);
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to load admin'));
    }
  }

  async updateAdmin(adminId: string, payload: AdminUpdatePayload): Promise<AdminMember> {
    try {
      const response = (await apiClient.patch(adminUrl(adminId), payload)) as unknown as ApiEnvelope<AdminRecord>;
      if (response.status !== 'success' || !response.data) {
        throw new Error(response.message || 'Failed to update admin');
      }
      return toMember(response.data);
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to update admin'));
    }
  }

  async setActive(adminId: string, active: boolean): Promise<void> {
    try {
      const response = (await apiClient.patch(
        adminUrl(adminId, active ? '/activate' : '/deactivate')
      )) as unknown as ApiEnvelope<unknown>;
      if (response.status !== 'success') {
        throw new Error(response.message || 'Failed to update admin status');
      }
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to update admin status'));
    }
  }

  async deleteAdmin(adminId: string): Promise<void> {
    try {
      const response = (await apiClient.delete(adminUrl(adminId))) as unknown as ApiEnvelope<unknown>;
      if (response.status !== 'success') {
        throw new Error(response.message || 'Failed to delete admin');
      }
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to delete admin'));
    }
  }
}

export const adminManagementService = new AdminManagementService();
