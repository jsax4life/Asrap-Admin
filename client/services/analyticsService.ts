import apiClient from './apiClient';

// Types for API responses
export interface AdminOverviewResponse {
  status: string;
  data: {
    revenueGenerated: number;
    totals: {
      artists: number;
      albums: number;
      songs: number;
      downloads: number;
    };
    users: {
      activeLast30d: number;
      newSignupsLast30d: number;
    };
    streams: {
      songsStreamedLast30d: number;
    };
  };
}

export interface TopArtist {
  monthlyListeners: number;
  _id: string;
  name: string;
  profilePicture: string;
}

export interface TopArtistsResponse {
  status: string;
  results: number;
  data: TopArtist[];
}

export interface TopSong {
  plays: number;
  _id: string;
  title: string;
  coverPhotoUrl: string;
  artist: string;
}

export interface TopSongsResponse {
  status: string;
  results: number;
  data: TopSong[];
}

class AnalyticsService {
  /**
   * Get admin overview data including revenue, totals, users, and streams
   */
  async getAdminOverview(): Promise<AdminOverviewResponse> {
    try {
      // Backend path format: /api/v1/analytics/admin/overview
      const response = await apiClient.get<AdminOverviewResponse>('/analytics/admin/overview') as any;
      return response;
    } catch (error: any) {
      console.error('Error fetching admin overview:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch admin overview');
    }
  }

  /**
   * Get top artists by monthly listeners
   * @param limit - Number of results to return (default: 10)
   * @param period - Time period (default: '30d')
   */
  async getTopArtists(limit: number = 10, period: string = '30d'): Promise<TopArtistsResponse> {
    try {
      const response = await apiClient.get<TopArtistsResponse>(
        `/analytics/admin/top-artists?limit=${limit}&period=${period}`
      ) as any;
      return response;
    } catch (error: any) {
      console.error('Error fetching top artists:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch top artists');
    }
  }

  /**
   * Get top songs by plays
   * @param limit - Number of results to return (default: 10)
   * @param period - Time period (default: '30d')
   */
  async getTopSongs(limit: number = 10, period: string = '30d'): Promise<TopSongsResponse> {
    try {
      const response = await apiClient.get<TopSongsResponse>(
        `/analytics/admin/top-songs?limit=${limit}&period=${period}`
      ) as any;
      return response;
    } catch (error: any) {
      console.error('Error fetching top songs:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch top songs');
    }
  }
}

// Export singleton instance
export const analyticsService = new AnalyticsService();
export default analyticsService;

