import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, Eye, Check, X, ArrowRight, Globe, Layout, Lock, Crown, Play } from 'lucide-react';
import { portfolioTemplates, portfolioSeriesLabels, portfolioTierLabels } from '../../data/portfolioTemplates';
import { useAuth } from '../../store/AuthContext';

/* =====================================================
   TIER BADGE
   ====================================================== */
function TierBadge({ tier }) {
  if (tier === 'standard') return null;
  const info = portfolioTierLabels[tier];
  return (
    <div className="absolute top-2 left-2 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider"
      style={{ background: `${info.color}25`, color: info.color, border: `1px solid ${info.color}40` }}>
      <Crown size={9} />
      {info.shortFr || info.fr}
    </div>
  );
}

/* =====================================================
   PORTFOLIO CARD
   ====================================================== */
function PortfolioCard({ template, isSelected, onClick, onPreview }) {
  const { bg, text, accent, tier } = template;
  const isPremium = tier !== 'standard';

  return (
    <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.3 }} className="cursor-pointer group">
      <div
        onClick={onClick}
        className={`aspect-[16/10] rounded-xl border transition-all duration-300 relative overflow-hidden ${
          isSelected
            ? 'border-[var(--color-champagne)] ring-2 ring-[var(--color-champagne)] ring-offset-2 ring-offset-[var(--color-obsidian)]'
            : 'border-[rgba(255,255,255,0.08)] group-hover:border-[rgba(201,169,110,0.3)]'
        }`}
        style={{ background: bg }}
      >
        <TierBadge tier={tier} />

        <div className="p-5 h-full flex flex-col" style={{ color: text }}>
          {/* Browser bar */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="w-2 h-2 rounded-full" style={{ background: '#FF5F57' }} />
            <div className="w-2 h-2 rounded-full" style={{ background: '#FFBD2E' }} />
            <div className="w-2 h-2 rounded-full" style={{ background: '#28CA41' }} />
            <div className="flex-1 mx-3 h-3 rounded-full" style={{ background: `${text}08` }} />
          </div>

          {/* Hero mock */}
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-2">
            <div className="w-10 h-10 rounded-full mb-1" style={{ background: `linear-gradient(135deg, ${accent}, ${accent}70)` }} />
            <div className="h-2.5 rounded-full" style={{ background: `${text}40`, width: '55%' }} />
            <div className="h-1.5 rounded-full" style={{ background: `${accent}50`, width: '35%' }} />
            <div className="h-1 rounded-full mt-1" style={{ background: `${text}15`, width: '70%' }} />
          </div>

          {/* Project grid mock */}
          <div className="grid grid-cols-3 gap-1.5 mt-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="aspect-square rounded" style={{ background: `${accent}${15 - i * 3}` }} />
            ))}
          </div>
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
                <Lock size={10} /> Forfait {portfolioTierLabels[tier].fr} requis
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

      <div className="mt-2.5">
        <p className={`text-sm font-medium text-center transition-colors ${isSelected ? 'text-[var(--color-champagne)]' : 'text-[var(--color-white-muted)] group-hover:text-[var(--color-ivory)]'}`}>
          {template.name}
        </p>
        <p className="text-[10px] text-[var(--color-white-muted)] text-center mt-0.5">{template.description}</p>
      </div>
    </motion.div>
  );
}

/* =====================================================
   PREVIEW MODAL
   ====================================================== */
