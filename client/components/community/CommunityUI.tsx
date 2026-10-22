import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

// Building blocks shared by Modération, Shorts et communauté and Studio IA,
// matching the admin design (black page, warm dark cards, red accents).

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-[#E0E0E0] px-4 sm:px-6 lg:px-9 pt-7 pb-10 flex flex-col gap-5">
      {children}
    </div>
  );
}

export function PageHeader({ eyebrow, title, aside }: { eyebrow: string; title: string; aside?: ReactNode }) {
  return (
    <header className="flex flex-wrap gap-3 items-end justify-between">
      <div className="flex flex-col gap-1.5">
        <span className="text-xs tracking-[0.25em] font-medium text-[#FF3B30]">{eyebrow}</span>
        <h1 className="m-0 text-[30px] leading-[1.05] font-bold tracking-[-0.025em] text-white">{title}</h1>
      </div>
      {aside && <span className="text-[13px] text-[#C4C4C4]">{aside}</span>}
    </header>
  );
}

export function Card({ className, children, label }: { className?: string; children: ReactNode; label?: string }) {
  return (
    <section
      aria-label={label}
      className={cn('rounded-3xl bg-[rgba(28,24,23,0.9)] border border-white/[0.08]', className)}
    >
      {children}
    </section>
  );
}

export function CardTitle({ children }: { children: ReactNode }) {
  return <h2 className="m-0 text-base font-bold text-white">{children}</h2>;
}

export function KpiCard({
  label,
  value,
  unit,
  caption,
  highlight = false,
}: {
  label: string;
  value: ReactNode;
  unit?: ReactNode;
  caption: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        'p-[18px] rounded-3xl flex flex-col gap-1.5 border',
        highlight ? 'bg-[rgba(255,0,0,0.12)] border-[rgba(255,0,0,0.4)]' : 'bg-[rgba(28,24,23,0.9)] border-white/[0.08]'
      )}
    >
      <span className={cn('text-xs tracking-[0.18em]', highlight ? 'text-[#FF8A80]' : 'text-[#C4C4C4]')}>{label}</span>
      <b className="text-[32px] leading-none text-white tabular-nums">
        {value}
        {unit && <> {unit}</>}
      </b>
      <span className={cn('text-[13px]', highlight ? 'text-[#E0E0E0]' : 'text-[#C4C4C4]')}>{caption}</span>
    </div>
  );
}

export function PillButton({
  children,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'outline'; size?: 'sm' | 'md' }) {
  return (
    <button
      type="button"
      className={cn(
        'rounded-full font-bold text-white transition-opacity disabled:opacity-40 disabled:cursor-not-allowed',
        size === 'md' ? 'h-11 px-[18px] text-sm' : 'h-[38px] px-3.5 text-[13px]',
        variant === 'primary' ? 'bg-[#FF0000] hover:bg-[#FF0000]/90' : 'border border-white/[0.22] bg-transparent hover:bg-white/[0.06]',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export type BadgeTone = 'orange' | 'red' | 'neutral';

export function StatusBadge({ tone, children }: { tone: BadgeTone; children: ReactNode }) {
  return (
    <span
      className={cn(
        'justify-self-start inline-block text-xs font-bold px-[9px] py-[3px] rounded-full',
        tone === 'orange' && 'bg-[rgba(240,153,90,0.18)] text-[#F0995A]',
        tone === 'red' && 'bg-[rgba(255,0,0,0.18)] text-[#FF8A80]',
        tone === 'neutral' && 'bg-white/[0.08] text-[#E0E0E0]'
      )}
    >
      {children}
    </span>
  );
}

/** Grid table with the design's grey header row; shows `empty` when there are no rows. */
export function GridTable({
  columns,
  minWidth,
  children,
  empty,
  isEmpty,
}: {
  columns: string[];
  minWidth: number;
  children?: ReactNode;
  empty: string;
  isEmpty: boolean;
}) {
  return (
    <div className="overflow-x-auto">
      <div
        className="grid gap-x-3.5 gap-y-2.5 text-[13px] items-center"
        style={{ minWidth, gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}
      >
        {columns.map((c) => (
          <span key={c} className="text-[#C4C4C4]">{c}</span>
        ))}
        {isEmpty ? (
          <span className="text-[#C4C4C4]" style={{ gridColumn: `1 / span ${columns.length}` }}>{empty}</span>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

/** Shown under a section while its server route is not connected yet. */
export function PendingNote({ children }: { children: ReactNode }) {
  return <span className="text-xs text-[#C4C4C4]">{children}</span>;
}

export const DASH = '—';

export function formatCount(value: number | null | undefined, locale: string): string {
  if (value === null || value === undefined) return DASH;
  return new Intl.NumberFormat(locale).format(value);
}
