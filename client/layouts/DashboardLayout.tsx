import { ReactNode, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import { useAuth } from '@/hooks/useAuth';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-asra-dark flex">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        user={user}
      />
      
      <main className="flex-1 lg:ml-[315px] p-4 sm:p-6 lg:p-16">
        <DashboardHeader 
          onMenuClick={() => setSidebarOpen(true)}
          user={user}
        />
        
        <div className="mt-8">
          {children}
        </div>
      </main>
    </div>
  );
};
