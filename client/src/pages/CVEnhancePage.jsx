import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, ArrowLeft, Loader2, Upload, FileCheck, LayoutTemplate, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import { templates } from '../data/templates';

export default function CVEnhancePage() {
  const navigate = useNavigate();
  
  // States
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  
  // Process States
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState(0); // 0: Idle, 1: Scanning, 2: Enhancing, 3: Creating
  const [error, setError] = useState(null);

  // Filter templates to only show standard and premium ones (exclude cover-letters, media-kits if needed)
  const availableTemplates = templates.filter(t => t.tier === 'standard' || t.tier === 'premium');

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
        setSelectedFile(file);
        setError(null);
      } else {
        setError("Veuillez sélectionner un document PDF ou une Image.");
      }
    }
  };

  const handleGenerate = async () => {
    if (!selectedFile || !selectedTemplate) return;
    
    setIsProcessing(true);
    setError(null);
    setProcessStep(1); // Étape 1 : Scan du document

    try {
      // 1. Scan du document
      const formData = new FormData();
      formData.append('document', selectedFile);
      
      const scanRes = await api.post('/ai/scan', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (!scanRes.data.success || !scanRes.data.data) {
        throw new Error("Échec de l'extraction des données du document.");
      }
      
      const rawCvData = scanRes.data.data;
      
      // 2. Amélioration par l'IA
      setProcessStep(2);
      const enhanceRes = await api.post('/ai/enhance-cv', { cvData: rawCvData });
      
      if (!enhanceRes.data.success || !enhanceRes.data.enhancedData) {
        throw new Error("Échec de l'amélioration du CV par l'IA.");
      }
      
      const enhancedData = enhanceRes.data.enhancedData;

      // 3. Création du nouveau CV en base de données
      setProcessStep(3);
      const createPayload = {
        templateId: selectedTemplate.id,
        title: `CV IA - ${enhancedData.fullName || 'Nouveau CV'}`,
        data: enhancedData,
        experiences: enhancedData.experiences || []
      };

      const createRes = await api.post('/cv', createPayload);

      if (!createRes.data.cv) {
        throw new Error("Échec de la sauvegarde du CV.");
      }

      // 4. Succès et redirection
      setProcessStep(4);
      setTimeout(() => {
        navigate(`/dashboard/cv/editor?template=${selectedTemplate.id}&cvId=${createRes.data.cv.id}`);
      }, 1000);

    } catch (err) {
      console.error("Erreur Workflow IA:", err);
      setError(err.response?.data?.error || err.message || "Une erreur est survenue lors de la génération.");
      setIsProcessing(false);
      setProcessStep(0);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-obsidian)] text-[var(--color-ivory)] pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-[var(--color-white-muted)] hover:text-[var(--color-champagne)] transition-colors mb-8">
          <ArrowLeft size={20} /> Retour au tableau de bord
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C9A96E] to-[#D4B878] flex items-center justify-center text-[var(--color-obsidian)] shadow-lg shadow-[rgba(201,169,110,0.2)]">
              <Wand2 size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-[var(--font-serif)]">Création Magique IA</h1>
              <p className="text-[var(--color-white-muted)] mt-1">Importez votre ancien CV, choisissez un design, l'IA fait le reste.</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Colonne de gauche : Upload */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-card p-6 rounded-2xl">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[rgba(201,169,110,0.15)] flex items-center justify-center text-xs text-[var(--color-champagne)] font-bold">1</span>
                Votre ancien CV
              </h2>
              
              <label className="block w-full cursor-pointer group">
                <input 
                  type="file" 
                  accept=".pdf, image/*" 
                  onChange={handleFileSelect} 
                  className="hidden"
                  disabled={isProcessing}
                />
                <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${selectedFile ? 'border-[var(--color-champagne)] bg-[rgba(201,169,110,0.05)]' : 'border-white/10 hover:border-white/30 hover:bg-white/5'}`}>
                  {selectedFile ? (
                    <div className="flex flex-col items-center">
                      <FileCheck size={40} className="text-[var(--color-champagne)] mb-3" />
                      <p className="text-sm font-bold text-white truncate w-full px-4">{selectedFile.name}</p>
                      <p className="text-xs text-[var(--color-white-muted)] mt-1">Cliquez pour modifier</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-[var(--color-white-muted)] mb-3 group-hover:text-white transition-colors">
                        <Upload size={24} />
                      </div>
                      <p className="text-sm font-bold text-white mb-1">Uploader un document</p>
                      <p className="text-xs text-[var(--color-white-muted)]">Formats supportés : PDF, PNG, JPG</p>
                    </div>
                  )}
                </div>
              </label>
            </div>

            {/* État du processus */}
            <AnimatePresence>
              {isProcessing && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="glass-card p-6 rounded-2xl overflow-hidden"
                >
                  <h3 className="text-sm font-bold mb-4 text-[var(--color-champagne)]">Création en cours...</h3>
                  <div className="space-y-4">
                    <div className={`flex items-center gap-3 text-sm ${processStep >= 1 ? 'text-white' : 'text-white/30'}`}>
                      {processStep > 1 ? <CheckCircle2 size={16} className="text-green-400" /> : processStep === 1 ? <Loader2 size={16} className="animate-spin text-[var(--color-champagne)]" /> : <div className="w-4 h-4 rounded-full border border-white/30" />}
                      Extraction des données (PDF)
                    </div>
                    <div className={`flex items-center gap-3 text-sm ${processStep >= 2 ? 'text-white' : 'text-white/30'}`}>
                      {processStep > 2 ? <CheckCircle2 size={16} className="text-green-400" /> : processStep === 2 ? <Loader2 size={16} className="animate-spin text-[var(--color-champagne)]" /> : <div className="w-4 h-4 rounded-full border border-white/30" />}
                      Amélioration des textes par l'IA
                    </div>
                    <div className={`flex items-center gap-3 text-sm ${processStep >= 3 ? 'text-white' : 'text-white/30'}`}>
                      {processStep > 3 ? <CheckCircle2 size={16} className="text-green-400" /> : processStep === 3 ? <Loader2 size={16} className="animate-spin text-[var(--color-champagne)]" /> : <div className="w-4 h-4 rounded-full border border-white/30" />}
                      Génération du design
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* Colonne de droite : Modèles */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[rgba(201,169,110,0.15)] flex items-center justify-center text-xs text-[var(--color-champagne)] font-bold">2</span>
                  Choisissez votre modèle
                </h2>
                {selectedTemplate && (
                  <span className="text-sm text-[var(--color-champagne)] font-bold bg-[rgba(201,169,110,0.1)] px-3 py-1 rounded-full">
                    {selectedTemplate.name} sélectionné
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {availableTemplates.map(template => (
                  <div 
                    key={template.id}
                    onClick={() => !isProcessing && setSelectedTemplate(template)}
                    className={`relative rounded-xl border-2 transition-all cursor-pointer overflow-hidden group ${
                      selectedTemplate?.id === template.id 
                        ? 'border-[var(--color-champagne)] shadow-[0_0_15px_rgba(201,169,110,0.3)]' 
                        : 'border-white/5 hover:border-white/20'
                    } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="aspect-[1/1.4] bg-white w-full relative">
                      {/* Design du Template abstrait */}
                      <div className="absolute inset-0 p-3 flex flex-col" style={{ background: template.bg, color: template.text }}>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-full shrink-0" style={{ background: `linear-gradient(135deg, ${template.accent}, ${template.accent}80)` }} />
                          <div className="flex-1 space-y-1">
                            <div className="h-1.5 rounded-full" style={{ background: `${template.text}50`, width: '80%' }} />
                            <div className="h-1 rounded-full" style={{ background: `${template.accent}60`, width: '60%' }} />
                          </div>
                        </div>
                        <div className="flex gap-1 mb-2">
                          {[40, 35, 30].map((w, i) => (
                            <div key={i} className="h-1 rounded-full" style={{ background: `${template.text}20`, width: `${w}%` }} />
                          ))}
                        </div>
                        <div className="h-[1px] mb-2" style={{ background: `${template.accent}25` }} />
                        
                        {template.layout === 'two-column' || template.layout === 'grid' ? (
                          <div className="flex gap-2 flex-1">
                            <div className="w-[35%] space-y-1.5" style={{ background: template.secondary, borderRadius: 3, padding: 3 }}>
                              {[80, 70, 90, 60].map((w, i) => (
                                <div key={i} className="h-0.5 rounded-full" style={{ background: `${template.text}${Math.max(10, 25 - i * 3)}`, width: `${w}%` }} />
                              ))}
                            </div>
                            <div className="flex-1 space-y-1.5 pt-1">
                              <div className="h-1 rounded-full mb-1" style={{ background: `${template.accent}40`, width: '45%' }} />
                              {[95, 90, 85].map((w, i) => (
                                <div key={i} className="h-0.5 rounded-full" style={{ background: `${template.text}${Math.max(8, 20 - i * 3)}`, width: `${w}%` }} />
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1.5 flex-1">
                            <div className="h-1 rounded-full mb-1" style={{ background: `${template.accent}40`, width: '35%' }} />
                            {[95, 85, 90].map((w, i) => (
                              <div key={i} className="h-0.5 rounded-full" style={{ background: `${template.text}15`, width: `${w}%` }} />
                            ))}
                            <div className="mt-2 h-1 rounded-full" style={{ background: `${template.accent}40`, width: '40%' }} />
                            <div className="flex items-center gap-1 mt-1">
                              <div className="w-3 h-3 rounded-full" style={{ background: `${template.accent}20` }} />
                              <div className="space-y-0.5 flex-1">
                                <div className="h-0.5 rounded-full" style={{ background: `${template.text}20`, width: '70%' }} />
                                <div className="h-0.5 rounded-full" style={{ background: `${template.accent}30`, width: '40%' }} />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Overlay Selection */}
                      {selectedTemplate?.id === template.id && (
                        <div className="absolute inset-0 bg-[var(--color-champagne)]/20 flex items-center justify-center">
                          <div className="w-10 h-10 bg-[var(--color-champagne)] rounded-full flex items-center justify-center shadow-lg">
                            <CheckCircle2 size={24} className="text-[var(--color-obsidian)]" />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-3 bg-[var(--color-charcoal)] border-t border-white/5">
                      <p className="text-sm font-bold truncate text-white">{template.name}</p>
                      <p className="text-[10px] text-[var(--color-white-muted)] uppercase tracking-wider mt-1">{template.tier === 'premium' ? '👑 Premium' : '⭐ Standard'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bouton de génération */}
            <div className="sticky bottom-6 z-10">
              <button 
                onClick={handleGenerate}
                disabled={!selectedFile || !selectedTemplate || isProcessing}
                className="w-full btn-primary !py-5 text-lg font-bold shadow-[0_10px_40px_rgba(201,169,110,0.3)] hover:shadow-[0_10px_50px_rgba(201,169,110,0.5)] disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-3"
              >
                {isProcessing ? (
                  <><Loader2 size={24} className="animate-spin" /> Génération du CV Magique...</>
                ) : (
                  <><Wand2 size={24} /> Générer mon nouveau CV</>
                )}
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
