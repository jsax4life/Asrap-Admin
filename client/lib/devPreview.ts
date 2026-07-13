import { AUTH_TOKEN_KEY } from '@/constants';
import { useAuthStore } from '@/store/authStore';
import { User } from '@/types';

export const DEV_PREVIEW_KEY = 'asra_dev_preview';

export const MOCK_AGENT_USER: User = {
  id: 'preview-agent-001',
  email: 'agent.preview@asrapa.com',
  name: 'Amina Bello',
  role: 'payment_agent',
  firstName: 'Amina',
  lastName: 'Bello',
  isActive: true,
  isEmailVerified: true,
  createdAt: new Date().toISOString(),
  phoneNumber: '+234 801 000 0000',
  department: 'Field Agents',
};

export function isDevPreview(): boolean {
  return import.meta.env.DEV && sessionStorage.getItem(DEV_PREVIEW_KEY) === 'agent';
}

export function enterAgentPreview(): void {
  sessionStorage.setItem(DEV_PREVIEW_KEY, 'agent');
  localStorage.setItem(AUTH_TOKEN_KEY, 'dev-preview-token');
  useAuthStore.setState({
    user: MOCK_AGENT_USER,
    accessToken: 'dev-preview-token',
    refreshTokenValue: null,
    isAuthenticated: true,
    isLoading: false,
  });
}

export function exitDevPreview(): void {
  sessionStorage.removeItem(DEV_PREVIEW_KEY);
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem('asra_refresh_token');
  useAuthStore.getState().clearAuth();
}
