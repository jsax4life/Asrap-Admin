import axios from 'axios';
import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '@/constants';
import { CommunityApiUnavailableError } from './communityService';

// AsraPa prépayée (carte virtuelle prépayée, portefeuille fermé).
// The /admin/card/* routes are written but not yet deployed on the server: a 404 means "not connected".
// Contract: « AsraPa carte virtuelle prépayée/backend/routes/cardAdminRoutes.js ».

export type RequestStatus = 'submitted' | 'under_review' | 'approved' | 'rejected' | 'cancelled';
export type OwnerType = 'User' | 'Artist';
export type CardStatus = 'active' | 'blocked' | 'closed';
export type RejectionReason = 'phone_unreachable' | 'duplicate_account' | 'incomplete_information' | 'other';
export type BatchStatus = 'created' | 'delivered' | 'activated' | 'cancelled';
export type AlertType =
  | 'reconciliation_provider_gap'
  | 'reconciliation_balance_mismatch'
  | 'duplicate_phone_requests'
  | 'code_bruteforce'
  | 'pin_locked'
  | 'fulfillment_failed';

export interface PrepaidOverview {
  openRequests: number;
  activeCards: { listeners: number; artists: number };
  moneyInCirculation: number;
  topupsToday: { count: number; amount: number };
  spentThisMonth: number;
  openAlerts: number;
  lastReconciliation: {
    at: string;
    providerTotal: number | null;
    ledgerTotal: number;
    missingInLedger: string[];
    missingAtProvider: string[];
    balanceMismatches: unknown[];
    providerError: string | null;
  } | null;
}

export interface CardRequest {
  _id: string;
  reference: string;
  ownerType: OwnerType;
  nameOnCard: string;
  phone: string;
  city?: string;
  termsAcceptedAt: string;
  status: RequestStatus;
  createdAt: string;
  decidedAt?: string;
  rejectionReason?: RejectionReason;
  rejectionNote?: string;
  internalNote?: string;
}

export interface RequestChecks {
  accountCreatedAt: string | null;
  accountEmail: string | null;
  accountPhone: string | null;
  phoneMatchesAccount: boolean | null;
  samePhoneRequests: number;
  hasCard: boolean;
}

export interface PrepaidCard {
  id: string;
  type: 'listener' | 'artist';
  maskedNumber: string;
  last4: string;
  nameOnCard: string;
  status: CardStatus;
  issuedAt: string;
  balance?: number;
  blockedReason?: string;
  pinSet?: boolean;
  pinLockedUntil?: string | null;
}

export interface CardDetail {
  card: PrepaidCard;
  balance: number;
  balanceFromLedger: number;
  request: { reference: string; decidedAt?: string } | null;
}

export interface LedgerLine {
  txnId: string;
  type: string;
  reference: string;
  direction: 'credit' | 'debit';
  amount: number;
  reason?: string;
  at: string;
}

export interface CardTopup {
  _id: string;
  reference: string;
  method: 'mobile_money' | 'scratch' | 'gift' | 'adjustment';
  operator?: 'airtel' | 'moov';
  amount: number;
  status: 'pending' | 'succeeded' | 'failed' | 'expired';
  createdAt: string;
}

export interface CardPayment {
  _id: string;
  reference: string;
  product: { type: string; label?: string };
  amount: number;
  status: 'succeeded' | 'refunded';
  createdAt: string;
}

export interface CardLedger {
  items: LedgerLine[];
  topups: CardTopup[];
  payments: CardPayment[];
}

export interface ScratchBatch {
  _id: string;
  reference: string;
  value: number;
  quantity: number;
  usedCount: number;
  status: BatchStatus;
  agent?: { _id: string; firstName?: string; lastName?: string } | string;
  expiresAt: string;
  createdAt: string;
}

export interface PrepaidSettings {
  maxBalance: number | null;
  topupMin: number | null;
  topupMax: number | null;
  dailyTopupMax: number | null;
  scratchValidityMonths: number | null;
  maxCodeAttempts: number | null;
  pinMaxAttempts: number | null;
  pinRequired: boolean;
  giftAmounts: number[];
  giftValidityMonths: number | null;
  tipMin: number | null;
  tipMax: number | null;
  artistPlanPrices: { single: number | null; ep_album: number | null; annual: number | null };
  promotionPrice: number | null;
}

export interface PrepaidAlert {
  _id: string;
  type: AlertType;
  severity: 'high' | 'medium' | 'info';
  createdAt: string;
}

