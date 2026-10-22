import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';
import {
  PageShell,
  PageHeader,
  Card,
  CardTitle,
  PillButton,
  GridTable,
  DASH,
} from '@/components/community/CommunityUI';
import {
  communityService,
  CommunityApiUnavailableError,
  ModerationItem,
  ModerationQueue,
  ModerationDecision,
  DecisionLogEntry,
} from '@/services/communityService';

type TabSlug = 'signalements' | 'defis' | 'ia';

const TABS: { slug: TabSlug; queue: ModerationQueue }[] = [
  { slug: 'signalements', queue: 'reports' },
  { slug: 'defis', queue: 'challenges' },
  { slug: 'ia', queue: 'ai' },
];

const DECISIONS: Record<ModerationQueue, ModerationDecision[]> = {
  reports: ['keep', 'hide', 'warn', 'suspend'],
  challenges: ['approve', 'request_change', 'reject'],
  ai: ['publish', 'reject', 'request_version'],
};

const NEGATIVE_DECISIONS: ModerationDecision[] = ['hide', 'reject', 'warn', 'suspend'];

const SEVERITY_DOT: Record<ModerationItem['severity'], string> = {
  high: 'bg-[#FF0000]',
  medium: 'bg-[#F0995A]',
  low: 'bg-[#8A8A8A]',
};

