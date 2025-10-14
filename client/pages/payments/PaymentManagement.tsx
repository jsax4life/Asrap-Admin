import { useState } from 'react';
import { Search, Calendar, User, ChevronLeft, ChevronRight, DollarSign, TrendingUp, Building, Users, ArrowUp, ArrowDown } from 'lucide-react';

// Mock data for payment overview
const mockPaymentOverview = {
  totalMonthlyRevenue: 50000,
  totalAnnualRevenue: 500000,
  earningsFromSubscription: 300000,
  earningsFromArtists: 100000,
  totalPayoutsToArtists: 100000,
  subscriptionFromAgents: 100000,
};

// Mock data for payment history
const mockPaymentHistory = [
  {
    id: 1,
    transactionId: 'PAY-000001',
    transactionDate: '2023-01-15',
    paymentType: 'Artist Subscription',
    paymentAmount: 500,
    paymentSource: "John Doe's Subscription",
    paymentStatus: 'Completed',
  },
  {
    id: 2,
    transactionId: 'PAY-000001',
    transactionDate: '2023-01-20',
    paymentType: 'Listener Subscription',
    paymentAmount: 200,
    paymentSource: 'Premium Plan',
    paymentStatus: 'Completed',
  },
  {
    id: 3,
    transactionId: 'PAY-000001',
    transactionDate: '2023-02-05',
    paymentType: 'Promotion',
    paymentAmount: 300,
    paymentSource: "Valentine's Day Campaign",
    paymentStatus: 'Completed',
  },
  {
    id: 4,
    transactionId: 'PAY-000001',
    transactionDate: '2023-02-10',
    paymentType: 'Advertising',
    paymentAmount: 150,
    paymentSource: 'Ad Campaign XYZ',
    paymentStatus: 'Completed',
  },
];

// Mock data for Payment In history
const mockPaymentInHistory = [
  {
    id: 1,
    paymentId: 'PAY-000001',
    paymentDate: '2023-01-15',
    paymentType: 'Artist Subscription',
    paymentAmount: 500,
    paymentSource: "John Doe's Subscription",
    paymentStatus: 'Completed'
  },
  {
    id: 2,
    paymentId: 'PAY-000002',
    paymentDate: '2023-01-20',
    paymentType: 'Listener Subscription',
    paymentAmount: 300,
    paymentSource: 'Premium Plan',
    paymentStatus: 'Completed'
  },
  {
    id: 3,
    paymentId: 'PAY-000003',
    paymentDate: '2023-02-05',
    paymentType: 'Promotion',
    paymentAmount: 200,
    paymentSource: "Valentine's Day Campaign",
    paymentStatus: 'Completed'
  },
  {
    id: 4,
    paymentId: 'PAY-000004',
    paymentDate: '2023-02-10',
    paymentType: 'Advertising',
    paymentAmount: 150,
    paymentSource: 'Ad Campaign XYZ',
    paymentStatus: 'Completed'
  },
  {
    id: 5,
    paymentId: 'PAY-000005',
    paymentDate: '2023-03-03',
    paymentType: 'Artist Subscription',
    paymentAmount: 550,
    paymentSource: "Jane Smith's Subscription",
    paymentStatus: 'Completed'
  },
  {
    id: 6,
    paymentId: 'PAY-000006',
    paymentDate: '2023-02-10',
    paymentType: 'Listener Subscription',
    paymentAmount: 210,
    paymentSource: 'Family Plan',
    paymentStatus: 'Completed'
  },
  {
    id: 7,
    paymentId: 'PAY-000007',
    paymentDate: '2023-03-12',
    paymentType: 'Promotion',
    paymentAmount: 400,
    paymentSource: 'Spring Sale',
    paymentStatus: 'Completed'
  },
  {
    id: 8,
    paymentId: 'PAY-000008',
    paymentDate: '2023-04-02',
    paymentType: 'Advertising',
    paymentAmount: 180,
    paymentSource: 'Ad Campaign ABC',
    paymentStatus: 'Completed'
  },
  {
    id: 9,
    paymentId: 'PAY-000009',
    paymentDate: '2023-04-08',
    paymentType: 'Artist Subscription',
    paymentAmount: 500,
    paymentSource: "Mike Johnson's Subscription",
    paymentStatus: 'Completed'
  }
];

