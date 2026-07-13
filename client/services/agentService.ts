import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '@/constants';
import {
  AgentClient,
  AgentDashboardStats,
  AgentTransaction,
  ClientType,
  OnboardingFormData,
  SubscriptionPlan,
} from '@/types';

interface ApiSuccessResponse<T> {
  status: string;
  message: string;
  data: T;
}

interface PaginatedApiResponse<T> {
  status: string;
  message: string;
  results: number;
  totalResults: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  data: T[];
  summary?: {
    totalCollected: number;
    transactionCount: number;
    estimatedCommission: number;
  };
}

function assertSuccess<T>(response: { status?: string; message?: string; data?: T }, fallback: string): T {
  if (response.status !== 'success' || response.data === undefined) {
    throw new Error(response.message || fallback);
  }
  return response.data;
}

function getErrorMessage(error: unknown, fallback: string): string {
  const err = error as { response?: { data?: { message?: string } }; message?: string };
  return err.response?.data?.message || err.message || fallback;
}

class AgentService {
  async getDashboardStats(): Promise<AgentDashboardStats> {
    try {
      const response = (await apiClient.get<AgentDashboardStats>(
        API_ENDPOINTS.AGENT.DASHBOARD
      )) as unknown as ApiSuccessResponse<AgentDashboardStats>;
      return assertSuccess(response, 'Failed to load dashboard');
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to load dashboard'));
    }
  }

  async getClients(filters?: {
    search?: string;
    clientType?: ClientType;
    subscriptionStatus?: string;
    page?: number;
    limit?: number;
  }): Promise<AgentClient[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.search) params.set('search', filters.search);
      if (filters?.clientType) params.set('clientType', filters.clientType);
      if (filters?.subscriptionStatus) params.set('subscriptionStatus', filters.subscriptionStatus);
      if (filters?.page) params.set('page', String(filters.page));
      if (filters?.limit) params.set('limit', String(filters.limit));

      const query = params.toString();
      const url = `${API_ENDPOINTS.AGENT.CLIENTS}${query ? `?${query}` : ''}`;
      const response = (await apiClient.get<AgentClient[]>(url)) as unknown as PaginatedApiResponse<AgentClient>;
      if (response.status !== 'success') {
        throw new Error(response.message || 'Failed to load clients');
      }
      return response.data || [];
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to load clients'));
    }
  }

  async getTransactions(filters?: { page?: number; limit?: number }): Promise<{
    transactions: AgentTransaction[];
    summary: { totalCollected: number; transactionCount: number; estimatedCommission: number };
  }> {
    try {
      const params = new URLSearchParams();
      if (filters?.page) params.set('page', String(filters.page));
      if (filters?.limit) params.set('limit', String(filters.limit));

      const query = params.toString();
      const url = `${API_ENDPOINTS.AGENT.TRANSACTIONS}${query ? `?${query}` : ''}`;
      const response = (await apiClient.get<AgentTransaction[]>(url)) as unknown as PaginatedApiResponse<AgentTransaction>;

      if (response.status !== 'success') {
        throw new Error(response.message || 'Failed to load transactions');
      }

      return {
        transactions: response.data || [],
        summary: response.summary || {
          totalCollected: 0,
          transactionCount: 0,
          estimatedCommission: 0,
        },
      };
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to load transactions'));
    }
  }

  async onboardClient(data: OnboardingFormData): Promise<{ success: boolean; clientId: string; transactionId?: string }> {
    try {
      const response = (await apiClient.post<{ clientId: string; transactionId?: string | null }>(
        API_ENDPOINTS.AGENT.ONBOARD,
        data
      )) as unknown as ApiSuccessResponse<{ clientId: string; transactionId?: string | null }>;

      const result = assertSuccess(response, 'Failed to onboard client');
      return {
        success: true,
        clientId: result.clientId,
        transactionId: result.transactionId || undefined,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to onboard client'));
    }
  }

  async createSubscription(
    clientId: string,
    plan: SubscriptionPlan,
    paymentMethod: string
  ): Promise<{ success: boolean; transactionId: string }> {
    try {
      const response = (await apiClient.post<{ transactionId: string }>(
        `${API_ENDPOINTS.AGENT.CLIENTS}/${clientId}/subscriptions`,
        { plan, paymentMethod }
      )) as unknown as ApiSuccessResponse<{ transactionId: string }>;

      const result = assertSuccess(response, 'Failed to create subscription');
      return { success: true, transactionId: result.transactionId };
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to create subscription'));
    }
  }
}

export const agentService = new AgentService();
