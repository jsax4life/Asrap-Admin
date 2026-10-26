import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { DASH, formatCount } from '@/components/community/CommunityUI';
import { CommunityApiUnavailableError } from '@/services/communityService';

// Small building blocks shared by the AsraPa prépayée tabs.

export const inputClass =
  'h-[42px] px-3.5 rounded-full border border-white/[0.14] bg-black/40 text-white text-sm placeholder:text-[#8A8A8A] focus:outline-none focus:border-[#FF0000] disabled:opacity-60';

export const textareaClass =
  'min-h-[80px] px-3.5 py-2.5 rounded-2xl border border-white/[0.14] bg-black/40 text-white text-sm placeholder:text-[#8A8A8A] focus:outline-none focus:border-[#FF0000] resize-none disabled:opacity-60';

export function useFormat() {
  const { i18n } = useTranslation();
  const locale = i18n.language === 'en' ? 'en-US' : 'fr-FR';
  return {
    count: (v: number | null | undefined) => formatCount(v, locale),
    fcfa: (v: number | null | undefined) => (v == null ? DASH : `${formatCount(v, locale)} FCFA`),
    date: (iso?: string | null) => (iso ? new Date(iso).toLocaleDateString(locale) : DASH),
  };
}

/** Runs an admin action with a toast; returns true when it succeeded. */
export function useRun() {
  const { t } = useTranslation('prepaid');
  const [busy, setBusy] = useState(false);
  const run = async (action: () => Promise<unknown>, success: string) => {
    setBusy(true);
    try {
      await action();
      toast.success(success);
      return true;
    } catch (error) {
      toast.error(
        error instanceof CommunityApiUnavailableError
          ? t('errors.apiUnavailable')
          : error instanceof Error ? error.message : t('errors.actionFailed')
      );
      return false;
    } finally {
      setBusy(false);
    }
  };
  return { run, busy };
}

export function loadError(error: unknown, fallback: string) {
  toast.error(error instanceof Error ? error.message : fallback);
}

export function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'h-[38px] px-3.5 rounded-full text-[13px] font-bold text-white',
        active ? 'border-2 border-[#FF0000] bg-[rgba(255,0,0,0.16)]' : 'border border-white/[0.18] hover:bg-white/[0.05]'
      )}
    >
      {children}
    </button>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-[13px] text-[#C4C4C4]">
      {label}
      {children}
    </label>
  );
}

export function DefList({ rows }: { rows: [string, ReactNode][] }) {
  return (
    <dl className="grid grid-cols-[150px_1fr] gap-x-3.5 gap-y-2 text-sm m-0">
      {rows.map(([k, v]) => (
        <div key={k} className="contents">
          <dt className="text-[#C4C4C4]">{k}</dt>
          <dd className="m-0 text-white break-words">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function CheckRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex justify-between gap-3 text-sm px-3 py-2.5 rounded-xl bg-white/[0.04]">
      <span>{label}</span>
      <b className="text-white">{value}</b>
    </div>
  );
}

export function Banner({ children }: { children: ReactNode }) {
  return (
    <div className="px-3.5 py-3 rounded-2xl bg-white/[0.04] border-l-[3px] border-[#FF3B30] text-[13px] text-[#E0E0E0]">
      {children}
    </div>
  );
}

/** Row button used in the lists (requests, cards, search results). */
export function RowButton({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full text-left grid gap-x-3 items-center px-4 py-3 border-b border-white/[0.07] text-[13px]',
        selected ? 'bg-[rgba(255,0,0,0.08)]' : 'hover:bg-white/[0.03]'
      )}
    >
      {children}
    </button>
  );
}

export function toAmount(value: string): number | null {
  const digits = value.replace(/\s/g, '');
  if (!digits) return null;
  const n = Number(digits);
  return Number.isInteger(n) && n > 0 ? n : null;
}
