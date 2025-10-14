import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Printer, Copy, Edit, Trash2 } from 'lucide-react';

// Mock data for user detail
const mockUserDetail = {
  id: 1,
  name: 'Bashir Muhammad',
  userType: 'Admin User',
  email: 'hasmad6806@gmail.com',
  phoneNumber: '+234 7068061724',
  role: 'Support Admin',
  accessLevel: 'Dashboard, Analytics, Help and Support',
  password: 'david@124)(',
  avatar: 'https://api.builder.io/api/v1/image/assets/TEMP/77784d2e1616758f6b0d5b70a64186f75a3b7ce5?width=200',
  status: 'Active',
  lastLogin: '10/02/2023 9.00AM',
  createdAt: '2023-01-15',
};

const ViewUser = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleGoBack = () => {
    navigate('/admin-users');
  };

  const handleEdit = () => {
    navigate(`/admin-users/edit/${id}`);
  };

  const handleDelete = () => {
    console.log('Delete user:', id);
    // TODO: Implement delete user functionality
    // For now, just navigate back
    navigate('/admin-users');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(mockUserDetail.password);
    // TODO: Show success toast
    console.log('Password copied to clipboard');
  };

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
            <h1 className="text-2xl font-bold text-white">Admin Users</h1>
          </div>

          {/* Right side - Profile */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-asra-red rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-white text-sm">System Admin</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 max-w-4xl mx-auto">
        {/* Action Bar */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleGoBack}
            className="text-asra-red hover:text-red-400 text-sm font-medium flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Admin Users list</span>
          </button>
          <button
            onClick={handlePrint}
            className="bg-asra-red hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print</span>
          </button>
        </div>

        {/* User Detail Card */}
        <div className="bg-asra-gray-900 rounded-lg p-8">
          {/* User Profile Header */}
          <div className="flex items-start space-x-6 mb-8">
            <div className="relative">
              <img
                src={mockUserDetail.avatar}
                alt={mockUserDetail.name}
                className="w-24 h-24 rounded-full object-cover border-2 border-asra-red"
              />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-asra-red rounded-full"></div>
            </div>
            <div>
              <h2 className="text-lg font-medium text-asra-gray-300 mb-1">Name of User</h2>
              <h3 className="text-2xl font-bold text-white">{mockUserDetail.name}</h3>
            </div>
          </div>

          {/* User Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-asra-gray-300 mb-2">User Type</label>
              <p className="text-white text-lg">{mockUserDetail.userType}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-asra-gray-300 mb-2">Email</label>
              <p className="text-white text-lg">{mockUserDetail.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-asra-gray-300 mb-2">Phone Number</label>
              <p className="text-white text-lg">{mockUserDetail.phoneNumber}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-asra-gray-300 mb-2">Role</label>
              <p className="text-white text-lg">{mockUserDetail.role}</p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-asra-gray-300 mb-2">Access Level</label>
              <p className="text-white text-lg">{mockUserDetail.accessLevel}</p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-asra-gray-700 mb-8"></div>

          {/* Account Credentials */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Account Credentials</h3>
            <div>
              <label className="block text-sm font-medium text-asra-gray-300 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={mockUserDetail.password}
                  readOnly
                  className="w-full px-4 py-3 bg-asra-gray-800 border border-asra-gray-700 rounded-lg text-white pr-12"
                />
                <button
                  onClick={handleCopyPassword}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-asra-gray-400 hover:text-white transition-colors"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={handleEdit}
              className="bg-asra-red hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Edit className="w-5 h-5" />
              <span>Edit Details</span>
            </button>
            <button
              onClick={handleDelete}
              className="bg-transparent border border-white text-white hover:bg-white hover:text-black px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Trash2 className="w-5 h-5" />
              <span>Delete Account</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewUser;
