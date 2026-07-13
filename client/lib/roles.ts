import { UserRole } from '@/types';

export const ADMIN_ROLES: UserRole[] = ['super_admin', 'admin', 'moderator', 'analyst'];
export const AGENT_ROLES: UserRole[] = ['payment_agent'];

export function isAgentRole(role: UserRole): boolean {
  return AGENT_ROLES.includes(role);
}

export function isAdminRole(role: UserRole): boolean {
  return ADMIN_ROLES.includes(role);
}

export function getDefaultPathForRole(role: UserRole): string {
  if (isAgentRole(role)) return '/agent/dashboard';
  return '/dashboard';
}

export function getPostLoginPath(user: { role: UserRole; mustChangePassword?: boolean }): string {
  if (user.mustChangePassword) return '/change-password';
  return getDefaultPathForRole(user.role);
}
