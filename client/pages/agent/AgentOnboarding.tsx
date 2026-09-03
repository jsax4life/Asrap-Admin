import { useNavigate } from 'react-router-dom';
import { Headphones, Mic2, Building2, ArrowRight, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AgentPageHeader } from '@/components/agent/AgentPageHeader';

export default function AgentOnboarding() {
  const navigate = useNavigate();
  const { t } = useTranslation('agent');

  const onboardingOptions = [
    {
      type: 'user' as const,
      title: t('onboarding.options.user.title'),
      description: t('onboarding.options.user.description'),
      icon: Headphones,
      path: '/agent/onboard/user',
      plans: t('onboarding.options.user.plans', { returnObjects: true }) as string[],
      color: 'border-blue-500/30 hover:border-blue-500',
      iconBg: 'bg-blue-600',
    },
    {
      type: 'artist' as const,
      title: t('onboarding.options.artist.title'),
      description: t('onboarding.options.artist.description'),
      icon: Mic2,
      path: '/agent/onboard/artist',
      plans: t('onboarding.options.artist.plans', { returnObjects: true }) as string[],
      color: 'border-purple-500/30 hover:border-purple-500',
      iconBg: 'bg-purple-600',
    },
    {
      type: 'advertiser' as const,
      title: t('onboarding.options.advertiser.title'),
      description: t('onboarding.options.advertiser.description'),
      icon: Building2,
      path: '/agent/onboard/advertiser',
      plans: t('onboarding.options.advertiser.plans', { returnObjects: true }) as string[],
      color: 'border-amber-500/30 hover:border-amber-500',
      iconBg: 'bg-amber-600',
    },
  ];

  return (
    <div className="min-h-screen bg-asra-dark">
      <AgentPageHeader title={t('onboarding.header.title')} />

      <div className="p-6 max-w-5xl mx-auto">
        <div className="bg-asra-gray-1 rounded-lg p-4 mb-8 flex items-start gap-3 border border-asra-gray-2">
          <Info className="w-5 h-5 text-asra-red flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-white font-medium">{t('onboarding.role.title')}</p>
            <p className="text-asra-gray-6 text-sm mt-1">
              {t('onboarding.role.description')}
            </p>
          </div>
        </div>

        <h2 className="text-white text-xl font-bold mb-6">{t('onboarding.question')}</h2>

        <div className="space-y-4">
          {onboardingOptions.map((option) => (
            <button
              key={option.type}
              onClick={() => navigate(option.path)}
              className={`w-full bg-asra-gray-1 rounded-lg p-6 border-2 ${option.color} text-left transition-all group`}
            >
              <div className="flex items-start gap-5">
                <div className={`w-14 h-14 ${option.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <option.icon className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white text-lg font-bold mb-1">{option.title}</h3>
                  <p className="text-asra-gray-6 text-sm mb-3">{option.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {option.plans.map((plan) => (
                      <span
                        key={plan}
                        className="text-xs bg-asra-gray-2 text-asra-gray-6 px-2 py-1 rounded"
                      >
                        {plan}
                      </span>
                    ))}
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-asra-gray-6 group-hover:text-asra-red transition-colors flex-shrink-0 mt-2" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
