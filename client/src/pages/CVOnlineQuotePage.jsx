import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Globe, Mail, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CVOnlineQuotePage() {
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
        className="text-center z-10 max-w-lg w-full bg-[var(--color-obsidian)] border border-[rgba(201,169,110,0.3)] rounded-3xl shadow-2xl p-8 lg:p-12"
      >
        <div className="w-20 h-20 rounded-full bg-[rgba(201,169,110,0.1)] flex items-center justify-center mx-auto mb-8 border border-[rgba(201,169,110,0.3)]">
          <Globe className="text-[var(--color-champagne)]" size={40} />
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
          Site Web CV (Sur Devis)
        </h1>
        <p className="text-[var(--color-white-muted)] text-sm lg:text-base leading-relaxed mb-8">
          La création d'un CV en ligne sous forme de site web animé est une prestation haut de gamme sur mesure. Choisissez comment vous souhaitez nous contacter pour discuter de votre projet et obtenir un devis.
        </p>

        <div className="space-y-4 text-left">
          <a 
            href="mailto:rahmaneking@gmail.com" 
            className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-[var(--color-ivory)] group"
          >
            <div className="w-12 h-12 rounded-full bg-[var(--color-champagne)]/10 flex items-center justify-center text-[var(--color-champagne)] group-hover:bg-[var(--color-champagne)]/20 transition-colors">
              <Mail size={20} />
            </div>
            <div>
              <div className="font-semibold text-lg">Par Email</div>
              <div className="text-sm text-[var(--color-white-muted)]">rahmaneking@gmail.com</div>
            </div>
          </a>
          
          <a 
            href="https://wa.me/221777185723" 
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-[var(--color-ivory)] group"
          >
            <div className="w-12 h-12 rounded-full bg-[#25D366]/10 flex items-center justify-center text-[#25D366] group-hover:bg-[#25D366]/20 transition-colors">
              <Phone size={20} />
            </div>
            <div>
              <div className="font-semibold text-lg">Par WhatsApp / Tél</div>
              <div className="text-sm text-[var(--color-white-muted)]">+221 77 718 57 23</div>
            </div>
          </a>
        </div>

        <button 
          onClick={() => navigate('/dashboard')}
          className="mt-10 btn-ghost w-full py-3"
        >
          Retour au Dashboard
        </button>
      </motion.div>
    </div>
  );
}
