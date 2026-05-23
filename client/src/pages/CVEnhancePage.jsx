import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wand2, ArrowLeft, Loader2, FileText, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

export default function CVEnhancePage() {
  const navigate = useNavigate();
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCv, setSelectedCv] = useState(null);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancedCvData, setEnhancedCvData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchCvs = async () => {
      try {
        const res = await api.get('/cv/user');
        setCvs(res.data.cvs || []);
      } catch (err) {
        console.error('Erreur fetch CVs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCvs();
  }, []);

  const handleEnhance = async () => {
    if (!selectedCv) return;
    setIsEnhancing(true);
    try {
      const payload = {
        cvData: {
          summary: selectedCv.data.summary,
          experiences: selectedCv.experiences.map(exp => ({
            id: exp.id,
            company: exp.company,
            position: exp.position,
            description: exp.description,
            startDate: exp.startDate,
            endDate: exp.endDate
          }))
        }
      };
      
      const res = await api.post('/ai/enhance-cv', payload);
      if (res.data.success) {
        setEnhancedCvData(res.data.enhancedData);
      }
    } catch (err) {
      console.error('Erreur lors de l\'amélioration:', err);
      alert('Une erreur est survenue lors de l\'amélioration par l\'IA.');
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleSave = async () => {
    if (!selectedCv || !enhancedCvData) return;
    setIsSaving(true);
    try {
      // Fusionner les données améliorées avec les données existantes
      const updatedData = { ...selectedCv.data, summary: enhancedCvData.summary };
      
      const updatedExperiences = selectedCv.experiences.map(exp => {
        const enhancedExp = enhancedCvData.experiences.find(e => e.id === exp.id || (e.company === exp.company && e.position === exp.position));
        return {
          ...exp,
          description: enhancedExp ? enhancedExp.description : exp.description
        };
      });

      const payload = {
        templateId: selectedCv.templateId,
        title: selectedCv.title,
        data: updatedData,
        experiences: updatedExperiences
      };

      await api.put(`/cv/${selectedCv.id}`, payload);
      alert('Votre CV a été mis à jour avec les améliorations IA !');
      navigate('/dashboard');
    } catch (err) {
      console.error('Erreur save:', err);
      alert('Erreur lors de la sauvegarde du CV.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-obsidian)] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-[var(--color-champagne)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-obsidian)] text-[var(--color-ivory)] pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-[var(--color-white-muted)] hover:text-[var(--color-champagne)] transition-colors mb-8">
          <ArrowLeft size={20} /> Retour au tableau de bord
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-[rgba(201,169,110,0.15)] flex items-center justify-center text-[var(--color-champagne)]">
            <Wand2 size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-[var(--font-serif)]">Améliorer mon CV avec l'IA</h1>
            <p className="text-[var(--color-white-muted)]">Donnez un aspect professionnel et percutant à votre CV en un clic.</p>
          </div>
        </div>

        {!selectedCv ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 rounded-2xl">
            <h2 className="text-xl font-bold mb-6">Sélectionnez le CV à améliorer</h2>
            {cvs.length === 0 ? (
              <p className="text-[var(--color-white-muted)]">Vous n'avez pas encore de CV. Créez-en un depuis l'éditeur d'abord.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cvs.map(cv => (
                  <div 
                    key={cv.id} 
                    onClick={() => setSelectedCv(cv)}
                    className="border border-[rgba(255,255,255,0.1)] rounded-xl p-4 hover:border-[var(--color-champagne)] cursor-pointer transition-all hover:bg-white/5"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[rgba(255,255,255,0.05)] flex items-center justify-center text-[var(--color-white-muted)]">
                        <FileText size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-[var(--color-ivory)]">{cv.title}</h3>
                        <p className="text-xs text-[var(--color-white-muted)] mt-1">
                          Mis à jour le {new Date(cv.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ) : !enhancedCvData ? (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-8 rounded-2xl text-center">
            <h2 className="text-2xl font-bold mb-4">Prêt à améliorer "{selectedCv.title}" ?</h2>
            <p className="text-[var(--color-white-muted)] max-w-lg mx-auto mb-8">
              Notre IA Gemini va analyser votre résumé et vos descriptions d'expériences pour les réécrire avec un vocabulaire plus professionnel, percutant et axé sur les résultats.
            </p>
            
            <button 
              onClick={handleEnhance}
              disabled={isEnhancing}
              className="btn-primary !px-8 !py-4 text-lg w-full max-w-md flex items-center justify-center gap-3 mx-auto"
            >
              {isEnhancing ? (
                <><Loader2 size={24} className="animate-spin" /> Analyse IA en cours...</>
              ) : (
                <><Wand2 size={24} /> Lancer la magie IA</>
              )}
            </button>
            <button 
              onClick={() => setSelectedCv(null)} 
              className="mt-6 text-sm text-[var(--color-white-muted)] hover:text-white transition-colors"
              disabled={isEnhancing}
            >
              Choisir un autre CV
            </button>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="glass-card p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-[var(--color-champagne)] mb-4 flex items-center gap-2">
                <CheckCircle2 size={20} /> Résumé Professionnel
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-bold text-[var(--color-white-muted)] uppercase tracking-wider mb-2">Original</p>
                  <div className="p-4 rounded-xl bg-black/20 border border-white/5 text-sm text-white/70">
                    {selectedCv.data.summary || "Aucun résumé original."}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-green-400 uppercase tracking-wider mb-2">Version IA</p>
                  <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-sm text-white">
                    {enhancedCvData.summary}
                  </div>
                </div>
              </div>
            </div>

            {selectedCv.experiences.map((exp, idx) => {
              const enhancedExp = enhancedCvData.experiences.find(e => e.id === exp.id || (e.company === exp.company && e.position === exp.position));
              if (!enhancedExp) return null;
              
              return (
                <div key={exp.id || idx} className="glass-card p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-[var(--color-champagne)] mb-1">{exp.position}</h3>
                  <p className="text-sm text-[var(--color-white-muted)] mb-4">{exp.company}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs font-bold text-[var(--color-white-muted)] uppercase tracking-wider mb-2">Original</p>
                      <div className="p-4 rounded-xl bg-black/20 border border-white/5 text-sm text-white/70 whitespace-pre-wrap">
                        {exp.description || "Aucune description originale."}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-green-400 uppercase tracking-wider mb-2">Version IA</p>
                      <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-sm text-white whitespace-pre-wrap">
                        {enhancedExp.description}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => setEnhancedCvData(null)}
                className="btn-ghost flex-1 py-4 text-center"
                disabled={isSaving}
              >
                Annuler
              </button>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="btn-primary flex-1 py-4 text-center flex items-center justify-center gap-2"
              >
                {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                Sauvegarder les améliorations
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