export default function Moderation() {
  const { t, i18n } = useTranslation('community');
  const { tab } = useParams<{ tab?: string }>();
  const active = TABS.find((x) => x.slug === tab) ?? TABS[2];
  const locale = i18n.language === 'en' ? 'en-US' : 'fr-FR';

  const [queues, setQueues] = useState<Partial<Record<ModerationQueue, ModerationItem[] | null>>>({});
  const [log, setLog] = useState<DecisionLogEntry[] | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadAll = async () => {
    try {
      const [results, logResult] = await Promise.all([
        Promise.all(TABS.map((x) => communityService.getModerationQueue(x.queue))),
        communityService.getDecisionLog(),
      ]);
      const next: Partial<Record<ModerationQueue, ModerationItem[] | null>> = {};
      TABS.forEach((x, i) => {
        next[x.queue] = results[i].data;
      });
      setQueues(next);
      setLog(logResult.data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('errors.loadFailed'));
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const items = queues[active.queue] ?? null;
  const selected = items?.find((item) => item._id === selectedId) ?? items?.[0] ?? null;

  useEffect(() => {
    setSelectedId(null);
  }, [active.queue]);

  const decide = async (decision: ModerationDecision) => {
    if (!selected) return;
    setSubmitting(true);
    try {
      await communityService.decide(selected._id, decision);
      toast.success(t('moderation.decisionSaved'));
      setSelectedId(null);
      await loadAll();
    } catch (error) {
      toast.error(
        error instanceof CommunityApiUnavailableError
          ? t('errors.apiUnavailable')
          : error instanceof Error ? error.message : t('errors.actionFailed')
      );
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (iso?: string) =>
    iso ? new Date(iso).toLocaleString(locale, { dateStyle: 'short', timeStyle: 'short' }) : DASH;

  const details: { label: string; value?: string }[] =
    active.queue === 'reports'
      ? [
          { label: t('moderation.fields.account'), value: selected?.account },
          { label: t('moderation.fields.sound'), value: selected?.sound },
          { label: t('moderation.fields.reason'), value: selected?.reason },
          { label: t('moderation.fields.received'), value: selected ? formatDate(selected.receivedAt) : undefined },
        ]
      : active.queue === 'challenges'
        ? [
            { label: t('moderation.fields.account'), value: selected?.account },
            { label: t('moderation.fields.sound'), value: selected?.sound },
            { label: t('moderation.fields.duration'), value: selected?.duration },
            { label: t('moderation.fields.received'), value: selected ? formatDate(selected.receivedAt) : undefined },
          ]
        : [
            { label: t('moderation.fields.account'), value: selected?.account },
            { label: t('moderation.fields.sound'), value: selected?.sound },
            { label: t('moderation.fields.consent'), value: selected?.consent },
            { label: t('moderation.fields.received'), value: selected ? formatDate(selected.receivedAt) : undefined },
          ];

  return (
    <PageShell>
      <PageHeader
        eyebrow={t('moderation.eyebrow')}
        title={t('moderation.title')}
        aside={t('moderation.aside')}
      />

      <div role="tablist" aria-label={t('moderation.tabsLabel')} className="flex gap-2 flex-wrap">
        {TABS.map((x) => {
          const isActive = x.slug === active.slug;
          const list = queues[x.queue];
          return (
            <Link
              key={x.slug}
              to={`/moderation/${x.slug}`}
              role="tab"
              aria-selected={isActive}
              className={cn(
                'h-[42px] px-[18px] rounded-full inline-flex items-center gap-2 text-sm font-bold text-white',
                isActive ? 'border-2 border-[#FF0000] bg-[rgba(255,0,0,0.16)]' : 'border border-white/[0.18] hover:bg-white/[0.05]'
              )}
            >
              {t(`moderation.tabs.${x.slug}`)}
              <span className="text-xs font-bold px-2 py-px rounded-full bg-white/[0.12]">
                {list ? list.length : DASH}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-[18px] items-start">
        <Card label={t('moderation.queueLabel')} className="flex-[1_1_380px] min-w-0 overflow-hidden">
          {items && items.length > 0 ? (
            items.map((item) => {
              const isSelected = item._id === selected?._id;
              return (
                <button
                  key={item._id}
                  type="button"
                  onClick={() => setSelectedId(item._id)}
                  className={cn(
                    'w-full text-left flex gap-3 items-center px-4 py-3.5 border-b border-white/[0.07]',
                    isSelected ? 'bg-[rgba(255,0,0,0.08)]' : 'hover:bg-white/[0.03]'
                  )}
                >
                  <span className={cn('w-2 h-2 rounded-full flex-shrink-0', SEVERITY_DOT[item.severity])} />
                  <span className="flex flex-col gap-[3px] flex-grow min-w-0">
                    <b className="text-sm text-white truncate">{item.title}</b>
                    {item.subtitle && <span className="text-xs text-[#C4C4C4] truncate">{item.subtitle}</span>}
                  </span>
                  <span className="text-[11px] text-[#C4C4C4] whitespace-nowrap">{t(`moderation.kinds.${item.kind}`)}</span>
                </button>
              );
            })
          ) : (
            <div className="flex gap-3 items-center px-4 py-3.5">
              <span className="w-2 h-2 rounded-full flex-shrink-0 bg-[#8A8A8A]" />
              <span className="text-sm text-[#C4C4C4]">
                {items ? t(`moderation.empty.${active.slug}`) : t('moderation.notConnected')}
              </span>
            </div>
          )}
        </Card>

        <Card label={t('moderation.previewLabel')} className="flex-[2_1_520px] min-w-0 p-5 flex flex-wrap gap-5">
          <div className="w-[200px] h-[356px] rounded-[28px] border-[6px] border-[#1E1E1E] overflow-hidden relative flex-shrink-0 bg-[#141111] flex items-center justify-center">
            {selected?.previewUrl ? (
              <img src={selected.previewUrl} alt={selected.title} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs text-[#8A8A8A] px-4 text-center">{t('moderation.noPreview')}</span>
            )}
            <span className="absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-[3px] rounded-full bg-black/65 text-white">
              {t(`moderation.previewTag.${active.slug}`)}
            </span>
          </div>

          <div className="flex-[1_1_260px] min-w-0 flex flex-col gap-3">
            <span className="text-xs tracking-[0.18em] text-[#FF3B30]">{t(`moderation.previewEyebrow.${active.slug}`)}</span>
            <h2 className="m-0 text-[22px] font-bold text-white">{selected?.title ?? t('moderation.nothingSelected')}</h2>
            <dl className="m-0 grid grid-cols-2 gap-x-4 gap-y-2.5 text-[13px]">
              {details.map((d) => (
                <div key={d.label}>
                  <dt className="text-[#C4C4C4]">{d.label}</dt>
                  <dd className="mt-0.5 text-white">{d.value || DASH}</dd>
                </div>
              ))}
            </dl>
            <div className="p-3 rounded-2xl bg-white/[0.05] text-[13px] leading-normal text-[#E0E0E0]">
              {active.queue === 'challenges' && selected?.instructions
                ? t('moderation.challengeInstructions', { instructions: selected.instructions })
                : t(`moderation.checklist.${active.slug}`)}
            </div>
            <div className="flex flex-wrap gap-2 mt-auto">
              {DECISIONS[active.queue].map((decision, i) => (
                <PillButton
                  key={decision}
                  variant={i === 0 ? 'primary' : 'outline'}
                  disabled={!selected || submitting}
                  onClick={() => decide(decision)}
                >
                  {t(`moderation.decisions.${decision}`)}
                </PillButton>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <Card label={t('moderation.logTitle')} className="px-5 py-[18px] flex flex-col gap-2.5">
        <CardTitle>{t('moderation.logTitle')}</CardTitle>
        <GridTable
          minWidth={640}
          columns={[t('moderation.log.when'), t('moderation.log.admin'), t('moderation.log.item'), t('moderation.log.decision')]}
          isEmpty={!log || log.length === 0}
          empty={log ? t('moderation.log.empty') : t('moderation.notConnected')}
        >
          {log?.map((entry) => (
            <div key={entry._id} className="contents">
              <span className="text-[#E0E0E0]">{formatDate(entry.createdAt)}</span>
              <span className="text-[#E0E0E0]">{entry.adminName}</span>
              <span className="text-[#E0E0E0]">{entry.itemLabel}</span>
              <span className={cn('font-bold', NEGATIVE_DECISIONS.includes(entry.decision) ? 'text-[#FF8A80]' : 'text-white')}>
                {t(`moderation.logDecisions.${entry.decision}`)}
              </span>
            </div>
          ))}
        </GridTable>
      </Card>
    </PageShell>
  );
}
