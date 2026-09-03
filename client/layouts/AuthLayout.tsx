import { ReactNode } from 'react';

import { APP_NAME } from '@/constants';
import asrapaLogo from '@/assets/images/asrapa-logo-white.png';

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-asra-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src={asrapaLogo}
            alt={APP_NAME}
            className="h-24 w-auto object-contain mx-auto"
          />
        </div>
        
        {/* Auth form */}
        <div className="bg-asra-gray-1 rounded-lg p-8 shadow-lg">
          {children}
        </div>
      </div>
    </div>
  );
};
