import { useState, useCallback, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, Loader2, Save, Download, Lock, Upload, Globe, Camera } from 'lucide-react';
import { portfolioTemplates } from '../../data/portfolioTemplates';
import PortfolioPreview from './PortfolioPreview';
import PaymentModal from '../shared/PaymentModal';
import api from '../../services/api';

const emptyPortfolioData = {
  fullName: '',
  jobTitle: '',
  bio: '',
  email: '',
  phone: '',
  location: '',
  projects: [],
  socialLinks: [{ platform: 'LinkedIn', url: '' }],
};

const emptyProject = {
  title: '',
  description: '',
  link: '',
  imageUrl: '',
  tags: [],
};

export default function PortfolioEditor() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const templateId = searchParams.get('template') || 'portfolio-noir-luxe';
  const portfolioId = searchParams.get('portfolioId');
  const template = portfolioTemplates.find(t => t.id === templateId) || portfolioTemplates[0];

  const [data, setData] = useState(emptyPortfolioData);
  const [projects, setProjects] = useState([{ ...emptyProject }]);
  const [tagInput, setTagInput] = useState('');
  
  const [saving, setSaving] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [isLoading, setIsLoading] = useState(!!portfolioId);

  useEffect(() => {
    if (portfolioId) {
      const loadPortfolio = async () => {
        try {
          const res = await api.get(`/portfolios/${portfolioId}`);
          if (res.data.portfolio) {
            setData(prev => ({ ...prev, ...res.data.portfolio.data }));
            if (res.data.portfolio.data.projects?.length > 0) {
              setProjects(res.data.portfolio.data.projects);
            }
          }
        } catch (err) {
          console.error('Error loading Portfolio:', err);
          showToast('Erreur lors du chargement', 'error');
        } finally {
          setIsLoading(false);
        }
      };
      loadPortfolio();
    }
  }, [portfolioId]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 5000);
  };

  const updateField = useCallback((field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
  }, []);

  const updateProject = useCallback((index, field, value) => {
    setProjects(prev => prev.map((proj, i) => i === index ? { ...proj, [field]: value } : proj));
  }, []);

  const addProject = () => setProjects(prev => [...prev, { ...emptyProject }]);
  const removeProject = (index) => setProjects(prev => prev.filter((_, i) => i !== index));

  const addTagToProject = (index, e) => {
    if (e.key === 'Enter' && e.target.value.trim() !== '') {
      e.preventDefault();
      const val = e.target.value.trim();
      setProjects(prev => prev.map((proj, i) => {
        if (i === index) {
          return { ...proj, tags: [...(proj.tags || []), val] };
        }
        return proj;
      }));
      e.target.value = '';
    }
  };

  const removeTagFromProject = (projIndex, tagIndex) => {
    setProjects(prev => prev.map((proj, i) => {
      if (i === projIndex) {
        return { ...proj, tags: proj.tags.filter((_, j) => j !== tagIndex) };
      }
      return proj;
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        templateId,
        type: template.tier === 'premium' ? 'premium' : 'simple',
        title: `${template.name} - ${data.fullName || 'Sans titre'}`,
        data: { ...data, projects }
      };
      
      if (portfolioId) {
        await api.put(`/portfolios/${portfolioId}`, payload);
        showToast('Modifications enregistrées !');
      } else {
        const res = await api.post('/portfolios', payload);
        showToast('Nouveau Portfolio sauvegardé !');
        // Remplace l'URL pour inclure l'ID sans recharger la page
        navigate(`/dashboard/portfolio/editor?template=${templateId}&portfolioId=${res.data.portfolio.id}`, { replace: true });
      }
    } catch (err) {
      console.error('Save error:', err);
      showToast('Erreur lors de la sauvegarde.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      showToast('Upload de la photo en cours...', 'success');
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.url) {
        updateField('photo', res.data.url);
        showToast('Photo uploadée avec succès !');
      }
    } catch (err) {
      console.error('Photo upload error:', err);
      showToast('Erreur lors de l\'upload.', 'error');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleFileUpload = async (index, file) => {
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      showToast('Upload en cours...', 'success');
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.url) {
        updateProject(index, 'imageUrl', res.data.url);
        showToast('Fichier uploadé avec succès !');
      }
    } catch (err) {
      console.error('Upload error:', err);
      showToast('Erreur lors de l\'upload du fichier.', 'error');
    }
  };

  const addSocialLink = () => {
    const current = data.socialLinks || [];
    setData(prev => ({ ...prev, socialLinks: [...current, { platform: 'LinkedIn', url: '' }] }));
  };

  const updateSocialLink = (index, field, value) => {
    const current = data.socialLinks || [];
    let formattedValue = value;

    if (field === 'url' && value && !value.startsWith('http://') && !value.startsWith('https://')) {
      formattedValue = 'https://' + value;
    }

    const updated = current.map((link, i) => i === index ? { ...link, [field]: formattedValue } : link);
    setData(prev => ({ ...prev, socialLinks: updated }));
  };

  const removeSocialLink = (index) => {
    const current = data.socialLinks || [];
    setData(prev => ({ ...prev, socialLinks: current.filter((_, i) => i !== index) }));
  };

  const ensureSaved = async () => {
    if (portfolioId) return portfolioId;
    
    setSaving(true);
    try {
      const payload = {
        templateId,
        type: template.tier === 'premium' ? 'premium' : 'simple',
        title: `${template.name} - ${data.fullName || 'Sans titre'}`,
        data: { ...data, projects }
      };
      const res = await api.post('/portfolios', payload);
      const newId = res.data.portfolio.id;
      // Remplace l'URL discrètement
      navigate(`/dashboard/portfolio/editor?template=${templateId}&portfolioId=${newId}`, { replace: true });
      return newId;
    } catch (err) {
      console.error('Auto-save error:', err);
      showToast('Erreur lors de la préparation.', 'error');
      return null;
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async () => {
    const currentId = await ensureSaved();
    if (!currentId) return;

    setIsCheckingPayment(true);
    try {
      const res = await api.get(`/cv/purchase/${templateId}`);
      if (res.data.purchased) {
        window.print();
      } else {
        setShowPaymentModal(true);
      }
    } catch (err) {
      console.error('Check purchase error:', err);
      showToast('Erreur de vérification des droits.', 'error');
    } finally {
      setIsCheckingPayment(false);
    }
  };

  const handleShareLink = async () => {
    const currentId = await ensureSaved();
    if (!currentId) return;

    setIsCheckingPayment(true);
    try {
      const res = await api.get(`/cv/purchase/${templateId}`);
      if (res.data.purchased) {
        const link = `${window.location.origin}/p/${currentId}`;
        await navigator.clipboard.writeText(link);
        showToast('Lien public copié dans le presse-papier !');
      } else {
        setShowPaymentModal(true);
      }
    } catch (err) {
      console.error('Check purchase error:', err);
      showToast('Erreur de vérification des droits.', 'error');
    } finally {
      setIsCheckingPayment(false);
    }
  };

  const handleSimulatePayment = async () => {
    setIsPurchasing(true);
    try {
      await api.post('/cv/purchase/simulate', { templateId });
      setShowPaymentModal(false);
      showToast('Paiement réussi ! Vous pouvez maintenant exporter et partager.');
    } catch (err) {
      console.error('Payment error:', err);
      showToast('Erreur lors du paiement.', 'error');
    } finally {
      setIsPurchasing(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[var(--color-ivory)] placeholder:text-[var(--color-white-muted)] focus:outline-none focus:border-[var(--color-champagne)] transition-all text-sm";
  const labelClass = "block text-sm font-medium text-[var(--color-white-muted)] mb-1.5";

  return (
    <div className="min-h-screen bg-[var(--color-obsidian)] flex flex-col print:bg-white print:min-h-0">
      {/* Top bar */}
      <div className="h-16 border-b border-[rgba(255,255,255,0.06)] bg-[var(--color-charcoal)] flex items-center justify-between px-6 shrink-0 print:hidden">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard/portfolio/templates')} className="text-[var(--color-white-muted)] hover:text-[var(--color-ivory)] transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-sm font-semibold text-[var(--color-ivory)]">Éditeur de Portfolio</h2>
            <p className="text-[11px] text-[var(--color-white-muted)]">{template.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleSave}
            disabled={saving || isLoading}
            className="btn-ghost !py-2 !px-4 !text-xs flex items-center gap-1.5 disabled:opacity-50"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} 
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
          
          <button 
            onClick={handleShareLink}
            disabled={isCheckingPayment || isLoading || saving}
            className="btn-ghost !py-2 !px-4 !text-xs flex items-center gap-1.5 disabled:opacity-50"
            title="Générer un lien public"
          >
            {isCheckingPayment ? <Loader2 size={14} className="animate-spin" /> : <Globe size={14} />} 
            Publier en ligne
          </button>

          <button 
            onClick={handleExport}
            disabled={isCheckingPayment || isLoading || saving}
            className="btn-primary !py-2 !px-4 !text-xs flex items-center gap-1.5 disabled:opacity-50"
            title="Télécharger au format PDF"
          >
            {isCheckingPayment ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />} 
            Exporter PDF
          </button>
        </div>
      </div>

      {/* Editor area */}
      <div className="flex flex-1 overflow-hidden print:overflow-visible">
        {/* LEFT — Form */}
        <div className="w-[45%] overflow-y-auto p-6 space-y-8 border-r border-[rgba(255,255,255,0.06)] print:hidden">
          
          <section>
            <h3 className="text-lg font-bold text-[var(--color-ivory)] mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-serif)' }}>
              <span className="w-7 h-7 rounded-lg bg-[rgba(201,169,110,0.15)] flex items-center justify-center text-xs text-[var(--color-champagne)] font-bold">1</span>
              Profil
            </h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className={labelClass}>Nom complet</label>
                  <input type="text" value={data.fullName} onChange={e => updateField('fullName', e.target.value)} placeholder="Ex: Studio Creatif" className={inputClass} />
                </div>
                <div className="shrink-0 flex flex-col items-center justify-end pb-1 relative">
                  {data.photo && !isUploadingPhoto && (
                    <button 
                      onClick={() => updateField('photo', '')} 
                      className="absolute -top-1 -right-1 z-10 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors shadow-sm"
                      title="Supprimer la photo"
                    >
                      <Trash2 size={10} />
                    </button>
                  )}
                  <label className="cursor-pointer group relative" title="Ajouter une photo de profil">
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" disabled={isUploadingPhoto} />
                    <div className="w-[46px] h-[46px] rounded-full border-2 border-dashed border-[rgba(201,169,110,0.3)] flex items-center justify-center overflow-hidden bg-[rgba(201,169,110,0.05)] hover:border-[var(--color-champagne)] transition-all">
                      {isUploadingPhoto ? (
                        <Loader2 size={20} className="animate-spin text-[var(--color-champagne)]" />
                      ) : data.photo ? (
                        <img src={data.photo} alt="Profil" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center gap-1 opacity-50 group-hover:opacity-100 transition-opacity text-[var(--color-champagne)]">
                          <Camera size={16} />
                          <span className="text-[8px] font-bold uppercase tracking-wider">Photo</span>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>
              <div>
                <label className={labelClass}>Spécialité / Titre</label>
                <input type="text" value={data.jobTitle} onChange={e => updateField('jobTitle', e.target.value)} placeholder="Ex: Direction Artistique & Design" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>À propos (Bio)</label>
                <textarea value={data.bio} onChange={e => updateField('bio', e.target.value)} placeholder="Une courte description de votre univers..." className={`${inputClass} min-h-[100px] resize-y`} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Email</label>
                  <input type="email" value={data.email} onChange={e => updateField('email', e.target.value)} placeholder="contact@studio.com" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Téléphone</label>
                  <input type="tel" value={data.phone} onChange={e => updateField('phone', e.target.value)} placeholder="+221 77..." className={inputClass} />
                </div>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="mt-8 space-y-4">
              <h4 className="text-sm font-bold text-[var(--color-ivory)] border-b border-white/10 pb-2">Réseaux Sociaux</h4>
              {(data.socialLinks || []).map((link, i) => (
                <div key={i} className="flex gap-3 items-start relative group">
                  <div className="w-1/3">
                    <select 
                      value={link.platform} 
                      onChange={e => updateSocialLink(i, 'platform', e.target.value)}
                      className={inputClass}
                    >
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="Twitter">Twitter / X</option>
                      <option value="Instagram">Instagram</option>
                      <option value="TikTok">TikTok</option>
                      <option value="Facebook">Facebook</option>
                      <option value="YouTube">YouTube</option>
                      <option value="Vimeo">Vimeo</option>
                      <option value="Pinterest">Pinterest</option>
                      <option value="Site Web">Site Web</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>
                  <div className="flex-1 relative">
                    <input 
                      type="url" 
                      value={link.url} 
                      onChange={e => updateSocialLink(i, 'url', e.target.value)}
                      onBlur={e => updateSocialLink(i, 'url', e.target.value)}
                      placeholder="https://..." 
                      className={inputClass} 
                    />
                  </div>
                  <button onClick={() => removeSocialLink(i)} className="p-3 text-[var(--color-white-muted)] hover:text-red-400 mt-0.5">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button onClick={addSocialLink} className="text-xs text-[var(--color-champagne)] hover:text-white flex items-center gap-1">
                <Plus size={14} /> Ajouter un réseau
              </button>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold text-[var(--color-ivory)] mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-serif)' }}>
              <span className="w-7 h-7 rounded-lg bg-[rgba(201,169,110,0.15)] flex items-center justify-center text-xs text-[var(--color-champagne)] font-bold">2</span>
              Projets
            </h3>
            {projects.map((proj, i) => (
              <div key={i} className="p-5 rounded-2xl bg-white/5 border border-white/10 mb-4 relative group">
                <button onClick={() => removeProject(i)} className="absolute top-4 right-4 text-[var(--color-white-muted)] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 size={16} />
                </button>
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Nom du projet</label>
                    <input type="text" value={proj.title} onChange={e => updateProject(i, 'title', e.target.value)} className={inputClass} placeholder="Ex: Refonte App Mobile" />
                  </div>
                  <div>
                    <label className={labelClass}>Description courte</label>
                    <textarea value={proj.description} onChange={e => updateProject(i, 'description', e.target.value)} className={`${inputClass} min-h-[80px]`} placeholder="Description du projet..." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Lien vers le projet (URL)</label>
                      <input type="url" value={proj.link} onChange={e => {
                        let val = e.target.value;
                        if (val && !val.startsWith('http://') && !val.startsWith('https://')) val = 'https://' + val;
                        updateProject(i, 'link', val);
                      }} className={inputClass} placeholder="https://..." />
                    </div>
                    <div>
                      <label className={labelClass}>Média (Image/Vidéo/PDF)</label>
                      <div className="relative">
                        <input 
                          type="file" 
                          id={`file-upload-${i}`}
                          accept="image/*,video/mp4,video/webm,application/pdf"
                          onChange={e => handleFileUpload(i, e.target.files[0])} 
                          className="hidden"
                        />
                        <label 
                          htmlFor={`file-upload-${i}`}
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-[rgba(201,169,110,0.4)] hover:bg-white/10 transition-all flex flex-col items-center justify-center gap-1 cursor-pointer group"
                        >
                          <Upload size={18} className="text-[var(--color-champagne)] group-hover:-translate-y-1 transition-transform" />
                          <span className="text-xs font-bold text-[var(--color-ivory)]">Cliquez pour ajouter un fichier</span>
                          <span className="text-[10px] text-[var(--color-white-muted)]">(Images, PDF, Vidéos MP4 - Max 20 Mo)</span>
                        </label>
                      </div>
                      
                      {proj.imageUrl && (
                        <div className="mt-2 p-2 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center gap-3">
                          {proj.imageUrl.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                            <img src={proj.imageUrl} alt="preview" className="w-10 h-10 object-cover rounded-md border border-white/10" />
                          ) : (
                            <div className="w-10 h-10 rounded-md bg-white/5 flex items-center justify-center">✓</div>
                          )}
                          <div>
                            <span className="text-xs text-green-400 font-bold block">Fichier enregistré</span>
                            <a href={proj.imageUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-[var(--color-white-muted)] hover:text-white hover:underline truncate max-w-[150px] inline-block">Voir le fichier</a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Tags (Entrée pour ajouter)</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {proj.tags?.map((tag, j) => (
                        <span key={j} className="px-2 py-1 bg-[rgba(201,169,110,0.1)] border border-[rgba(201,169,110,0.2)] text-[var(--color-champagne)] rounded text-[10px] flex items-center gap-1">
                          {tag} <button onClick={() => removeTagFromProject(i, j)} className="hover:text-red-400">×</button>
                        </span>
                      ))}
                    </div>
                    <input type="text" onKeyDown={(e) => addTagToProject(i, e)} className={inputClass} placeholder="Ex: React, UX Design..." />
                  </div>
                </div>
              </div>
            ))}
            <button onClick={addProject} className="w-full py-3 rounded-xl border border-dashed border-[rgba(201,169,110,0.2)] text-sm text-[var(--color-champagne)] hover:bg-[rgba(201,169,110,0.05)] transition-colors flex items-center justify-center gap-2">
              <Plus size={16} /> Ajouter un projet
            </button>
          </section>
        </div>

        {/* RIGHT — Live Preview */}
        <div className="flex-1 overflow-y-auto bg-[var(--color-graphite)] p-8 flex items-start justify-center print:bg-white print:p-0 print:m-0 print:absolute print:inset-0 print:block print:w-full print:h-full">
          <div className="w-full max-w-[800px] shadow-[var(--shadow-cinematic)] rounded-lg overflow-hidden print:max-w-none print:shadow-none print:rounded-none print:w-[210mm] print:h-[297mm] print:mx-auto">
            <PortfolioPreview template={template} data={{ ...data, projects }} />
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className={`px-6 py-3 rounded-full shadow-lg border flex items-center gap-3 text-sm font-medium
            ${toast.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-green-500/10 border-green-500/20 text-green-400'}
          `}>
            {toast.message}
          </div>
        </div>
      )}

      {/* Payment Modal */}
      <PaymentModal 
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={() => {
          showToast('Paiement réussi ! Vous pouvez maintenant exporter et partager.');
          // On ferme la modale (déjà géré dans PaymentModal)
          // On relance la vérification (optionnel, mais utile si on veut exporter auto)
          // setTimeout(() => window.print(), 500);
        }}
        templateId={templateId}
        templateName={`Modèle: ${template.name}`}
        price={template.tier === 'premium' ? '5 000' : '2 000'}
      />
    </div>
  );
}
