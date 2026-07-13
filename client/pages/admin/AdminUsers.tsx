import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Calendar, User, Plus, Edit, Trash2, Eye, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { adminAgentService, PaymentAgentListItem } from '@/services/adminAgentService';

// Mock data for admin users (non-agent staff — API wiring pending)
const mockAdminUsers = [
  {
    id: 1,
    name: 'Bashir Muhammad',
    role: 'Support Admin',
    lastLogin: '10/02/2023 9.00AM',
    email: 'bashirmuhammad@gmail.com',
    avatar: 'https://api.builder.io/api/v1/image/assets/TEMP/77784d2e1616758f6b0d5b70a64186f75a3b7ce5?width=75',
    status: 'Active',
    createdAt: '2023-01-15',
  },
  {
    id: 2,
    name: 'Jess Archer',
    role: 'Support Admin',
    lastLogin: '10/02/2023 9.00AM',
    email: 'jess@gmail.com',
    avatar: 'https://api.builder.io/api/v1/image/assets/TEMP/77784d2e1616758f6b0d5b70a64186f75a3b7ce5?width=75',
    status: 'Active',
    createdAt: '2023-01-20',
  },
];

function formatLastLogin(date?: string | null) {
  if (!date) return 'Never';
  return new Date(date).toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function AgentAvatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="w-8 h-8 rounded-full bg-asra-red/30 flex items-center justify-center text-xs font-bold text-white">
      {initials}
    </div>
  );
}

const AdminUsers = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'payment-agents' ? 'payment-agents' : 'users';

  const [activeTab, setActiveTab] = useState<'users' | 'payment-agents'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [paymentAgents, setPaymentAgents] = useState<PaymentAgentListItem[]>([]);
  const [agentsLoading, setAgentsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (activeTab !== 'payment-agents') return;

    setAgentsLoading(true);
    adminAgentService
      .listPaymentAgents({ search: searchQuery || undefined, page: currentPage, limit: itemsPerPage })
      .then(({ agents, pagination }) => {
        setPaymentAgents(agents);
        setTotalPages(pagination.totalPages || 1);
      })
      .catch((err: Error) => toast.error(err.message))
      .finally(() => setAgentsLoading(false));
  }, [activeTab, searchQuery, currentPage]);

  const handleTabChange = (tab: 'users' | 'payment-agents') => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSearchQuery('');
    if (tab === 'payment-agents') {
      setSearchParams({ tab: 'payment-agents' });
    } else {
      setSearchParams({});
    }
  };

  const handleEditUser = (userId: string | number) => {
    console.log('Edit user:', userId);
  };

  const handleDeleteUser = (userId: string | number) => {
    console.log('Delete user:', userId);
  };

  const handleViewUser = (userId: string | number) => {
    navigate(`/admin-users/view/${userId}`);
  };

  const handleNewUser = () => {
    navigate('/admin-users/create');
  };

  const filteredUsers = mockAdminUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentUserItems = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const userTotalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const displayTotalPages = activeTab === 'users' ? userTotalPages : totalPages;

  return (
    <div className="min-h-screen bg-asra-dark text-white">
      <div className="bg-asra-dark border-b border-asra-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-asra-red rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-white text-xl font-bold">Asrapa</span>
            </div>
            <div className="flex items-center space-x-2 text-asra-gray-400">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">{new Date().toLocaleDateString('en-GB')}</span>
            </div>
          </div>

          <div className="flex-1 flex justify-center">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-asra-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name or email"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 bg-asra-gray-800 border border-asra-gray-700 rounded-lg text-white placeholder:text-asra-gray-400 focus:outline-none focus:border-asra-red"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={handleNewUser}
              className="bg-asra-red hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>New User</span>
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-asra-red rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-white text-sm">System Admin</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-8">Admin Users</h1>

        <div className="flex space-x-8 mb-8 border-b border-asra-gray-700">
          <button
            onClick={() => handleTabChange('users')}
            className={`pb-3 text-lg font-medium border-b-2 transition-colors ${
              activeTab === 'users'
                ? 'text-asra-red border-asra-red'
                : 'text-asra-gray-400 border-transparent hover:text-white'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => handleTabChange('payment-agents')}
            className={`pb-3 text-lg font-medium border-b-2 transition-colors ${
              activeTab === 'payment-agents'
                ? 'text-asra-red border-asra-red'
                : 'text-asra-gray-400 border-transparent hover:text-white'
            }`}
          >
            Payment Agent
          </button>
        </div>

        <div className="bg-asra-gray-900 rounded-lg overflow-hidden">
          {agentsLoading && activeTab === 'payment-agents' ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 text-asra-red animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-asra-gray-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">S/N</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">Last Log In</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">Email</th>
                    {activeTab === 'payment-agents' && (
                      <>
                        <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">Password</th>
                      </>
                    )}
                    <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">Manage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-asra-gray-800">
                  {activeTab === 'users' &&
                    currentUserItems.map((item, index) => (
                      <tr key={item.id} className="hover:bg-asra-gray-800 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-asra-gray-300">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <img src={item.avatar} alt={item.name} className="w-8 h-8 rounded-full object-cover" />
                            <span className="text-sm font-medium text-white">{item.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-asra-gray-300">{item.role}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-asra-gray-300">{item.lastLogin}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-asra-gray-300">{item.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button onClick={() => handleEditUser(item.id)} className="text-asra-gray-400 hover:text-white">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDeleteUser(item.id)} className="text-asra-gray-400 hover:text-red-400">
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleViewUser(item.id)}
                              className="bg-asra-red hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium"
                            >
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                  {activeTab === 'payment-agents' &&
                    paymentAgents.map((agent, index) => (
                      <tr key={agent.id} className="hover:bg-asra-gray-800 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-asra-gray-300">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <AgentAvatar name={agent.name} />
                            <span className="text-sm font-medium text-white">{agent.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-asra-gray-300">{agent.role}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-asra-gray-300">
                          {formatLastLogin(agent.lastLoginAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-asra-gray-300">{agent.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              agent.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                            }`}
                          >
                            {agent.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              agent.mustChangePassword
                                ? 'bg-amber-500/20 text-amber-400'
                                : 'bg-asra-gray-2 text-asra-gray-6'
                            }`}
                          >
                            {agent.mustChangePassword ? 'Must change' : 'Set'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleViewUser(agent.id)}
                              className="bg-asra-red hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium"
                            >
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                  {activeTab === 'payment-agents' && !agentsLoading && paymentAgents.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-asra-gray-400">
                        No payment agents yet. Click <strong className="text-white">New User</strong> to create one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-6">
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="bg-asra-red text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(displayTotalPages, prev + 1))}
              disabled={currentPage === displayTotalPages || displayTotalPages === 0}
              className="bg-asra-red text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="text-asra-gray-400 text-sm">
            Page {currentPage} of {Math.max(displayTotalPages, 1)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
