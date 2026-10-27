import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { CommunityApiUnavailableError } from '@/services/communityService';

// Small building blocks shared by the Boutique tabs (the generic ones come from ../prepaid/shared).
export { Banner, Field, Pill, inputClass, textareaClass, loadError, useFormat } from '../prepaid/shared';

/** Runs an admin action with a toast; returns true when it succeeded. */
export function useRun() {
  const { t } = useTranslation('shop');
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

/** Dashed empty state used when a list has nothing to show. */
export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="border-[1.5px] border-dashed border-white/[0.14] rounded-3xl px-6 py-9 flex flex-col items-center gap-2 text-center">
      <b className="text-base text-white">{title}</b>
      {children && <p className="m-0 max-w-[440px] text-[13px] leading-relaxed text-[#C4C4C4]">{children}</p>}
    </div>
  );
}

/** Four red/grey dashes showing a reseller tier. */
export function Level({ level }: { level: number }) {
  return (
    <div className="flex gap-1" aria-hidden>
      {[1, 2, 3, 4].map((i) => (
        <i key={i} className={i <= level ? 'w-[18px] h-1 rounded-sm bg-[#FF0000]' : 'w-[18px] h-1 rounded-sm bg-[#333]'} />
      ))}
    </div>
  );
}
