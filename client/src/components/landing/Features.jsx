import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FileText, Wand2, Globe, Briefcase, Layout, CreditCard } from 'lucide-react';
import RevealSection from '../ui/RevealSection';

const iconMap = {
  cv: FileText,
  ai: Wand2,
  online: Globe,
  portfolio: Briefcase,
  portfolioSimple: Layout,
  payment: CreditCard,
};

export default function Features() {
  const { t } = useTranslation();

  const features = ['cv', 'ai', 'online', 'portfolio', 'portfolioSimple', 'payment'];

  return (
    <section id="features" className="py-[var(--spacing-section)] relative">
      {/* Background accent */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[rgba(201,169,110,0.15)] to-transparent" />

      <div className="max-w-6xl mx-auto px-6">
        <RevealSection className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-[var(--color-ivory)] mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
            {t('features.title')}
          </h2>
          <p className="text-lg text-[var(--color-white-muted)] max-w-xl mx-auto">
            {t('features.subtitle')}
          </p>
        </RevealSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((key, i) => {
            const Icon = iconMap[key];
            return (
              <RevealSection key={key} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -6, borderColor: 'rgba(201,169,110,0.3)' }}
                  transition={{ duration: 0.35 }}
                  className="glass-card p-8 h-full cursor-pointer group"
                >
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-[rgba(201,169,110,0.1)] flex items-center justify-center mb-6 group-hover:bg-[rgba(201,169,110,0.2)] transition-colors duration-500">
                    <Icon size={24} className="text-[var(--color-champagne)]" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-[var(--color-ivory)] mb-3" style={{ fontFamily: 'var(--font-serif)' }}>
                    {t(`features.${key}.title`)}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-[var(--color-white-muted)] leading-relaxed">
                    {t(`features.${key}.desc`)}
                  </p>

                  {/* Bottom line accent */}
                  <div className="mt-6 w-0 group-hover:w-full h-[1.5px] bg-gradient-to-r from-[var(--color-champagne)] to-transparent transition-all duration-700" />
                </motion.div>
              </RevealSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