function PortfolioPreviewModal({ template, onClose, onSelect, isLoggedIn }) {
  if (!template) return null;
  const { bg, text, accent, secondary, tier } = template;
  const isPremium = tier !== 'standard';
  const tierInfo = portfolioTierLabels[tier];

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[rgba(0,0,0,0.9)] backdrop-blur-lg"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.4 }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-[900px] w-full max-h-[92vh] overflow-hidden rounded-2xl shadow-[0_0_100px_rgba(201,169,110,0.12)]"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-[var(--color-charcoal)] border-b border-[rgba(255,255,255,0.06)]">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-[var(--color-ivory)]" style={{ fontFamily: 'var(--font-serif)' }}>{template.name}</h3>
              {isPremium && (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase" style={{ background: `${tierInfo.color}20`, color: tierInfo.color }}>
                  {tierInfo.fr}
                </span>
              )}
            </div>
            <p className="text-xs text-[var(--color-white-muted)]">{template.description}</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => onSelect(template.id)} className="btn-primary !py-2.5 !px-6 !text-sm flex items-center gap-2">
              {isPremium && <Lock size={12} />}
              {isLoggedIn ? 'Utiliser ce modèle' : 'Créer mon portfolio'} <ArrowRight size={14} />
            </button>
            <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[var(--color-white-muted)]">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Full Portfolio Preview */}
        <div className="overflow-y-auto max-h-[calc(92vh-72px)]" style={{ background: bg, color: text }}>
          <div className="sticky top-0 z-5 flex items-center gap-2 px-4 py-2.5 border-b" style={{ background: secondary, borderColor: `${text}10` }}>
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <div className="w-3 h-3 rounded-full bg-[#28CA41]" />
            </div>
            <div className="flex-1 mx-4 h-7 rounded-lg flex items-center px-3 text-xs" style={{ background: `${text}08`, color: `${text}50` }}>
              <Globe size={12} className="mr-2" style={{ color: accent }} />
              abdou-diallo.samacvpro.dev
            </div>
          </div>

          {/* Hero */}
          <div className="text-center py-20 px-8">
            <div className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl font-bold"
              style={{ background: `linear-gradient(135deg, ${accent}, ${accent}70)`, color: bg }}>
              AD
            </div>
            <h1 className="text-4xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Abdou Diallo</h1>
            <p className="text-lg mb-4" style={{ color: accent }}>Product Manager Senior</p>
            <p className="max-w-xl mx-auto text-sm leading-relaxed" style={{ color: `${text}80` }}>
              Passionné par la création de produits numériques à fort impact. 8 ans d'expérience dans la tech en Afrique et en Europe.
            </p>
          </div>

          {/* Projects or Videos */}
          <div className="px-8 pb-16">
            <h2 className="text-xs font-bold uppercase tracking-[3px] mb-8 text-center" style={{ color: accent }}>
              {template.type === 'audiovisual' ? 'Bande Démo & Réalisations' : 'Projets sélectionnés'}
            </h2>
            
            {template.type === 'audiovisual' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['Showreel 2024', 'Court-Métrage "Dakar"', 'Campagne Publicitaire'].map((video, i) => (
                  <div key={i} className="group relative rounded-xl overflow-hidden cursor-pointer" style={{ background: secondary }}>
                    <div className="aspect-video w-full flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: `url('https://images.unsplash.com/photo-${[ '1485846234645-a62644f84728', '1536240478700-b869070f9279', '1601506521937-0121a7ef2ad6'][i]}?w=800&q=80')` }} />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                      <div className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md border shadow-2xl transition-transform group-hover:scale-110" style={{ background: `${accent}40`, borderColor: accent, color: '#FFF' }}>
                        <Play size={20} className="ml-1" />
                      </div>
                    </div>
                    <div className="p-4 relative z-20" style={{ background: secondary }}>
                      <p className="text-sm font-semibold mb-1">{video}</p>
                      <p className="text-xs" style={{ color: `${text}60` }}>Réalisation • Montage • Étalonnage</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {['Wave Mobile Banking', 'Orange Learning Platform', 'Sonatel AI Chatbot', 'Dakar Tech Hub'].map((project, i) => (
                  <div key={i} className="rounded-xl overflow-hidden" style={{ background: secondary }}>
                    <div className="aspect-video flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${accent}${20 + i * 5}, ${accent}${10 + i * 3})` }}>
                      <Layout size={24} style={{ color: `${accent}80` }} />
                    </div>
                    <div className="p-4">
                      <p className="text-sm font-semibold mb-1">{project}</p>
                      <p className="text-xs" style={{ color: `${text}60` }}>Design • Développement • Stratégie</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Infinite Gallery / Media */}
          <div className="px-8 pb-16">
            <h2 className="text-xs font-bold uppercase tracking-[3px] mb-8 text-center" style={{ color: accent }}>
              Galerie (Images & Documents)
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none' }}>
              {[1, 2, 3, 4, 5].map((item, i) => (
                <div key={i} className="min-w-[220px] h-[160px] rounded-xl flex-shrink-0 relative overflow-hidden group border" style={{ background: secondary, borderColor: `${text}10` }}>
                  {i % 3 === 0 ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                      <div className="w-12 h-16 bg-white/5 rounded mb-3 flex items-center justify-center border shadow-lg" style={{ borderColor: `${text}20` }}>
                        <span className="text-[11px] font-bold" style={{ color: text }}>PDF</span>
                      </div>
                      <p className="text-[11px] font-medium text-center" style={{ color: `${text}70` }}>Document_{i}.pdf</p>
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: `url('https://images.unsplash.com/photo-${[ '1498050108023-c5249f4df085', '1481481325911-5819e61db1d1', '1454165804606-c3d57bc86b40'][i % 3]}?w=500&q=80')` }} />
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="text-xs font-bold text-white px-4 py-2 rounded-full border border-white/30 backdrop-blur-md">Ouvrir</span>
                  </div>
                </div>
              ))}
              <div className="min-w-[220px] h-[160px] rounded-xl flex-shrink-0 flex items-center justify-center border-2 border-dashed" style={{ borderColor: `${accent}40`, background: `${accent}05` }}>
                <div className="text-center">
                  <p className="text-2xl font-light mb-1" style={{ color: accent }}>∞</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: accent }}>Illimité</p>
                </div>
              </div>
            </div>
          </div>


          <div className="text-center py-12 border-t" style={{ borderColor: `${text}08` }}>
            <p className="text-xs uppercase tracking-[3px] mb-4" style={{ color: accent }}>Contact & Réseaux</p>
            <p className="text-sm mb-6" style={{ color: `${text}60` }}>abdou.diallo@email.com • Dakar, Sénégal</p>
            <div className="flex items-center justify-center gap-4">
              {['LinkedIn', 'Twitter', 'Instagram'].map(network => (
                <span key={network} className="text-[11px] font-bold uppercase tracking-wider px-4 py-2 rounded-full cursor-pointer hover:opacity-80 transition-opacity" style={{ background: `${text}10`, color: text }}>
                  {network}
                </span>
              ))}
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
export default function PortfolioGallery() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const isLoggedIn = !!user;
  const isFromDashboard = location.pathname.startsWith('/dashboard');

  const [selectedId, setSelectedId] = useState(null);
  const [activeSeries, setActiveSeries] = useState(location.state?.filter || 'all');
  const [activeTier, setActiveTier] = useState('all');
  const [search, setSearch] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const series = ['all', 'premium', 'creative', 'tech', 'african', 'mediakit'];
  const tiers = ['all', 'standard', 'premium'];

  const filtered = useMemo(() => portfolioTemplates.filter(t => {
    if (activeSeries !== 'all' && t.series !== activeSeries) return false;
    if (activeTier !== 'all' && t.tier !== activeTier) return false;
    if (search && !t.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [activeSeries, activeTier, search]);

  const counts = useMemo(() => ({
    all: portfolioTemplates.length,
    standard: portfolioTemplates.filter(t => t.tier === 'standard').length,
    premium: portfolioTemplates.filter(t => t.tier === 'premium').length,
  }), []);

  const handleSelect = (id) => {
    const templateId = id || selectedId;
    if (!templateId) return;
    setPreviewTemplate(null);
    navigate(isLoggedIn ? `/dashboard/portfolio/editor?template=${templateId}` : `/register?portfolio=${templateId}`);
  };

  return (
    <div className="min-h-screen bg-[var(--color-obsidian)] p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <button onClick={() => navigate(isFromDashboard ? '/dashboard' : '/')} className="flex items-center gap-2 text-sm text-[var(--color-white-muted)] hover:text-[var(--color-champagne)] transition-colors mb-6">
            <ArrowLeft size={16} /> {isFromDashboard ? 'Retour au dashboard' : 'Retour à l\'accueil'}
          </button>

          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-ivory)] mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
            Choisissez votre portfolio
          </h1>
          <p className="text-[var(--color-white-muted)] mb-8">{portfolioTemplates.length} portfolios web cinématographiques pour mettre en valeur vos projets</p>
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
                {s === 'all' ? 'Tous' : portfolioSeriesLabels[s]?.fr}
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
              {t === 'premium' && <span className="w-2 h-2 rounded-full bg-[#C9A96E]" />}
              {t === 'all' ? `Tous (${counts.all})` : `${portfolioTierLabels[t].fr} (${counts[t]})`}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-24">
          {filtered.map((tmpl, i) => (
            <motion.div key={tmpl.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.4 }}>
              <PortfolioCard
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
                  <p className="text-sm text-[var(--color-ivory)] font-medium">{portfolioTemplates.find(t => t.id === selectedId)?.name}</p>
                  <p className="text-xs text-[var(--color-white-muted)]">Portfolio sélectionné</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setPreviewTemplate(portfolioTemplates.find(t => t.id === selectedId))} className="btn-ghost !py-2.5 !px-5 !text-sm flex items-center gap-2">
                    <Eye size={14} /> Prévisualiser
                  </button>
                  <button onClick={() => handleSelect()} className="btn-primary !py-2.5 !px-6 !text-sm">
                    {isLoggedIn ? 'Utiliser ce modèle' : 'Créer mon portfolio'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {previewTemplate && (
          <PortfolioPreviewModal
            template={previewTemplate}
            onClose={() => setPreviewTemplate(null)}
            onSelect={handleSelect}
            isLoggedIn={isLoggedIn}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
