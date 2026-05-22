import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../store/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';

export default function LoginPage() {

  const { login, googleLogin: contextGoogleLogin, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate(location.state?.from || '/dashboard', { replace: true });
    }
  }, [user, navigate, location.state?.from]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setNeedsVerification(false);
    setLoading(true);

    try {
      await login(email, password);
      const from = location.state?.from || '/dashboard';
      navigate(from);
    } catch (err) {
      const data = err.response?.data;
      if (data?.needsVerification) {
        setNeedsVerification(true);
      }
      const errorMsg = typeof err.response?.data?.error === 'string' 
        ? err.response.data.error 
        : err.response?.data?.message || err.message || 'Une erreur est survenue';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    prompt: 'select_account',
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        setError('');
        
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        }).then(res => res.json());

        await contextGoogleLogin({
          email: userInfo.email,
          name: userInfo.name,
          avatar: userInfo.picture,
          googleId: userInfo.sub
        });

        const from = location.state?.from || '/dashboard';
        navigate(from);
      } catch (err) {
        const errorMsg = typeof err.response?.data?.error === 'string' 
          ? err.response.data.error 
          : err.response?.data?.message || err.message || 'La connexion avec Google a échoué';
        setError(errorMsg);
        setLoading(false);
      }
    },
    onError: () => {
      setError('La connexion avec Google a échoué.');
    }
  });

  const handleGoogleLogin = () => {
    googleLogin();
  };

  return (
    <div className="min-h-screen bg-[var(--color-obsidian)] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(201,169,110,0.08)_0%,transparent_70%)] blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(201,169,110,0.06)_0%,transparent_70%)] blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-3 mb-10">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C9A96E] to-[#D4B878] flex items-center justify-center shadow-lg">
            <span className="text-[#0A0A0A] font-bold text-xl" style={{ fontFamily: 'var(--font-serif)' }}>S</span>
          </div>
          <span className="text-2xl font-bold">
            <span className="text-[var(--color-ivory)]">Sama</span>
            <span className="text-gradient-gold">cvpro</span>
          </span>
        </Link>

        {/* Card */}
        <div className="glass-card p-8 md:p-10">
          <h1 className="text-2xl font-bold text-[var(--color-ivory)] text-center mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
            Bon retour
          </h1>
          <p className="text-sm text-[var(--color-white-muted)] text-center mb-8">
            Connectez-vous pour accéder à votre espace
          </p>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-[rgba(229,57,53,0.1)] border border-[rgba(229,57,53,0.2)] text-sm text-red-400"
            >
              {error}
              {needsVerification && (
                <Link to="/resend-verification" className="block mt-2 text-[var(--color-champagne)] underline text-xs">
                  Renvoyer l'email de vérification
                </Link>
              )}
            </motion.div>
          )}

          {/* Google Button */}
          <button
            type="button"
            onClick={() => googleLogin()}
            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-white/5 border border-white/10 text-[var(--color-ivory)] font-medium text-sm hover:bg-white/10 hover:border-white/20 transition-all duration-300 mb-6"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuer avec Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-[1px] bg-white/10" />
            <span className="text-xs text-[var(--color-white-muted)]">ou</span>
            <div className="flex-1 h-[1px] bg-white/10" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-white-muted)] mb-2">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-white-muted)]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-[var(--color-ivory)] placeholder:text-[var(--color-white-muted)] focus:outline-none focus:border-[var(--color-champagne)] focus:ring-1 focus:ring-[var(--color-champagne)] transition-all text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-[var(--color-white-muted)]">Mot de passe</label>
                <Link to="/forgot-password" className="text-xs text-[var(--color-champagne)] hover:text-[var(--color-gold-light)]">
                  Oublié ?
                </Link>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-white-muted)]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-white/5 border border-white/10 text-[var(--color-ivory)] placeholder:text-[var(--color-white-muted)] focus:outline-none focus:border-[var(--color-champagne)] focus:ring-1 focus:ring-[var(--color-champagne)] transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-white-muted)] hover:text-[var(--color-ivory)]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full !py-3.5 !text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : (
                <>Se connecter <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          {/* Register link */}
          <p className="mt-8 text-center text-sm text-[var(--color-white-muted)]">
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-[var(--color-champagne)] font-medium hover:text-[var(--color-gold-light)]">
              Créer un compte
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
