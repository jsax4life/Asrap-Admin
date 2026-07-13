import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '@/constants';
import { CreateAgentAccountRequest } from '@/types';

export interface CreateAgentResponse {
  status: string;
  message: string;
  data: {
    id: string;
    email: string;
    role: string;
    mustChangePassword: boolean;
  };
}

export interface PaymentAgentListItem {
  id: string;
  name: string;
  email: string;
  role: string;
  phoneNumber?: string;
  lastLoginAt?: string | null;
  isActive: boolean;
  mustChangePassword: boolean;
  createdAt?: string;
}

interface AdminRecord {
  _id?: string;
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phoneNumber?: string;
  lastLoginAt?: string | null;
  isActive?: boolean;
  mustChangePassword?: boolean;
  createdAt?: string;
}

interface ListAdminsResponse {
  status: string;
  message: string;
  data: AdminRecord[];
  meta?: {
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
}

function mapAdminToAgent(admin: AdminRecord): PaymentAgentListItem {
  return {
    id: admin.id || admin._id || '',
    name: `${admin.firstName} ${admin.lastName}`.trim(),
    email: admin.email,
    role: 'Payment Agent',
    phoneNumber: admin.phoneNumber,
    lastLoginAt: admin.lastLoginAt,
    isActive: admin.isActive !== false,
    mustChangePassword: Boolean(admin.mustChangePassword),
    createdAt: admin.createdAt,
  };
}

async function fetchAdmins(params: URLSearchParams): Promise<ListAdminsResponse> {
  return (await apiClient.get<AdminRecord[]>(
    `${API_ENDPOINTS.ADMIN.ADMINS}?${params.toString()}`
  )) as unknown as ListAdminsResponse;
}

class AdminAgentService {
  async createPaymentAgent(payload: CreateAgentAccountRequest): Promise<CreateAgentResponse['data']> {
    const response = (await apiClient.post<CreateAgentResponse['data']>(
      API_ENDPOINTS.AGENT.CREATE_ACCOUNT,
      payload
    )) as unknown as CreateAgentResponse;

    if (response.status !== 'success' || !response.data) {
      throw new Error(response.message || 'Failed to create payment agent');
    }

    return response.data;
  }

  async listPaymentAgents(filters?: {
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ agents: PaymentAgentListItem[]; pagination: NonNullable<ListAdminsResponse['meta']>['pagination'] }> {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;

    const buildParams = (includeRole: boolean) => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(includeRole ? limit : 100),
      });
      if (includeRole) params.set('role', 'payment_agent');
      if (filters?.search) params.set('search', filters.search);
      return params;
    };

    const parseResponse = (response: ListAdminsResponse) => {
      if (response.status !== 'success' || !response.data) {
        throw new Error(response.message || 'Failed to load payment agents');
      }
      const paymentAgents = response.data.filter((admin) => admin.role === 'payment_agent');
      return {
        agents: paymentAgents.map(mapAdminToAgent),
        pagination: response.meta?.pagination ?? {
          currentPage: page,
          totalPages: Math.ceil(paymentAgents.length / limit) || 1,
          totalItems: paymentAgents.length,
          itemsPerPage: limit,
        },
      };
    };

    try {
      const response = await fetchAdmins(buildParams(true));
      return parseResponse(response);
    } catch (firstError) {
      // Live API may reject role=payment_agent until backend validation is updated
      try {
        const response = await fetchAdmins(buildParams(false));
        return parseResponse(response);
      } catch {
        throw firstError instanceof Error ? firstError : new Error('Failed to load payment agents');
      }
    }
  }
}

export const adminAgentService = new AdminAgentService();
