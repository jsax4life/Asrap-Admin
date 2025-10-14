import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, User, Plus, Edit, Trash2, Eye } from 'lucide-react';

// Mock data for admin users
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
  {
    id: 3,
    name: 'Dries Vints',
    role: 'Support Admin',
    lastLogin: '10/02/2023 9.00AM',
    email: 'dries@gmail.com',
    avatar: 'https://api.builder.io/api/v1/image/assets/TEMP/77784d2e1616758f6b0d5b70a64186f75a3b7ce5?width=75',
    status: 'Active',
    createdAt: '2023-02-01',
  },
  {
    id: 4,
    name: 'Ian Landsman',
    role: 'Support Admin',
    lastLogin: '10/02/2023 9.00AM',
    email: 'ian@gmail.com',
    avatar: 'https://api.builder.io/api/v1/image/assets/TEMP/77784d2e1616758f6b0d5b70a64186f75a3b7ce5?width=75',
    status: 'Active',
    createdAt: '2023-02-10',
  },
  {
    id: 5,
    name: 'Mohamed Sahad',
    role: 'Approver',
    lastLogin: '10/02/2023 9.00AM',
    email: 'sahad@gmail.com',
    avatar: 'https://api.builder.io/api/v1/image/assets/TEMP/77784d2e1616758f6b0d5b70a64186f75a3b7ce5?width=75',
    status: 'Active',
    createdAt: '2023-02-15',
  },
];

// Mock data for payment agents
const mockPaymentAgents = [
  {
    id: 1,
    name: 'Agent Danjuma',
    role: 'Payment Agent',
    email: 'danjuma@asramusic.com',
    lastLogin: '10/02/2023 8.30AM',
    status: 'Active',
    totalTransactions: 1250,
    commission: '$2,500',
    createdAt: '2023-01-01',
  },
  {
    id: 2,
    name: 'Agent Danladi',
    role: 'Payment Agent',
    email: 'danladi@asramusic.com',
    lastLogin: '10/02/2023 8.45AM',
    status: 'Active',
    totalTransactions: 980,
    commission: '$1,960',
    createdAt: '2023-01-05',
  },
  {
    id: 3,
    name: 'Agent Ganna',
    role: 'Senior Payment Agent',
    email: 'ganna@asramusic.com',
    lastLogin: '10/02/2023 9.15AM',
    status: 'Active',
    totalTransactions: 750,
    commission: '$1,500',
    createdAt: '2023-01-10',
  },
  {
    id: 4,
    name: 'Agent Kolo',
    role: 'Payment Agent',
    email: 'kolo@asramusic.com',
    lastLogin: '10/02/2023 9.30AM',
    status: 'Active',
    totalTransactions: 1100,
    commission: '$2,200',
    createdAt: '2023-01-15',
  },
  {
    id: 5,
    name: 'Agent Nma',
    role: 'Payment Agent',
    email: 'nma@asramusic.com',
    lastLogin: '10/02/2023 9.45AM',
    status: 'Active',
    totalTransactions: 850,
    commission: '$1,700',
    createdAt: '2023-01-20',
  },
];

const AdminUsers = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'users' | 'payment-agents'>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleEditUser = (userId: number) => {
    console.log('Edit user:', userId);
    // TODO: Implement edit user functionality
  };

  const handleDeleteUser = (userId: number) => {
    console.log('Delete user:', userId);
    // TODO: Implement delete user functionality
  };

  const handleViewUser = (userId: number) => {
    navigate(`/admin-users/view/${userId}`);
  };

  const handleNewUser = () => {
    navigate('/admin-users/create');
  };

  const filteredUsers = mockAdminUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAgents = mockPaymentAgents.filter(agent =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentData = activeTab === 'users' ? filteredUsers : filteredAgents;
  const totalPages = Math.ceil(currentData.length / itemsPerPage);
  const currentItems = currentData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-asra-dark text-white">
      {/* Header */}
      <div className="bg-asra-dark border-b border-asra-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and Date */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-asra-red rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-white text-xl font-bold">AsraMusic</span>
            </div>
            <div className="flex items-center space-x-2 text-asra-gray-400">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">03/02/2023</span>
            </div>
          </div>

          {/* Center - Search Bar */}
          <div className="flex-1 flex justify-center">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-asra-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-asra-gray-800 border border-asra-gray-700 rounded-lg text-white placeholder:text-asra-gray-400 focus:outline-none focus:border-asra-red"
              />
            </div>
          </div>

          {/* Right side - New User Button and Profile */}
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

      {/* Main Content */}
      <div className="p-6">
        {/* Page Title */}
        <h1 className="text-2xl font-bold text-white mb-8">Asra Playlist Manager</h1>

        {/* Tabs */}
        <div className="flex space-x-8 mb-8 border-b border-asra-gray-700">
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-3 text-lg font-medium border-b-2 transition-colors ${
              activeTab === 'users'
                ? 'text-asra-red border-asra-red'
                : 'text-asra-gray-400 border-transparent hover:text-white'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('payment-agents')}
            className={`pb-3 text-lg font-medium border-b-2 transition-colors ${
              activeTab === 'payment-agents'
                ? 'text-asra-red border-asra-red'
                : 'text-asra-gray-400 border-transparent hover:text-white'
            }`}
          >
            Payment Agent
          </button>
        </div>

        {/* Table */}
        <div className="bg-asra-gray-900 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-asra-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                    S/N
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                    Last Log In
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  {activeTab === 'payment-agents' && (
                    <>
                      <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                        Total Transactions
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                        Commission
                      </th>
                    </>
                  )}
                  <th className="px-6 py-4 text-left text-xs font-medium text-asra-gray-300 uppercase tracking-wider">
                    Manage
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-asra-gray-800">
                {currentItems.map((item, index) => (
                  <tr key={item.id} className="hover:bg-asra-gray-800 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-asra-gray-300">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.avatar}
                          alt={item.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="text-sm font-medium text-white">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-asra-gray-300">
                      {item.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-asra-gray-300">
                      {item.lastLogin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-asra-gray-300">
                      {item.email}
                    </td>
                    {activeTab === 'payment-agents' && 'totalTransactions' in item && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-asra-gray-300">
                          {item.totalTransactions.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-asra-gray-300">
                          {item.commission}
                        </td>
                      </>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditUser(item.id)}
                          className="text-asra-gray-400 hover:text-white transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(item.id)}
                          className="text-asra-gray-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleViewUser(item.id)}
                          className="bg-asra-red hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="bg-asra-red text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="bg-asra-red text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="text-asra-gray-400 text-sm">
            Page {currentPage} of {totalPages}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
