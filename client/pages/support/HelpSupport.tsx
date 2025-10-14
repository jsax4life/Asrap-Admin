import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, User, Eye } from 'lucide-react';

// Mock data for support requests
const mockSupportRequests = [
  {
    id: 1,
    sn: 1,
    userType: 'Artist',
    name: 'Adekunle Gold',
    subject: 'Aceess error',
    dateSent: '10/02/2023 9.00AM',
    status: 'Answered',
  },
  {
    id: 2,
    sn: 2,
    userType: 'Artist',
    name: 'Olamide',
    subject: 'Payment error',
    dateSent: '10/02/2023 9.00AM',
    status: 'Answered',
  },
  {
    id: 3,
    sn: 3,
    userType: 'Normal User',
    name: 'Dries Vints',
    subject: 'Download fail',
    dateSent: '10/02/2023 9.00AM',
    status: 'Pending',
  },
  {
    id: 4,
    sn: 4,
    userType: 'Artist',
    name: 'Wizkid',
    subject: 'Aceess error',
    dateSent: '10/02/2023 9.00AM',
    status: 'Answered',
  },
  {
    id: 5,
    sn: 5,
    userType: 'Normal User',
    name: 'Mohamed Sahad',
    subject: 'Aceess error',
    dateSent: '10/02/2023 9.00AM',
    status: 'Answered',
  },
];

const HelpSupport = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'answered' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const getFilteredRequests = () => {
    let filtered = mockSupportRequests;

    // Filter by tab
    if (activeTab === 'answered') {
      filtered = filtered.filter(request => request.status === 'Answered');
    } else if (activeTab === 'pending') {
      filtered = filtered.filter(request => request.status === 'Pending');
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(request =>
        request.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.userType.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const handleViewRequest = (requestId: number) => {
    navigate(`/help-support/view/${requestId}`);
  };

  const getStatusBadge = (status: string) => {
    if (status === 'Answered') {
      return (
        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
          Answered
        </span>
      );
    } else if (status === 'Pending') {
      return (
        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
          Pending
        </span>
      );
    }
    return null;
  };

  const filteredRequests = getFilteredRequests();

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
              <span className="text-sm">Date: 03/02/2023</span>
            </div>
          </div>

          {/* Center - Page Title */}
          <div className="flex-1 flex justify-center">
            <h1 className="text-2xl font-bold text-white">Help & Support</h1>
          </div>

          {/* Right side - Search and Profile */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 px-4 py-2 pl-10 bg-asra-gray-800 border border-asra-gray-700 rounded-lg text-white placeholder:text-asra-gray-400 focus:outline-none focus:border-asra-red"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-asra-gray-400" />
            </div>

            {/* Profile */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-white text-sm">System Admin</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Filter Tabs */}
        <div className="flex space-x-8 mb-6">
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-2 text-lg font-medium transition-colors ${
              activeTab === 'all'
                ? 'text-white border-b-2 border-asra-red'
                : 'text-asra-gray-400 hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab('answered')}
            className={`pb-2 text-lg font-medium transition-colors ${
              activeTab === 'answered'
                ? 'text-white border-b-2 border-asra-red'
                : 'text-asra-gray-400 hover:text-white'
            }`}
          >
            Answered
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`pb-2 text-lg font-medium transition-colors ${
              activeTab === 'pending'
                ? 'text-white border-b-2 border-asra-red'
                : 'text-asra-gray-400 hover:text-white'
            }`}
          >
            Pending
          </button>
        </div>

        {/* Support Requests Table */}
        <div className="bg-asra-gray-900 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-asra-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-asra-gray-300">S/N</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-asra-gray-300">Type of User</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-asra-gray-300">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-asra-gray-300">Subject</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-asra-gray-300">Date Sent</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-asra-gray-300">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-asra-gray-300">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-asra-gray-700">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-asra-gray-800 transition-colors">
                    <td className="px-6 py-4 text-sm text-white">{request.sn}</td>
                    <td className="px-6 py-4 text-sm text-white">{request.userType}</td>
                    <td className="px-6 py-4 text-sm text-white font-medium">{request.name}</td>
                    <td className="px-6 py-4 text-sm text-white">{request.subject}</td>
                    <td className="px-6 py-4 text-sm text-asra-gray-400">{request.dateSent}</td>
                    <td className="px-6 py-4">
                      {getStatusBadge(request.status)}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewRequest(request.id)}
                        className="bg-asra-red hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </button>
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
            <button className="bg-asra-red hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Previous
            </button>
            <button className="bg-asra-red hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Next
            </button>
          </div>
          <div className="text-asra-gray-400 text-sm">
            Page 1
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;
