import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, FileText, Edit2, Lock, Unlock, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

export default function MyPurchasesPage() {
  const navigate = useNavigate();
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCVs = async () => {
      try {
        const res = await api.get('/cv/user');
        setCvs(res.data.cvs || []);
      } catch (err) {
        console.error('Error fetching CVs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCVs();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-obsidian)] flex flex-col p-8">
      {/* Header */}
      <div className="flex items-center gap-6 mb-12">
        <button 
          onClick={() => navigate('/dashboard')}
          className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[var(--color-white-muted)] hover:text-white hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-ivory)]" style={{ fontFamily: 'var(--font-serif)' }}>
            Mes Achats & CVs
          </h1>
          <p className="text-[var(--color-white-muted)]">Retrouvez tous vos CV sauvegardés et modèles débloqués.</p>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin text-[var(--color-champagne)]" size={40} />
        </div>
      ) : cvs.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
            <FileText size={32} className="text-[var(--color-white-muted)]" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Aucun CV sauvegardé</h2>
          <p className="text-[var(--color-white-muted)] max-w-md mb-8">
            Vous n'avez pas encore créé ou sauvegardé de CV. Rendez-vous dans le créateur pour démarrer.
          </p>
          <button onClick={() => navigate('/dashboard/cv/templates')} className="btn-primary">
            Créer mon premier CV
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cvs.map((cv, i) => (
            <motion.div
              key={cv.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-[var(--color-charcoal)] border border-[rgba(255,255,255,0.06)] rounded-2xl overflow-hidden group hover:border-[rgba(201,169,110,0.3)] transition-colors"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[rgba(201,169,110,0.2)] to-transparent border border-[rgba(201,169,110,0.1)] flex items-center justify-center">
                    <FileText size={24} className="text-[var(--color-champagne)]" />
                  </div>
                  {/* For now, we assume all saved CVs are drafts unless we check purchase status per CV.
                      We will add a simple badge. */}
                  <span className="px-3 py-1 rounded-full bg-white/5 text-[10px] font-bold text-[var(--color-white-muted)] uppercase tracking-wider">
                    Modèle : {cv.templateId}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-[var(--color-ivory)] mb-1 truncate">
                  {cv.title || 'CV Sans titre'}
                </h3>
                <p className="text-xs text-[var(--color-white-muted)] mb-6">
                  Modifié le {new Date(cv.updatedAt).toLocaleDateString('fr-FR')}
                </p>

                <div className="flex gap-3">
                  <button 
                    onClick={() => navigate(`/dashboard/cv/editor?template=${cv.templateId}&cvId=${cv.id}`)}
                    className="flex-1 py-2.5 rounded-lg border border-[rgba(201,169,110,0.3)] text-[var(--color-champagne)] text-xs font-bold flex items-center justify-center gap-2 hover:bg-[rgba(201,169,110,0.05)] transition-colors"
                  >
                    <Edit2 size={14} /> Modifier
                  </button>
                  <button 
                    onClick={() => navigate(`/dashboard/cv/editor?template=${cv.templateId}&cvId=${cv.id}`)}
                    className="w-10 h-10 rounded-lg bg-[rgba(255,255,255,0.05)] text-[var(--color-ivory)] flex items-center justify-center hover:bg-white/10 transition-colors"
                    title="Ouvrir pour exporter"
                  >
                    <Download size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
