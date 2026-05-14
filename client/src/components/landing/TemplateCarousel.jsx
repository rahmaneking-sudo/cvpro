import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import RevealSection from '../ui/RevealSection';

const templateSeries = [
  {
    key: 'executive',
    color: '#1a1a2e',
    templates: [
      { id: 'midnight-executive', name: 'Midnight Executive', accent: '#C9A96E' },
      { id: 'executive-blanc', name: 'Executive Blanc', accent: '#F5F0EB' },
      { id: 'executive-navy', name: 'Executive Navy', accent: '#1B2A4A' },
      { id: 'executive-slate', name: 'Executive Slate', accent: '#4A4A5A' },
    ],
  },
  {
    key: 'creative',
    color: '#0d0d0d',
    templates: [
      { id: 'cinematic-dark', name: 'Cinematic Dark', accent: '#C9A96E' },
      { id: 'editorial-magazine', name: 'Editorial Magazine', accent: '#E8D5B7' },
      { id: 'bold-creative', name: 'Bold Creative', accent: '#FF6B35' },
      { id: 'minimal-luxe', name: 'Minimal Luxe', accent: '#B8A9C9' },
    ],
  },
  {
    key: 'tech',
    color: '#0a0a0a',
    templates: [
      { id: 'code-noir', name: 'Code Noir', accent: '#00D4AA' },
      { id: 'architectural-grid', name: 'Architectural Grid', accent: '#7B8794' },
      { id: 'neo-minimal', name: 'Neo Minimal', accent: '#E0E0E0' },
      { id: 'silicon', name: 'Silicon', accent: '#6366F1' },
    ],
  },
  {
    key: 'african',
    color: '#1a0f00',
    templates: [
      { id: 'teranga-gold', name: 'Teranga Gold', accent: '#D4A537' },
      { id: 'savane-luxe', name: 'Savane Luxe', accent: '#8B4513' },
      { id: 'dakar-modern', name: 'Dakar Modern', accent: '#2E8B57' },
      { id: 'kente-pro', name: 'Kente Pro', accent: '#FF8C00' },
    ],
  },
];

function TemplateCard({ template }) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.03 }}
      transition={{ duration: 0.4 }}
      className="relative group cursor-pointer flex-shrink-0 w-[220px] md:w-[260px]"
    >
      {/* Mock CV Preview */}
      <div
        className="aspect-[3/4] rounded-xl overflow-hidden border border-[rgba(255,255,255,0.08)] group-hover:border-[rgba(201,169,110,0.3)] transition-all duration-500 relative"
        style={{ background: `linear-gradient(135deg, ${template.accent}15, #0A0A0A)` }}
      >
        {/* Simulated CV layout */}
        <div className="p-5 h-full flex flex-col">
          {/* Header area */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full" style={{ background: `linear-gradient(135deg, ${template.accent}, ${template.accent}80)` }} />
            <div className="flex-1">
              <div className="h-3 rounded-full mb-1.5" style={{ background: `${template.accent}40`, width: '80%' }} />
              <div className="h-2 rounded-full" style={{ background: `${template.accent}20`, width: '60%' }} />
            </div>
          </div>

          {/* Divider */}
          <div className="h-[1px] mb-4" style={{ background: `${template.accent}30` }} />

          {/* Content blocks */}
          <div className="space-y-3 flex-1">
            <div className="h-2 rounded-full bg-white/10 w-full" />
            <div className="h-2 rounded-full bg-white/8 w-[90%]" />
            <div className="h-2 rounded-full bg-white/6 w-[75%]" />
            <div className="mt-4 h-2 rounded-full bg-white/10 w-full" />
            <div className="h-2 rounded-full bg-white/8 w-[85%]" />
            <div className="h-2 rounded-full bg-white/6 w-[60%]" />
            <div className="mt-4 flex gap-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-5 rounded-md px-3 flex-shrink-0" style={{ background: `${template.accent}20`, width: `${40 + i * 10}px` }} />
              ))}
            </div>
          </div>

          {/* Bottom */}
          <div className="flex gap-2 mt-auto">
            <div className="h-2 rounded-full bg-white/5 flex-1" />
            <div className="h-2 rounded-full bg-white/5 flex-1" />
          </div>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-center justify-center">
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
            <Eye size={16} className="text-[var(--color-champagne)]" />
            <span className="text-sm font-medium text-white">Prévisualiser</span>
          </div>
        </div>

        {/* Cinematic shadow */}
        <div className="absolute inset-0 rounded-xl shadow-[inset_0_-40px_40px_-20px_rgba(0,0,0,0.5)]" />
      </div>

      {/* Name */}
      <p className="text-sm font-medium text-[var(--color-ivory)] mt-3 text-center group-hover:text-[var(--color-champagne)] transition-colors">
        {template.name}
      </p>
    </motion.div>
  );
}

export default function TemplateCarousel() {
  const { t } = useTranslation();
  const [activeSeries, setActiveSeries] = useState(0);

  const series = templateSeries[activeSeries];

  return (
    <section id="templates" className="py-[var(--spacing-section)] relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[rgba(201,169,110,0.12)] to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        <RevealSection className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-[var(--color-ivory)] mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
            {t('templates.title')}
          </h2>
          <p className="text-lg text-[var(--color-white-muted)] max-w-2xl mx-auto">
            {t('templates.subtitle')}
          </p>
        </RevealSection>

        {/* Series tabs */}
        <RevealSection delay={0.2} className="flex flex-wrap justify-center gap-3 mb-16">
          {templateSeries.map((s, i) => (
            <button
              key={s.key}
              onClick={() => setActiveSeries(i)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-400 ${
                activeSeries === i
                  ? 'bg-gradient-to-r from-[var(--color-champagne)] to-[var(--color-gold-light)] text-[var(--color-obsidian)]'
                  : 'bg-[rgba(255,255,255,0.05)] text-[var(--color-white-muted)] hover:bg-[rgba(255,255,255,0.1)] hover:text-[var(--color-ivory)]'
              }`}
            >
              {t(`templates.${s.key}`)}
            </button>
          ))}
        </RevealSection>

        {/* Carousel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSeries}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex gap-6 justify-center flex-wrap lg:flex-nowrap"
          >
            {series.templates.map(tmpl => (
              <TemplateCard key={tmpl.id} template={tmpl} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Mobile nav arrows */}
        <div className="flex justify-center gap-4 mt-10 lg:hidden">
          <button
            onClick={() => setActiveSeries(Math.max(0, activeSeries - 1))}
            className="w-10 h-10 rounded-full bg-[rgba(255,255,255,0.05)] flex items-center justify-center hover:bg-[rgba(201,169,110,0.1)] transition-colors"
            disabled={activeSeries === 0}
          >
            <ChevronLeft size={18} className={activeSeries === 0 ? 'text-[rgba(255,255,255,0.2)]' : 'text-[var(--color-ivory)]'} />
          </button>
          <button
            onClick={() => setActiveSeries(Math.min(templateSeries.length - 1, activeSeries + 1))}
            className="w-10 h-10 rounded-full bg-[rgba(255,255,255,0.05)] flex items-center justify-center hover:bg-[rgba(201,169,110,0.1)] transition-colors"
            disabled={activeSeries === templateSeries.length - 1}
          >
            <ChevronRight size={18} className={activeSeries === templateSeries.length - 1 ? 'text-[rgba(255,255,255,0.2)]' : 'text-[var(--color-ivory)]'} />
          </button>
        </div>
      </div>
    </section>
  );
}