// Mock data for Payment Out history
const mockPaymentOutHistory = [
  {
    id: 1,
    payoutId: 'PAY-000001',
    payoutDate: '2023-01-15',
    artistName: 'Ayomide Ibrahim Balogun',
    paymentAmount: 500,
    paymentType: 'Payout',
    paymentStatus: 'Completed'
  },
  {
    id: 2,
    payoutId: 'PAY-000002',
    payoutDate: '2023-01-20',
    artistName: 'Jane Smith',
    paymentAmount: 300,
    paymentType: 'Payout',
    paymentStatus: 'Completed'
  },
  {
    id: 3,
    payoutId: 'PAY-000003',
    payoutDate: '2023-02-05',
    artistName: 'Robert Johnson',
    paymentAmount: 200,
    paymentType: 'Payout',
    paymentStatus: 'Completed'
  },
  {
    id: 4,
    payoutId: 'PAY-000004',
    payoutDate: '2023-02-10',
    artistName: 'Emily White',
    paymentAmount: 150,
    paymentType: 'Payout',
    paymentStatus: 'Completed'
  },
  {
    id: 5,
    payoutId: 'PAY-000005',
    payoutDate: '2023-03-03',
    artistName: 'Michael Brown',
    paymentAmount: 550,
    paymentType: 'Payout',
    paymentStatus: 'Completed'
  },
  {
    id: 6,
    payoutId: 'PAY-000006',
    payoutDate: '2023-02-10',
    artistName: 'Adekunle Gold',
    paymentAmount: 210,
    paymentType: 'Payout',
    paymentStatus: 'Completed'
  },
  {
    id: 7,
    payoutId: 'PAY-000007',
    payoutDate: '2023-03-12',
    artistName: 'Simisola Adekunle',
    paymentAmount: 400,
    paymentType: 'Payout',
    paymentStatus: 'Completed'
  },
  {
    id: 8,
    payoutId: 'PAY-000008',
    payoutDate: '2023-04-02',
    artistName: 'Adesua Walington',
    paymentAmount: 180,
    paymentType: 'Payout',
    paymentStatus: 'Completed'
  },
  {
    id: 9,
    payoutId: 'PAY-000009',
    payoutDate: '2023-04-08',
    artistName: 'Bella Shrumda',
    paymentAmount: 500,
    paymentType: 'Payout',
    paymentStatus: 'Completed'
  }
];

// Mock data for Payment from Agent history
const mockPaymentAgentHistory = [
  {
    id: 1,
    paymentId: 'PAY-000001',
    paymentDate: '2023-01-15',
    paymentType: 'Artist Subscription',
    paymentAmount: 500,
    payerEmail: 'Johndoe@gmail.com',
    agentName: 'Agent Danjuma',
    paymentStatus: 'Completed'
  },
  {
    id: 2,
    paymentId: 'PAY-000002',
    paymentDate: '2023-01-20',
    paymentType: 'Listener Subscription',
    paymentAmount: 300,
    payerEmail: 'Johndoe@gmail.com',
    agentName: 'Agent Danladi',
    paymentStatus: 'Completed'
  },
  {
    id: 3,
    paymentId: 'PAY-000003',
    paymentDate: '2023-02-05',
    paymentType: 'Promotion',
    paymentAmount: 200,
    payerEmail: 'Johndoe@gmail.com',
    agentName: 'Agent Ganna',
    paymentStatus: 'Completed'
  },
  {
    id: 4,
    paymentId: 'PAY-000004',
    paymentDate: '2023-02-10',
    paymentType: 'Advertising',
    paymentAmount: 150,
    payerEmail: 'Johndoe@gmail.com',
    agentName: 'Agent Kolo',
    paymentStatus: 'Completed'
  },
  {
    id: 5,
    paymentId: 'PAY-000005',
    paymentDate: '2023-03-03',
    paymentType: 'Artist Subscription',
    paymentAmount: 550,
    payerEmail: 'Johndoe@gmail.com',
    agentName: 'Agent Nma',
    paymentStatus: 'Completed'
  },
  {
    id: 6,
    paymentId: 'PAY-000006',
    paymentDate: '2023-02-10',
    paymentType: 'Listener Subscription',
    paymentAmount: 210,
    payerEmail: 'Johndoe@gmail.com',
    agentName: 'Agent Ndagi',
    paymentStatus: 'Completed'
  },
  {
    id: 7,
    paymentId: 'PAY-000007',
    paymentDate: '2023-03-12',
    paymentType: 'Promotion',
    paymentAmount: 400,
    payerEmail: 'Johndoe@gmail.com',
    agentName: 'Agent Danganna',
    paymentStatus: 'Completed'
  },
  {
    id: 8,
    paymentId: 'PAY-000008',
    paymentDate: '2023-04-02',
    paymentType: 'Advertising',
    paymentAmount: 180,
    payerEmail: 'Johndoe@gmail.com',
    agentName: 'Agent Halima',
    paymentStatus: 'Completed'
  },
  {
    id: 9,
    paymentId: 'PAY-000009',
    paymentDate: '2023-04-08',
    paymentType: 'Artist Subscription',
    paymentAmount: 500,
    payerEmail: 'Johndoe@gmail.com',
    agentName: 'Agent Sule',
    paymentStatus: 'Completed'
  }
];

