import "./global.css";
import "@/lib/i18n";

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
import { AgentLayout } from "@/layouts/AgentLayout";

// Pages
import { Login } from "./pages/auth/Login";
import { ChangePassword } from "./pages/auth/ChangePassword";
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
import Settings from "./pages/settings/Settings";
import GenreManagement from "./pages/genres/GenreManagement";
import AgentDashboard from "./pages/agent/AgentDashboard";
import AgentOnboarding from "./pages/agent/AgentOnboarding";
import OnboardUser from "./pages/agent/OnboardUser";
import OnboardArtist from "./pages/agent/OnboardArtist";
import OnboardAdvertiser from "./pages/agent/OnboardAdvertiser";
import AgentClients from "./pages/agent/AgentClients";
import AgentSubscriptions from "./pages/agent/AgentSubscriptions";
import AgentTransactions from "./pages/agent/AgentTransactions";
import AgentHelp from "./pages/agent/AgentHelp";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

// Components
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import { RoleBasedRedirect } from "@/components/common/RoleBasedRedirect";
import { ADMIN_ROLES, AGENT_ROLES } from "@/lib/roles";

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
        <Route path="/change-password" element={
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        } />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute requiredRoles={ADMIN_ROLES}>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/analytics" element={
          <ProtectedRoute requiredRoles={ADMIN_ROLES}>
            <DashboardLayout>
              <Analytics />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/music-upload" element={
          <ProtectedRoute requiredRoles={ADMIN_ROLES}>
            <CustomLayout>
              <MusicUploadApproval />
            </CustomLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/music-upload/:id" element={
          <ProtectedRoute requiredRoles={ADMIN_ROLES}>
            <CustomLayout>
              <MusicApprovalDetail />
            </CustomLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/music-upload/success" element={
          <ProtectedRoute requiredRoles={ADMIN_ROLES}>
            <CustomLayout>
              <MusicApprovalSuccess />
            </CustomLayout>
          </ProtectedRoute>
        } />

        <Route path="/genre-management" element={
          <ProtectedRoute requiredRoles={ADMIN_ROLES}>
            <CustomLayout>
              <GenreManagement />
            </CustomLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/playlist-management" element={
          <ProtectedRoute requiredRoles={ADMIN_ROLES}>
            <CustomLayout>
              <PlaylistManagement />
            </CustomLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/playlist-management/:id" element={
          <ProtectedRoute requiredRoles={ADMIN_ROLES}>
            <CustomLayout>
              <PlaylistDetail />
            </CustomLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/artist-management" element={
          <ProtectedRoute requiredRoles={ADMIN_ROLES}>
            <CustomLayout>
              <ArtistManagement />
            </CustomLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/artist-management/:id" element={
          <ProtectedRoute requiredRoles={ADMIN_ROLES}>
            <CustomLayout>
              <ArtistDetail />
            </CustomLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/album/:id" element={
          <ProtectedRoute requiredRoles={ADMIN_ROLES}>
            <CustomLayout>
              <AlbumDetail />
            </CustomLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/user-management/:id" element={
          <ProtectedRoute requiredRoles={ADMIN_ROLES}>
            <CustomLayout>
              <UserDetail />
            </CustomLayout>
          </ProtectedRoute>
        } />
        
            <Route path="/payments" element={
              <ProtectedRoute requiredRoles={ADMIN_ROLES}>
                <CustomLayout>
                  <PaymentManagement />
                </CustomLayout>
              </ProtectedRoute>
            } />

            <Route path="/settings" element={
              <ProtectedRoute requiredRoles={ADMIN_ROLES}>
                <CustomLayout>
                  <Settings />
                </CustomLayout>
              </ProtectedRoute>
            } />

            <Route path="/admin-users" element={
              <ProtectedRoute requiredRoles={ADMIN_ROLES}>
                <CustomLayout>
                  <AdminUsers />
                </CustomLayout>
              </ProtectedRoute>
            } />

            <Route path="/admin-users/create" element={
              <ProtectedRoute requiredRoles={ADMIN_ROLES}>
                <CustomLayout>
                  <CreateUser />
                </CustomLayout>
              </ProtectedRoute>
            } />

            <Route path="/admin-users/view/:id" element={
              <ProtectedRoute requiredRoles={ADMIN_ROLES}>
                <CustomLayout>
                  <ViewUser />
                </CustomLayout>
              </ProtectedRoute>
            } />

            <Route path="/admin-users/edit/:id" element={
              <ProtectedRoute requiredRoles={ADMIN_ROLES}>
                <CustomLayout>
                  <EditUser />
                </CustomLayout>
              </ProtectedRoute>
            } />

            <Route path="/help-support" element={
              <ProtectedRoute requiredRoles={ADMIN_ROLES}>
                <CustomLayout>
                  <HelpSupport />
                </CustomLayout>
              </ProtectedRoute>
            } />

            <Route path="/help-support/view/:id" element={
              <ProtectedRoute requiredRoles={ADMIN_ROLES}>
                <CustomLayout>
                  <ViewSupportRequest />
                </CustomLayout>
              </ProtectedRoute>
            } />

            <Route path="/promotion" element={
              <ProtectedRoute requiredRoles={ADMIN_ROLES}>
                <CustomLayout>
                  <PromotionManagement />
                </CustomLayout>
              </ProtectedRoute>
            } />

        {/* Agent App Routes */}
        <Route path="/agent/dashboard" element={
          <ProtectedRoute requiredRoles={AGENT_ROLES}>
            <AgentLayout>
              <AgentDashboard />
            </AgentLayout>
          </ProtectedRoute>
        } />

        <Route path="/agent/onboarding" element={
          <ProtectedRoute requiredRoles={AGENT_ROLES}>
            <AgentLayout>
              <AgentOnboarding />
            </AgentLayout>
          </ProtectedRoute>
        } />

        <Route path="/agent/onboard/user" element={
          <ProtectedRoute requiredRoles={AGENT_ROLES}>
            <AgentLayout>
              <OnboardUser />
            </AgentLayout>
          </ProtectedRoute>
        } />

        <Route path="/agent/onboard/artist" element={
          <ProtectedRoute requiredRoles={AGENT_ROLES}>
            <AgentLayout>
              <OnboardArtist />
            </AgentLayout>
          </ProtectedRoute>
        } />

        <Route path="/agent/onboard/advertiser" element={
          <ProtectedRoute requiredRoles={AGENT_ROLES}>
            <AgentLayout>
              <OnboardAdvertiser />
            </AgentLayout>
          </ProtectedRoute>
        } />

        <Route path="/agent/clients" element={
          <ProtectedRoute requiredRoles={AGENT_ROLES}>
            <AgentLayout>
              <AgentClients />
            </AgentLayout>
          </ProtectedRoute>
        } />

        <Route path="/agent/subscriptions" element={
          <ProtectedRoute requiredRoles={AGENT_ROLES}>
            <AgentLayout>
              <AgentSubscriptions />
            </AgentLayout>
          </ProtectedRoute>
        } />

        <Route path="/agent/transactions" element={
          <ProtectedRoute requiredRoles={AGENT_ROLES}>
            <AgentLayout>
              <AgentTransactions />
            </AgentLayout>
          </ProtectedRoute>
        } />

        <Route path="/agent/help" element={
          <ProtectedRoute requiredRoles={AGENT_ROLES}>
            <AgentLayout>
              <AgentHelp />
            </AgentLayout>
          </ProtectedRoute>
        } />

        <Route path="/agent" element={<Navigate to="/agent/dashboard" replace />} />

            {/* Redirect root based on role */}
            <Route path="/" element={<RoleBasedRedirect />} />
        
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
