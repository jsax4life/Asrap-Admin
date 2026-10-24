import { API_ENDPOINTS } from '@/constants';
import { load, send } from './communityService';

// AsraPa Awards (distinctions Argent, Or, Platine, Diamant — règlement v1.1).
// None of these admin routes exist on the server yet: a 404 means "not connected".

export type AwardLevel = 'silver' | 'gold' | 'platinum' | 'diamond';
export type AwardDecision = 'submit' | 'extend' | 'reject';
export type CommitteeVote = 'pending' | 'approve' | 'reject';
export type PayoutStatus = 'to_pay' | 'paid' | 'deferred';

export interface AwardSignals {
  qualifiedListeners: number | null;
  subscribers: number | null;
  phones: number | null;
  duplicatesRemoved: number | null;
  threshold: number | null;
  offlineShare: number | null;
  asraPointsSold: number | null;
  asraPointsRequired: number | null;
  concentrationShare: number | null;
  suddenPeaks: number | null;
  selfPurchases: number | null;
  removedSales: number | null;
}

export interface CommitteeMemberVote {
  memberName: string;
  vote: CommitteeVote;
}

export interface EligibleCertification {
  _id: string;
  level: AwardLevel;
  songTitle: string;
  artistName: string;
  thresholdReachedAt: string;
  verificationEndsAt: string | null;
  signals: AwardSignals;
  committee?: CommitteeMemberVote[];
}

export interface LevelThreshold {
  firstPeriod: number;
  secondPeriod: number;
}

export interface AwardsSettings {
  minPlaysPerSubscriber: number | null;
  minArtistsPerPack: number | null;
  streamsPerSale: number | null;
  networkTriggerShare: number | null;
  networkMinShare: number | null;
  networkFloor: number | null;
  activeDays: number | null;
  activeAsraPoints: number | null;
  thresholds: Record<AwardLevel, LevelThreshold>;
  primes: Record<AwardLevel, number>;
  published: boolean;
}

export interface AwardPayout {
  _id: string;
  level: AwardLevel;
  songTitle: string;
  artistName: string;
  validatedAt: string;
  amount: number;
  status: PayoutStatus;
}

export interface CommitteeMember {
  name: string;
  diaspora: boolean;
}

export interface FundData {
  periodStart: string | null;
  periodEnd: string | null;
  revenue: number | null;
  fund: number | null;
  reserve: number | null;
  available: number | null;
  paid: number | null;
  deferred: number | null;
  payouts: AwardPayout[];
  committee: CommitteeMember[];
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

  getFund() {
    return load<FundData>(API_ENDPOINTS.AWARDS.FUND, 'fund');
  }
}

export const awardsService = new AwardsService();
