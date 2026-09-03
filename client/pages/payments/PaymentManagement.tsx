import { useState } from 'react';
import { Search, Calendar, User, ChevronLeft, ChevronRight, DollarSign, TrendingUp, Building, Users, ArrowUp, ArrowDown } from 'lucide-react';

// Aperçu des paiements (à connecter au service backend)
const mockPaymentOverview = {
  totalMonthlyRevenue: 0,
  totalAnnualRevenue: 0,
  earningsFromSubscription: 0,
  outstandingBalances: 0,
  earningsFromArtists: 0,
  totalPayoutsToArtists: 0,
  subscriptionFromAgents: 0,
};

// Historique des paiements (à connecter au service backend)
const mockPaymentHistory: {
  id: number;
  transactionId: string;
  transactionDate: string;
  paymentType: string;
  paymentAmount: number;
  paymentSource: string;
  paymentStatus: string;
}[] = [];

// Historique des paiements entrants (à connecter au service backend)
const mockPaymentInHistory: {
  id: number;
  paymentId: string;
  paymentDate: string;
  paymentType: string;
  paymentAmount: number;
  paymentSource: string;
  paymentStatus: string;
}[] = [];

// Historique des paiements sortants (à connecter au service backend)
const mockPaymentOutHistory: {
  id: number;
  payoutId: string;
  payoutDate: string;
  artistName: string;
  paymentAmount: number;
  paymentType: string;
  paymentStatus: string;
}[] = [];

// Historique des paiements reçus des agents (à connecter au service backend)
const mockPaymentAgentHistory: {
  id: number;
  paymentId: string;
  paymentDate: string;
  paymentType: string;
  paymentAmount: number;
  payerEmail: string;
  agentName: string;
  paymentStatus: string;
}[] = [];

