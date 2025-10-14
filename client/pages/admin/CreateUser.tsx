import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Upload, UserCheck, Mail, Phone, Shield } from 'lucide-react';

const CreateUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    avatar: null as File | null,
    userType: '',
    email: '',
    role: '',
    name: '',
    phoneNumber: '',
    accessLevel: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const userTypeOptions = [
    'Admin User',
    'Payment Agent',
    'Support Staff',
    'Moderator',
    'Analyst',
  ];

  const accessLevelOptions = [
    'Super Admin',
    'Admin',
    'Moderator',
    'Analyst',
    'Viewer',
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, avatar: file }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.userType) newErrors.userType = 'User type is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.role) newErrors.role = 'Role is required';
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.accessLevel) newErrors.accessLevel = 'Access level is required';

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Creating user:', formData);
      // TODO: Implement create user API call
      // For now, just navigate back to admin users
      navigate('/admin-users');
    }
  };

  const handleGoBack = () => {
    navigate('/admin-users');
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
        {/* Back Link */}
        <button
          onClick={handleGoBack}
          className="text-asra-red hover:text-red-400 text-sm font-medium mb-6 flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Admin Users list</span>
        </button>

        {/* Form Title */}
        <h2 className="text-3xl font-bold text-white mb-8">Create new users</h2>

        {/* Avatar Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-24 h-24 bg-asra-gray-800 rounded-full flex items-center justify-center border-2 border-asra-gray-700">
                {formData.avatar ? (
                  <img
                    src={URL.createObjectURL(formData.avatar)}
                    alt="Avatar preview"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-asra-gray-400" />
                )}
              </div>
              <input
                type="file"
                id="avatar"
                accept="image/*"
                onChange={handleAvatarChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <div>
              <label htmlFor="avatar" className="text-white text-lg font-medium">
                Choose avatar <span className="text-asra-red">*</span>
              </label>
              <p className="text-asra-gray-400 text-sm mt-1">
                Click on the avatar to upload a new image
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* User Type */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  User Type <span className="text-asra-red">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.userType}
                    onChange={(e) => handleInputChange('userType', e.target.value)}
                    className={`w-full px-4 py-3 bg-asra-gray-800 border rounded-lg text-white focus:outline-none focus:border-asra-red ${
                      errors.userType ? 'border-red-500' : 'border-asra-gray-700'
                    }`}
                  >
                    <option value="" className="text-asra-gray-400 bg-asra-gray-800">Select...</option>
                    {userTypeOptions.map((option) => (
                      <option key={option} value={option} className="text-white bg-asra-gray-800">
                        {option}
                      </option>
                    ))}
                  </select>
                  <UserCheck className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-asra-gray-400 pointer-events-none" />
                </div>
                {errors.userType && (
                  <p className="text-red-500 text-sm mt-1">{errors.userType}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Email <span className="text-asra-red">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter the email address"
                    className={`w-full px-4 py-3 pl-12 bg-asra-gray-800 border rounded-lg text-white placeholder:text-asra-gray-400 focus:outline-none focus:border-asra-red ${
                      errors.email ? 'border-red-500' : 'border-asra-gray-700'
                    }`}
                  />
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-asra-gray-400" />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Role */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Role <span className="text-asra-red">*</span>
                </label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  placeholder="Enter the role"
                  className={`w-full px-4 py-3 bg-asra-gray-800 border rounded-lg text-white placeholder:text-asra-gray-400 focus:outline-none focus:border-asra-red ${
                    errors.role ? 'border-red-500' : 'border-asra-gray-700'
                  }`}
                />
                {errors.role && (
                  <p className="text-red-500 text-sm mt-1">{errors.role}</p>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Name of user <span className="text-asra-red">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter the name"
                  className={`w-full px-4 py-3 bg-asra-gray-800 border rounded-lg text-white placeholder:text-asra-gray-400 focus:outline-none focus:border-asra-red ${
                    errors.name ? 'border-red-500' : 'border-asra-gray-700'
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Phone number <span className="text-asra-red">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    placeholder="+234"
                    className={`w-full px-4 py-3 pl-12 bg-asra-gray-800 border rounded-lg text-white placeholder:text-asra-gray-400 focus:outline-none focus:border-asra-red ${
                      errors.phoneNumber ? 'border-red-500' : 'border-asra-gray-700'
                    }`}
                  />
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-asra-gray-400" />
                </div>
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
                )}
              </div>

              {/* Access Level */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Access Level <span className="text-asra-red">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.accessLevel}
                    onChange={(e) => handleInputChange('accessLevel', e.target.value)}
                    className={`w-full px-4 py-3 bg-asra-gray-800 border rounded-lg text-white focus:outline-none focus:border-asra-red ${
                      errors.accessLevel ? 'border-red-500' : 'border-asra-gray-700'
                    }`}
                  >
                    <option value="" className="text-asra-gray-400 bg-asra-gray-800">Select...</option>
                    {accessLevelOptions.map((option) => (
                      <option key={option} value={option} className="text-white bg-asra-gray-800">
                        {option}
                      </option>
                    ))}
                  </select>
                  <Shield className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-asra-gray-400 pointer-events-none" />
                </div>
                {errors.accessLevel && (
                  <p className="text-red-500 text-sm mt-1">{errors.accessLevel}</p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-8">
            <button
              type="submit"
              className="bg-asra-red hover:bg-red-600 text-white px-12 py-4 rounded-lg text-lg font-medium transition-colors"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;
