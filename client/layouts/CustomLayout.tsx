import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { User } from '@/types';

interface CustomLayoutProps {
  children: React.ReactNode;
}

export const CustomLayout = ({ children }: CustomLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-asra-dark flex">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        user={mockUser}
      />
      
      <main className="flex-1 lg:ml-[315px]">
        {children}
      </main>
    </div>
  );
};
