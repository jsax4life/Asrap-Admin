import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Upload, UserCheck, Mail, Phone, Shield, Loader2, RefreshCw, Copy } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { adminAgentService } from '@/services/adminAgentService';
import { generateTemporaryPassword } from '@/lib/password';

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
    temporaryPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isPaymentAgent = formData.userType === 'Payment Agent';

  const userTypeOptions = [
    'Admin User',
    'Payment Agent',
    'Support Staff',
    'Moderator',
    'Analyst',
  ];

  const userTypeLabels: Record<string, string> = {
    'Admin User': 'Utilisateur administrateur',
    'Payment Agent': 'Agent de paiement',
    'Support Staff': 'Personnel de support',
    'Moderator': 'Modérateur',
    'Analyst': 'Analyste',
  };

  const accessLevelOptions = [
    'Super Admin',
    'Admin',
    'Moderator',
    'Analyst',
    'Viewer',
  ];

  const accessLevelLabels: Record<string, string> = {
    'Super Admin': 'Super administrateur',
    'Admin': 'Administrateur',
    'Moderator': 'Modérateur',
    'Analyst': 'Analyste',
    'Viewer': 'Lecteur',
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'userType' && value === 'Payment Agent') {
        next.role = 'payment_agent';
        next.accessLevel = 'Payment Agent';
      }
      return next;
    });
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

    if (!formData.userType) newErrors.userType = 'Le type d\'utilisateur est requis';
    if (!formData.email) newErrors.email = 'L\'e-mail est requis';
    if (!formData.role) newErrors.role = 'Le rôle est requis';
    if (!formData.name) newErrors.name = 'Le nom est requis';
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Le numéro de téléphone est requis';
    if (!isPaymentAgent && !formData.accessLevel) newErrors.accessLevel = 'Le niveau d\'accès est requis';
    if (isPaymentAgent && !formData.temporaryPassword) {
      newErrors.temporaryPassword = 'Le mot de passe temporaire est requis pour les agents';
    }
    if (isPaymentAgent && formData.temporaryPassword && formData.temporaryPassword.length < 8) {
      newErrors.temporaryPassword = 'Le mot de passe temporaire doit comporter au moins 8 caractères';
    }

    // Validation de l'e-mail
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Veuillez saisir une adresse e-mail valide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGeneratePassword = () => {
    const password = generateTemporaryPassword();
    handleInputChange('temporaryPassword', password);
    toast.success('Mot de passe temporaire généré');
  };

  const handleCopyPassword = async () => {
    if (!formData.temporaryPassword) return;
    await navigator.clipboard.writeText(formData.temporaryPassword);
    toast.success('Mot de passe copié dans le presse-papiers');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (isPaymentAgent) {
      const nameParts = formData.name.trim().split(/\s+/);
      const firstName = nameParts[0] || formData.name;
      const lastName = nameParts.slice(1).join(' ') || firstName;

      setIsSubmitting(true);
      try {
        await adminAgentService.createPaymentAgent({
          firstName,
          lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          role: 'payment_agent',
          temporaryPassword: formData.temporaryPassword,
          department: 'field_agents',
        });
        toast.success('Agent de paiement créé. Partagez le mot de passe temporaire en toute sécurité avec l\'agent.');
        navigate('/admin-users?tab=payment-agents');
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Échec de la création de l\'agent de paiement';
        toast.error(message);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    console.log('Creating user:', formData);
    navigate('/admin-users');
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
              <span className="text-white text-xl font-bold">Asrapa</span>
            </div>
            <div className="flex items-center space-x-2 text-asra-gray-400">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Date : 03/02/2023</span>
            </div>
          </div>

          {/* Center - Page Title */}
          <div className="flex-1 flex justify-center">
            <h1 className="text-2xl font-bold text-white">Utilisateurs administrateurs</h1>
          </div>

          {/* Right side - Profile */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-asra-red rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-white text-sm">Administrateur système</span>
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
          <span>Retour à la liste des utilisateurs administrateurs</span>
        </button>

        {/* Form Title */}
        <h2 className="text-3xl font-bold text-white mb-8">Créer de nouveaux utilisateurs</h2>

        {/* Avatar Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-24 h-24 bg-asra-gray-800 rounded-full flex items-center justify-center border-2 border-asra-gray-700">
                {formData.avatar ? (
                  <img
                    src={URL.createObjectURL(formData.avatar)}
                    alt="Aperçu de l'avatar"
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
                Choisir un avatar <span className="text-asra-red">*</span>
              </label>
              <p className="text-asra-gray-400 text-sm mt-1">
                Cliquez sur l'avatar pour téléverser une nouvelle image
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
                  Type d'utilisateur <span className="text-asra-red">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.userType}
                    onChange={(e) => handleInputChange('userType', e.target.value)}
                    className={`w-full px-4 py-3 bg-asra-gray-800 border rounded-lg text-white focus:outline-none focus:border-asra-red ${
                      errors.userType ? 'border-red-500' : 'border-asra-gray-700'
                    }`}
                  >
                    <option value="" className="text-asra-gray-400 bg-asra-gray-800">Sélectionner...</option>
                    {userTypeOptions.map((option) => (
                      <option key={option} value={option} className="text-white bg-asra-gray-800">
                        {userTypeLabels[option] || option}
                      </option>
                    ))}
                  </select>
                  <UserCheck className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-asra-gray-400 pointer-events-none" />
                </div>
                {errors.userType && (
                  <p className="text-red-500 text-sm mt-1">{errors.userType}</p>
                )}
                {isPaymentAgent && (
                  <p className="text-asra-gray-400 text-sm mt-2">
                    Les agents de paiement ne peuvent pas s'auto-inscrire. Ils se connectent avec le mot de passe
                    temporaire défini ici et doivent le changer dès la première connexion avant d'utiliser le portail agent.
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  E-mail <span className="text-asra-red">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Entrez l'adresse e-mail"
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
                  Rôle <span className="text-asra-red">*</span>
                </label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  placeholder="Entrez le rôle"
                  readOnly={isPaymentAgent}
                  className={`w-full px-4 py-3 bg-asra-gray-800 border rounded-lg text-white placeholder:text-asra-gray-400 focus:outline-none focus:border-asra-red ${
                    errors.role ? 'border-red-500' : 'border-asra-gray-700'
                  } ${isPaymentAgent ? 'opacity-70 cursor-not-allowed' : ''}`}
                />
                {errors.role && (
                  <p className="text-red-500 text-sm mt-1">{errors.role}</p>
                )}
              </div>

              {isPaymentAgent && (
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Mot de passe temporaire <span className="text-asra-red">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.temporaryPassword}
                      onChange={(e) => handleInputChange('temporaryPassword', e.target.value)}
                      placeholder="L'agent le changera à la première connexion"
                      className={`flex-1 px-4 py-3 bg-asra-gray-800 border rounded-lg text-white placeholder:text-asra-gray-400 focus:outline-none focus:border-asra-red font-mono ${
                        errors.temporaryPassword ? 'border-red-500' : 'border-asra-gray-700'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={handleGeneratePassword}
                      className="px-4 py-3 bg-asra-gray-800 border border-asra-gray-700 rounded-lg text-white hover:border-asra-red transition-colors flex items-center gap-2 whitespace-nowrap"
                      title="Générer un mot de passe"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Générer
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyPassword}
                      disabled={!formData.temporaryPassword}
                      className="px-4 py-3 bg-asra-gray-800 border border-asra-gray-700 rounded-lg text-white hover:border-asra-red transition-colors disabled:opacity-50"
                      title="Copier le mot de passe"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  {errors.temporaryPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.temporaryPassword}</p>
                  )}
                  <p className="text-asra-gray-400 text-sm mt-1">
                    Cliquez sur Générer pour un mot de passe sécurisé. Partagez-le avec l'agent — il ne sera plus affiché ensuite.
                  </p>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Nom de l'utilisateur <span className="text-asra-red">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Entrez le nom"
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
                  Numéro de téléphone <span className="text-asra-red">*</span>
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
              {!isPaymentAgent && (
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Niveau d'accès <span className="text-asra-red">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.accessLevel}
                    onChange={(e) => handleInputChange('accessLevel', e.target.value)}
                    className={`w-full px-4 py-3 bg-asra-gray-800 border rounded-lg text-white focus:outline-none focus:border-asra-red ${
                      errors.accessLevel ? 'border-red-500' : 'border-asra-gray-700'
                    }`}
                  >
                    <option value="" className="text-asra-gray-400 bg-asra-gray-800">Sélectionner...</option>
                    {accessLevelOptions.map((option) => (
                      <option key={option} value={option} className="text-white bg-asra-gray-800">
                        {accessLevelLabels[option] || option}
                      </option>
                    ))}
                  </select>
                  <Shield className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-asra-gray-400 pointer-events-none" />
                </div>
                {errors.accessLevel && (
                  <p className="text-red-500 text-sm mt-1">{errors.accessLevel}</p>
                )}
              </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-asra-red hover:bg-red-600 disabled:opacity-60 text-white px-12 py-4 rounded-lg text-lg font-medium transition-colors flex items-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
              {isSubmitting ? 'Création...' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;
