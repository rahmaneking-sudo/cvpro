import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import api from '../services/api';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState('loading'); // loading | success | error

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }

    api.get(`/auth/verify/${token}`)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [token]);

  return (
    <div className="min-h-screen bg-[var(--color-obsidian)] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="glass-card p-10 max-w-md text-center"
      >
        {status === 'loading' && (
          <>
            <Loader2 size={40} className="text-[var(--color-champagne)] animate-spin mx-auto mb-6" />
            <h2 className="text-xl font-bold text-[var(--color-ivory)]" style={{ fontFamily: 'var(--font-serif)' }}>Vérification en cours...</h2>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 rounded-full bg-[rgba(67,160,71,0.15)] flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={32} className="text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--color-ivory)] mb-3" style={{ fontFamily: 'var(--font-serif)' }}>Email vérifié !</h2>
            <p className="text-sm text-[var(--color-white-muted)] mb-6">Votre compte est maintenant actif. Connectez-vous pour commencer.</p>
            <Link to="/login" className="btn-primary inline-flex">Se connecter</Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 rounded-full bg-[rgba(229,57,53,0.15)] flex items-center justify-center mx-auto mb-6">
              <XCircle size={32} className="text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--color-ivory)] mb-3" style={{ fontFamily: 'var(--font-serif)' }}>Lien invalide</h2>
            <p className="text-sm text-[var(--color-white-muted)] mb-6">Ce lien de vérification est invalide ou a déjà été utilisé.</p>
            <Link to="/login" className="text-[var(--color-champagne)]">Retour à la connexion</Link>
          </>
        )}
      </motion.div>
    </div>
  );
}
