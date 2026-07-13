import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Loader2, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { AgentPageHeader } from '@/components/agent/AgentPageHeader';
import { Button } from '@/components/ui/button';
import { SUBSCRIPTION_PLANS } from '@/constants';
import { agentService } from '@/services/agentService';
import { AgentClient } from '@/types';

const STATUS_STYLES = {
  active: 'bg-green-500/20 text-green-400',
  pending: 'bg-amber-500/20 text-amber-400',
  expired: 'bg-red-500/20 text-red-400',
  none: 'bg-asra-gray-2 text-asra-gray-6',
};

export default function AgentSubscriptions() {
  const navigate = useNavigate();
  const [clients, setClients] = useState<AgentClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'pending' | 'expired'>('active');

  useEffect(() => {
    agentService
      .getClients()
      .then(setClients)
      .catch((err: Error) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = clients.filter((c) => {
    if (activeTab === 'active') return c.subscriptionStatus === 'active';
    if (activeTab === 'pending') return c.subscriptionStatus === 'pending';
    return c.subscriptionStatus === 'expired' || c.subscriptionStatus === 'none';
  });

  const tabs = [
    { key: 'active' as const, label: 'Active', count: clients.filter((c) => c.subscriptionStatus === 'active').length },
    { key: 'pending' as const, label: 'Pending', count: clients.filter((c) => c.subscriptionStatus === 'pending').length },
    { key: 'expired' as const, label: 'No Plan / Expired', count: clients.filter((c) => c.subscriptionStatus === 'expired' || c.subscriptionStatus === 'none').length },
  ];

  return (
    <div className="min-h-screen bg-asra-dark">
      <AgentPageHeader title="Subscriptions" />

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`pb-2 text-lg font-medium border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? 'text-asra-red border-asra-red'
                    : 'text-asra-gray-400 border-transparent hover:text-white'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
          <Button
            onClick={() => navigate('/agent/onboarding')}
            className="bg-asra-red hover:bg-asra-red/90 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Subscription
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-asra-red animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((client) => (
              <div key={client.id} className="bg-asra-gray-1 rounded-lg p-5 border border-asra-gray-2">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-white font-bold">{client.name}</p>
                    <p className="text-asra-gray-6 text-sm">{client.email}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full capitalize ${STATUS_STYLES[client.subscriptionStatus]}`}>
                    {client.subscriptionStatus}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="w-4 h-4 text-asra-gray-6" />
                  <span className="text-white text-sm">
                    {client.subscriptionPlan
                      ? SUBSCRIPTION_PLANS[client.subscriptionPlan].label
                      : 'No plan selected'}
                  </span>
                  {client.subscriptionPlan && (
                    <span className="text-asra-gray-6 text-sm ml-auto">
                      ₦{SUBSCRIPTION_PLANS[client.subscriptionPlan].price.toLocaleString()}/mo
                    </span>
                  )}
                </div>

                {client.subscriptionStatus === 'none' && (
                  <Button
                    size="sm"
                    onClick={() => navigate('/agent/onboarding')}
                    className="w-full bg-asra-red hover:bg-asra-red/90 text-white"
                  >
                    Set Up Subscription
                  </Button>
                )}
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="text-asra-gray-6 col-span-full text-center py-12">No subscriptions in this category</p>
            )}
          </div>
        )}

        <div className="mt-8 bg-asra-gray-1 rounded-lg p-6 border border-asra-gray-2">
          <h3 className="text-white font-bold mb-4">Available Plans</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(SUBSCRIPTION_PLANS).map(([key, plan]) => (
              <div key={key} className="bg-asra-gray-2 rounded-lg p-4">
                <p className="text-white font-medium">{plan.label}</p>
                <p className="text-asra-red font-bold">
                  {plan.price === 0 ? 'Free' : `₦${plan.price.toLocaleString()}/mo`}
                </p>
                <p className="text-asra-gray-6 text-xs mt-1 capitalize">
                  For: {plan.clientTypes.join(', ')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
