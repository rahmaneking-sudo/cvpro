import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ComingSoonPage({ title }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--color-obsidian)] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--color-champagne)] rounded-full blur-[150px] opacity-10 pointer-events-none" />
      
      <button 
        onClick={() => navigate(-1)}
        className="absolute top-8 left-8 flex items-center gap-2 text-[var(--color-white-muted)] hover:text-white transition-colors"
      >
        <ArrowLeft size={20} /> Retour
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center z-10 max-w-lg"
      >
        <div className="w-20 h-20 rounded-full bg-[rgba(201,169,110,0.1)] flex items-center justify-center mx-auto mb-8 border border-[rgba(201,169,110,0.3)]">
          <Sparkles className="text-[var(--color-champagne)]" size={40} />
        </div>
        
        <h1 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
          {title || "Bientôt disponible"}
        </h1>
        <p className="text-[var(--color-white-muted)] text-lg leading-relaxed">
          Cette fonctionnalité est en cours de développement. L'équipe de CV Pro y met la touche finale pour vous offrir une expérience cinématographique exceptionnelle.
        </p>

        <button 
          onClick={() => navigate('/dashboard')}
          className="mt-10 btn-primary"
        >
          Retour au Dashboard
        </button>
      </motion.div>
    </div>
  );
}
