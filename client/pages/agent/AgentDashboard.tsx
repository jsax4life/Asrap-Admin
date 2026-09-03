import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
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
      title: 'Intégrer un auditeur',
      description: 'Inscrire un nouvel utilisateur et configurer son abonnement',
      icon: Headphones,
      path: '/agent/onboard/user',
      color: 'bg-blue-600',
    },
    {
      title: 'Intégrer un artiste',
      description: 'Aider un artiste à rejoindre Asrapa et à s\'abonner à Artist Pro',
      icon: Mic2,
      path: '/agent/onboard/artist',
      color: 'bg-purple-600',
    },
    {
      title: 'Intégrer un annonceur',
      description: 'Inscrire une entreprise pour faire de la publicité sur Asrapa',
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
      <AgentPageHeader title="Tableau de bord de l'agent" />

      <div className="p-6 space-y-8">
        <div>
          <h2 className="text-white text-lg font-bold mb-4">Aperçu du jour</h2>
          <div className="flex flex-wrap gap-4">
            <MetricCard icon={Users} value={String(stats?.totalClients ?? 0)} label="Total de clients aidés" />
            <MetricCard icon={UserPlus} value={String(stats?.onboardedToday ?? 0)} label="Intégrés aujourd'hui" />
            <MetricCard icon={CreditCard} value={String(stats?.activeSubscriptions ?? 0)} label="Abonnements actifs" />
            <MetricCard icon={Banknote} value={formatCurrency(stats?.monthlyCommission ?? 0)} label="Commission ce mois-ci" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-asra-gray-1 rounded-lg p-5 border border-asra-gray-2">
            <div className="flex items-center gap-3 mb-2">
              <Headphones className="w-5 h-5 text-blue-400" />
              <span className="text-asra-gray-6 text-sm">Auditeurs</span>
            </div>
            <p className="text-white text-2xl font-bold">{stats?.usersOnboarded}</p>
          </div>
          <div className="bg-asra-gray-1 rounded-lg p-5 border border-asra-gray-2">
            <div className="flex items-center gap-3 mb-2">
              <Mic2 className="w-5 h-5 text-purple-400" />
              <span className="text-asra-gray-6 text-sm">Artistes</span>
            </div>
            <p className="text-white text-2xl font-bold">{stats?.artistsOnboarded}</p>
          </div>
          <div className="bg-asra-gray-1 rounded-lg p-5 border border-asra-gray-2">
            <div className="flex items-center gap-3 mb-2">
              <Building2 className="w-5 h-5 text-amber-400" />
              <span className="text-asra-gray-6 text-sm">Annonceurs</span>
            </div>
            <p className="text-white text-2xl font-bold">{stats?.advertisersOnboarded}</p>
          </div>
        </div>

        <div>
          <h2 className="text-white text-lg font-bold mb-4">Actions rapides</h2>
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
                  Commencer <ArrowRight className="w-4 h-4" />
                </span>
              </button>
            ))}
          </div>
        </div>

        {stats && stats.pendingOnboardings > 0 && (
          <div className="bg-asra-gray-1 rounded-lg p-5 border border-amber-600/30">
            <p className="text-amber-400 font-medium">
              Vous avez {stats.pendingOnboardings} intégration{stats.pendingOnboardings > 1 ? 's' : ''} en attente à finaliser
            </p>
            <button
              onClick={() => navigate('/agent/clients')}
              className="text-asra-red text-sm mt-2 hover:underline"
            >
              Voir les clients en attente →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
