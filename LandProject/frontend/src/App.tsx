import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { DashboardLayout } from './components/layout/DashboardLayout';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { HowItWorksPage } from './pages/public/HowItWorksPage';
import { VerificationRulesPage } from './pages/public/VerificationRulesPage';
import { PublicVerifyPage } from './pages/public/PublicVerifyPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { PrivacyPage } from './pages/public/PrivacyPage';
import { TermsPage } from './pages/public/TermsPage';

// User Dashboard Pages
import { DashboardOverviewPage } from './pages/dashboard/DashboardOverviewPage';
import { MyLandsPage } from './pages/dashboard/MyLandsPage';
import { NewLandPage } from './pages/dashboard/NewLandPage';
import { LandDetailPage } from './pages/dashboard/LandDetailPage';
import { MyDocumentsPage } from './pages/dashboard/MyDocumentsPage';
import { UploadDocumentPage } from './pages/dashboard/UploadDocumentPage';
import { VerificationReportsPage } from './pages/dashboard/VerificationReportsPage';
import { TransactionsPage } from './pages/dashboard/TransactionsPage';
import { NewTransactionPage } from './pages/dashboard/NewTransactionPage';
import { FraudAlertsPage } from './pages/dashboard/FraudAlertsPage';
import { ConsentRequestsPage } from './pages/dashboard/ConsentRequestsPage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AuditLogsPage } from './pages/admin/AuditLogsPage';

const PublicLayout: React.FC = () => (
  <div className="min-h-screen flex flex-col bg-slate-50">
    <Navbar />
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <Outlet />
    </main>
    <Footer />
  </div>
);

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const StaffRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  const isStaff = user?.role === 'ADMIN' || user?.role === 'REVIEWER';
  return isStaff ? <>{children}</> : <Navigate to="/dashboard" replace />;
};

export const App: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages with Top Nav & Footer */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/verification-rules" element={<VerificationRulesPage />} />
        <Route path="/verify/:token" element={<PublicVerifyPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
      </Route>

      {/* Citizen Dashboard with Sidebar */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardOverviewPage />} />
        <Route path="lands" element={<MyLandsPage />} />
        <Route path="lands/new" element={<NewLandPage />} />
        <Route path="lands/:id" element={<LandDetailPage />} />
        <Route path="documents" element={<MyDocumentsPage />} />
        <Route path="documents/upload" element={<UploadDocumentPage />} />
        <Route path="verification-reports" element={<VerificationReportsPage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="transactions/new" element={<NewTransactionPage />} />
        <Route path="alerts" element={<FraudAlertsPage />} />
        <Route path="consent-requests" element={<ConsentRequestsPage />} />
      </Route>

      {/* Admin Panel */}
      <Route
        path="/admin"
        element={
          <StaffRoute>
            <DashboardLayout />
          </StaffRoute>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="audit-logs" element={<AuditLogsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
