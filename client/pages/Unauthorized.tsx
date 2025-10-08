import { Shield, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-asra-dark flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <Shield className="w-24 h-24 text-asra-red mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-asra-gray-6">
            You don't have permission to access this page. Please contact your administrator if you believe this is an error.
          </p>
        </div>
        
        <Button
          onClick={() => navigate(-1)}
          className="bg-asra-red hover:bg-asra-red/90 text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      </div>
    </div>
  );
}
