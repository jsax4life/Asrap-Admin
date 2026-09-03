import { useTranslation } from 'react-i18next';
import { OnboardClientForm } from './OnboardClientForm';

export default function OnboardArtist() {
  const { t } = useTranslation('agent');
  return (
    <OnboardClientForm
      clientType="artist"
      title={t('onboardForm.artist.title')}
      subtitle={t('onboardForm.artist.subtitle')}
    />
  );
}
