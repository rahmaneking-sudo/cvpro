import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import api from '../services/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-obsidian)] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(201,169,110,0.06)_0%,transparent_70%)] blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md"
      >
        <Link to="/" className="flex items-center justify-center gap-3 mb-10">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C9A96E] to-[#D4B878] flex items-center justify-center shadow-lg">
            <span className="text-[#0A0A0A] font-bold text-xl" style={{ fontFamily: 'var(--font-serif)' }}>C</span>
          </div>
          <span className="text-2xl font-bold">
            <span className="text-[var(--color-ivory)]">CV</span>
            <span className="text-gradient-gold ml-1">Pro</span>
          </span>
        </Link>

        <div className="glass-card p-8 md:p-10">
          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[rgba(67,160,71,0.15)] flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={32} className="text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-[var(--color-ivory)] mb-3" style={{ fontFamily: 'var(--font-serif)' }}>
                Email envoyé
              </h2>
              <p className="text-sm text-[var(--color-white-muted)] mb-6">
                Si un compte existe avec cet email, vous recevrez un lien de réinitialisation.
              </p>
              <Link to="/login" className="text-sm text-[var(--color-champagne)]">
                Retour à la connexion
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-[var(--color-ivory)] text-center mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
                Mot de passe oublié
              </h1>
              <p className="text-sm text-[var(--color-white-muted)] text-center mb-8">
                Entrez votre email pour recevoir un lien de réinitialisation
              </p>

              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-4 rounded-xl bg-[rgba(229,57,53,0.1)] border border-[rgba(229,57,53,0.2)] text-sm text-red-400">
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-white-muted)] mb-2">Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-white-muted)]" />
                    <input
                      type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre@email.com" required
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-[var(--color-ivory)] placeholder:text-[var(--color-white-muted)] focus:outline-none focus:border-[var(--color-champagne)] focus:ring-1 focus:ring-[var(--color-champagne)] transition-all text-sm"
                    />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full !py-3.5 !text-sm disabled:opacity-50">
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <>Envoyer le lien <ArrowRight size={16} /></>}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-[var(--color-white-muted)]">
                <Link to="/login" className="text-[var(--color-champagne)]">Retour à la connexion</Link>
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
