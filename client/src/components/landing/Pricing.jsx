import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Check, Crown, Zap } from 'lucide-react';
import RevealSection from '../ui/RevealSection';

export default function Pricing() {
  const { t } = useTranslation();

  const plans = [
    {
      key: 'cvUnit',
      icon: null,
      popular: false,
      quote: false,
    },
    {
      key: 'cvPack',
      icon: <Crown size={18} />,
      popular: true,
      quote: false,
    },
    {
      key: 'aiEnhance',
      icon: <Zap size={18} />,
      popular: false,
      quote: false,
    },
    {
      key: 'portfolioUnit',
      icon: null,
      popular: false,
      quote: false,
    },
    {
      key: 'portfolioPack',
      icon: null,
      popular: false,
      quote: false,
    },
    {
      key: 'portfolioPremium',
      icon: null,
      popular: false,
      quote: true,
    },
  ];

  return (
    <section id="pricing" className="py-[var(--spacing-section)] relative">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[rgba(201,169,110,0.12)] to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        <RevealSection className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-[var(--color-ivory)] mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
            {t('pricing.title')}
          </h2>
          <p className="text-lg text-[var(--color-white-muted)]">{t('pricing.subtitle')}</p>
        </RevealSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan, i) => {
            const isPopular = plan.popular;
            return (
              <RevealSection key={plan.key} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                  className={`relative rounded-[var(--radius-lg)] p-8 h-full flex flex-col ${
                    isPopular
                      ? 'bg-gradient-to-b from-[rgba(201,169,110,0.12)] to-[rgba(28,28,30,0.8)] border-2 border-[var(--color-champagne)] shadow-[0_0_40px_rgba(201,169,110,0.15)]'
                      : 'glass-card glass-card-hover'
                  }`}
                >
                  {/* Popular badge */}
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[var(--color-champagne)] to-[var(--color-gold-light)] text-[var(--color-obsidian)] text-xs font-bold uppercase tracking-wider">
                      {t(`pricing.${plan.key}.badge`)}
                    </div>
                  )}

                  {/* Header */}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-[var(--color-ivory)] mb-3 flex items-center gap-2" style={{ fontFamily: 'var(--font-serif)' }}>
                      {plan.icon && <span className="text-[var(--color-champagne)]">{plan.icon}</span>}
                      {t(`pricing.${plan.key}.name`)}
                    </h3>

                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-gradient-gold">{t(`pricing.${plan.key}.price_eur`)}</span>
                      {t(`pricing.${plan.key}.per`) && (
                        <span className="text-sm text-[var(--color-white-muted)]">{t(`pricing.${plan.key}.per`)}</span>
                      )}
                    </div>
                    <p className="text-sm text-[var(--color-white-muted)] mt-1">
                      {t(`pricing.${plan.key}.price_xof`)}
                    </p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8 flex-1">
                    {t(`pricing.${plan.key}.features`, { returnObjects: true }).map((feat, j) => (
                      <li key={j} className="flex items-start gap-3 text-sm text-[var(--color-ivory)]">
                        <Check size={16} className="text-[var(--color-champagne)] mt-0.5 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <button
                    className={`w-full py-3.5 rounded-full font-semibold text-sm transition-all duration-400 ${
                      isPopular
                        ? 'btn-primary'
                        : plan.quote
                        ? 'btn-ghost'
                        : 'btn-ghost hover:bg-[rgba(201,169,110,0.1)]'
                    }`}
                  >
                    {plan.quote ? t('pricing.quote') : t('pricing.cta')}
                  </button>
                </motion.div>
              </RevealSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
