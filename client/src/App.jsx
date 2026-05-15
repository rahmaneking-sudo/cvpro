import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './store/AuthContext';
import GrainOverlay from './components/ui/GrainOverlay';
import PrivateRoute from './components/auth/PrivateRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import DashboardPage from './pages/DashboardPage';
import TemplateGalleryPage from './pages/TemplateGalleryPage';
import CVEditorPage from './pages/CVEditorPage';
import PortfolioGalleryPage from './pages/PortfolioGalleryPage';
import PortfolioEditorPage from './pages/PortfolioEditorPage';
import MyPurchasesPage from './pages/MyPurchasesPage';
import ComingSoonPage from './pages/ComingSoonPage';
import PublicPortfolioPage from './pages/PublicPortfolioPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import api from './services/api';
import { useEffect } from 'react';

function VisitTracker() {
  useEffect(() => {
    // Prevent double counting in dev strict mode by checking session storage
    if (!sessionStorage.getItem('visit_tracked')) {
      api.post('/admin/visit').catch(() => {});
      sessionStorage.setItem('visit_tracked', 'true');
    }
  }, []);
  return null;
}

export default function App() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '801802942563-s00778mctslujf17tlbkt51rp4icf5gk.apps.googleusercontent.com';

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <BrowserRouter>
        <AuthProvider>
          <VisitTracker />
          <GrainOverlay />
          <Routes>
          {/* Public — accessible sans connexion */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/templates" element={<TemplateGalleryPage />} />
          <Route path="/portfolios" element={<PortfolioGalleryPage />} />
          <Route path="/p/:id" element={<PublicPortfolioPage />} />

          {/* Protected — connexion requise */}
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/dashboard/purchases" element={<PrivateRoute><MyPurchasesPage /></PrivateRoute>} />
          <Route path="/dashboard/cv/templates" element={<PrivateRoute><TemplateGalleryPage /></PrivateRoute>} />
          <Route path="/dashboard/cv/editor" element={<PrivateRoute><CVEditorPage /></PrivateRoute>} />
          <Route path="/dashboard/cv/enhance" element={<PrivateRoute><ComingSoonPage title="Améliorer mon CV avec l'IA" /></PrivateRoute>} />
          <Route path="/dashboard/cv/online" element={<PrivateRoute><ComingSoonPage title="CV en Ligne (Site Web)" /></PrivateRoute>} />
          <Route path="/dashboard/portfolio/templates" element={<PrivateRoute><PortfolioGalleryPage /></PrivateRoute>} />
          <Route path="/dashboard/portfolio/editor" element={<PrivateRoute><PortfolioEditorPage /></PrivateRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
    </GoogleOAuthProvider>
  );
}
