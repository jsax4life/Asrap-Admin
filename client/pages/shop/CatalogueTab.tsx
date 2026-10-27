import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, GridTable, StatusBadge, BadgeTone, PendingNote } from '@/components/community/CommunityUI';
import { shopService, ShopProduct } from '@/services/shopService';
import { Banner, Pill, inputClass, loadError, useFormat } from './shared';
import { REFERENCE_CATALOGUE, RefState, RefType } from './reference';

const STATE_TONE: Record<RefState, BadgeTone> = { ordered: 'neutral', offKit: 'red', priceGap: 'orange', missing: 'orange' };
type Filter = 'all' | RefType;
const FILTERS: Filter[] = ['all', 'phone', 'accessory', 'subscription'];

export default function CatalogueTab() {
  const { t } = useTranslation('shop');
  const f = useFormat();
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [live, setLive] = useState<ShopProduct[] | null>(null);

  useEffect(() => {
    shopService
      .listProducts({ kind: 'asrapa' })
      .then((r) => setLive(r.data?.products ?? null))
      .catch((error) => loadError(error, t('errors.loadFailed')));
  }, []);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return REFERENCE_CATALOGUE.filter((p) => (filter === 'all' || p.type === filter) && p.name.toLowerCase().includes(q));
  }, [filter, query]);

  // Server stock by product name, once the shop server is connected.
  const stockByName = useMemo(() => {
    const map = new Map<string, number>();
    live?.forEach((p) => map.set(p.name, p.variants.reduce((s, v) => s + v.available, 0)));
    return map;
  }, [live]);

  return (
    <>
      <div className="flex gap-2 flex-wrap items-center">
        {FILTERS.map((key) => (
          <Pill key={key} active={filter === key} onClick={() => setFilter(key)}>
            {t(`catalogue.filters.${key}`)}
          </Pill>
        ))}
        <input
          className={`${inputClass} flex-1 min-w-[200px] max-w-[320px]`}
          placeholder={t('catalogue.search')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <Card className="p-5">
        <GridTable
          columns={[
            t('catalogue.columns.product'),
            t('catalogue.columns.price'),
            t('catalogue.columns.asrashop'),
            t('catalogue.columns.asraexperience'),
            t('catalogue.columns.ordered'),
            t('catalogue.columns.state'),
          ]}
          minWidth={860}
          isEmpty={rows.length === 0}
          empty={t('catalogue.empty')}
        >
          {rows.map((p) => (
            <div key={p.name} className="contents">
              <div className="flex flex-col">
                <b className="text-white">{p.name}</b>
                <span className="text-xs text-[#C4C4C4]">
                  {t(`catalogue.types.${p.type}`)}
                  {p.serverPrice != null && ` · ${t('catalogue.serverPrice', { price: f.fcfa(p.serverPrice) })}`}
                </span>
              </div>
              <b className="text-white tabular-nums">{f.fcfa(p.price)}</b>
              <span className="tabular-nums">{f.fcfa(p.asrashop)}</span>
              <span className="tabular-nums">{f.fcfa(p.asraexperience)}</span>
              <span className="tabular-nums">
                {f.count(p.ordered)}
                {stockByName.has(p.name) && <span className="text-[#C4C4C4]"> · {f.count(stockByName.get(p.name))}</span>}
              </span>
              <StatusBadge tone={STATE_TONE[p.state]}>{t(`catalogue.states.${p.state}`)}</StatusBadge>
            </div>
          ))}
        </GridTable>
      </Card>

      <Banner>
        <b className="text-white">{t('catalogue.gapTitle')}</b> {t('catalogue.gapText')}
      </Banner>
      <PendingNote>{t('catalogue.source')}</PendingNote>
    </>
  );
}
