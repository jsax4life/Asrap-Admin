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
import ArtistManagement from "./pages/artists/ArtistManagement";
import ArtistDetail from "./pages/artists/ArtistDetail";
import AlbumDetail from "./pages/artists/AlbumDetail";
import UserDetail from "./pages/artists/UserDetail";
import PaymentManagement from "./pages/payments/PaymentManagement";
import AdminUsers from "./pages/admin/AdminUsers";
import CreateUser from "./pages/admin/CreateUser";
import ViewUser from "./pages/admin/ViewUser";
import EditUser from "./pages/admin/EditUser";
import HelpSupport from "./pages/support/HelpSupport";
import ViewSupportRequest from "./pages/support/ViewSupportRequest";
import PromotionManagement from "./pages/promotion/PromotionManagement";
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
        
        <Route path="/artist-management" element={
          <ProtectedRoute>
            <CustomLayout>
              <ArtistManagement />
            </CustomLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/artist-management/:id" element={
          <ProtectedRoute>
            <CustomLayout>
              <ArtistDetail />
            </CustomLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/album/:id" element={
          <ProtectedRoute>
            <CustomLayout>
              <AlbumDetail />
            </CustomLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/user-management/:id" element={
          <ProtectedRoute>
            <CustomLayout>
              <UserDetail />
            </CustomLayout>
          </ProtectedRoute>
        } />
        
            <Route path="/payments" element={
              <ProtectedRoute>
                <CustomLayout>
                  <PaymentManagement />
                </CustomLayout>
              </ProtectedRoute>
            } />

            <Route path="/admin-users" element={
              <ProtectedRoute>
                <CustomLayout>
                  <AdminUsers />
                </CustomLayout>
              </ProtectedRoute>
            } />

            <Route path="/admin-users/create" element={
              <ProtectedRoute>
                <CustomLayout>
                  <CreateUser />
                </CustomLayout>
              </ProtectedRoute>
            } />

            <Route path="/admin-users/view/:id" element={
              <ProtectedRoute>
                <CustomLayout>
                  <ViewUser />
                </CustomLayout>
              </ProtectedRoute>
            } />

            <Route path="/admin-users/edit/:id" element={
              <ProtectedRoute>
                <CustomLayout>
                  <EditUser />
                </CustomLayout>
              </ProtectedRoute>
            } />

            <Route path="/help-support" element={
              <ProtectedRoute>
                <CustomLayout>
                  <HelpSupport />
                </CustomLayout>
              </ProtectedRoute>
            } />

            <Route path="/help-support/view/:id" element={
              <ProtectedRoute>
                <CustomLayout>
                  <ViewSupportRequest />
                </CustomLayout>
              </ProtectedRoute>
            } />

            <Route path="/promotion" element={
              <ProtectedRoute>
                <CustomLayout>
                  <PromotionManagement />
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
