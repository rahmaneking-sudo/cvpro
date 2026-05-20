import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, ArrowLeft, Check, Search, X, ArrowRight, Lock, Crown } from 'lucide-react';
import { templates, seriesLabels, tierLabels } from '../../data/templates';
import { sampleCVData, sampleExperiences, sampleEducation } from '../../data/sampleCV';
import CVPreview from './CVPreview';
import CoverLetterPreview from './CoverLetterPreview';
import { useAuth } from '../../store/AuthContext';

/* =====================================================
   TIER BADGE
   ====================================================== */
function TierBadge({ tier }) {
  if (tier === 'standard' || tier === 'cover-letter') return null;
  const info = tierLabels[tier];
  return (
    <div className="absolute top-2 left-2 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider"
      style={{ background: `${info.color}25`, color: info.color, border: `1px solid ${info.color}40` }}>
      <Crown size={9} />
      {info.shortFr || info.fr}
    </div>
  );
}

/* =====================================================
   MINI CV CARD
   ====================================================== */
function TemplateMiniCard({ template, isSelected, onClick, onPreview }) {
  const { bg, text, accent, secondary, layout, tier } = template;
  const isTwoCol = layout === 'two-column' || layout === 'grid';
  const isPremium = tier !== 'standard' && tier !== 'cover-letter';

  return (
    <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.3 }} className="cursor-pointer group">
      <div
        onClick={onClick}
        className={`aspect-[3/4] rounded-xl border transition-all duration-300 relative overflow-hidden ${
          isSelected
            ? 'border-[var(--color-champagne)] ring-2 ring-[var(--color-champagne)] ring-offset-2 ring-offset-[var(--color-obsidian)]'
            : 'border-[rgba(255,255,255,0.08)] group-hover:border-[rgba(201,169,110,0.3)]'
        }`}
        style={{ background: bg }}
      >
        <TierBadge tier={tier} />
        {layout === 'media-kit' && (
          <div className="absolute top-2 right-2 z-10 px-2 py-0.5 rounded-sm text-[8px] font-black uppercase tracking-widest bg-white text-black shadow-xl border border-black/10">
            Media Kit
          </div>
        )}
        {layout === 'cover-letter' && (
          <div className="absolute top-2 right-2 z-10 px-2 py-0.5 rounded-sm text-[8px] font-black uppercase tracking-widest" style={{ background: '#3B82F620', color: '#3B82F6', border: '1px solid #3B82F640' }}>
            Lettre
          </div>
        )}

        <div className="p-4 h-full flex flex-col" style={{ color: text }}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full shrink-0" style={{ background: `linear-gradient(135deg, ${accent}, ${accent}80)` }} />
            <div className="flex-1 space-y-1">
              <div className="h-2 rounded-full" style={{ background: `${text}50`, width: '80%' }} />
              <div className="h-1.5 rounded-full" style={{ background: `${accent}60`, width: '60%' }} />
            </div>
          </div>
          <div className="flex gap-1.5 mb-2">
            {[40, 35, 30].map((w, i) => (
              <div key={i} className="h-1 rounded-full" style={{ background: `${text}20`, width: `${w}%` }} />
            ))}
          </div>
          <div className="h-[1px] mb-2" style={{ background: `${accent}25` }} />
          {layout === 'cover-letter' ? (
            /* Cover Letter mini-preview: text lines mimicking a formal letter */
            <div className="space-y-2 flex-1 pt-1">
              {/* Sender block (left) */}
              <div className="space-y-0.5">
                <div className="h-1.5 rounded-full" style={{ background: `${text}30`, width: '50%' }} />
                <div className="h-1 rounded-full" style={{ background: `${text}15`, width: '35%' }} />
                <div className="h-1 rounded-full" style={{ background: `${text}15`, width: '40%' }} />
              </div>
              {/* Recipient block (right) */}
              <div className="flex justify-end">
                <div className="space-y-0.5 w-[55%]">
                  <div className="h-1.5 rounded-full" style={{ background: `${text}30`, width: '65%' }} />
                  <div className="h-1 rounded-full" style={{ background: `${text}15`, width: '50%' }} />
                  <div className="h-1 rounded-full" style={{ background: `${text}15`, width: '55%' }} />
                </div>
              </div>
              {/* Subject line */}
              <div className="h-[1px] mt-1" style={{ background: `${accent}20` }} />
              <div className="h-1.5 rounded-full" style={{ background: `${accent}40`, width: '70%' }} />
              {/* Body lines */}
              <div className="space-y-0.5 pt-1">
                {[95, 90, 88, 92, 85, 90, 82, 88].map((w, i) => (
                  <div key={i} className="h-1 rounded-full" style={{ background: `${text}${Math.max(6, 15 - i)}`, width: `${w}%` }} />
                ))}
              </div>
            </div>
          ) : isTwoCol ? (
            <div className="flex gap-2 flex-1">
              <div className="w-[35%] space-y-1.5" style={{ background: secondary, borderRadius: 4, padding: 4 }}>
                {[80, 70, 90, 60, 80].map((w, i) => (
                  <div key={i} className="h-1 rounded-full" style={{ background: `${text}${Math.max(10, 25 - i * 3)}`, width: `${w}%` }} />
                ))}
              </div>
              <div className="flex-1 space-y-1.5 pt-1">
                <div className="h-1.5 rounded-full mb-1" style={{ background: `${accent}40`, width: '45%' }} />
                {[95, 90, 85, 80].map((w, i) => (
                  <div key={i} className="h-1 rounded-full" style={{ background: `${text}${Math.max(8, 20 - i * 3)}`, width: `${w}%` }} />
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-1.5 flex-1">
              <div className="h-1.5 rounded-full mb-1" style={{ background: `${accent}40`, width: '35%' }} />
              {[95, 85, 90].map((w, i) => (
                <div key={i} className="h-1 rounded-full" style={{ background: `${text}15`, width: `${w}%` }} />
              ))}
              <div className="mt-2 h-1.5 rounded-full" style={{ background: `${accent}40`, width: '40%' }} />
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-4 h-4 rounded-full" style={{ background: `${accent}20` }} />
                <div className="space-y-0.5 flex-1">
                  <div className="h-1 rounded-full" style={{ background: `${text}20`, width: '70%' }} />
                  <div className="h-1 rounded-full" style={{ background: `${accent}30`, width: '40%' }} />
                </div>
              </div>
              {[90, 80].map((w, i) => (
                <div key={i} className="h-1 rounded-full" style={{ background: `${text}10`, width: `${w}%` }} />
              ))}
            </div>
          )}
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); onPreview(template); }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--color-champagne)] text-[var(--color-obsidian)] text-xs font-semibold hover:scale-105 transition-transform"
            >
              <Eye size={14} /> Prévisualiser
            </button>
            {isPremium && (
              <span className="flex items-center gap-1 text-[10px] text-white/70">
                <Lock size={10} /> Forfait {tierLabels[tier].fr} requis
              </span>
            )}
          </div>
        </div>

        {isSelected && (
          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[var(--color-champagne)] flex items-center justify-center z-10">
            <Check size={12} className="text-[var(--color-obsidian)]" />
          </div>
        )}
      </div>

      <p className={`text-xs font-medium mt-2.5 text-center transition-colors ${
        isSelected ? 'text-[var(--color-champagne)]' : 'text-[var(--color-white-muted)] group-hover:text-[var(--color-ivory)]'
      }`}>
        {template.name}
      </p>
    </motion.div>
  );
}

