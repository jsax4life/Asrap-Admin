// Core types for Asra Music Admin Dashboard

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface Artist {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  monthlyListeners: number;
  totalStreams: number;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface Song {
  id: string;
  title: string;
  artist: Artist;
  album?: string;
  duration: number;
  genre: string;
  streams: number;
  isActive: boolean;
  createdAt: string;
  coverArt?: string;
}

export interface Album {
  id: string;
  title: string;
  artist: Artist;
  songs: Song[];
  coverArt?: string;
  releaseDate: string;
  totalStreams: number;
  isActive: boolean;
}

export interface DashboardMetrics {
  totalRevenue: number;
  totalArtists: number;
  totalAlbums: number;
  totalSongs: number;
  totalDownloads: number;
  activeUsers: number;
  newUserSignups: number;
  totalStreams: number;
}

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  roles: UserRole[];
  children?: MenuItem[];
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshTokenValue: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ThemeState {
  theme: 'light' | 'dark';
  systemTheme: boolean;
}

export type UserRole = 'super_admin' | 'admin' | 'moderator' | 'analyst';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  isRead: boolean;
}

export interface SearchFilters {
  query?: string;
  role?: UserRole;
  status?: 'active' | 'inactive';
  dateFrom?: string;
  dateTo?: string;
}

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}
