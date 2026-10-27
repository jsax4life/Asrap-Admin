import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardTitle, PillButton, PendingNote } from '@/components/community/CommunityUI';
import { useAuth } from '@/hooks/useAuth';
import { shopService, ShopSettings } from '@/services/shopService';
import { Banner, Field, inputClass, loadError, useRun } from './shared';

// Proposed values from the architecture note; the server keeps null for « à fixer ».
const PROPOSED: ShopSettings = {
  artistCommissionRate: 0.25,
  returnWindowDays: null,
  payoutFrequency: null,
  deliveryFeeFcfa: null,
  paymentTimeoutMinutes: 30,
};

function toInt(value: string): number | null {
  const digits = value.replace(/\s/g, '');
  if (!digits) return null;
  const n = Number(digits);
  return Number.isInteger(n) && n >= 0 ? n : null;
}

export default function RulesTab() {
  const { t } = useTranslation('shop');
  const { user } = useAuth();
  const { run, busy } = useRun();
  const canEdit = user?.role === 'super_admin';
  const [settings, setSettings] = useState<ShopSettings>(PROPOSED);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    shopService
      .getSettings()
      .then((r) => {
        if (r.data?.settings) setSettings(r.data.settings);
        setConnected(!r.unavailable);
      })
      .catch((error) => loadError(error, t('errors.loadFailed')));
  }, []);

  const disabled = !canEdit || !connected || busy;
  const commission = Math.round(settings.artistCommissionRate * 100);

  const save = () =>
    run(
      () =>
        shopService.saveSettings({
          artistCommissionRate: settings.artistCommissionRate,
          returnWindowDays: settings.returnWindowDays,
          payoutFrequency: settings.payoutFrequency,
          deliveryFeeFcfa: settings.deliveryFeeFcfa,
        }),
      t('rules.saved')
    );

  return (
    <>
      <Banner>{t('rules.banner')}</Banner>
      {!connected && <Banner>{t('notConnectedBanner')}</Banner>}

      <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(min(380px,100%),1fr))] items-start">
        <Card className="p-5 flex flex-col gap-4">
          <CardTitle>{t('rules.artistsTitle')}</CardTitle>
          <Field label={`${t('rules.commission')} (%)`}>
            <input
              className={inputClass}
              inputMode="numeric"
              disabled={disabled}
              value={String(commission)}
              onChange={(e) => {
                const n = toInt(e.target.value);
                if (n != null && n <= 90) setSettings({ ...settings, artistCommissionRate: n / 100 });
              }}
            />
          </Field>
          <span className="text-xs text-[#C4C4C4] -mt-2">{t('rules.commissionText')}</span>
          <Field label={`${t('rules.returnWindow')} (${t('rules.days')})`}>
            <input
              className={inputClass}
              inputMode="numeric"
              disabled={disabled}
              placeholder={t('toFix')}
              value={settings.returnWindowDays ?? ''}
              onChange={(e) => setSettings({ ...settings, returnWindowDays: toInt(e.target.value) })}
            />
          </Field>
          <span className="text-xs text-[#C4C4C4] -mt-2">{t('rules.returnWindowText')}</span>
          <Field label={t('rules.frequency')}>
            <select
              className={inputClass}
              disabled={disabled}
              value={settings.payoutFrequency ?? ''}
              onChange={(e) => setSettings({ ...settings, payoutFrequency: (e.target.value || null) as ShopSettings['payoutFrequency'] })}
            >
              <option value="">{t('toFix')}</option>
              <option value="weekly">{t('rules.frequencies.weekly')}</option>
              <option value="monthly">{t('rules.frequencies.monthly')}</option>
            </select>
          </Field>
          <span className="text-xs text-[#C4C4C4] -mt-2">{t('rules.frequencyText')}</span>
        </Card>

        <div className="flex flex-col gap-4">
          <Card className="p-5 flex flex-col gap-4">
            <CardTitle>{t('rules.deliveryTitle')}</CardTitle>
            <Field label={`${t('rules.deliveryFee')} (FCFA)`}>
              <input
                className={inputClass}
                inputMode="numeric"
                disabled={disabled}
                placeholder={t('toFix')}
                value={settings.deliveryFeeFcfa ?? ''}
                onChange={(e) => setSettings({ ...settings, deliveryFeeFcfa: toInt(e.target.value) })}
              />
            </Field>
            <span className="text-xs text-[#C4C4C4] -mt-2">{t('rules.deliveryFeeText')}</span>
          </Card>

          <Card className="p-5 flex flex-col gap-2.5">
            <CardTitle>{t('rules.fixedTitle')}</CardTitle>
            {(['price', 'twoAdmins', 'verifiedNumber'] as const).map((k) => (
              <div key={k} className="px-3 py-2.5 rounded-xl bg-white/[0.04] text-[13px] text-[#E0E0E0]">{t(`rules.fixed.${k}`)}</div>
            ))}
          </Card>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <PillButton disabled={disabled} onClick={save}>{t('rules.save')}</PillButton>
        {!canEdit && <PendingNote>{t('rules.superAdminOnly')}</PendingNote>}
      </div>
    </>
  );
}
