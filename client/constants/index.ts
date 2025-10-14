import { MenuItem, UserRole } from '@/types';
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
  Calendar
} from 'lucide-react';

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

// Authentication
export const AUTH_TOKEN_KEY = 'asra_auth_token';
export const REFRESH_TOKEN_KEY = 'asra_refresh_token';

// User Roles
export const USER_ROLES: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  moderator: 'Moderator',
  analyst: 'Analyst',
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
    id: 'playlist-management',
    label: 'Asra Playlist Management',
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
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
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
} as const;

// Theme configuration
export const THEME_CONFIG = {
  defaultTheme: 'dark',
  storageKey: 'asra_theme',
} as const;
