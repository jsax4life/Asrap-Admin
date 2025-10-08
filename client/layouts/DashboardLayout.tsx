import { ReactNode, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import { useAuth } from '@/hooks/useAuth';
import { User } from '@/types';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  // TEMPORARY: Mock user for development when backend is not ready
  const mockUser: User = {
    id: '1',
    email: 'admin@asramusic.com',
    name: 'System Admin',
    role: 'super_admin',
    avatar: 'https://api.builder.io/api/v1/image/assets/TEMP/77784d2e1616758f6b0d5b70a64186f75a3b7ce5?width=75',
    isActive: true,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  };

  // Use mock user if no real user is available
  const currentUser = user || mockUser;

  return (
    <div className="min-h-screen bg-asra-dark flex">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        user={currentUser}
      />
      
      <main className="flex-1 lg:ml-[315px] p-4 sm:p-6 lg:p-16">
        <DashboardHeader 
          onMenuClick={() => setSidebarOpen(true)}
          user={currentUser}
        />
        
        <div className="mt-8">
          {children}
        </div>
      </main>
    </div>
  );
};
