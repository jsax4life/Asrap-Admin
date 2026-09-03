import { useEffect, useState } from 'react';
import { Headphones, Mic2, Building2, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { AgentPageHeader } from '@/components/agent/AgentPageHeader';
import { SUBSCRIPTION_PLANS } from '@/constants';
import { agentService } from '@/services/agentService';
import { AgentClient, ClientType } from '@/types';

const CLIENT_TYPE_ICONS = {
  user: Headphones,
  artist: Mic2,
  advertiser: Building2,
};

const CLIENT_TYPE_LABELS = {
  user: 'Auditeur',
  artist: 'Artiste',
  advertiser: 'Annonceur',
};

const STATUS_LABELS: Record<string, string> = {
  active: 'Actif',
  pending: 'En attente',
  expired: 'Expiré',
  none: 'Aucun',
};

const STATUS_STYLES = {
  active: 'bg-green-500/20 text-green-400',
  pending: 'bg-amber-500/20 text-amber-400',
  expired: 'bg-red-500/20 text-red-400',
  none: 'bg-asra-gray-2 text-asra-gray-6',
};

export default function AgentClients() {
  const [clients, setClients] = useState<AgentClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<ClientType | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    setLoading(true);
    agentService
      .getClients({
        search: search || undefined,
        clientType: filterType === 'all' ? undefined : filterType,
      })
      .then(setClients)
      .catch((err: Error) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, [search, filterType]);

  const totalPages = Math.ceil(clients.length / pageSize);
  const paginatedClients = clients.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="min-h-screen bg-asra-dark">
      <AgentPageHeader
        title="Mes clients"
        showSearch
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); setCurrentPage(1); }}
        searchPlaceholder="Rechercher par nom, e-mail ou téléphone"
      />

      <div className="p-6">
        <div className="flex flex-wrap gap-3 mb-6">
          {(['all', 'user', 'artist', 'advertiser'] as const).map((type) => (
            <button
              key={type}
              onClick={() => { setFilterType(type); setCurrentPage(1); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterType === type
                  ? 'bg-asra-red text-white'
                  : 'bg-asra-gray-1 text-asra-gray-6 hover:text-white border border-asra-gray-2'
              }`}
            >
              {type === 'all' ? 'Tous les clients' : CLIENT_TYPE_LABELS[type]}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-asra-red animate-spin" />
          </div>
        ) : (
          <>
            <div className="bg-asra-gray-1 rounded-lg border border-asra-gray-2 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-asra-gray-2">
                    <th className="text-left text-asra-gray-6 text-sm font-medium px-6 py-4">Client</th>
                    <th className="text-left text-asra-gray-6 text-sm font-medium px-6 py-4">Type</th>
                    <th className="text-left text-asra-gray-6 text-sm font-medium px-6 py-4">Forfait</th>
                    <th className="text-left text-asra-gray-6 text-sm font-medium px-6 py-4">Statut</th>
                    <th className="text-left text-asra-gray-6 text-sm font-medium px-6 py-4">Intégré le</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedClients.map((client) => {
                    const Icon = CLIENT_TYPE_ICONS[client.clientType];
                    return (
                      <tr key={client.id} className="border-b border-asra-gray-2 hover:bg-asra-gray-2/50">
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-white font-medium">{client.name}</p>
                            <p className="text-asra-gray-6 text-sm">{client.phone}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-asra-gray-6" />
                            <span className="text-white text-sm">{CLIENT_TYPE_LABELS[client.clientType]}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-white text-sm">
                          {client.subscriptionPlan
                            ? SUBSCRIPTION_PLANS[client.subscriptionPlan].label
                            : '—'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-xs px-2 py-1 rounded-full capitalize ${STATUS_STYLES[client.subscriptionStatus]}`}>
                            {STATUS_LABELS[client.subscriptionStatus] ?? client.subscriptionStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-asra-gray-6 text-sm">
                          {new Date(client.onboardedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {paginatedClients.length === 0 && (
                <p className="text-asra-gray-6 text-center py-12">Aucun client trouvé</p>
              )}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-asra-gray-6 text-sm">{clients.length} clients au total</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-asra-gray-1 text-white disabled:opacity-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-white text-sm">
                    Page {currentPage} sur {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg bg-asra-gray-1 text-white disabled:opacity-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
