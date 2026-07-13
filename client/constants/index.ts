import { MenuItem, UserRole, SubscriptionPlan } from '@/types';
import { 
  Home, 
  BarChart3, 
  Upload, 
  Music2, 
  Users, 
  Megaphone, 
  Banknote, 
  UserCircle, 
  HelpCircle, 
  LogOut,
  Settings,
  Shield,
  TrendingUp,
  FileText,
  Calendar,
  UserPlus,
  CreditCard,
  ClipboardList,
  Headphones,
  Mic2,
  Building2,
  Tags,
} from 'lucide-react';

export const APP_NAME = 'Asrapa';
export const APP_NAME_FULL = 'Asrapa Music';

// API Configuration
// In production: use https://api.asrapa.com
// In development: use http://localhost:4000
const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // Check if we're in production or development
  const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
  
  if (isProduction) {
    return 'https://api.asrapa.com/api/v1';
  }
  
  return 'http://localhost:4000/api/v1';
};

export const API_BASE_URL = getApiBaseUrl();

// Authentication
export const AUTH_TOKEN_KEY = 'asra_auth_token';
export const REFRESH_TOKEN_KEY = 'asra_refresh_token';

// User Roles
export const USER_ROLES: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  moderator: 'Moderator',
  analyst: 'Analyst',
  payment_agent: 'Payment Agent',
};

// Menu Items Configuration
export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'Home',
    path: '/dashboard',
    roles: ['super_admin', 'admin', 'moderator', 'analyst'],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: 'BarChart3',
    path: '/analytics',
    roles: ['super_admin', 'admin', 'analyst'],
  },
  {
    id: 'music-upload',
    label: 'Music Upload Approval',
    icon: 'Upload',
    path: '/music-upload',
    roles: ['super_admin', 'admin', 'moderator'],
  },
  {
    id: 'genre-management',
    label: 'Genre Management',
    icon: 'Tags',
    path: '/genre-management',
    roles: ['super_admin', 'admin', 'moderator'],
  },
  {
    id: 'playlist-management',
    label: 'Asrapa Playlist Management',
    icon: 'Music2',
    path: '/playlist-management',
    roles: ['super_admin', 'admin', 'moderator'],
  },
  {
    id: 'artist-management',
    label: 'Artist/User Management',
    icon: 'Users',
    path: '/artist-management',
    roles: ['super_admin', 'admin', 'moderator'],
  },
  {
    id: 'promotion',
    label: 'Promotion',
    icon: 'Megaphone',
    path: '/promotion',
    roles: ['super_admin', 'admin'],
  },
  {
    id: 'payments',
    label: 'Payment',
    icon: 'Banknote',
    path: '/payments',
    roles: ['super_admin', 'admin'],
  },
  {
    id: 'admin-users',
    label: 'Admin Users',
    icon: 'UserCircle',
    path: '/admin-users',
    roles: ['super_admin'],
  },
];

// Agent App Menu Items
export const AGENT_MENU_ITEMS: MenuItem[] = [
  {
    id: 'agent-dashboard',
    label: 'Dashboard',
    icon: 'Home',
    path: '/agent/dashboard',
    roles: ['payment_agent'],
  },
  {
    id: 'agent-onboarding',
    label: 'Onboard Clients',
    icon: 'UserPlus',
    path: '/agent/onboarding',
    roles: ['payment_agent'],
  },
  {
    id: 'agent-clients',
    label: 'My Clients',
    icon: 'Users',
    path: '/agent/clients',
    roles: ['payment_agent'],
  },
  {
    id: 'agent-subscriptions',
    label: 'Subscriptions',
    icon: 'CreditCard',
    path: '/agent/subscriptions',
    roles: ['payment_agent'],
  },
  {
    id: 'agent-transactions',
    label: 'Transactions',
    icon: 'Banknote',
    path: '/agent/transactions',
    roles: ['payment_agent'],
  },
];

export const AGENT_ACCOUNT_MENU_ITEMS: MenuItem[] = [
  {
    id: 'agent-help',
    label: 'Help & Support',
    icon: 'HelpCircle',
    path: '/agent/help',
    roles: ['payment_agent'],
  },
  {
    id: 'agent-logout',
    label: 'Log Out',
    icon: 'LogOut',
    path: '/logout',
    roles: ['payment_agent'],
  },
];

