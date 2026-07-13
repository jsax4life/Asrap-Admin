import { useState } from 'react';
import { Menu } from 'lucide-react';
import { AgentSidebar } from '@/components/agent/AgentSidebar';
import { AgentPreviewBanner } from '@/components/agent/AgentPreviewBanner';
import { useAuth } from '@/hooks/useAuth';

interface AgentLayoutProps {
  children: React.ReactNode;
}

export const AgentLayout = ({ children }: AgentLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-asra-dark flex">
      <AgentSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
      />

      <main className="flex-1 lg:ml-[315px]">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-30 p-2 bg-asra-gray-1 rounded-lg text-white"
        >
          <Menu className="w-6 h-6" />
        </button>
        <AgentPreviewBanner />
        {children}
      </main>
    </div>
  );
};
