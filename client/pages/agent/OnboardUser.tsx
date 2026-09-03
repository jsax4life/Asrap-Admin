import { useTranslation } from 'react-i18next';
import { OnboardClientForm } from './OnboardClientForm';

export default function OnboardUser() {
  const { t } = useTranslation('agent');
  return (
    <OnboardClientForm
      clientType="user"
      title={t('onboardForm.user.title')}
      subtitle={t('onboardForm.user.subtitle')}
    />
  );
}
