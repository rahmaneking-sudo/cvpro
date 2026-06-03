import { motion } from 'framer-motion';
import { ShieldAlert, ArrowRight, MessageCircle } from 'lucide-react';
import { useAuth } from '../store/AuthContext';
import { Navigate } from 'react-router-dom';

export default function ActivationRequiredPage() {
  const { user } = useAuth();

  // If somehow the user is not logged in, go to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If the user is already active, go to dashboard
  if (user.isActive) {
    return <Navigate to="/dashboard" replace />;
  }

  // WhatsApp configuration
  const whatsappNumber = "+221777185723"; 
  const whatsappMessage = encodeURIComponent(`Bonjour, je souhaite activer mon compte sur CV PRO. Mon email est : ${user.email}`);
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace('+', '')}?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-[var(--color-obsidian)] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--color-champagne)]/5 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="bg-white/5 border border-[var(--color-champagne)]/20 p-10 rounded-[2rem] backdrop-blur-xl shadow-2xl text-center">
          
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-3xl bg-[var(--color-champagne)]/10 border border-[var(--color-champagne)]/30 flex items-center justify-center">
              <ShieldAlert size={40} className="text-[var(--color-champagne)]" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-[var(--color-ivory)] mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
            Activation Requise
          </h1>
          
          <p className="text-[var(--color-white-muted)] mb-8 text-base leading-relaxed">
            Votre compte a été créé avec succès, mais il est actuellement en attente d'activation. <br/><br/>
            Pour débloquer l'accès complet à la plateforme et commencer à créer votre CV et Portfolio, veuillez procéder au paiement de votre forfait via WhatsApp.
          </p>

          <div className="space-y-4">
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3 text-lg shadow-lg shadow-[#25D366]/20 hover:shadow-[#25D366]/40 transform hover:-translate-y-1"
            >
              <MessageCircle size={24} />
              Contacter sur WhatsApp
            </a>
            
            <p className="text-xs text-white/40 mt-4">
              L'activation sera effectuée manuellement par l'administrateur après réception de votre message.
            </p>
          </div>
          
        </div>
      </motion.div>
    </div>
  );
}