/* =====================================================
   PREVIEW MODAL
   ====================================================== */
function PreviewModal({ template, onClose, onSelect, isLoggedIn }) {
  if (!template) return null;
  const isPremium = template.tier !== 'standard' && template.tier !== 'cover-letter';
  const tierInfo = tierLabels[template.tier];

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[rgba(0,0,0,0.9)] backdrop-blur-lg"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 30 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-[680px] w-full max-h-[92vh] overflow-hidden rounded-2xl shadow-[0_0_100px_rgba(201,169,110,0.12)]"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-[var(--color-charcoal)] border-b border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-[var(--color-ivory)]" style={{ fontFamily: 'var(--font-serif)' }}>{template.name}</h3>
                {isPremium && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase" style={{ background: `${tierInfo.color}20`, color: tierInfo.color }}>
                    {tierInfo.fr}
                  </span>
                )}
              </div>
              <p className="text-xs text-[var(--color-white-muted)]">{seriesLabels[template.series]?.fr}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => onSelect(template.id)} className="btn-primary !py-2.5 !px-6 !text-sm flex items-center gap-2">
              {isPremium && <Lock size={12} />}
              {isLoggedIn ? 'Utiliser ce modèle' : 'Créer mon CV'} <ArrowRight size={14} />
            </button>
            <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[var(--color-white-muted)]">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(92vh-72px)] bg-[#1a1a1a]">
          <div className="p-6 flex justify-center">
            <div className="w-full max-w-[595px] shadow-[0_25px_80px_rgba(0,0,0,0.6)] rounded-lg overflow-hidden">
              {template.layout === 'cover-letter' ? (
                <CoverLetterPreview template={template} cvData={sampleCVData} />
              ) : (
                <CVPreview template={template} cvData={sampleCVData} experiences={sampleExperiences} educations={sampleEducation} />
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* =====================================================
   MAIN GALLERY
   ====================================================== */
export default function TemplateGallery() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const isLoggedIn = !!user;
  const isFromDashboard = location.pathname.startsWith('/dashboard');

  const [selectedId, setSelectedId] = useState(null);
  const [activeSeries, setActiveSeries] = useState('all');
  const [activeTier, setActiveTier] = useState('all');
  const [search, setSearch] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const series = ['all', 'executive', 'creative', 'tech', 'african'];
  const tiers = ['all', 'standard', 'cover-letter', 'media-kit', 'premium'];

  const filtered = useMemo(() => templates.filter(t => {
    if (activeSeries !== 'all' && t.series !== activeSeries) return false;
    if (activeTier !== 'all' && t.tier !== activeTier) return false;
    if (search && !t.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [activeSeries, activeTier, search]);

  const handleSelect = (id) => {
    const templateId = id || selectedId;
    if (!templateId) return;
    setPreviewTemplate(null);
    navigate(isLoggedIn ? `/dashboard/cv/editor?template=${templateId}` : `/register?template=${templateId}`);
  };

  const counts = useMemo(() => ({
    all: templates.length,
    standard: templates.filter(t => t.tier === 'standard').length,
    'cover-letter': templates.filter(t => t.tier === 'cover-letter').length,
    premium: templates.filter(t => t.tier === 'premium').length,
    'media-kit': templates.filter(t => t.tier === 'media-kit').length,
  }), []);

  return (
    <div className="min-h-screen bg-[var(--color-obsidian)] p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <button onClick={() => navigate(isFromDashboard ? '/dashboard' : '/')} className="flex items-center gap-2 text-sm text-[var(--color-white-muted)] hover:text-[var(--color-champagne)] transition-colors mb-6">
            <ArrowLeft size={16} /> {isFromDashboard ? 'Retour au dashboard' : 'Retour à l\'accueil'}
          </button>

          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-ivory)] mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
            Choisissez votre modèle
          </h1>
          <p className="text-[var(--color-white-muted)] mb-8">{templates.length} modèles cinématographiques conçus pour impressionner</p>
        </motion.div>

        {/* Series Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex flex-wrap gap-2">
            {series.map(s => (
              <button key={s} onClick={() => setActiveSeries(s)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 ${
                  activeSeries === s
                    ? 'bg-gradient-to-r from-[var(--color-champagne)] to-[var(--color-gold-light)] text-[var(--color-obsidian)]'
                    : 'bg-white/5 text-[var(--color-white-muted)] hover:bg-white/10'
                }`}
              >
                {s === 'all' ? 'Tous' : seriesLabels[s]?.fr}
              </button>
            ))}
          </div>
          <div className="relative ml-auto">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-white-muted)]" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..."
              className="pl-9 pr-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-[var(--color-ivory)] placeholder:text-[var(--color-white-muted)] focus:outline-none focus:border-[var(--color-champagne)] w-48"
            />
          </div>
        </div>

        {/* Tier Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tiers.map(t => (
            <button key={t} onClick={() => setActiveTier(t)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-all duration-300 flex items-center gap-1.5 ${
                activeTier === t
                  ? 'bg-white/15 text-[var(--color-ivory)] border border-white/20'
                  : 'bg-white/3 text-[var(--color-white-muted)] hover:bg-white/8 border border-transparent'
              }`}
            >
              {t === 'standard' && <span className="w-2 h-2 rounded-full bg-[#43A047]" />}
              {t === 'cover-letter' && <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />}
              {t === 'media-kit' && <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />}
              {t === 'premium' && <span className="w-2 h-2 rounded-full bg-[#C9A96E]" />}
              {t === 'all' ? `Tous (${counts.all})` : `${tierLabels[t]?.fr || t} (${counts[t] || 0})`}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 pb-24">
          {filtered.map((tmpl, i) => (
            <motion.div key={tmpl.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03, duration: 0.4 }}>
              <TemplateMiniCard
                template={tmpl}
                isSelected={selectedId === tmpl.id}
                onClick={() => setSelectedId(selectedId === tmpl.id ? null : tmpl.id)}
                onPreview={setPreviewTemplate}
              />
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <AnimatePresence>
          {selectedId && (
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
              className="fixed bottom-0 left-0 right-0 p-4 bg-[rgba(10,10,10,0.95)] backdrop-blur-xl border-t border-[rgba(201,169,110,0.15)] z-50"
            >
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--color-ivory)] font-medium">{templates.find(t => t.id === selectedId)?.name}</p>
                  <p className="text-xs text-[var(--color-white-muted)]">Modèle sélectionné</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setPreviewTemplate(templates.find(t => t.id === selectedId))} className="btn-ghost !py-2.5 !px-5 !text-sm flex items-center gap-2">
                    <Eye size={14} /> Prévisualiser
                  </button>
                  <button onClick={() => handleSelect()} className="btn-primary !py-2.5 !px-6 !text-sm">
                    {isLoggedIn ? 'Utiliser ce modèle' : 'Créer mon CV'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {previewTemplate && (
          <PreviewModal template={previewTemplate} onClose={() => setPreviewTemplate(null)} onSelect={handleSelect} isLoggedIn={isLoggedIn} />
        )}
      </AnimatePresence>
    </div>
  );
}
