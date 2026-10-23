import { API_ENDPOINTS } from '@/constants';
import { load, send } from './communityService';

// AsraPa Awards (certifications Argent, Or, Platine, Diamant and the yearly ceremony).
// None of these admin routes exist on the server yet: a 404 means "not connected".

export type AwardLevel = 'silver' | 'gold' | 'platinum' | 'diamond';
export type AwardDecision = 'certify' | 'postpone' | 'reject';

export interface AwardSignals {
  qualifiedStreams: number | null;
  threshold: number | null;
  topAccountsShare: number | null;
  recentAccountsShare: number | null;
  loopListeners: number | null;
  citiesCount: number | null;
  discardedStreams: number | null;
}

export interface EligibleCertification {
  _id: string;
  level: AwardLevel;
  songTitle: string;
  artistName: string;
  eligibleAt: string;
  signals: AwardSignals;
}

export interface AwardsSettings {
  minSeconds: number | null;
  dailyCapPerAccount: number | null;
  observationStart: string | null;
  observationEnd: string | null;
  silverThresholdTitle: number | null;
  silverThresholdAlbum: number | null;
  published: boolean;
}

export type CeremonyPrize =
  | 'title' | 'artist' | 'revelation' | 'challenge' | 'short' | 'diaspora' | 'maquis';

export interface CeremonyData {
  computedAt: string | null;
  leaders: Partial<Record<CeremonyPrize, string | null>>;
  date: string | null;
  venue: string | null;
  referenceStart: string | null;
  referenceEnd: string | null;
  juryPrizes: string | null;
}

class AwardsService {
  getEligible() {
    return load<EligibleCertification[]>(API_ENDPOINTS.AWARDS.ELIGIBLE, 'certifications');
  }

  decide(certificationId: string, decision: AwardDecision, reason?: string) {
    return send('post', API_ENDPOINTS.AWARDS.DECIDE.replace(':certificationId', certificationId), {
      decision,
      reason,
    });
  }

  getSettings() {
    return load<AwardsSettings>(API_ENDPOINTS.AWARDS.SETTINGS, 'settings');
  }

  saveSettings(settings: AwardsSettings) {
    return send('patch', API_ENDPOINTS.AWARDS.SETTINGS, settings);
  }

  publishThresholds(settings: AwardsSettings) {
    return send('post', API_ENDPOINTS.AWARDS.PUBLISH_THRESHOLDS, settings);
  }

  getCeremony() {
    return load<CeremonyData>(API_ENDPOINTS.AWARDS.CEREMONY, 'ceremony');
  }

  preparePlaques() {
    return send('post', API_ENDPOINTS.AWARDS.PREPARE_PLAQUES, {});
  }
}

export const awardsService = new AwardsService();
