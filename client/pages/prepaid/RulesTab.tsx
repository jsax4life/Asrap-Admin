import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardTitle, PillButton, PendingNote } from '@/components/community/CommunityUI';
import { useAuth } from '@/hooks/useAuth';
import { prepaidService, PrepaidSettings } from '@/services/prepaidService';
import { Field, inputClass, loadError, useRun } from './shared';

// Empty until the rules are fixed with the lawyer: no value is pre-filled.
const EMPTY: PrepaidSettings = {
  maxBalance: null,
  topupMin: null,
  topupMax: null,
  dailyTopupMax: null,
  scratchValidityMonths: null,
  maxCodeAttempts: null,
  pinMaxAttempts: null,
  pinRequired: false,
  giftAmounts: [],
  giftValidityMonths: null,
  tipMin: null,
  tipMax: null,
  artistPlanPrices: { single: null, ep_album: null, annual: null },
  promotionPrice: null,
};

type NumKey = 'maxBalance' | 'topupMin' | 'topupMax' | 'dailyTopupMax' | 'scratchValidityMonths' | 'maxCodeAttempts' | 'pinMaxAttempts'
  | 'giftValidityMonths' | 'tipMin' | 'tipMax' | 'promotionPrice';
const LIMITS: NumKey[] = ['maxBalance', 'topupMin', 'topupMax', 'dailyTopupMax', 'scratchValidityMonths', 'maxCodeAttempts', 'pinMaxAttempts'];
const GIFTS: NumKey[] = ['giftValidityMonths', 'tipMin', 'tipMax'];
const PLANS = ['single', 'ep_album', 'annual'] as const;

// Only the two roles that can open this page.
const ROLES = ['super_admin', 'admin'] as const;
const RIGHTS: [string, boolean[]][] = [
  ['read', [true, true]],
  ['review', [true, true]],
  ['approve', [true, true]],
  ['batches', [true, true]],
  ['activate', [true, true]],
  ['adjust', [true, true]],
  ['block', [true, true]],
  ['pin', [true, true]],
  ['settings', [true, false]],
];

function toNumber(value: string): number | null {
  const digits = value.replace(/\s/g, '');
  if (!digits) return null;
  const n = Number(digits);
  return Number.isInteger(n) && n > 0 ? n : null;
}

export default function RulesTab() {
  const { t } = useTranslation('prepaid');
  const { user } = useAuth();
  const { run, busy } = useRun();
  const canEdit = user?.role === 'super_admin';
  const [settings, setSettings] = useState<PrepaidSettings>(EMPTY);
  const [giftText, setGiftText] = useState('');
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    prepaidService
      .getSettings()
      .then((r) => {
        if (!r.data) return;
        const s = { ...EMPTY, ...r.data.settings, artistPlanPrices: { ...EMPTY.artistPlanPrices, ...r.data.settings.artistPlanPrices } };
        setSettings(s);
        setGiftText(s.giftAmounts.join(', '));
        setConnected(true);
      })
      .catch((error) => loadError(error, t('errors.loadFailed')));
  }, []);

  const setNum = (key: NumKey, value: string) => setSettings((p) => ({ ...p, [key]: toNumber(value) }));
  const disabled = !canEdit || !connected;

  const numField = (key: NumKey, label: string) => (
    <Field key={key} label={label}>
      <input inputMode="numeric" value={settings[key] ?? ''} placeholder={t('toFix')} disabled={disabled} onChange={(e) => setNum(key, e.target.value)} className={inputClass} />
    </Field>
  );

  const save = () =>
    run(
      () => prepaidService.saveSettings({
        ...settings,
        giftAmounts: giftText.split(/[,;]/).map((x) => toNumber(x)).filter((x): x is number => x != null),
      }),
      t('rules.saved')
    );

  return (
    <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(min(360px,100%),1fr))] items-start">
      <Card className="p-5 flex flex-col gap-3">
        <CardTitle>{t('rules.limitsTitle')}</CardTitle>
        {LIMITS.map((k) => numField(k, t(`rules.fields.${k}`)))}
        <label className="flex items-center gap-2.5 text-[13px] text-[#C4C4C4]">
          <input type="checkbox" checked={settings.pinRequired} disabled={disabled} onChange={(e) => setSettings((p) => ({ ...p, pinRequired: e.target.checked }))} className="accent-[#FF0000] w-4 h-4" />
          {t('rules.fields.pinRequired')}
        </label>
      </Card>

      <div className="flex flex-col gap-4">
        <Card className="p-5 flex flex-col gap-3">
          <CardTitle>{t('rules.giftsTitle')}</CardTitle>
          <Field label={t('rules.giftFields.giftAmounts')}>
            <input value={giftText} placeholder={t('toFix')} disabled={disabled} onChange={(e) => setGiftText(e.target.value)} className={inputClass} />
          </Field>
          {GIFTS.map((k) => numField(k, t(`rules.giftFields.${k}`)))}
        </Card>

        <Card className="p-5 flex flex-col gap-3">
          <CardTitle>{t('rules.pricesTitle')}</CardTitle>
          {PLANS.map((plan) => (
            <Field key={plan} label={t(`rules.priceFields.${plan}`)}>
              <input
                inputMode="numeric"
                value={settings.artistPlanPrices[plan] ?? ''}
                placeholder={t('toFix')}
                disabled={disabled}
                onChange={(e) => setSettings((p) => ({ ...p, artistPlanPrices: { ...p.artistPlanPrices, [plan]: toNumber(e.target.value) } }))}
                className={inputClass}
              />
            </Field>
          ))}
          {numField('promotionPrice', t('rules.priceFields.promotionPrice'))}
          <PendingNote>{t('rules.pricesNote')}</PendingNote>
        </Card>
      </div>

      <div className="flex flex-col gap-4">
        <Card className="p-5 flex flex-col gap-3">
          <CardTitle>{t('rules.rightsTitle')}</CardTitle>
          <div className="overflow-x-auto">
            <div className="min-w-[320px] grid grid-cols-[2fr_repeat(2,1fr)] gap-x-3 gap-y-2.5 text-[13px] items-center">
              <span className="text-[#C4C4C4]">{t('rules.action')}</span>
              {ROLES.map((r) => <span key={r} className="text-[#C4C4C4] text-center">{t(`rules.roles.${r}`)}</span>)}
              {RIGHTS.map(([key, values]) => (
                <div key={key} className="contents">
                  <span className="text-white">{t(`rules.rights.${key}`)}</span>
                  {values.map((v, i) => (
                    <span key={ROLES[i]} className={v ? 'text-center font-bold text-[#FF3B30]' : 'text-center text-[#8F8F8F]'}>
                      {v ? t('rules.yes') : t('rules.no')}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <PendingNote>{t('rules.rightsNote')}</PendingNote>
        </Card>

        <Card className="p-5 flex flex-col gap-3">
          <PendingNote>{t('rules.note')}</PendingNote>
          {!canEdit && <PendingNote>{t('rules.superAdminOnly')}</PendingNote>}
          {!connected && <PendingNote>{t('notConnected')}</PendingNote>}
          <PillButton disabled={disabled || busy} onClick={save}>{t('rules.save')}</PillButton>
        </Card>
      </div>
    </div>
  );
}