export type Loaded<T> = { data: T | null; unavailable: boolean };

function isNotFound(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 404;
}

function errorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) return error.response?.data?.message || error.message || fallback;
  return error instanceof Error ? error.message : fallback;
}

type ApiResponse = { status: string; message?: string; data?: Record<string, unknown> };

/** GET returning the whole `data` object; null + unavailable when the route does not exist yet. */
async function get<T>(url: string, params?: Record<string, unknown>): Promise<Loaded<T>> {
  try {
    const response = (await apiClient.get(url, { params })) as unknown as ApiResponse;
    if (response.status !== 'success' || !response.data) throw new Error(response.message || 'Invalid response');
    return { data: response.data as T, unavailable: false };
  } catch (error) {
    if (isNotFound(error)) return { data: null, unavailable: true };
    throw new Error(errorMessage(error, 'Failed to load data'));
  }
}

async function write<T = unknown>(method: 'post' | 'patch', url: string, body: unknown = {}): Promise<T> {
  try {
    const response = (await apiClient[method](url, body)) as unknown as ApiResponse;
    if (response.status !== 'success') throw new Error(response.message || 'Request failed');
    return response.data as T;
  } catch (error) {
    if (isNotFound(error)) throw new CommunityApiUnavailableError();
    throw new Error(errorMessage(error, 'Request failed'));
  }
}

const E = API_ENDPOINTS.PREPAID;
const withId = (path: string, id: string) => path.replace(':id', encodeURIComponent(id));

class PrepaidService {
  getOverview() {
    return get<{ overview: PrepaidOverview }>(E.OVERVIEW);
  }

  getAlerts() {
    return get<{ items: PrepaidAlert[] }>(E.ALERTS);
  }

  listRequests(filters: { status?: RequestStatus; q?: string }) {
    return get<{ items: CardRequest[]; total: number }>(E.REQUESTS, filters);
  }

  getRequest(id: string) {
    return get<{ request: CardRequest; checks: RequestChecks }>(withId(E.REQUEST, id));
  }

  startReview(id: string) {
    return write('post', withId(E.REQUEST_REVIEW, id));
  }

  approve(id: string, internalNote?: string) {
    return write<{ card: PrepaidCard }>('post', withId(E.REQUEST_APPROVE, id), { internalNote });
  }

  reject(id: string, reasonCode: RejectionReason, note?: string) {
    return write('post', withId(E.REQUEST_REJECT, id), { reasonCode, note });
  }

  listCards(filters: { status?: CardStatus; ownerType?: OwnerType; q?: string }) {
    return get<{ items: PrepaidCard[] }>(E.CARDS, filters);
  }

  getCard(id: string) {
    return get<CardDetail>(withId(E.CARD, id));
  }

  getLedger(id: string) {
    return get<CardLedger>(withId(E.CARD_LEDGER, id));
  }

  block(id: string, reason: string) {
    return write('post', withId(E.CARD_BLOCK, id), { reason });
  }

  unblock(id: string, reason: string) {
    return write('post', withId(E.CARD_UNBLOCK, id), { reason });
  }

  resetPin(id: string) {
    return write('post', withId(E.CARD_PIN_RESET, id));
  }

  creditTopup(topupId: string, reason: string) {
    return write('post', withId(E.TOPUP_CREDIT, topupId), { reason });
  }

  refundPayment(paymentId: string, reason: string) {
    return write('post', withId(E.PAYMENT_REFUND, paymentId), { reason });
  }

  reverse(txnId: string, reason: string) {
    return write('post', withId(E.LEDGER_REVERSE, txnId), { reason });
  }

  listBatches() {
    return get<{ items: ScratchBatch[] }>(E.BATCHES);
  }

  /** Returns the printer file once: the codes are never shown again. */
  createBatch(value: number, quantity: number, agentId: string) {
    return write<{ batch: ScratchBatch; csv: string }>('post', E.BATCHES, { value, quantity, agentId });
  }

  batchAction(id: string, action: 'deliver' | 'activate' | 'cancel', reason?: string) {
    return write('post', withId(E.BATCH_ACTION, id).replace(':action', action), reason ? { reason } : {});
  }

  getSettings() {
    return get<{ settings: PrepaidSettings }>(E.SETTINGS);
  }

  saveSettings(settings: Partial<PrepaidSettings>) {
    return write('patch', E.SETTINGS, settings);
  }
}

export const prepaidService = new PrepaidService();
