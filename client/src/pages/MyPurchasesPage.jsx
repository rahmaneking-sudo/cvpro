import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, FileText, Edit2, Download, Trash2, Briefcase, Image } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { templates } from '../data/templates';
import { portfolioTemplates } from '../data/portfolioTemplates';
import SEO from '../components/SEO';

export default function MyPurchasesPage() {
  const navigate = useNavigate();
  const [cvs, setCvs] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null); // { type: 'cv'|'portfolio', id, title }

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [cvRes, portfolioRes] = await Promise.all([
          api.get('/cv/user').catch(() => ({ data: { cvs: [] } })),
          api.get('/portfolios/user').catch(() => ({ data: { portfolios: [] } })),
        ]);
        setCvs(cvRes.data.cvs || []);
        setPortfolios(portfolioRes.data.portfolios || []);
      } catch (err) {
        console.error('Error fetching purchases:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleDelete = async () => {
    if (!confirmDelete) return;
    const { type, id } = confirmDelete;
    setDeletingId(id);
    try {
      if (type === 'cv') {
        await api.delete(`/cv/${id}`);
        setCvs(prev => prev.filter(c => c.id !== id));
      } else {
        await api.delete(`/portfolios/${id}`);
        setPortfolios(prev => prev.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
  };

  const getTemplateName = (templateId) => {
    const cv = templates.find(t => t.id === templateId);
    if (cv) return cv.name;
    const pf = portfolioTemplates.find(t => t.id === templateId);
    if (pf) return pf.name;
    return templateId;
  };

  const totalItems = cvs.length + portfolios.length;

  return (
    <div className="min-h-screen bg-[var(--color-obsidian)] flex flex-col p-4 sm:p-8">
      <SEO 
        title="Mes Documents - Samacvpro" 
        description="Retrouvez tous vos CV et portfolios sauvegardés sur Samacvpro." 
        url="https://samacvpro.com/dashboard/purchases" 
      />
      {/* Header */}
      <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-12">
        <button 
          onClick={() => navigate('/dashboard')}
          className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[var(--color-white-muted)] hover:text-white hover:bg-white/10 transition-colors shrink-0"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-ivory)]" style={{ fontFamily: 'var(--font-serif)' }}>
            Mes Documents
          </h1>
          <p className="text-sm text-[var(--color-white-muted)]">
            Retrouvez tous vos CV et portfolios sauvegardés.
          </p>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin text-[var(--color-champagne)]" size={40} />
        </div>
      ) : totalItems === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
            <FileText size={32} className="text-[var(--color-white-muted)]" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Aucun document sauvegardé</h2>
          <p className="text-[var(--color-white-muted)] max-w-md mb-8">
            Vous n'avez pas encore créé ou sauvegardé de CV ni de portfolio.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button onClick={() => navigate('/dashboard/cv/templates')} className="btn-primary">
              Créer un CV
            </button>
            <button onClick={() => navigate('/dashboard/portfolio/templates')} className="btn-ghost">
              Créer un Portfolio
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          {/* ========== CV Section ========== */}
          {cvs.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[rgba(201,169,110,0.2)] to-transparent border border-[rgba(201,169,110,0.1)] flex items-center justify-center">
                  <Briefcase size={18} className="text-[var(--color-champagne)]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[var(--color-ivory)]">Mes CV</h2>
                  <p className="text-xs text-[var(--color-white-muted)]">{cvs.length} document{cvs.length > 1 ? 's' : ''}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <AnimatePresence>
                  {cvs.map((cv, i) => (
                    <motion.div
                      key={cv.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-[var(--color-charcoal)] border border-[rgba(255,255,255,0.06)] rounded-2xl overflow-hidden group hover:border-[rgba(201,169,110,0.3)] transition-colors"
                    >
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[rgba(201,169,110,0.2)] to-transparent border border-[rgba(201,169,110,0.1)] flex items-center justify-center">
                            <FileText size={22} className="text-[var(--color-champagne)]" />
                          </div>
                          <span className="px-3 py-1 rounded-full bg-white/5 text-[10px] font-bold text-[var(--color-white-muted)] uppercase tracking-wider max-w-[140px] truncate">
                            {getTemplateName(cv.templateId)}
                          </span>
                        </div>
                        
                        <h3 className="text-base font-bold text-[var(--color-ivory)] mb-1 truncate">
                          {cv.title || 'CV Sans titre'}
                        </h3>
                        <p className="text-xs text-[var(--color-white-muted)] mb-5">
                          Modifié le {new Date(cv.updatedAt).toLocaleDateString('fr-FR')}
                        </p>

                        <div className="flex gap-2">
                          <button 
                            onClick={() => navigate(`/dashboard/cv/editor?template=${cv.templateId}&cvId=${cv.id}`)}
                            className="flex-1 py-2.5 rounded-lg border border-[rgba(201,169,110,0.3)] text-[var(--color-champagne)] text-xs font-bold flex items-center justify-center gap-2 hover:bg-[rgba(201,169,110,0.05)] transition-colors"
                          >
                            <Edit2 size={13} /> Modifier
                          </button>
                          <button 
                            onClick={() => navigate(`/dashboard/cv/editor?template=${cv.templateId}&cvId=${cv.id}`)}
                            className="w-10 h-10 rounded-lg bg-[rgba(255,255,255,0.05)] text-[var(--color-ivory)] flex items-center justify-center hover:bg-white/10 transition-colors"
                            title="Exporter"
                          >
                            <Download size={14} />
                          </button>
                          <button 
                            onClick={() => setConfirmDelete({ type: 'cv', id: cv.id, title: cv.title || 'CV Sans titre' })}
                            className="w-10 h-10 rounded-lg bg-[rgba(255,255,255,0.05)] text-[var(--color-white-muted)] flex items-center justify-center hover:bg-red-500/20 hover:text-red-400 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </section>
          )}

          {/* ========== Portfolio Section ========== */}
          {portfolios.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[rgba(139,92,246,0.2)] to-transparent border border-[rgba(139,92,246,0.1)] flex items-center justify-center">
                  <Image size={18} className="text-purple-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[var(--color-ivory)]">Mes Portfolios</h2>
                  <p className="text-xs text-[var(--color-white-muted)]">{portfolios.length} document{portfolios.length > 1 ? 's' : ''}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <AnimatePresence>
                  {portfolios.map((pf, i) => (
                    <motion.div
                      key={pf.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-[var(--color-charcoal)] border border-[rgba(255,255,255,0.06)] rounded-2xl overflow-hidden group hover:border-[rgba(139,92,246,0.3)] transition-colors"
                    >
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[rgba(139,92,246,0.2)] to-transparent border border-[rgba(139,92,246,0.1)] flex items-center justify-center">
                            <Image size={22} className="text-purple-400" />
                          </div>
                          <span className="px-3 py-1 rounded-full bg-white/5 text-[10px] font-bold text-[var(--color-white-muted)] uppercase tracking-wider max-w-[140px] truncate">
                            {getTemplateName(pf.templateId)}
                          </span>
                        </div>
                        
                        <h3 className="text-base font-bold text-[var(--color-ivory)] mb-1 truncate">
                          {pf.title || 'Portfolio Sans titre'}
                        </h3>
                        <p className="text-xs text-[var(--color-white-muted)] mb-5">
                          Modifié le {new Date(pf.updatedAt).toLocaleDateString('fr-FR')}
                        </p>

                        <div className="flex gap-2">
                          <button 
                            onClick={() => navigate(`/dashboard/portfolio/editor?template=${pf.templateId}&portfolioId=${pf.id}`)}
                            className="flex-1 py-2.5 rounded-lg border border-[rgba(139,92,246,0.3)] text-purple-400 text-xs font-bold flex items-center justify-center gap-2 hover:bg-[rgba(139,92,246,0.05)] transition-colors"
                          >
                            <Edit2 size={13} /> Modifier
                          </button>
                          <button 
                            onClick={() => navigate(`/dashboard/portfolio/editor?template=${pf.templateId}&portfolioId=${pf.id}`)}
                            className="w-10 h-10 rounded-lg bg-[rgba(255,255,255,0.05)] text-[var(--color-ivory)] flex items-center justify-center hover:bg-white/10 transition-colors"
                            title="Exporter"
                          >
                            <Download size={14} />
                          </button>
                          <button 
                            onClick={() => setConfirmDelete({ type: 'portfolio', id: pf.id, title: pf.title || 'Portfolio Sans titre' })}
                            className="w-10 h-10 rounded-lg bg-[rgba(255,255,255,0.05)] text-[var(--color-white-muted)] flex items-center justify-center hover:bg-red-500/20 hover:text-red-400 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </section>
          )}
        </div>
      )}

      {/* ========== Delete Confirmation Modal ========== */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => !deletingId && setConfirmDelete(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 10, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[var(--color-charcoal)] border border-[rgba(255,255,255,0.1)] rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            >
              <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-5">
                <Trash2 size={26} className="text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-white text-center mb-2">Supprimer ce document ?</h3>
              <p className="text-sm text-[var(--color-white-muted)] text-center mb-6">
                « {confirmDelete.title} » sera définitivement supprimé. Cette action est irréversible.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  disabled={!!deletingId}
                  className="flex-1 py-2.5 rounded-xl border border-white/10 text-[var(--color-white-muted)] text-sm font-bold hover:bg-white/5 transition-colors disabled:opacity-40"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDelete}
                  disabled={!!deletingId}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {deletingId ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={14} />}
                  Supprimer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
