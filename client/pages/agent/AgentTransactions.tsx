import { useEffect, useState } from 'react';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { AgentPageHeader } from '@/components/agent/AgentPageHeader';
import { SUBSCRIPTION_PLANS } from '@/constants';
import { agentService } from '@/services/agentService';
import { AgentTransaction } from '@/types';

const STATUS_STYLES = {
  completed: 'bg-green-500/20 text-green-400',
  pending: 'bg-amber-500/20 text-amber-400',
  failed: 'bg-red-500/20 text-red-400',
};

const PAYMENT_LABELS = {
  cash: 'Espèces',
  mobile_money: 'Mobile Money',
  bank_transfer: 'Virement bancaire',
  card: 'Carte',
};

const CLIENT_TYPE_LABELS = {
  user: 'Auditeur',
  artist: 'Artiste',
  advertiser: 'Annonceur',
};

const STATUS_LABELS: Record<string, string> = {
  completed: 'Terminée',
  pending: 'En attente',
  failed: 'Échouée',
};

export default function AgentTransactions() {
  const [transactions, setTransactions] = useState<AgentTransaction[]>([]);
  const [summary, setSummary] = useState({ totalCollected: 0, transactionCount: 0, estimatedCommission: 0 });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    setLoading(true);
    agentService
      .getTransactions({ page: currentPage, limit: pageSize })
      .then(({ transactions: data, summary: s }) => {
        setTransactions(data);
        setSummary(s);
      })
      .catch((err: Error) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, [currentPage]);

  const totalPages = Math.ceil(summary.transactionCount / pageSize) || 1;
  const paginated = transactions;

  return (
    <div className="min-h-screen bg-asra-dark">
      <AgentPageHeader title="Transactions" />

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-asra-gray-1 rounded-lg p-5 border border-asra-gray-2">
            <p className="text-asra-gray-6 text-sm">Total encaissé</p>
            <p className="text-white text-2xl font-bold">{summary.totalCollected.toLocaleString('fr-FR')} FCFA</p>
          </div>
          <div className="bg-asra-gray-1 rounded-lg p-5 border border-asra-gray-2">
            <p className="text-asra-gray-6 text-sm">Transactions</p>
            <p className="text-white text-2xl font-bold">{summary.transactionCount}</p>
          </div>
          <div className="bg-asra-gray-1 rounded-lg p-5 border border-asra-gray-2">
            <p className="text-asra-gray-6 text-sm">Commission est.</p>
            <p className="text-white text-2xl font-bold">{summary.estimatedCommission.toLocaleString('fr-FR')} FCFA</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-asra-red animate-spin" />
          </div>
        ) : (
          <>
            <div className="bg-asra-gray-1 rounded-lg border border-asra-gray-2 overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-asra-gray-2">
                    <th className="text-left text-asra-gray-6 text-sm font-medium px-6 py-4">ID transaction</th>
                    <th className="text-left text-asra-gray-6 text-sm font-medium px-6 py-4">Client</th>
                    <th className="text-left text-asra-gray-6 text-sm font-medium px-6 py-4">Type</th>
                    <th className="text-left text-asra-gray-6 text-sm font-medium px-6 py-4">Forfait</th>
                    <th className="text-left text-asra-gray-6 text-sm font-medium px-6 py-4">Montant</th>
                    <th className="text-left text-asra-gray-6 text-sm font-medium px-6 py-4">Paiement</th>
                    <th className="text-left text-asra-gray-6 text-sm font-medium px-6 py-4">Statut</th>
                    <th className="text-left text-asra-gray-6 text-sm font-medium px-6 py-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((tx) => (
                    <tr key={tx.id} className="border-b border-asra-gray-2 hover:bg-asra-gray-2/50">
                      <td className="px-6 py-4 text-white text-sm font-mono">{tx.transactionId}</td>
                      <td className="px-6 py-4 text-white text-sm">{tx.clientName}</td>
                      <td className="px-6 py-4 text-asra-gray-6 text-sm">{CLIENT_TYPE_LABELS[tx.clientType]}</td>
                      <td className="px-6 py-4 text-white text-sm">{SUBSCRIPTION_PLANS[tx.plan].label}</td>
                      <td className="px-6 py-4 text-white text-sm font-medium">{tx.amount.toLocaleString('fr-FR')} FCFA</td>
                      <td className="px-6 py-4 text-asra-gray-6 text-sm">{PAYMENT_LABELS[tx.paymentMethod]}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full capitalize ${STATUS_STYLES[tx.status]}`}>
                          {STATUS_LABELS[tx.status] ?? tx.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-asra-gray-6 text-sm">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-end gap-2 mt-4">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-asra-gray-1 text-white disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-white text-sm">Page {currentPage} sur {totalPages}</span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-asra-gray-1 text-white disabled:opacity-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
