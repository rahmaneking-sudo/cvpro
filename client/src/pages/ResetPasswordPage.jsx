import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import api from '../services/api';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) return setError('Les mots de passe ne correspondent pas');
    if (password.length < 6) return setError('Minimum 6 caractères');

    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, password });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-[var(--color-obsidian)] flex items-center justify-center px-4">
        <div className="glass-card p-10 max-w-md text-center">
          <h2 className="text-xl font-bold text-[var(--color-ivory)] mb-4" style={{ fontFamily: 'var(--font-serif)' }}>Lien invalide</h2>
          <p className="text-sm text-[var(--color-white-muted)] mb-6">Ce lien de réinitialisation est invalide ou expiré.</p>
          <Link to="/forgot-password" className="text-[var(--color-champagne)]">Demander un nouveau lien</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-obsidian)] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/3 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(201,169,110,0.06)_0%,transparent_70%)] blur-3xl" />
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-3 mb-10">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C9A96E] to-[#D4B878] flex items-center justify-center shadow-lg">
            <span className="text-[#0A0A0A] font-bold text-xl" style={{ fontFamily: 'var(--font-serif)' }}>C</span>
          </div>
          <span className="text-2xl font-bold"><span className="text-[var(--color-ivory)]">CV</span><span className="text-gradient-gold ml-1">Pro</span></span>
        </Link>

        <div className="glass-card p-8 md:p-10">
          {success ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[rgba(67,160,71,0.15)] flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={32} className="text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-[var(--color-ivory)] mb-3" style={{ fontFamily: 'var(--font-serif)' }}>Mot de passe mis à jour</h2>
              <p className="text-sm text-[var(--color-white-muted)] mb-6">Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.</p>
              <Link to="/login" className="btn-primary inline-flex">Se connecter <ArrowRight size={16} /></Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-[var(--color-ivory)] text-center mb-2" style={{ fontFamily: 'var(--font-serif)' }}>Nouveau mot de passe</h1>
              <p className="text-sm text-[var(--color-white-muted)] text-center mb-8">Choisissez un nouveau mot de passe sécurisé</p>

              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-4 rounded-xl bg-[rgba(229,57,53,0.1)] border border-[rgba(229,57,53,0.2)] text-sm text-red-400">{error}</motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-white-muted)] mb-2">Nouveau mot de passe</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-white-muted)]" />
                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimum 6 caractères" required
                      className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-white/5 border border-white/10 text-[var(--color-ivory)] placeholder:text-[var(--color-white-muted)] focus:outline-none focus:border-[var(--color-champagne)] focus:ring-1 focus:ring-[var(--color-champagne)] transition-all text-sm" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-white-muted)]">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-white-muted)] mb-2">Confirmer</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-white-muted)]" />
                    <input type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Retapez le mot de passe" required
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-[var(--color-ivory)] placeholder:text-[var(--color-white-muted)] focus:outline-none focus:border-[var(--color-champagne)] focus:ring-1 focus:ring-[var(--color-champagne)] transition-all text-sm" />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full !py-3.5 !text-sm disabled:opacity-50">
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <>Réinitialiser <ArrowRight size={16} /></>}
                </button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
