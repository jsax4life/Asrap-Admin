import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import {
  Users,
  UserPlus,
  CreditCard,
  Banknote,
  Headphones,
  Mic2,
  Building2,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { AgentPageHeader } from '@/components/agent/AgentPageHeader';
import { MetricCard } from '@/components/MetricCard';
import { agentService } from '@/services/agentService';
import { AgentDashboardStats } from '@/types';

const formatCurrency = (amount: number) =>
  `${new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(amount)} FCFA`;

export default function AgentDashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation('agent');
  const [stats, setStats] = useState<AgentDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    agentService
      .getDashboardStats()
      .then(setStats)
      .catch((err: Error) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  const quickActions = [
    {
      title: t('dashboard.quickActions.onboardUser.title'),
      description: t('dashboard.quickActions.onboardUser.description'),
      icon: Headphones,
      path: '/agent/onboard/user',
      color: 'bg-blue-600',
    },
    {
      title: t('dashboard.quickActions.onboardArtist.title'),
      description: t('dashboard.quickActions.onboardArtist.description'),
      icon: Mic2,
      path: '/agent/onboard/artist',
      color: 'bg-purple-600',
    },
    {
      title: t('dashboard.quickActions.onboardAdvertiser.title'),
      description: t('dashboard.quickActions.onboardAdvertiser.description'),
      icon: Building2,
      path: '/agent/onboard/advertiser',
      color: 'bg-amber-600',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-asra-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-asra-red animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-asra-dark">
      <AgentPageHeader title={t('dashboard.header.title')} />

      <div className="p-6 space-y-8">
        <div>
          <h2 className="text-white text-lg font-bold mb-4">{t('dashboard.overview')}</h2>
          <div className="flex flex-wrap gap-4">
            <MetricCard icon={Users} value={String(stats?.totalClients ?? 0)} label={t('dashboard.metrics.totalClients')} />
            <MetricCard icon={UserPlus} value={String(stats?.onboardedToday ?? 0)} label={t('dashboard.metrics.onboardedToday')} />
            <MetricCard icon={CreditCard} value={String(stats?.activeSubscriptions ?? 0)} label={t('dashboard.metrics.activeSubscriptions')} />
            <MetricCard icon={Banknote} value={formatCurrency(stats?.monthlyCommission ?? 0)} label={t('dashboard.metrics.monthlyCommission')} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-asra-gray-1 rounded-lg p-5 border border-asra-gray-2">
            <div className="flex items-center gap-3 mb-2">
              <Headphones className="w-5 h-5 text-blue-400" />
              <span className="text-asra-gray-6 text-sm">{t('dashboard.breakdown.listeners')}</span>
            </div>
            <p className="text-white text-2xl font-bold">{stats?.usersOnboarded}</p>
          </div>
          <div className="bg-asra-gray-1 rounded-lg p-5 border border-asra-gray-2">
            <div className="flex items-center gap-3 mb-2">
              <Mic2 className="w-5 h-5 text-purple-400" />
              <span className="text-asra-gray-6 text-sm">{t('dashboard.breakdown.artists')}</span>
            </div>
            <p className="text-white text-2xl font-bold">{stats?.artistsOnboarded}</p>
          </div>
          <div className="bg-asra-gray-1 rounded-lg p-5 border border-asra-gray-2">
            <div className="flex items-center gap-3 mb-2">
              <Building2 className="w-5 h-5 text-amber-400" />
              <span className="text-asra-gray-6 text-sm">{t('dashboard.breakdown.advertisers')}</span>
            </div>
            <p className="text-white text-2xl font-bold">{stats?.advertisersOnboarded}</p>
          </div>
        </div>

        <div>
          <h2 className="text-white text-lg font-bold mb-4">{t('dashboard.quickActions.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <button
                key={action.path}
                onClick={() => navigate(action.path)}
                className="bg-asra-gray-1 rounded-lg p-6 border border-asra-gray-2 text-left hover:border-asra-red transition-colors group"
              >
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-bold mb-2">{action.title}</h3>
                <p className="text-asra-gray-6 text-sm mb-4">{action.description}</p>
                <span className="text-asra-red text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  {t('dashboard.quickActions.start')} <ArrowRight className="w-4 h-4" />
                </span>
              </button>
            ))}
          </div>
        </div>

        {stats && stats.pendingOnboardings > 0 && (
          <div className="bg-asra-gray-1 rounded-lg p-5 border border-amber-600/30">
            <p className="text-amber-400 font-medium">
              {t('dashboard.pendingBanner', { count: stats.pendingOnboardings })}
            </p>
            <button
              onClick={() => navigate('/agent/clients')}
              className="text-asra-red text-sm mt-2 hover:underline"
            >
              {t('dashboard.viewPendingClients')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
