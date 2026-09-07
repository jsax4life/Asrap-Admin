import axios from 'axios';
import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '@/constants';

export interface Genre {
  _id: string;
  name: string;
  description?: string;
  coverImageUrl?: string | null;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface GenresListResponse {
  status: string;
  message?: string;
  results: number;
  data: {
    genres: Genre[];
  };
}

interface AddGenreResponse {
  status: string;
  message: string;
  data?: {
    genre?: Genre;
    genres?: Genre[];
  };
}

interface UpdateGenreResponse {
  status: string;
  message: string;
  data?: {
    genre?: Genre;
  };
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}

class GenreService {
  async listGenres(): Promise<Genre[]> {
    try {
      // Admin management needs deactivated genres too (to allow re-adding a
      // duplicate name, which reactivates it instead of failing) — the public
      // GENRES.LIST endpoint only returns active genres.
      const response = (await apiClient.get<{ genres: Genre[] }>(
        API_ENDPOINTS.GENRES.ADMIN_LIST
      )) as unknown as GenresListResponse;

      if (response.status !== 'success' || !response.data?.genres) {
        throw new Error(response.message || 'Failed to load genres');
      }
      return response.data.genres;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to load genres'));
    }
  }

  async addGenre(payload: {
    name?: string;
    names?: string;
    description?: string;
    coverImage?: File;
  }): Promise<AddGenreResponse> {
    const formData = new FormData();
    if (payload.name) formData.append('name', payload.name.trim());
    if (payload.names) formData.append('names', payload.names.trim());
    if (payload.description) formData.append('description', payload.description.trim());
    if (payload.coverImage) formData.append('coverImage', payload.coverImage);

    try {
      const response = (await apiClient.post<AddGenreResponse>(
        API_ENDPOINTS.GENRES.ADMIN_CREATE,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )) as unknown as AddGenreResponse;

      if (response.status !== 'success') {
        throw new Error(response.message || 'Failed to add genre');
      }
      return response;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to add genre'));
    }
  }

  async updateGenre(
    genreId: string,
    payload: {
      name?: string;
      description?: string;
      coverImage?: File;
    }
  ): Promise<UpdateGenreResponse> {
    const url = API_ENDPOINTS.GENRES.ADMIN_UPDATE.replace(':genreId', genreId);

    try {
      let response: UpdateGenreResponse;

      if (payload.coverImage) {
        const formData = new FormData();
        if (payload.name !== undefined) formData.append('name', payload.name.trim());
        if (payload.description !== undefined) formData.append('description', payload.description.trim());
        formData.append('coverImage', payload.coverImage);

        response = (await apiClient.patch<UpdateGenreResponse>(url, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })) as unknown as UpdateGenreResponse;
      } else {
        const body: Record<string, string> = {};
        if (payload.name !== undefined) body.name = payload.name.trim();
        if (payload.description !== undefined) body.description = payload.description.trim();

        if (Object.keys(body).length === 0) {
          throw new Error('Provide at least one field to update');
        }

        response = (await apiClient.patch<UpdateGenreResponse>(url, body)) as unknown as UpdateGenreResponse;
      }

      if (response.status !== 'success') {
        throw new Error(response.message || 'Failed to update genre');
      }
      return response;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to update genre'));
    }
  }

  async deleteGenre(genreId: string): Promise<void> {
    try {
      const response = (await apiClient.delete<{ status: string; message: string }>(
        API_ENDPOINTS.GENRES.ADMIN_DELETE.replace(':genreId', genreId)
      )) as unknown as { status: string; message: string };

      if (response.status !== 'success') {
        throw new Error(response.message || 'Failed to delete genre');
      }
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to delete genre'));
    }
  }
}

export const genreService = new GenreService();
