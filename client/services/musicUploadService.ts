import apiClient from './apiClient';
import { API_BASE_URL } from '@/constants';

// Types for API responses
export interface MusicUploadItem {
  _id: string;
  artistId: string;
  artistName: string;
  uploadType: 'song' | 'album';
  title: string;
  genre: string;
  dateSent: string;
  status: 'pending' | 'approved' | 'rejected';
  coverPhotoUrl: string;
  duration: number;
  songCount: number;
}

export interface MusicUploadsResponse {
  status: string;
  results: number;
  totalResults: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  data: MusicUploadItem[];
}

export interface MusicUploadFilters {
  search?: string;
  uploadType?: 'song' | 'album';
  status?: 'pending' | 'approved' | 'rejected';
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'title' | 'artistName' | 'genre' | 'status';
  sortOrder?: 'asc' | 'desc';
}

export interface Artist {
  _id: string;
  stageName: string;
  fullName: string;
  profilePicture: string;
}

export interface Collaborator {
  _id: string;
  stageName: string;
  profilePicture: string;
}

export interface AlbumSong {
  _id: string;
  title: string;
  duration: number;
  songUrl: string;
  s3Key: string;
  coverPhotoUrl: string;
  songUrlPresigned: string;
}

// Song-specific fields
export interface SongDetail {
  duration: number;
  songUrlPresigned: string;
  isExplicit?: boolean;
  collaborators?: Collaborator[];
  streams?: number;
  downloads?: number;
  popularity?: number;
  lyrics?: string;
}

// Album-specific fields
export interface AlbumDetail {
  songs: AlbumSong[];
  songCount: number;
  caption?: string;
}

// Base fields common to both
export interface MusicUploadDetailBase {
  _id: string;
  uploadType: 'song' | 'album';
  title: string;
  artist: Artist;
  genre: string;
  dateSent: string;
  status: 'pending' | 'approved' | 'rejected';
  coverPhotoUrl: string;
  comment: string | null;
  releaseDate: string;
}

// Union type for upload detail
export type MusicUploadDetail = MusicUploadDetailBase & (SongDetail | AlbumDetail);

export interface MusicUploadDetailResponse {
  status: string;
  data: MusicUploadDetail;
}

export interface UpdateStatusRequest {
  status: 'approved' | 'rejected';
  comment: string;
}

export interface UpdateStatusResponse {
  status: string;
  message: string;
  data: {
    _id: string;
    title: string;
    status: 'approved' | 'rejected';
    comment: string;
    updatedAt: string;
  };
}

class MusicUploadService {
  /**
   * Get all music uploads with filters and pagination
   */
  async getMusicUploads(filters: MusicUploadFilters = {}): Promise<MusicUploadsResponse> {
    try {
      // Build query parameters
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.uploadType) params.append('uploadType', filters.uploadType);
      if (filters.status) params.append('status', filters.status);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

      const queryString = params.toString();
      const url = `/admin/music-uploads${queryString ? `?${queryString}` : ''}`;
      
      const response = await apiClient.get<MusicUploadsResponse>(url) as any;
      return response;
    } catch (error: any) {
      console.error('Error fetching music uploads:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch music uploads');
    }
  }

  /**
   * Get a single music upload detail by ID
   */
  async getMusicUploadDetail(id: string): Promise<MusicUploadDetailResponse> {
    try {
      const response = await apiClient.get<MusicUploadDetailResponse>(`/admin/music-uploads/${id}`) as any;
      return response;
    } catch (error: any) {
      console.error('Error fetching music upload detail:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch music upload detail');
    }
  }

  /**
   * Update the status of a music upload (approve or reject)
   */
  async updateUploadStatus(id: string, status: 'approved' | 'rejected', comment: string): Promise<UpdateStatusResponse> {
    try {
      const url = `/admin/music-uploads/${id}/status`;
      const payload = {
        status,
        comment,
      };
      
      const response = await apiClient.patch<UpdateStatusResponse>(url, payload) as any;
      
      if (response.status === 'success') {
        return response;
      }
      
      throw new Error(response.message || 'Failed to update upload status');
    } catch (error: any) {
      console.error('Error updating upload status:', {
        url: `/admin/music-uploads/${id}/status`,
        status,
        error: error.message,
        response: error.response?.data,
        statusCode: error.response?.status,
      });
      
      throw new Error(error.response?.data?.message || error.message || 'Failed to update upload status');
    }
  }
}

// Export singleton instance
export const musicUploadService = new MusicUploadService();
export default musicUploadService;

