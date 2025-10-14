import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, User } from 'lucide-react';

// Mock data for a single support request
const mockSupportRequestDetail = {
  id: 1,
  nameOfUser: 'Adekunle Gold',
  typeOfUser: 'Artist',
  subject: 'Access error',
  dateSent: '10/02/2023 9.00AM',
  message: "The mail I got stated I had access to download reports but on logging in, I can't download any report. Please confirm from your end. Thank you.",
  status: 'Answered',
};

const ViewSupportRequest = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [replyMessage, setReplyMessage] = useState('');

  const handleGoBack = () => {
    navigate('/help-support');
  };

  const handleSendReply = () => {
    if (replyMessage.trim()) {
      console.log('Sending reply:', replyMessage);
      // TODO: Implement API call to send reply
      setReplyMessage('');
      alert('Reply sent!');
    }
  };

  const handleResolveRequest = () => {
    console.log('Resolving request:', id);
    // TODO: Implement API call to resolve request
    alert('Request marked as Resolved!');
    navigate('/help-support'); // Go back to list after resolving
  };

  return (
    <div className="min-h-screen bg-asra-dark text-white">
      {/* Header */}
      <div className="bg-asra-dark border-b border-asra-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Back button and Title */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleGoBack}
              className="text-asra-red hover:text-red-400 text-sm font-medium flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Help & Support</span>
            </button>
            <h1 className="text-2xl font-bold text-white">Help & Support</h1>
          </div>

          {/* Right side - Profile */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-white text-sm">System Admin</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 max-w-4xl mx-auto">
        {/* Request Details Card */}
        <div className="bg-asra-gray-900 rounded-lg p-8 mb-8">
          {/* Request Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div>
              <p className="text-asra-gray-400 text-sm font-medium mb-2">Name of User</p>
              <p className="text-white text-lg font-semibold">{mockSupportRequestDetail.nameOfUser}</p>
            </div>
            <div>
              <p className="text-asra-gray-400 text-sm font-medium mb-2">Type of User</p>
              <p className="text-white text-lg font-semibold">{mockSupportRequestDetail.typeOfUser}</p>
            </div>
            <div>
              <p className="text-asra-gray-400 text-sm font-medium mb-2">Subject</p>
              <p className="text-white text-lg font-semibold">{mockSupportRequestDetail.subject}</p>
            </div>
            <div>
              <p className="text-asra-gray-400 text-sm font-medium mb-2">Date sent</p>
              <p className="text-white text-lg font-semibold">{mockSupportRequestDetail.dateSent}</p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-asra-gray-700 mb-8"></div>

          {/* Message Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Message</h2>
            <div className="bg-asra-gray-800 p-6 rounded-lg">
              <p className="text-white text-base leading-relaxed mb-4">
                {mockSupportRequestDetail.message}
              </p>
              {/* Duplicate message as shown in the UI */}
              <p className="text-white text-base leading-relaxed">
                {mockSupportRequestDetail.message}
              </p>
            </div>
          </div>

          {/* Reply Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Reply</h2>
            <div className="relative">
              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Message here"
                className="w-full h-32 bg-asra-gray-800 border border-asra-gray-700 rounded-lg p-4 pr-16 text-white placeholder:text-asra-gray-400 focus:outline-none focus:border-asra-red resize-none"
                style={{ color: 'white' }}
              />
              <button
                onClick={handleSendReply}
                disabled={!replyMessage.trim()}
                className="absolute bottom-4 right-4 bg-asra-red hover:bg-red-600 disabled:bg-asra-gray-600 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors flex items-center space-x-1"
              >
                <Send className="w-4 h-4" />
                <span className="text-sm font-medium">Send</span>
              </button>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-start">
            <button
              onClick={handleResolveRequest}
              className="bg-transparent border border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-asra-dark transition-colors font-medium"
            >
              Resolved
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSupportRequest;
