import { useTranslation } from 'react-i18next';
import { OnboardClientForm } from './OnboardClientForm';

export default function OnboardAdvertiser() {
  const { t } = useTranslation('agent');
  return (
    <OnboardClientForm
      clientType="advertiser"
      title={t('onboardForm.advertiser.title')}
      subtitle={t('onboardForm.advertiser.subtitle')}
    />
  );
}
