import { ReactNode } from 'react';

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
            src="https://api.builder.io/api/v1/image/assets/TEMP/2f1510a347aa5bfec3416f59e81b157d9997dfa5?width=464" 
            alt="AsraMusic" 
            className="w-[232px] h-[52px] mx-auto"
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
