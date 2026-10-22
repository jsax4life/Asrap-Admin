import axios from 'axios';
import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '@/constants';

// Moderation, Shorts community and AI Studio.
// Only /settings/landing-stats exists on the server today; the admin routes below
// are the contract for the coming backend work. A 404 means "not connected yet".

export type ModerationQueue = 'reports' | 'challenges' | 'ai';
export type ModerationSeverity = 'high' | 'medium' | 'low';
export type ModerationDecision =
  | 'publish' | 'reject' | 'request_version'
  | 'approve' | 'request_change'
  | 'keep' | 'hide' | 'warn' | 'suspend';

export interface ModerationItem {
  _id: string;
  queue: ModerationQueue;
  kind: 'short' | 'comment' | 'account' | 'challenge' | 'ai_video';
  title: string;
  subtitle?: string;
  severity: ModerationSeverity;
  previewUrl?: string | null;
  account?: string;
  sound?: string;
  reason?: string;
  duration?: string;
  consent?: string;
  instructions?: string;
  receivedAt?: string;
}

export interface DecisionLogEntry {
  _id: string;
  createdAt: string;
  adminName: string;
  itemLabel: string;
  decision: ModerationDecision;
}

export interface LandingStats {
  songs: number;
  artists: number;
  listeners: number;
  cities: number;
}

export interface CommunityStats {
  shortsPerDay: number;
  creatorsRate: number;
  streamsFromShorts: number;
  retention7d: number;
}

export interface CommunityChallenge {
  _id: string;
  title: string;
  artistName: string;
  participations: number;
  status: 'pending' | 'active';
}

export interface TopSound {
  songId: string;
  title: string;
  artistName: string;
  genre?: string;
  coverUrl?: string | null;
  shortsCount: number;
}

export interface CommunityCreator {
  _id: string;
  name: string;
  avatarUrl?: string | null;
  detail?: string;
  kind: 'fan' | 'verification';
}

export interface StudioStats {
  generationsThisMonth: number;
  higgsfieldCredits: number;
  creditsSoldFcfa: number;
  alerts: number;
}

export interface StudioSettings {
  packs: { name: string; credits: number | null; priceFcfa: number | null }[];
  planCredits: { title: number | null; ep: number | null; album: number | null };
  monthlyCapPerAccount: number | null;
  requireAdminReview: boolean;
  requireAiLabel: boolean;
  requireArtistConsent: boolean;
  budgetAlert: boolean;
}

export interface StudioGeneration {
  _id: string;
  createdAt: string;
  artistName: string;
  type: 'animated_cover' | 'promo_clip';
  songTitle: string;
  credits: number | null;
  status: 'generating' | 'pending_review' | 'rejected' | 'published';
}

/** Result of a read: `null` data with `unavailable` when the server route does not exist yet. */
export interface Loaded<T> {
  data: T | null;
  unavailable: boolean;
}

export class CommunityApiUnavailableError extends Error {}

function isNotFound(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 404;
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}

async function load<T>(url: string, key: string, params?: Record<string, unknown>): Promise<Loaded<T>> {
  try {
    const response = (await apiClient.get(url, { params })) as unknown as {
      status: string;
      message?: string;
      data?: Record<string, unknown>;
    };
    if (response.status !== 'success' || !response.data || !(key in response.data)) {
      throw new Error(response.message || 'Invalid response');
    }
    return { data: response.data[key] as T, unavailable: false };
  } catch (error) {
    if (isNotFound(error)) return { data: null, unavailable: true };
    throw new Error(getErrorMessage(error, 'Failed to load data'));
  }
}

async function send(method: 'post' | 'patch', url: string, body: unknown): Promise<void> {
  try {
    const response = (await apiClient[method](url, body)) as unknown as { status: string; message?: string };
    if (response.status !== 'success') {
      throw new Error(response.message || 'Request failed');
    }
  } catch (error) {
    if (isNotFound(error)) throw new CommunityApiUnavailableError();
    throw new Error(getErrorMessage(error, 'Request failed'));
  }
}

class CommunityService {
  /** Live platform figures, already public on the server. */
  async getLandingStats(): Promise<LandingStats> {
    const response = (await apiClient.get(API_ENDPOINTS.LANDING_STATS)) as unknown as {
      status: string;
      data?: LandingStats;
    };
    if (response.status !== 'success' || typeof response.data?.songs !== 'number') {
      throw new Error('Invalid landing stats');
    }
    return response.data;
  }

  getModerationQueue(queue: ModerationQueue) {
    return load<ModerationItem[]>(API_ENDPOINTS.MODERATION.QUEUE.replace(':queue', queue), 'items');
  }

  getDecisionLog() {
    return load<DecisionLogEntry[]>(API_ENDPOINTS.MODERATION.LOG, 'entries');
  }

  decide(itemId: string, decision: ModerationDecision) {
    return send('post', API_ENDPOINTS.MODERATION.DECIDE.replace(':itemId', itemId), { decision });
  }

  getCommunityStats() {
    return load<CommunityStats>(API_ENDPOINTS.COMMUNITY.STATS, 'stats');
  }

  getChallenges() {
    return load<CommunityChallenge[]>(API_ENDPOINTS.COMMUNITY.CHALLENGES, 'challenges');
  }

  featureChallenge(challengeId: string) {
    return send('post', API_ENDPOINTS.COMMUNITY.FEATURE_CHALLENGE.replace(':challengeId', challengeId), {});
  }

  getTopSounds(city?: string) {
    return load<TopSound[]>(API_ENDPOINTS.COMMUNITY.TOP_SOUNDS, 'sounds', city ? { city } : undefined);
  }

  getCreators() {
    return load<CommunityCreator[]>(API_ENDPOINTS.COMMUNITY.CREATORS, 'creators');
  }

  featureCreator(userId: string) {
    return send('post', API_ENDPOINTS.COMMUNITY.FEATURE_CREATOR.replace(':userId', userId), {});
  }

  getStudioStats() {
    return load<StudioStats>(API_ENDPOINTS.STUDIO_IA.STATS, 'stats');
  }

  getStudioSettings() {
    return load<StudioSettings>(API_ENDPOINTS.STUDIO_IA.SETTINGS, 'settings');
  }

  saveStudioSettings(settings: StudioSettings) {
    return send('patch', API_ENDPOINTS.STUDIO_IA.SETTINGS, settings);
  }

  getGenerations() {
    return load<StudioGeneration[]>(API_ENDPOINTS.STUDIO_IA.GENERATIONS, 'generations');
  }
}

export const communityService = new CommunityService();