const PaymentManagement = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'payment-in' | 'payment-out' | 'payment-agents'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState('February');
  const [selectedYear, setSelectedYear] = useState('2023');

  const formatCurrency = (amount: number) => {
    return `${new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
    }).format(amount)} FCFA`;
  };

  const formatCurrencyCompact = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M FCFA`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}k FCFA`;
    }
    return formatCurrency(amount);
  };

  const filteredPayments = mockPaymentHistory.filter(payment =>
    payment.paymentType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.paymentSource.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-asra-dark">
      {/* Header */}
      <div className="bg-asra-dark border-b border-asra-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and Date */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-asra-red rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-white text-xl font-bold">Asrapa</span>
            </div>
            <div className="flex items-center space-x-2 text-asra-gray-400">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">03/02/2023</span>
            </div>
          </div>

          {/* Center - Title */}
          <div className="flex-1 flex justify-center">
            <h1 className="text-2xl font-bold text-white">Paiement</h1>
          </div>

          {/* Right side - Search and Profile */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-asra-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-asra-gray-800 text-white pl-10 pr-4 py-2 rounded-lg border border-asra-gray-700 focus:outline-none focus:border-asra-red w-64"
              />
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-asra-red rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-white text-sm">Administrateur système</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Tabs */}
        <div className="flex space-x-8 mb-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2 text-lg font-medium border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'text-asra-red border-asra-red'
                : 'text-asra-gray-400 border-transparent hover:text-white'
            }`}
          >
            Aperçu des paiements
          </button>
          <button
            onClick={() => setActiveTab('payment-in')}
            className={`pb-2 text-lg font-medium border-b-2 transition-colors ${
              activeTab === 'payment-in'
                ? 'text-asra-red border-asra-red'
                : 'text-asra-gray-400 border-transparent hover:text-white'
            }`}
          >
            Paiements entrants
          </button>
          <button
            onClick={() => setActiveTab('payment-out')}
            className={`pb-2 text-lg font-medium border-b-2 transition-colors ${
              activeTab === 'payment-out'
                ? 'text-asra-red border-asra-red'
                : 'text-asra-gray-400 border-transparent hover:text-white'
            }`}
          >
            Paiements sortants
          </button>
          <button
            onClick={() => setActiveTab('payment-agents')}
            className={`pb-2 text-lg font-medium border-b-2 transition-colors ${
              activeTab === 'payment-agents'
                ? 'text-asra-red border-asra-red'
                : 'text-asra-gray-400 border-transparent hover:text-white'
            }`}
          >
            Paiements entrants des agents
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div>
            {/* Overview Cards */}
            <div className="space-y-6 mb-8">
              {/* Top Row - 4 Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Monthly Revenue */}
                <div className="bg-asra-gray-1 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-asra-red rounded-full flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-3xl font-bold text-white mb-3">
                        {formatCurrency(mockPaymentOverview.totalMonthlyRevenue)}
                      </div>
                      <div className="mb-3">
                        <select
                          value={selectedMonth}
                          onChange={(e) => setSelectedMonth(e.target.value)}
                          className="bg-white text-gray-900 text-sm rounded-full px-4 py-2 border-0 focus:outline-none focus:ring-2 focus:ring-asra-red"
                        >
                          <option value="January">Janvier</option>
                          <option value="February">Février</option>
                          <option value="March">Mars</option>
                          <option value="April">Avril</option>
                          <option value="May">Mai</option>
                          <option value="June">Juin</option>
                          <option value="July">Juillet</option>
                          <option value="August">Août</option>
                          <option value="September">Septembre</option>
                          <option value="October">Octobre</option>
                          <option value="November">Novembre</option>
                          <option value="December">Décembre</option>
                        </select>
                      </div>
                      <div className="text-asra-gray-400 text-sm">Revenu mensuel total</div>
                    </div>
                  </div>
                </div>

                {/* Total Annual Revenue */}
                <div className="bg-asra-gray-1 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-asra-red rounded-full flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-3xl font-bold text-white mb-3">
                        {formatCurrency(mockPaymentOverview.totalAnnualRevenue)}
                      </div>
                      <div className="mb-3">
                        <select
                          value={selectedYear}
                          onChange={(e) => setSelectedYear(e.target.value)}
                          className="bg-white text-gray-900 text-sm rounded-full px-4 py-2 border-0 focus:outline-none focus:ring-2 focus:ring-asra-red"
                        >
                          <option value="2023">2023</option>
                          <option value="2022">2022</option>
                          <option value="2021">2021</option>
                        </select>
                      </div>
                      <div className="text-asra-gray-400 text-sm">Revenu annuel total</div>
                    </div>
                  </div>
                </div>

                {/* Earnings from Subscription */}
                <div className="bg-asra-gray-1 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-asra-red rounded-full flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-3xl font-bold text-white mb-3">
                        {formatCurrency(mockPaymentOverview.earningsFromSubscription)}
                      </div>
                      <div className="text-asra-gray-400 text-sm">Revenus des abonnements</div>
                    </div>
                  </div>
                </div>

                {/* Outstanding Balances */}
                <div className="bg-asra-gray-1 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-asra-red rounded-full flex items-center justify-center flex-shrink-0">
                      <Building className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-3xl font-bold text-white mb-3">
                        {formatCurrency(mockPaymentOverview.outstandingBalances)}
                      </div>
                      <div className="text-asra-gray-400 text-sm">Soldes impayés</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Row - 3 Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Earnings from Artists */}
                <div className="bg-asra-gray-1 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-asra-red rounded-full flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-3xl font-bold text-white mb-3">
                        {formatCurrencyCompact(mockPaymentOverview.earningsFromArtists)}
                      </div>
                      <div className="text-asra-gray-400 text-sm">Revenus des artistes</div>
                    </div>
                  </div>
                </div>

                {/* Total Payouts to Artists */}
                <div className="bg-asra-gray-1 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-asra-red rounded-full flex items-center justify-center flex-shrink-0">
                      <ArrowUp className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-3xl font-bold text-white mb-3">
                        {formatCurrencyCompact(mockPaymentOverview.totalPayoutsToArtists)}
                      </div>
                      <div className="text-asra-gray-400 text-sm">Total des versements aux artistes</div>
                    </div>
                  </div>
                </div>

                {/* Subscription from Agents */}
                <div className="bg-asra-gray-1 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-asra-red rounded-full flex items-center justify-center flex-shrink-0">
                      <ArrowUp className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-3xl font-bold text-white mb-3">
                        {formatCurrencyCompact(mockPaymentOverview.subscriptionFromAgents)}
                      </div>
                      <div className="text-asra-gray-400 text-sm">Abonnements via les agents</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment History */}
            <div className="bg-asra-gray-900 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Historique des paiements</h3>
                <button
                  onClick={() => setActiveTab('payment-in')}
                  className="text-asra-red hover:text-red-400 text-sm font-medium"
                >
                  Voir tout
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-asra-gray-800">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                        N°
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                        ID de transaction
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                        Date de transaction
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                        Type de paiement
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                        Montant
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                        Source/Description du paiement
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                        Statut du paiement
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-asra-gray-800">
                    {filteredPayments.map((payment, index) => (
                      <tr key={payment.id} className="hover:bg-asra-gray-800 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-asra-gray-300">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                          {payment.transactionId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-asra-gray-300">
                          {new Date(payment.transactionDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-asra-gray-300">
                          {payment.paymentType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                          {formatCurrency(payment.paymentAmount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-asra-gray-300">
                          {payment.paymentSource}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {payment.paymentStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {filteredPayments.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-sm text-asra-gray-400">
                          Aucune transaction pour le moment
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="bg-asra-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-asra-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Précédent</span>
                  </button>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="bg-asra-red text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors flex items-center space-x-2"
                  >
                    <span>Suivant</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-asra-gray-400 text-sm">
                  Page {currentPage}
                </div>

              </div>
            </div>
          </div>
        )}

        {/* Other tabs content */}
            {activeTab === 'payment-in' && (
              <div className="bg-asra-gray-900 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Paiements entrants</h3>
                  <button className="text-asra-red hover:text-red-400 text-sm font-medium">
                    Voir tout
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-asra-gray-800">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                          N°
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                          Date de paiement
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                          ID de paiement
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                          Type de paiement
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                          Montant
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                          Source/Description du paiement
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                          Statut du paiement
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-asra-gray-800">
                      {mockPaymentInHistory.map((payment, index) => (
                        <tr key={payment.id} className="hover:bg-asra-gray-800 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-asra-gray-300">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-asra-gray-300">
                            {new Date(payment.paymentDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                            {payment.paymentId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-asra-gray-300">
                            {payment.paymentType}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                            {formatCurrency(payment.paymentAmount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-asra-gray-300">
                            {payment.paymentSource}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {payment.paymentStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {mockPaymentInHistory.length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-6 py-8 text-center text-sm text-asra-gray-400">
                            Aucun paiement entrant pour le moment
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center justify-between mt-6">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="bg-asra-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-asra-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Précédent</span>
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      className="bg-asra-red text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors flex items-center space-x-2"
                    >
                      <span>Suivant</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-asra-gray-400 text-sm">
                    Page {currentPage}
                  </div>
                </div>
              </div>
            )}

        {activeTab === 'payment-out' && (
          <div className="bg-asra-gray-900 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Paiements sortants</h3>
              <button className="text-asra-red hover:text-red-400 text-sm font-medium">
                Voir tout
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-asra-gray-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                      N°
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                      Date de versement
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                      ID de versement
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                      Nom de l'artiste
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                      Montant
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                      Type de paiement
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                      Statut du paiement
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-asra-gray-800">
                  {mockPaymentOutHistory.map((payment, index) => (
                    <tr key={payment.id} className="hover:bg-asra-gray-800 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-asra-gray-300">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-asra-gray-300">
                        {new Date(payment.payoutDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                        {payment.payoutId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                        {payment.artistName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                        {formatCurrency(payment.paymentAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-asra-gray-300">
                        {payment.paymentType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {payment.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {mockPaymentOutHistory.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-sm text-asra-gray-400">
                        Aucun paiement sortant pour le moment
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between mt-6">
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="bg-asra-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-asra-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Précédent</span>
                </button>
                <button
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="bg-asra-red text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors flex items-center space-x-2"
                >
                  <span>Suivant</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="text-asra-gray-400 text-sm">
                Page {currentPage}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'payment-agents' && (
          <div className="bg-asra-gray-900 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Paiements des agents</h3>
              <button className="text-asra-red hover:text-red-400 text-sm font-medium">
                Voir tout
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-asra-gray-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                      N°
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                      Date de paiement
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                      ID de paiement
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                      Type de paiement
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                      Montant
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                      E-mail du payeur
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                      Payé par (nom de l'agent)
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                      Statut du paiement
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-asra-gray-800">
                  {mockPaymentAgentHistory.map((payment, index) => (
                    <tr key={payment.id} className="hover:bg-asra-gray-800 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-asra-gray-300">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-asra-gray-300">
                        {new Date(payment.paymentDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                        {payment.paymentId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-asra-gray-300">
                        {payment.paymentType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                        {formatCurrency(payment.paymentAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-asra-gray-300">
                        {payment.payerEmail}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                        {payment.agentName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {payment.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {mockPaymentAgentHistory.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-6 py-8 text-center text-sm text-asra-gray-400">
                        Aucun paiement reçu d'agent pour le moment
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between mt-6">
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="bg-asra-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-asra-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Précédent</span>
                </button>
                <button
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="bg-asra-red text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors flex items-center space-x-2"
                >
                  <span>Suivant</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="text-asra-gray-400 text-sm">
                Page {currentPage}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentManagement;
