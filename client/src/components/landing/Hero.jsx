import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useParallax } from '../../hooks/useAnimations';

export default function Hero() {
  const { t } = useTranslation();
  const parallaxY = useParallax(0.3);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(201,169,110,0.15)_0%,transparent_70%)] blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(201,169,110,0.1)_0%,transparent_70%)] blur-3xl"
        />
      </div>

      {/* Cinematic light lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] bg-gradient-to-b from-transparent via-[rgba(201,169,110,0.2)] to-transparent"
          style={{ height: '40%', transform: `translateX(-50%) translateY(${parallaxY * 0.5}px)` }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center" style={{ transform: `translateY(${parallaxY * -0.2}px)` }}>
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[rgba(201,169,110,0.1)] border border-[rgba(201,169,110,0.2)] mb-8"
        >
          <Sparkles size={14} className="text-[var(--color-champagne)]" />
          <span className="text-xs font-medium text-[var(--color-champagne)] tracking-wider uppercase">
            Propulsé par GPT-4o
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-8"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          <span className="text-[var(--color-ivory)]">{t('hero.title').split(' ').slice(0, 4).join(' ')}</span>
          <br />
          <span className="text-gradient-gold">{t('hero.title').split(' ').slice(4).join(' ')}</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-lg md:text-xl text-[var(--color-white-muted)] max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          {t('hero.subtitle')}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a href="/register" className="btn-primary text-base px-10 py-4 flex items-center gap-2">
            {t('hero.cta')}
            <ArrowRight size={18} />
          </a>
          <a href="/templates" className="btn-ghost text-base px-8 py-4">
            Voir les Modèles CV
          </a>
          <a href="/portfolios" className="btn-ghost text-base px-8 py-4">
            Voir les Portfolios
          </a>
        </motion.div>

        {/* Trust line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="mt-16 text-xs text-[var(--color-white-muted)] tracking-wider uppercase"
        >
          {t('hero.trusted')}
        </motion.p>

        {/* Decorative dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.8 }}
          className="mt-4 flex items-center justify-center gap-2"
        >
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-[rgba(201,169,110,0.2)] to-[rgba(201,169,110,0.05)] border border-[rgba(201,169,110,0.15)]"
            />
          ))}
          <span className="text-xs text-[var(--color-white-muted)] ml-2">+12 000</span>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--color-obsidian)] to-transparent pointer-events-none" />
    </section>
  );
}
