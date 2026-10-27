import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PillButton, PendingNote } from '@/components/community/CommunityUI';
import { shopService, ShopOrder, OrderStatus } from '@/services/shopService';
import { Banner, loadError, useFormat, useRun } from './shared';

type Column = 'paid' | 'preparing' | 'shipping' | 'delivered' | 'returned';
const COLUMNS: Column[] = ['paid', 'preparing', 'shipping', 'delivered', 'returned'];
const NEXT: Partial<Record<Column, OrderStatus>> = { paid: 'preparing', preparing: 'shipping', shipping: 'delivered' };

export default function OrdersTab() {
  const { t } = useTranslation('shop');
  const f = useFormat();
  const { run, busy } = useRun();
  const [orders, setOrders] = useState<ShopOrder[] | null>(null);
  const [unavailable, setUnavailable] = useState(false);

  const load = () =>
    shopService
      .listOrders()
      .then((r) => {
        setOrders(r.data?.orders ?? null);
        setUnavailable(r.unavailable);
      })
      .catch((error) => loadError(error, t('errors.loadFailed')));

  useEffect(() => {
    load();
  }, []);

  const move = async (order: ShopOrder, to: OrderStatus) => {
    if (await run(() => shopService.setOrderStatus(order._id, to), t('orders.moved'))) load();
  };

  return (
    <>
      {unavailable && <Banner>{t('notConnectedBanner')}</Banner>}
      <div className="grid gap-3 grid-cols-[repeat(5,minmax(200px,1fr))] overflow-x-auto pb-1.5">
        {COLUMNS.map((col) => {
          const list = (orders ?? []).filter((o) => o.status === col);
          return (
            <section key={col} aria-label={t(`orders.columns.${col}`)} className="rounded-3xl bg-[rgba(28,24,23,0.9)] border border-white/[0.08] p-3.5 flex flex-col gap-3 min-h-[240px]">
              <div className="flex justify-between items-center text-[13px] font-bold text-white">
                {t(`orders.columns.${col}`)}
                <span className="min-w-[22px] h-[22px] px-1.5 rounded-full bg-white/[0.08] grid place-items-center text-[11px]">{f.count(orders ? list.length : null)}</span>
              </div>
              {list.length === 0 ? (
                <div className="flex-1 border-[1.5px] border-dashed border-white/[0.08] rounded-2xl grid place-items-center text-xs text-[#8F8F8F] text-center p-3">
                  {t(`orders.hints.${col}`)}
                </div>
              ) : (
                list.map((o) => (
                  <div key={o._id} className="rounded-2xl bg-white/[0.04] p-3 flex flex-col gap-1.5 text-[13px]">
                    <b className="text-white font-mono text-xs">{o.reference}</b>
                    <span className="text-[#C4C4C4]">{o.items.map((i) => `${i.qty} × ${i.name}`).join(', ')}</span>
                    <b className="text-white tabular-nums">{f.fcfa(o.totalFcfa)}</b>
                    {NEXT[col] && (
                      <PillButton size="sm" disabled={busy} onClick={() => move(o, NEXT[col] as OrderStatus)}>
                        {t(`orders.next.${col}`)}
                      </PillButton>
                    )}
                  </div>
                ))
              )}
            </section>
          );
        })}
      </div>
      <PendingNote>{t('orders.note')}</PendingNote>
    </>
  );
}
