import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Crown, Zap, Mail, Phone } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import RevealSection from '../ui/RevealSection';
import PaymentModal from '../shared/PaymentModal';

export default function Pricing() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);

  const handlePlanClick = (plan) => {
    if (plan.quote) {
      setShowContactModal(true);
    } else {
      if (user) {
        setSelectedPlan(plan);
        setShowPaymentModal(true);
      } else {
        navigate('/login', { state: { from: location.pathname + location.hash } });
      }
    }
  };

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
                    onClick={() => handlePlanClick(plan)}
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

      {/* Contact Modal for Quote */}
      <AnimatePresence>
        {showContactModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-[var(--color-obsidian)] border border-[rgba(201,169,110,0.3)] rounded-2xl shadow-2xl p-8 relative"
            >
              <button onClick={() => setShowContactModal(false)} className="absolute top-4 right-4 text-[var(--color-white-muted)] hover:text-white p-2">✕</button>
              <h3 className="text-2xl font-bold text-[var(--color-ivory)] mb-3" style={{ fontFamily: 'var(--font-serif)' }}>Demander un devis</h3>
              <p className="text-sm text-[var(--color-white-muted)] mb-8">Choisissez comment vous souhaitez nous contacter pour discuter de vos besoins sur mesure.</p>
              
              <div className="space-y-4">
                <a 
                  href="mailto:rahmaneking@gmail.com" 
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-[var(--color-ivory)] group"
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
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-[var(--color-ivory)] group"
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Payment Modal */}
      {selectedPlan && (
        <PaymentModal 
          isOpen={showPaymentModal} 
          onClose={() => {
            setShowPaymentModal(false);
            setTimeout(() => setSelectedPlan(null), 300); // clear after animation
          }} 
          onSuccess={() => {
            console.log('Paiement réussi pour', selectedPlan.key);
          }} 
          templateId={selectedPlan.key} 
          templateName={t(`pricing.${selectedPlan.key}.name`)} 
          price={t(`pricing.${selectedPlan.key}.price_xof`)?.replace(/[^\d\s]/g, '').trim()} 
        />
      )}
    </section>
  );
}
