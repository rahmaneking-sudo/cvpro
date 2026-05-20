import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import RevealSection from '../ui/RevealSection';
import { useAuth } from '../../store/AuthContext';
import { Link } from 'react-router-dom';

export default function FinalCTA() {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <section className="py-[var(--spacing-section)] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(201,169,110,0.08)_0%,transparent_70%)]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <RevealSection>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[var(--color-ivory)] mb-6" style={{ fontFamily: 'var(--font-serif)' }}>
            {t('cta.title')}
          </h2>
          <p className="text-lg text-[var(--color-white-muted)] mb-12 max-w-xl mx-auto">
            {t('cta.subtitle')}
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="inline-block"
          >
            <Link
              to={user ? '/dashboard' : '/register'}
              className="btn-primary text-lg px-14 py-5 inline-flex"
            >
              {user ? 'Mon Espace' : t('cta.button')}
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </RevealSection>
      </div>
    </section>
  );
}
