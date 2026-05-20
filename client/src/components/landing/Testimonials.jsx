import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import RevealSection from '../ui/RevealSection';

const testimonials = [
  {
    name: 'Fatou Diallo',
    role: 'Product Manager — Dakar',
    text_fr: "Samacvpro a complètement transformé ma candidature. Le modèle Teranga Gold m'a permis de décrocher un entretien chez Google en moins de deux semaines.",
    text_en: "Samacvpro completely transformed my application. The Teranga Gold template helped me land a Google interview in under two weeks.",
    rating: 5,
  },
  {
    name: 'Pierre Lefèvre',
    role: 'Développeur Senior — Paris',
    text_fr: "L'outil d'amélioration IA est bluffant. Il a restructuré mon CV de manière tellement professionnelle que je ne me suis pas reconnu — en mieux.",
    text_en: "The AI enhancement tool is stunning. It restructured my CV so professionally that I didn't recognize myself — in a better way.",
    rating: 5,
  },
  {
    name: 'Aminata Koné',
    role: 'Architecte — Abidjan',
    text_fr: "Le portfolio premium est d'un autre niveau. Mes clients sont impressionnés avant même notre premier échange. C'est devenu mon meilleur commercial.",
    text_en: "The premium portfolio is on another level. My clients are impressed before we even talk. It's become my best salesperson.",
    rating: 5,
  },
];

export default function Testimonials() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  return (
    <section id="testimonials" className="py-[var(--spacing-section)] bg-gradient-radial relative">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[rgba(201,169,110,0.12)] to-transparent" />

      <div className="max-w-6xl mx-auto px-6">
        <RevealSection className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-[var(--color-ivory)] mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
            {t('testimonials.title')}
          </h2>
          <p className="text-lg text-[var(--color-white-muted)]">{t('testimonials.subtitle')}</p>
        </RevealSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, i) => (
            <RevealSection key={i} delay={i * 0.15}>
              <motion.div
                whileHover={{ y: -4 }}
                className="glass-card glass-card-hover p-8 h-full flex flex-col"
              >
                {/* Quote icon */}
                <Quote size={28} className="text-[var(--color-champagne)] opacity-30 mb-4" />

                {/* Text */}
                <p className="text-[var(--color-ivory)] leading-relaxed mb-6 flex-1 text-[0.95rem]">
                  "{lang === 'fr' ? item.text_fr : item.text_en}"
                </p>

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(item.rating)].map((_, j) => (
                    <Star key={j} size={14} className="text-[var(--color-champagne)] fill-current" />
                  ))}
                </div>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-[rgba(255,255,255,0.06)]">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-champagne)] to-[var(--color-gold-light)] flex items-center justify-center text-[var(--color-obsidian)] font-bold text-sm">
                    {item.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-ivory)]">{item.name}</p>
                    <p className="text-xs text-[var(--color-white-muted)]">{item.role}</p>
                  </div>
                </div>
              </motion.div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
}
