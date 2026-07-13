import { useNavigate } from 'react-router-dom';
import { Headphones, Mic2, Building2, ArrowRight, Info } from 'lucide-react';
import { AgentPageHeader } from '@/components/agent/AgentPageHeader';

const onboardingOptions = [
  {
    type: 'user' as const,
    title: 'Listener / User',
    description:
      'Help someone who wants to listen to music on Asrapa. Register their account and set up a Free, Premium, or Family subscription.',
    icon: Headphones,
    path: '/agent/onboard/user',
    plans: ['Free', 'Premium', 'Family Plan'],
    color: 'border-blue-500/30 hover:border-blue-500',
    iconBg: 'bg-blue-600',
  },
  {
    type: 'artist' as const,
    title: 'Artist',
    description:
      'Help a musician or band join Asrapa Music. Create their artist profile and subscribe them to Artist Pro so they can upload and earn.',
    icon: Mic2,
    path: '/agent/onboard/artist',
    plans: ['Artist Pro'],
    color: 'border-purple-500/30 hover:border-purple-500',
    iconBg: 'bg-purple-600',
  },
  {
    type: 'advertiser' as const,
    title: 'Advertiser',
    description:
      'Help a business advertise on Asrapa Music. Register their company and set up an advertising subscription plan.',
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
      <AgentPageHeader title="Onboard Clients" />

      <div className="p-6 max-w-5xl mx-auto">
        <div className="bg-asra-gray-1 rounded-lg p-4 mb-8 flex items-start gap-3 border border-asra-gray-2">
          <Info className="w-5 h-5 text-asra-red flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-white font-medium">Your role as an Asrapa Agent</p>
            <p className="text-asra-gray-6 text-sm mt-1">
              Many people in your community may not be comfortable registering and subscribing on their own.
              Use this portal to onboard them, collect payments, and earn commission on each subscription you help set up.
            </p>
          </div>
        </div>

        <h2 className="text-white text-xl font-bold mb-6">Who would you like to help today?</h2>

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
