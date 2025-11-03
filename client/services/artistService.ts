import { apiClient } from './apiClient';

export interface ArtistListFilters {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'stageName' | 'followers' | 'monthlyListeners' | 'songCount';
  sortOrder?: 'asc' | 'desc';
}

export interface ArtistItem {
  _id: string;
  artistId: string;
  stageName: string;
  fullName: string;
  profilePicture: string | null;
  followers: number;
  monthlyListeners: number;
  songCount: number;
  genre: string | null;
  email: string;
  createdAt: string;
}

export interface ArtistListResponse {
  status: string;
  results: number;
  totalResults: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  data: ArtistItem[];
}

// Artist Detail types (subset based on provided response)
export interface ArtistStatistics {
  followers: number;
  monthlyListeners: number;
  likes: number;
  songs: number;
  totalDuration: number;
  totalDurationFormatted: string;
}

export interface ArtistAlbumItem {
  _id: string;
  title: string;
  year: number;
  coverPhotoUrl: string;
  songCount: number;
  durationFormatted: string;
  plays: number;
  type: 'album' | 'ep';
}

export interface ArtistSongItem {
  _id: string;
  title: string;
  album: string;
  year: number;
  durationFormatted: string;
  status: string;
  plays: number;
  uploadedAt: string;
}

export interface ArtistDetailData {
  _id: string;
  stageName: string;
  fullName: string;
  email: string;
  profilePicture: string | null;
  bannerImageUrl: string | null;
  bio: string | null;
  genre: string | null;
  hometown: string | null;
  socialMedia: Record<string, string>;
  statistics: ArtistStatistics;
  createdAt: string;
  albumsAndEPs: { count: number; items: ArtistAlbumItem[] };
  songs: { count: number; items: ArtistSongItem[] };
  videos: { count: number; items: any[] };
}

export interface ArtistDetailResponse {
  status: string;
  data: ArtistDetailData;
}

class ArtistService {
  async listArtists(filters: ArtistListFilters = {}): Promise<ArtistListResponse> {
    const params: Record<string, any> = {};
    if (filters.search) params.search = filters.search;
    if (filters.page) params.page = filters.page;
    if (filters.limit) params.limit = filters.limit;
    if (filters.sortBy) params.sortBy = filters.sortBy;
    if (filters.sortOrder) params.sortOrder = filters.sortOrder;

    const query = new URLSearchParams(params).toString();
    const url = `/admin/artists${query ? `?${query}` : ''}`;
    const response = await apiClient.get<ArtistListResponse>(url) as any;
    return response;
  }

  async getArtistDetail(id: string): Promise<ArtistDetailResponse> {
    const response = await apiClient.get<ArtistDetailResponse>(`/admin/artists/${id}`) as any;
    return response;
  }
}

export const artistService = new ArtistService();
export default artistService;