// Subscription plans available for agents to sell
export const SUBSCRIPTION_PLANS: Record<SubscriptionPlan, { label: string; price: number; clientTypes: string[] }> = {
  free: { label: 'Free', price: 0, clientTypes: ['user'] },
  premium: { label: 'Premium (Listener)', price: 1500, clientTypes: ['user'] },
  family: { label: 'Family Plan', price: 3500, clientTypes: ['user'] },
  artist_pro: { label: 'Artist Pro', price: 5000, clientTypes: ['artist'] },
  advertiser_starter: { label: 'Advertiser Starter', price: 10000, clientTypes: ['advertiser'] },
  advertiser_pro: { label: 'Advertiser Pro', price: 25000, clientTypes: ['advertiser'] },
};

export const ACCOUNT_MENU_ITEMS: MenuItem[] = [
  {
    id: 'settings',
    label: 'Settings',
    icon: 'Settings',
    path: '/settings',
    roles: ['super_admin', 'admin', 'moderator', 'analyst'],
  },
  {
    id: 'help-support',
    label: 'Help & Support',
    icon: 'HelpCircle',
    path: '/help-support',
    roles: ['super_admin', 'admin', 'moderator', 'analyst'],
  },
  {
    id: 'logout',
    label: 'Log Out',
    icon: 'LogOut',
    path: '/logout',
    roles: ['super_admin', 'admin', 'moderator', 'analyst'],
  },
];

// Icon mapping for dynamic icon rendering
export const ICON_MAP = {
  Home,
  BarChart3,
  Upload,
  Music2,
  Users,
  Megaphone,
  Banknote,
  UserCircle,
  HelpCircle,
  LogOut,
  Settings,
  Shield,
  TrendingUp,
  FileText,
  Calendar,
  UserPlus,
  CreditCard,
  ClipboardList,
  Headphones,
  Mic2,
  Building2,
  Tags,
};

// Table pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// Date formats
export const DATE_FORMATS = {
  display: 'MMM dd, yyyy',
  api: 'yyyy-MM-dd',
  datetime: 'MMM dd, yyyy HH:mm',
};

// File upload limits
export const UPLOAD_LIMITS = {
  maxFileSize: 50 * 1024 * 1024, // 50MB
  allowedAudioTypes: ['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/mp4'],
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
};

// Notification types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const;

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/admin/auth/login',
    LOGOUT: '/admin/auth/logout',
    REFRESH: '/admin/auth/refresh',
    PROFILE: '/admin/auth/me',
    CHANGE_PASSWORD: '/admin/auth/change-password',
  },
  USERS: {
    LIST: '/users',
    CREATE: '/users',
    UPDATE: '/users/:id',
    DELETE: '/users/:id',
    BULK_DELETE: '/users/bulk-delete',
  },
  ARTISTS: {
    LIST: '/artists',
    CREATE: '/artists',
    UPDATE: '/artists/:id',
    DELETE: '/artists/:id',
  },
  SONGS: {
    LIST: '/songs',
    CREATE: '/songs',
    UPDATE: '/songs/:id',
    DELETE: '/songs/:id',
    UPLOAD: '/songs/upload',
  },
  DASHBOARD: {
    METRICS: '/dashboard/metrics',
    TOP_ARTISTS: '/dashboard/top-artists',
    TOP_SONGS: '/dashboard/top-songs',
  },
  ANALYTICS: {
    OVERVIEW: '/analytics/overview',
    REVENUE: '/analytics/revenue',
    USERS: '/analytics/users',
    STREAMS: '/analytics/streams',
  },
  AGENT: {
    DASHBOARD: '/agent/dashboard',
    CLIENTS: '/agent/clients',
    ONBOARD: '/agent/clients/onboard',
    SUBSCRIPTIONS: '/agent/subscriptions',
    TRANSACTIONS: '/agent/transactions',
    CREATE_ACCOUNT: '/admin/agents',
  },
  ADMIN: {
    ADMINS: '/admin/management/admins',
  },
  GENRES: {
    LIST: '/genres',
    ADMIN_CREATE: '/admin/genres',
    ADMIN_DELETE: '/admin/genres/:genreId',
  },
} as const;

// Theme configuration
export const THEME_CONFIG = {
  defaultTheme: 'dark',
  storageKey: 'asra_theme',
} as const;
