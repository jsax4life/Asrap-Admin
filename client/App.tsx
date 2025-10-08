import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster as HotToaster } from 'react-hot-toast';

// Layouts
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { CustomLayout } from "@/layouts/CustomLayout";

// Pages
import { Login } from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import Analytics from "./pages/analytics/Analytics";
import MusicUploadApproval from "./pages/music-upload/MusicUploadApproval";
import MusicApprovalDetail from "./pages/music-upload/MusicApprovalDetail";
import MusicApprovalSuccess from "./pages/music-upload/MusicApprovalSuccess";
import PlaylistManagement from "./pages/playlist/PlaylistManagement";
import PlaylistDetail from "./pages/playlist/PlaylistDetail";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

// Components
import { ProtectedRoute } from "@/components/common/ProtectedRoute";

// Hooks
import { useTheme } from "@/hooks/useTheme";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const AppRoutes = () => {
  const { theme } = useTheme();

  return (
    <div className={theme}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/analytics" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Analytics />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/music-upload" element={
          <ProtectedRoute>
            <CustomLayout>
              <MusicUploadApproval />
            </CustomLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/music-upload/:id" element={
          <ProtectedRoute>
            <CustomLayout>
              <MusicApprovalDetail />
            </CustomLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/music-upload/success" element={
          <ProtectedRoute>
            <CustomLayout>
              <MusicApprovalSuccess />
            </CustomLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/playlist-management" element={
          <ProtectedRoute>
            <CustomLayout>
              <PlaylistManagement />
            </CustomLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/playlist-management/:id" element={
          <ProtectedRoute>
            <CustomLayout>
              <PlaylistDetail />
            </CustomLayout>
          </ProtectedRoute>
        } />
        
        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Unauthorized */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HotToaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#2B2B2B',
            color: '#fff',
            border: '1px solid #747272',
          },
        }}
      />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
