import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './store/AuthContext';
import CustomCursor from './components/ui/CustomCursor';
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

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CustomCursor />
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

          {/* Protected — connexion requise */}
          <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/dashboard/cv/templates" element={<PrivateRoute><TemplateGalleryPage /></PrivateRoute>} />
          <Route path="/dashboard/cv/editor" element={<PrivateRoute><CVEditorPage /></PrivateRoute>} />
          <Route path="/dashboard/portfolio/templates" element={<PrivateRoute><PortfolioGalleryPage /></PrivateRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
