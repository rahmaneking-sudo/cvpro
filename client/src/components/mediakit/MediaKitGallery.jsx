import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, Eye, Check, X, ArrowRight, Lock, Users, Heart, TrendingUp } from 'lucide-react';
import { mediaKitTemplates, mediaKitTierLabels } from '../../data/mediaKitTemplates';
import { useAuth } from '../../store/AuthContext';
import MediaKitPreview from './MediaKitPreview';

function MediaKitCard({ template, isSelected, onClick, onPreview }) {
  const { bg, text, accent, tier } = template;
  const isPremium = tier === 'premium';
  
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
        <div className="p-5 h-full flex flex-col" style={{ color: text }}>
          {/* Header Mock */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full" style={{ background: `linear-gradient(135deg, ${accent}, ${accent}70)` }} />
            <div>
              <div className="h-3 rounded-full mb-1.5" style={{ background: `${text}80`, width: '80px' }} />
              <div className="h-2 rounded-full" style={{ background: `${accent}80`, width: '50px' }} />
            </div>
          </div>
          
          {/* Stats Mock */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="text-center rounded-lg p-2 border" style={{ borderColor: `${text}10`, background: `${text}05` }}>
                <div className="h-2.5 rounded-full mx-auto mb-1.5" style={{ background: text, width: '60%' }} />
                <div className="h-1.5 rounded-full mx-auto" style={{ background: `${accent}80`, width: '40%' }} />
              </div>
            ))}
          </div>

          {/* Brands Mock */}
          <div className="flex-1 rounded-lg border flex flex-col justify-center items-center gap-2 p-2" style={{ borderColor: `${text}10`, background: `${text}02` }}>
            <div className="h-2 rounded-full" style={{ background: `${text}40`, width: '100px' }} />
            <div className="flex gap-2">
              <div className="w-6 h-6 rounded-md" style={{ background: `${accent}40` }} />
              <div className="w-6 h-6 rounded-md" style={{ background: `${text}20` }} />
              <div className="w-6 h-6 rounded-md" style={{ background: `${accent}20` }} />
            </div>
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

function MediaKitPreviewModal({ template, onClose, onSelect, isLoggedIn }) {
  if (!template) return null;

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
        className="relative max-w-[900px] w-full max-h-[92vh] overflow-hidden rounded-2xl shadow-[0_0_100px_rgba(201,169,110,0.12)] bg-[var(--color-charcoal)] flex flex-col"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(255,255,255,0.06)] shrink-0">
          <div>
            <h3 className="text-lg font-bold text-[var(--color-ivory)]" style={{ fontFamily: 'var(--font-serif)' }}>{template.name}</h3>
            <p className="text-xs text-[var(--color-white-muted)]">{template.description}</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => onSelect(template.id)} className="btn-primary !py-2.5 !px-6 !text-sm flex items-center gap-2">
              <Lock size={12} /> {isLoggedIn ? 'Utiliser ce modèle' : 'Créer mon Media Kit'} <ArrowRight size={14} />
            </button>
            <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[var(--color-white-muted)]">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <MediaKitPreview template={template} data={{}} isPlaceholder />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function MediaKitGallery() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const isLoggedIn = !!user;
  const isFromDashboard = location.pathname.startsWith('/dashboard');

  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const filtered = useMemo(() => mediaKitTemplates.filter(t => {
    if (search && !t.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [search]);

  const handleSelect = (id) => {
    const templateId = id || selectedId;
    if (!templateId) return;
    setPreviewTemplate(null);
    navigate(isLoggedIn ? `/dashboard/mediakit/editor?template=${templateId}` : `/register?mediakit=${templateId}`);
  };

  return (
    <div className="min-h-screen bg-[var(--color-obsidian)] p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <button onClick={() => navigate(isFromDashboard ? '/dashboard' : '/')} className="flex items-center gap-2 text-sm text-[var(--color-white-muted)] hover:text-[var(--color-champagne)] transition-colors mb-6">
            <ArrowLeft size={16} /> {isFromDashboard ? 'Retour au dashboard' : 'Retour à l\'accueil'}
          </button>

          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-ivory)] mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
            Media Kits pour Influenceurs
          </h1>
          <p className="text-[var(--color-white-muted)] mb-8">Des modèles optimisés pour présenter votre audience et vos tarifs aux marques.</p>
        </motion.div>

        <div className="flex flex-wrap items-center gap-4 mb-8">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-white-muted)]" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..."
              className="pl-9 pr-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-[var(--color-ivory)] placeholder:text-[var(--color-white-muted)] focus:outline-none focus:border-[var(--color-champagne)] w-64"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-24">
          {filtered.map((tmpl, i) => (
            <motion.div key={tmpl.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.4 }}>
              <MediaKitCard
                template={tmpl}
                isSelected={selectedId === tmpl.id}
                onClick={() => setSelectedId(selectedId === tmpl.id ? null : tmpl.id)}
                onPreview={setPreviewTemplate}
              />
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {selectedId && (
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
              className="fixed bottom-0 left-0 right-0 p-4 bg-[rgba(10,10,10,0.95)] backdrop-blur-xl border-t border-[rgba(201,169,110,0.15)] z-50"
            >
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--color-ivory)] font-medium">{mediaKitTemplates.find(t => t.id === selectedId)?.name}</p>
                  <p className="text-xs text-[var(--color-white-muted)]">Modèle sélectionné</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setPreviewTemplate(mediaKitTemplates.find(t => t.id === selectedId))} className="btn-ghost !py-2.5 !px-5 !text-sm flex items-center gap-2">
                    <Eye size={14} /> Prévisualiser
                  </button>
                  <button onClick={() => handleSelect()} className="btn-primary !py-2.5 !px-6 !text-sm">
                    {isLoggedIn ? 'Créer mon Media Kit' : 'S\'inscrire'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {previewTemplate && (
          <MediaKitPreviewModal
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
