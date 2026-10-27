import axios from 'axios';
import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '@/constants';
import { CommunityApiUnavailableError } from './communityService';

// Boutique AsraPa (catalogue, produits d'artistes en dépôt-vente, commandes, versements).
// The /admin/shop/* routes are written but not yet deployed on the server: a 404 means "not connected".
// Contract: « BOUTIQUE ASRAPA/backend/routes/shopAdminRoutes.js ».

export type ProductStatus = 'draft' | 'in_review' | 'awaiting_stock' | 'live' | 'sold_out' | 'rejected' | 'archived';
export type OrderStatus = 'pending_payment' | 'paid' | 'preparing' | 'shipping' | 'delivered' | 'returned' | 'cancelled' | 'refunded';
export type BatchStatus = 'draft' | 'approved' | 'sent' | 'cancelled';

export interface ShopOverview {
  productsToReview: number;
  productsAwaitingStock: number;
  productsLive: number;
  ordersToProcess: number;
  artistReservedFcfa: number;
  artistAvailableFcfa: number;
  artistPaidFcfa: number;
}

export interface ShopVariant {
  _id: string;
  label: string;
  declared: number;
  received: number;
  available: number;
}

export interface ShopProduct {
  _id: string;
  kind: 'asrapa' | 'artist';
  artist?: string;
  name: string;
  category: string;
  description?: string;
  images: string[];
  priceFcfa: number;
  resellerPrices?: { asrashop: number | null; asraexperience: number | null };
  variants: ShopVariant[];
  status: ProductStatus;
  rejectionReason?: string;
  createdAt: string;
}

export interface ShopOrder {
  _id: string;
  reference: string;
  items: { name: string; variantLabel: string; qty: number; unitPriceFcfa: number; kind: 'asrapa' | 'artist' }[];
  totalFcfa: number;
  status: OrderStatus;
  delivery: { address: string; phone: string };
  createdAt: string;
  returnWindowEndsAt?: string;
}

export interface PayoutBatch {
  _id: string;
  reference: string;
  status: BatchStatus;
  totalFcfa: number;
  lines: { artist: string; amountFcfa: number; operator: string }[];
  createdAt: string;
}

export interface ShopSettings {
  artistCommissionRate: number;
  returnWindowDays: number | null;
  payoutFrequency: 'weekly' | 'monthly' | null;
  deliveryFeeFcfa: number | null;
  paymentTimeoutMinutes: number;
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

const E = API_ENDPOINTS.SHOP;
const withId = (path: string, id: string) => path.replace(':id', encodeURIComponent(id));

class ShopService {
  getOverview() {
    return get<ShopOverview>(E.OVERVIEW);
  }

  listProducts(filters: { status?: ProductStatus; kind?: 'asrapa' | 'artist' } = {}) {
    return get<{ products: ShopProduct[] }>(E.PRODUCTS, filters);
  }

  review(id: string, decision: 'approve' | 'reject', reason?: string) {
    return write('post', withId(E.PRODUCT_REVIEW, id), { decision, reason });
  }

  receiveStock(id: string, counts: Record<string, number>) {
    return write('post', withId(E.PRODUCT_RECEIVE_STOCK, id), { counts });
  }

  listOrders(status?: OrderStatus) {
    return get<{ orders: ShopOrder[] }>(E.ORDERS, status ? { status } : undefined);
  }

  setOrderStatus(id: string, status: OrderStatus, note?: string) {
    return write('post', withId(E.ORDER_STATUS, id), { status, note });
  }

  listBatches() {
    return get<{ batches: PayoutBatch[] }>(E.PAYOUTS);
  }

  prepareBatch() {
    return write('post', E.PAYOUTS);
  }

  batchAction(id: string, action: 'approve' | 'send' | 'cancel') {
    return write('post', withId(E.PAYOUT_ACTION, id).replace(':action', action));
  }

  getSettings() {
    return get<{ settings: ShopSettings }>(E.SETTINGS);
  }

  saveSettings(settings: Partial<ShopSettings>) {
    return write('patch', E.SETTINGS, settings);
  }
}

export const shopService = new ShopService();
