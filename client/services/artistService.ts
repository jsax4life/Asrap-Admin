import { apiClient } from './apiClient';

export interface ArtistListFilters {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'stageName' | 'followers' | 'monthlyListeners' | 'songCount';
  sortOrder?: 'asc' | 'desc';
  status?: 'active' | 'deactivated';
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
  isDeleted?: boolean;
  isActive?: boolean;
  createdAt: string;
  artistType?: 'independent' | 'labelled';
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
  artistType?: 'independent' | 'labelled';
  labelName?: string | null;
  labelManagerName?: string | null;
  labelManagerContact?: string | null;
  albumsAndEPs: { count: number; items: ArtistAlbumItem[] };
  songs: { count: number; items: ArtistSongItem[] };
  videos: { count: number; items: any[] };
}

export interface ArtistDetailResponse {
  status: string;
  data: ArtistDetailData;
}

interface ArtistActionResponse {
  status: string;
  message: string;
}

class ArtistService {
  async listArtists(filters: ArtistListFilters = {}): Promise<ArtistListResponse> {
    const params: Record<string, string | number> = {};
    if (filters.search) params.search = filters.search;
    if (filters.page) params.page = filters.page;
    if (filters.limit) params.limit = filters.limit;
    if (filters.sortBy) params.sortBy = filters.sortBy;
    if (filters.sortOrder) params.sortOrder = filters.sortOrder;
    if (filters.status) params.status = filters.status;

    const query = new URLSearchParams(
      Object.entries(params).map(([key, value]) => [key, String(value)])
    ).toString();
    const url = `/admin/artists${query ? `?${query}` : ''}`;
    const response = await apiClient.get<ArtistListResponse>(url) as any;
    return response;
  }

  async getArtistDetail(id: string): Promise<ArtistDetailResponse> {
    const response = await apiClient.get<ArtistDetailResponse>(`/admin/artists/${id}`) as any;
    return response;
  }

  async deactivateArtist(artistId: string): Promise<ArtistActionResponse> {
    const response = (await apiClient.patch<ArtistActionResponse>(
      `/admin/artists/${artistId}/deactivate`
    )) as unknown as ArtistActionResponse;

    if (response.status !== 'success') {
      throw new Error(response.message || 'Failed to deactivate artist');
    }
    return response;
  }

  async reactivateArtist(artistId: string): Promise<ArtistActionResponse> {
    const response = (await apiClient.patch<ArtistActionResponse>(
      `/admin/artists/${artistId}/reactivate`
    )) as unknown as ArtistActionResponse;

    if (response.status !== 'success') {
      throw new Error(response.message || 'Failed to reactivate artist');
    }
    return response;
  }

  async deleteArtist(artistId: string): Promise<ArtistActionResponse> {
    const response = (await apiClient.delete<ArtistActionResponse>(
      `/admin/artists/${artistId}`
    )) as unknown as ArtistActionResponse;

    if (response.status !== 'success') {
      throw new Error(response.message || 'Failed to delete artist');
    }
    return response;
  }
}

export const artistService = new ArtistService();
export default artistService;


