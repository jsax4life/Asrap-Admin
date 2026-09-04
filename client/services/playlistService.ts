import axios from 'axios';
import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '@/constants';

export interface PlaylistSongItem {
  _id: string;
  title: string;
  artist?: { _id: string; stageName?: string; name?: string } | null;
  album?: { _id: string; title?: string } | null;
  duration?: number;
  coverPhotoUrl?: string | null;
  addedAt?: string;
}

export interface Playlist {
  _id: string;
  title: string;
  description?: string;
  coverImageUrl?: string | null;
  bannerText?: string | null;
  isPublic: boolean;
  likes?: number;
  songCount?: number;
  totalDurationFormatted?: string;
  songs?: PlaylistSongItem[];
  createdAt?: string;
  updatedAt?: string;
}

interface PlaylistsListResponse {
  status: string;
  message?: string;
  results?: number;
  data: {
    playlists: Playlist[];
  };
}

interface PlaylistDetailResponse {
  status: string;
  message?: string;
  data: {
    playlist: Playlist;
  };
}

interface PlaylistMutationResponse {
  status: string;
  message: string;
  data?: {
    playlist?: Playlist;
  };
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}

class PlaylistService {
  async listPlaylists(): Promise<Playlist[]> {
    try {
      const response = (await apiClient.get<{ playlists: Playlist[] }>(
        API_ENDPOINTS.PLAYLISTS.LIST
      )) as unknown as PlaylistsListResponse;

      if (response.status !== 'success' || !response.data?.playlists) {
        throw new Error(response.message || 'Failed to load playlists');
      }
      return response.data.playlists;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to load playlists'));
    }
  }

  async getPlaylist(playlistId: string): Promise<Playlist> {
    const url = API_ENDPOINTS.PLAYLISTS.DETAIL.replace(':playlistId', playlistId);
    try {
      const response = (await apiClient.get<{ playlist: Playlist }>(
        url
      )) as unknown as PlaylistDetailResponse;

      if (response.status !== 'success' || !response.data?.playlist) {
        throw new Error(response.message || 'Failed to load playlist');
      }
      return response.data.playlist;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to load playlist'));
    }
  }

  async createPlaylist(payload: {
    title: string;
    description?: string;
    isPublic?: boolean;
    coverImage?: File;
  }): Promise<Playlist> {
    const formData = new FormData();
    formData.append('title', payload.title.trim());
    if (payload.description) formData.append('description', payload.description.trim());
    formData.append('isPublic', String(payload.isPublic ?? true));
    if (payload.coverImage) formData.append('coverImage', payload.coverImage);

    try {
      const response = (await apiClient.post<{ playlist: Playlist }>(
        API_ENDPOINTS.PLAYLISTS.CREATE,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )) as unknown as PlaylistMutationResponse;

      if (response.status !== 'success' || !response.data?.playlist) {
        throw new Error(response.message || 'Failed to create playlist');
      }
      return response.data.playlist;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to create playlist'));
    }
  }

  async updatePlaylist(
    playlistId: string,
    payload: { title?: string; description?: string; isPublic?: boolean; coverImage?: File }
  ): Promise<Playlist> {
    const url = API_ENDPOINTS.PLAYLISTS.UPDATE.replace(':playlistId', playlistId);
    try {
      let response: PlaylistMutationResponse;

      if (payload.coverImage) {
        const formData = new FormData();
        if (payload.title !== undefined) formData.append('title', payload.title.trim());
        if (payload.description !== undefined) formData.append('description', payload.description.trim());
        if (payload.isPublic !== undefined) formData.append('isPublic', String(payload.isPublic));
        formData.append('coverImage', payload.coverImage);

        response = (await apiClient.patch<{ playlist: Playlist }>(url, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })) as unknown as PlaylistMutationResponse;
      } else {
        response = (await apiClient.patch<{ playlist: Playlist }>(
          url,
          payload
        )) as unknown as PlaylistMutationResponse;
      }

      if (response.status !== 'success' || !response.data?.playlist) {
        throw new Error(response.message || 'Failed to update playlist');
      }
      return response.data.playlist;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to update playlist'));
    }
  }

  async deletePlaylist(playlistId: string): Promise<void> {
    const url = API_ENDPOINTS.PLAYLISTS.DELETE.replace(':playlistId', playlistId);
    try {
      const response = (await apiClient.delete<{ status: string; message: string }>(
        url
      )) as unknown as { status: string; message: string };

      if (response.status !== 'success') {
        throw new Error(response.message || 'Failed to delete playlist');
      }
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to delete playlist'));
    }
  }

  async addSongs(playlistId: string, songIds: string[]): Promise<Playlist> {
    const url = API_ENDPOINTS.PLAYLISTS.ADD_SONGS.replace(':playlistId', playlistId);
    try {
      const response = (await apiClient.post<{ playlist: Playlist }>(url, {
        songIds,
      })) as unknown as PlaylistMutationResponse;

      if (response.status !== 'success' || !response.data?.playlist) {
        throw new Error(response.message || 'Failed to add songs');
      }
      return response.data.playlist;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to add songs'));
    }
  }

  async removeSong(playlistId: string, songId: string): Promise<void> {
    const url = API_ENDPOINTS.PLAYLISTS.REMOVE_SONG
      .replace(':playlistId', playlistId)
      .replace(':songId', songId);
    try {
      const response = (await apiClient.delete<{ status: string; message: string }>(
        url
      )) as unknown as { status: string; message: string };

      if (response.status !== 'success') {
        throw new Error(response.message || 'Failed to remove song');
      }
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to remove song'));
    }
  }
}

export const playlistService = new PlaylistService();
