import { useNavigate } from 'react-router-dom';
import { Headphones, Mic2, Building2, ArrowRight, Info } from 'lucide-react';
import { AgentPageHeader } from '@/components/agent/AgentPageHeader';

const onboardingOptions = [
  {
    type: 'user' as const,
    title: 'Auditeur / Utilisateur',
    description:
      'Aidez une personne qui souhaite écouter de la musique sur Asrapa. Inscrivez son compte et configurez un abonnement Gratuit, Premium ou Famille.',
    icon: Headphones,
    path: '/agent/onboard/user',
    plans: ['Gratuit', 'Premium', 'Forfait Famille'],
    color: 'border-blue-500/30 hover:border-blue-500',
    iconBg: 'bg-blue-600',
  },
  {
    type: 'artist' as const,
    title: 'Artiste',
    description:
      'Aidez un musicien ou un groupe à rejoindre Asrapa Music. Créez son profil d\'artiste et abonnez-le à Artist Pro afin qu\'il puisse publier et gagner de l\'argent.',
    icon: Mic2,
    path: '/agent/onboard/artist',
    plans: ['Artist Pro'],
    color: 'border-purple-500/30 hover:border-purple-500',
    iconBg: 'bg-purple-600',
  },
  {
    type: 'advertiser' as const,
    title: 'Annonceur',
    description:
      'Aidez une entreprise à faire de la publicité sur Asrapa Music. Inscrivez son entreprise et configurez un forfait d\'abonnement publicitaire.',
    icon: Building2,
    path: '/agent/onboard/advertiser',
    plans: ['Advertiser Starter', 'Advertiser Pro'],
    color: 'border-amber-500/30 hover:border-amber-500',
    iconBg: 'bg-amber-600',
  },
];

export default function AgentOnboarding() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-asra-dark">
      <AgentPageHeader title="Intégrer des clients" />

      <div className="p-6 max-w-5xl mx-auto">
        <div className="bg-asra-gray-1 rounded-lg p-4 mb-8 flex items-start gap-3 border border-asra-gray-2">
          <Info className="w-5 h-5 text-asra-red flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-white font-medium">Votre rôle en tant qu'agent Asrapa</p>
            <p className="text-asra-gray-6 text-sm mt-1">
              De nombreuses personnes de votre communauté ne sont peut-être pas à l'aise pour s'inscrire et s'abonner elles-mêmes.
              Utilisez ce portail pour les intégrer, encaisser les paiements et gagner une commission sur chaque abonnement que vous aidez à mettre en place.
            </p>
          </div>
        </div>

        <h2 className="text-white text-xl font-bold mb-6">Qui souhaitez-vous aider aujourd'hui ?</h2>

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
