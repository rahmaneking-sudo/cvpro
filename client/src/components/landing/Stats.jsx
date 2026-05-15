import { useTranslation } from 'react-i18next';
import RevealSection from '../ui/RevealSection';
import { useScrollReveal, useCountUp } from '../../hooks/useAnimations';

function StatCard({ value, suffix, label, delay }) {
  const [ref, isVisible] = useScrollReveal(0.3);
  const count = useCountUp(value, 2200, 0, isVisible);

  return (
    <RevealSection delay={delay}>
      <div ref={ref} className="text-center group">
        <div className="text-4xl md:text-5xl font-bold text-gradient-gold mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
          {count.toLocaleString()}{suffix}
        </div>
        <div className="text-sm text-[var(--color-white-muted)] uppercase tracking-wider break-words">{label}</div>
        <div className="divider-gold mx-auto mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </RevealSection>
  );
}

export default function Stats() {
  const { t } = useTranslation();

  const stats = [
    { value: 12000, suffix: '+', label: t('stats.cvCreated'), delay: 0 },
    { value: 35, suffix: '+', label: t('stats.countries'), delay: 0.15 },
    { value: 98, suffix: '%', label: t('stats.satisfaction'), delay: 0.3 },
    { value: 24, suffix: '', label: t('stats.templates'), delay: 0.45 },
  ];

  return (
    <section className="py-[var(--spacing-section)] bg-gradient-radial">
      <div className="max-w-6xl mx-auto px-6">
        <RevealSection className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-ivory)]" style={{ fontFamily: 'var(--font-serif)' }}>
            {t('stats.title')}
          </h2>
        </RevealSection>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map(s => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}
