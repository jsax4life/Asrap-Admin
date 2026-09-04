import axios from 'axios';
import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '@/constants';

export interface SongItem {
  _id: string;
  title: string;
  duration: number;
  songUrl: string;
  coverPhotoUrl?: string | null;
  artist?: { _id: string; stageName?: string; name?: string } | null;
  genre?: { _id: string; name: string } | null;
}

interface SongsListResponse {
  status: string;
  message?: string;
  results?: number;
  data: {
    songs: SongItem[];
  };
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}

class SongService {
  async listSongs(): Promise<SongItem[]> {
    try {
      const response = (await apiClient.get<{ songs: SongItem[] }>(
        API_ENDPOINTS.SONGS.LIST
      )) as unknown as SongsListResponse;

      if (response.status !== 'success' || !response.data?.songs) {
        throw new Error(response.message || 'Failed to load songs');
      }
      return response.data.songs;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to load songs'));
    }
  }
}

export const songService = new SongService();
