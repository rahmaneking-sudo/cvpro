import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './store/AuthContext';
import GrainOverlay from './components/ui/GrainOverlay';
import PrivateRoute from './components/auth/PrivateRoute';
import SupportChatWidget from './components/chat/SupportChatWidget';

import { lazy, Suspense, useEffect } from 'react';
import api from './services/api';

// Pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const VerifyEmailPage = lazy(() => import('./pages/VerifyEmailPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const TemplateGalleryPage = lazy(() => import('./pages/TemplateGalleryPage'));
const CVEditorPage = lazy(() => import('./pages/CVEditorPage'));
const PortfolioGalleryPage = lazy(() => import('./pages/PortfolioGalleryPage'));
const PortfolioEditorPage = lazy(() => import('./pages/PortfolioEditorPage'));
const MediaKitGalleryPage = lazy(() => import('./pages/MediaKitGalleryPage'));
const MediaKitEditorPage = lazy(() => import('./pages/MediaKitEditorPage'));
const MyPurchasesPage = lazy(() => import('./pages/MyPurchasesPage'));
const CVEnhancePage = lazy(() => import('./pages/CVEnhancePage'));
const CVOnlineQuotePage = lazy(() => import('./pages/CVOnlineQuotePage'));
const PublicPortfolioPage = lazy(() => import('./pages/PublicPortfolioPage'));
const PublicCVPage = lazy(() => import('./pages/PublicCVPage'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));
const PrintCVPage = lazy(() => import('./pages/PrintCVPage'));
const PrintPortfolioPage = lazy(() => import('./pages/PrintPortfolioPage'));
const ActivationRequiredPage = lazy(() => import('./pages/ActivationRequiredPage'));

// Legal & Blog
const PolitiqueConfidentialite = lazy(() => import('./pages/PolitiqueConfidentialite'));
const MentionsLegales = lazy(() => import('./pages/MentionsLegales'));
const Blog = lazy(() => import('./pages/Blog'));
const CommentRedigerCvSenegal = lazy(() => import('./pages/blog/CommentRedigerCvSenegal'));
const ErreursCvAEviter = lazy(() => import('./pages/blog/ErreursCvAEviter'));
const CvEtudiantStage = lazy(() => import('./pages/blog/CvEtudiantStage'));

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
          <SupportChatWidget />
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-[var(--color-obsidian)] text-[var(--color-champagne)]">Chargement...</div>}>
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
            <Route path="/cv/:id" element={<PublicCVPage />} />
            <Route path="/print-cv" element={<PrintCVPage />} />
            <Route path="/print-portfolio" element={<PrintPortfolioPage />} />
            
            {/* Legal & Blog */}
            <Route path="/politique-de-confidentialite" element={<PolitiqueConfidentialite />} />
            <Route path="/mentions-legales" element={<MentionsLegales />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/comment-rediger-cv-senegal" element={<CommentRedigerCvSenegal />} />
            <Route path="/blog/erreurs-cv-a-eviter" element={<ErreursCvAEviter />} />
            <Route path="/blog/cv-etudiant-stage" element={<CvEtudiantStage />} />

            {/* Protected — connexion requise */}
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/activation" element={<ActivationRequiredPage />} />
            <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
            <Route path="/dashboard/purchases" element={<PrivateRoute><MyPurchasesPage /></PrivateRoute>} />
            <Route path="/dashboard/cv/templates" element={<PrivateRoute><TemplateGalleryPage /></PrivateRoute>} />
            <Route path="/dashboard/cv/editor" element={<PrivateRoute><CVEditorPage /></PrivateRoute>} />
            <Route path="/dashboard/cv/enhance" element={<PrivateRoute><CVEnhancePage /></PrivateRoute>} />
            <Route path="/dashboard/cv/online" element={<PrivateRoute><CVOnlineQuotePage /></PrivateRoute>} />
            <Route path="/dashboard/portfolio/templates" element={<PrivateRoute><PortfolioGalleryPage /></PrivateRoute>} />
            <Route path="/dashboard/portfolio/editor" element={<PrivateRoute><PortfolioEditorPage /></PrivateRoute>} />
            <Route path="/dashboard/mediakit/templates" element={<PrivateRoute><MediaKitGalleryPage /></PrivateRoute>} />
            <Route path="/dashboard/mediakit/editor" element={<PrivateRoute><MediaKitEditorPage /></PrivateRoute>} />
          </Routes>
          </Suspense>
      </AuthProvider>
    </BrowserRouter>
    </GoogleOAuthProvider>
  );
}
