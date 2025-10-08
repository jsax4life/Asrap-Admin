import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MusicApprovalSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { action, songName, artistName } = location.state || {
    action: 'approved',
    songName: 'Unknown Song',
    artistName: 'Unknown Artist'
  };

  const isApproved = action === 'approved';

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto">
        {/* Success Icon */}
        <div className="mb-8">
          <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center ${
            isApproved ? 'bg-green-500' : 'bg-red-500'
          }`}>
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Success Message */}
        <div className="space-y-4 mb-8">
          <h1 className="text-3xl font-bold text-white">
            {isApproved ? 'Music Approved!' : 'Music Declined!'}
          </h1>
          
          <div className="text-asra-gray-6">
            <p className="text-lg">
              <span className="text-white font-semibold">"{songName}"</span>
            </p>
            <p className="text-sm">
              by <span className="text-white font-medium">{artistName}</span>
            </p>
          </div>

          <p className="text-asra-gray-6 text-sm">
            {isApproved 
              ? 'The music has been successfully approved and will be available on the platform.'
              : 'The music has been declined and the artist will be notified with your feedback.'
            }
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate('/music-upload')}
            variant="outline"
            className="border-asra-gray-5 text-white hover:bg-asra-gray-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Uploads
          </Button>
          
          <Button
            onClick={() => navigate('/dashboard')}
            className="bg-asra-red hover:bg-asra-red/90 text-white"
          >
            <Home className="w-4 h-4 mr-2" />
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
