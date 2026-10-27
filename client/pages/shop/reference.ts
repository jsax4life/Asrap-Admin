// Reference data shown until the shop server is connected.
// Sources: « Offre revendeurs ASRAPA : 4 paliers » and purchase order « ASRAPA SHOP 194 articles » (26/10/2026).
// Prices come from Abidjan and must be checked in N'Djamena; null = not set in the source.

export type RefType = 'phone' | 'accessory' | 'subscription';
export type RefState = 'ordered' | 'offKit' | 'priceGap' | 'missing';

export interface RefProduct {
  name: string;
  type: RefType;
  price: number | null;
  asrashop: number | null;
  asraexperience: number | null;
  ordered: number | null;
  state: RefState;
  serverPrice?: number;
}

export const REFERENCE_CATALOGUE: RefProduct[] = [
  { name: 'Nokia 105', type: 'phone', price: 9500, asrashop: null, asraexperience: 6315, ordered: 36, state: 'ordered' },
  { name: 'Nokia 106 4G', type: 'phone', price: 10000, asrashop: null, asraexperience: 7465, ordered: 24, state: 'ordered' },
  { name: 'Nokia 130 Music', type: 'phone', price: 16000, asrashop: null, asraexperience: 12490, ordered: 12, state: 'ordered' },
  { name: 'Nokia 150', type: 'phone', price: 19000, asrashop: null, asraexperience: 13540, ordered: 12, state: 'ordered' },
  { name: 'Nokia 5710 XpressAudio', type: 'phone', price: 35250, asrashop: null, asraexperience: 26150, ordered: 6, state: 'ordered' },
  { name: 'Nokia 5310', type: 'phone', price: null, asrashop: null, asraexperience: null, ordered: 6, state: 'offKit' },
  { name: 'Sony WH-CH520', type: 'accessory', price: 45000, asrashop: 37650, asraexperience: 35445, ordered: 6, state: 'ordered' },
  { name: 'Sony MDR-ZX110', type: 'accessory', price: 15000, asrashop: 12366, asraexperience: null, ordered: 6, state: 'ordered' },
  { name: 'Nokia WB-101', type: 'accessory', price: 5000, asrashop: 4025, asraexperience: 3733, ordered: 40, state: 'ordered' },
  { name: 'Nokia WB-108', type: 'accessory', price: 4500, asrashop: 3575, asraexperience: 3298, ordered: 10, state: 'ordered' },
  { name: 'Pods Basique', type: 'accessory', price: 5000, asrashop: 4121, asraexperience: 3858, ordered: 12, state: 'ordered' },
  { name: 'Pods Standard (Nokia TWS-201)', type: 'accessory', price: 13000, asrashop: 10900, asraexperience: 10270, ordered: 12, state: 'ordered' },
  { name: 'Pods Supérieure (Nokia Go Earbuds 2 Plus / 2 Pro)', type: 'accessory', price: 35000, asrashop: 29432, asraexperience: 27762, ordered: 12, state: 'ordered' },
  { name: 'Famille', type: 'subscription', price: 5000, asrashop: null, asraexperience: null, ordered: null, state: 'priceGap', serverPrice: 3500 },
  { name: 'Premium', type: 'subscription', price: 3000, asrashop: null, asraexperience: null, ordered: null, state: 'priceGap', serverPrice: 1500 },
  { name: 'Moins de 26 ans', type: 'subscription', price: 1500, asrashop: null, asraexperience: null, ordered: null, state: 'missing' },
];

/** Items in the supplier order, by family (purchase order of 26/10/2026). */
export const ORDER_SPLIT = { phones: 96, headphones: 12, wired: 50, wireless: 36 } as const;
export const ORDER_TOTAL = 194;
export const ORDER_REFERENCES = 13;

export type TierKey = 'point' | 'shop' | 'experience' | 'signature';

export const TIERS: { key: TierKey; name: string; level: number; deposit: number | null; planned: number | null }[] = [
  { key: 'point', name: 'Asra Point', level: 1, deposit: 20000, planned: 20 },
  { key: 'shop', name: 'AsraShop', level: 2, deposit: 50000, planned: 20 },
  { key: 'experience', name: 'AsraExperience', level: 3, deposit: 100000, planned: 10 },
  { key: 'signature', name: 'Asra Signature', level: 4, deposit: null, planned: null },
];
