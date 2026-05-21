import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from '../store/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';

export default function RegisterPage() {
  const { register, googleLogin: contextGoogleLogin, user } = useAuth();
  const navigate = useNavigate();

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('Les mots de passe ne correspondent pas');
    }
    if (password.length < 6) {
      return setError('Le mot de passe doit contenir au moins 6 caractères');
    }

    setLoading(true);
    try {
      await register(email, password, name);
      setSuccess(true);
    } catch (err) {
      const errorMsg = typeof err.response?.data?.error === 'string' 
        ? err.response.data.error 
        : err.response?.data?.message || err.message || 'Une erreur est survenue';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const googleSignup = useGoogleLogin({
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

        navigate('/dashboard');
      } catch (err) {
        const errorMsg = typeof err.response?.data?.error === 'string' 
          ? err.response.data.error 
          : err.response?.data?.message || err.message || 'Erreur lors de l\'inscription avec Google';
        setError(errorMsg);
        setLoading(false);
      }
    },
    onError: () => {
      setError('L\'inscription avec Google a échoué.');
    }
  });

  const handleGoogleSignup = () => {
    googleSignup();
  };

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-[var(--color-obsidian)] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="glass-card p-10 max-w-md text-center"
        >
          <div className="w-16 h-16 rounded-full bg-[rgba(67,160,71,0.15)] flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} className="text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--color-ivory)] mb-3" style={{ fontFamily: 'var(--font-serif)' }}>
            Compte créé avec succès !
          </h2>
          <p className="text-sm text-[var(--color-white-muted)] mb-6 leading-relaxed">
            Un email de vérification a été envoyé à <span className="text-[var(--color-champagne)]">{email}</span>.
            Vérifiez votre boîte de réception pour activer votre compte.
          </p>
          <Link to="/login" className="btn-primary inline-flex">
            Aller à la connexion <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-obsidian)] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(201,169,110,0.08)_0%,transparent_70%)] blur-3xl" />
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
            Créer un compte
          </h1>
          <p className="text-sm text-[var(--color-white-muted)] text-center mb-8">
            Rejoignez Samacvpro et transformez votre carrière
          </p>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-[rgba(229,57,53,0.1)] border border-[rgba(229,57,53,0.2)] text-sm text-red-400"
            >
              {error}
            </motion.div>
          )}

          {/* Google Button */}
          <button
            onClick={handleGoogleSignup}
            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-white/5 border border-white/10 text-[var(--color-ivory)] font-medium text-sm hover:bg-white/10 hover:border-white/20 transition-all duration-300 mb-6"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            S'inscrire avec Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-[1px] bg-white/10" />
            <span className="text-xs text-[var(--color-white-muted)]">ou</span>
            <div className="flex-1 h-[1px] bg-white/10" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-white-muted)] mb-2">Nom complet</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-white-muted)]" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Abdou Diallo"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-[var(--color-ivory)] placeholder:text-[var(--color-white-muted)] focus:outline-none focus:border-[var(--color-champagne)] focus:ring-1 focus:ring-[var(--color-champagne)] transition-all text-sm"
                />
              </div>
            </div>

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
              <label className="block text-sm font-medium text-[var(--color-white-muted)] mb-2">Mot de passe</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-white-muted)]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 caractères"
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

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-white-muted)] mb-2">Confirmer le mot de passe</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-white-muted)]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Retapez le mot de passe"
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
              className="btn-primary w-full !py-3.5 !text-sm disabled:opacity-50 disabled:cursor-not-allowed !mt-6"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : (
                <>Créer mon compte <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          {/* Login link */}
          <p className="mt-8 text-center text-sm text-[var(--color-white-muted)]">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-[var(--color-champagne)] font-medium hover:text-[var(--color-gold-light)]">
              Se connecter
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