const PaymentManagement = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'payment-in' | 'payment-out' | 'payment-agents'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState('February');
  const [selectedYear, setSelectedYear] = useState('2023');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatCurrencyCompact = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}k`;
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
              <span className="text-white text-xl font-bold">AsraMusic</span>
            </div>
            <div className="flex items-center space-x-2 text-asra-gray-400">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">03/02/2023</span>
            </div>
          </div>

          {/* Center - Title */}
          <div className="flex-1 flex justify-center">
            <h1 className="text-2xl font-bold text-white">Payment</h1>
          </div>

          {/* Right side - Search and Profile */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-asra-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-asra-gray-800 text-white pl-10 pr-4 py-2 rounded-lg border border-asra-gray-700 focus:outline-none focus:border-asra-red w-64"
              />
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-asra-red rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-white text-sm">System Admin</span>
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
            Payment Overview
          </button>
          <button
            onClick={() => setActiveTab('payment-in')}
            className={`pb-2 text-lg font-medium border-b-2 transition-colors ${
              activeTab === 'payment-in'
                ? 'text-asra-red border-asra-red'
                : 'text-asra-gray-400 border-transparent hover:text-white'
            }`}
          >
            Payment In
          </button>
          <button
            onClick={() => setActiveTab('payment-out')}
            className={`pb-2 text-lg font-medium border-b-2 transition-colors ${
              activeTab === 'payment-out'
                ? 'text-asra-red border-asra-red'
                : 'text-asra-gray-400 border-transparent hover:text-white'
            }`}
          >
            Payment Out
          </button>
          <button
            onClick={() => setActiveTab('payment-agents')}
            className={`pb-2 text-lg font-medium border-b-2 transition-colors ${
              activeTab === 'payment-agents'
                ? 'text-asra-red border-asra-red'
                : 'text-asra-gray-400 border-transparent hover:text-white'
            }`}
          >
            Payment In From Agents
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
                          <option value="January">January</option>
                          <option value="February">February</option>
                          <option value="March">March</option>
                          <option value="April">April</option>
                          <option value="May">May</option>
                          <option value="June">June</option>
                          <option value="July">July</option>
                          <option value="August">August</option>
                          <option value="September">September</option>
                          <option value="October">October</option>
                          <option value="November">November</option>
                          <option value="December">December</option>
                        </select>
                      </div>
                      <div className="text-asra-gray-400 text-sm">Total Monthly Revenue</div>
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
                      <div className="text-asra-gray-400 text-sm">Total Annual Revenue</div>
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
                      <div className="text-asra-gray-400 text-sm">Earnings from Subscription</div>
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
                      <div className="text-asra-gray-400 text-sm">Outstanding Balances</div>
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
                      <div className="text-asra-gray-400 text-sm">Earnings from Artists</div>
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
                      <div className="text-asra-gray-400 text-sm">Total Payouts to Artists</div>
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
                      <div className="text-asra-gray-400 text-sm">Subscription from Agents</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment History */}
            <div className="bg-asra-gray-900 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Payment History</h3>
                <button className="text-asra-red hover:text-red-400 text-sm font-medium">
                  See all
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-asra-gray-800">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                        S/N
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                        Transaction ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                        Transaction Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                        Payment Type
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                        Payment Amount
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                        Payment Source/Description
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                        Payment Status
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
                    <span>Previous</span>
                  </button>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="bg-asra-red text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors flex items-center space-x-2"
                  >
                    <span>Next</span>
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
                  <h3 className="text-xl font-bold text-white">Payment In</h3>
                  <button className="text-asra-red hover:text-red-400 text-sm font-medium">
                    See all
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-asra-gray-800">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                          S/N
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                          Payment Date
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                          Payment ID
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                          Payment Type
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                          Payment Amount
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                          Payment Source/Description
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                          Payment Status
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
                      <span>Previous</span>
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      className="bg-asra-red text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors flex items-center space-x-2"
                    >
                      <span>Next</span>
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
              <h3 className="text-xl font-bold text-white">Payment Out</h3>
              <button className="text-asra-red hover:text-red-400 text-sm font-medium">
                See all
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-asra-gray-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                      S/N
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                      Payout Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                      Payout ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                      Artist Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                      Payment Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                      Payment Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                      Payment Status
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
                  <span>Previous</span>
                </button>
                <button
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="bg-asra-red text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors flex items-center space-x-2"
                >
                  <span>Next</span>
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
              <h3 className="text-xl font-bold text-white">Payment from Agent</h3>
              <button className="text-asra-red hover:text-red-400 text-sm font-medium">
                See all
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-asra-gray-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                      S/N
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                      Payment Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                      Payment ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                      Payment Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                      Payment Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                      Payer Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                      Payed by (Agent Name)
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                      Payment Status
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
                  <span>Previous</span>
                </button>
                <button
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="bg-asra-red text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors flex items-center space-x-2"
                >
                  <span>Next</span>
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
