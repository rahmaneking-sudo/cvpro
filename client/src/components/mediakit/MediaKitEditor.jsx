import React, { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, Loader2, Save, Download, Globe, Camera, CheckCircle2, AlertCircle, Eye, Edit2 } from 'lucide-react';
import { mediaKitTemplates } from '../../data/mediaKitTemplates';
import MediaKitPreview from './MediaKitPreview';
import PaymentModal from '../shared/PaymentModal';
import api from '../../services/api';
import { uploadFile } from '../../services/cloudinaryUpload';

const PreviewScaler = ({ children }) => {
  const containerRef = React.useRef(null);
  const [scale, setScale] = React.useState(1);

  React.useEffect(() => {
    const observer = new ResizeObserver(() => {
      if (containerRef.current) {
        const availableWidth = containerRef.current.clientWidth;
        setScale(Math.min(1, availableWidth / 794));
      }
    });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full flex justify-center">
      <div 
        className="shadow-[var(--shadow-cinematic)] rounded-lg overflow-hidden"
        style={{ width: '794px', zoom: scale }}
      >
        {children}
      </div>
    </div>
  );
};

const emptyMediaKitData = {
  fullName: '',
  niche: '',
  bio: '',
  email: '',
  location: '',
  photo: '',
  stats: [
    { platform: 'Instagram', followers: '', engagement: '', url: '' }
  ],
  demographics: {
    age: '',
    gender: '',
    location: ''
  },
  services: [
    { name: 'Post Sponsorisé', price: 'Sur devis' }
  ],
  brands: []
};

export default function MediaKitEditor() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const templateId = searchParams.get('template') || 'mediakit-beauty';
  const portfolioId = searchParams.get('id');
  const template = mediaKitTemplates.find(t => t.id === templateId) || mediaKitTemplates[0];

  const [mobileTab, setMobileTab] = useState('edit');
  const [data, setData] = useState(emptyMediaKitData);
  
  const [saving, setSaving] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [isLoading, setIsLoading] = useState(!!portfolioId);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  useEffect(() => {
    if (portfolioId) {
      const loadPortfolio = async () => {
        try {
          const res = await api.get(`/portfolios/${portfolioId}`);
          if (res.data.portfolio) {
            setData(prev => ({
              ...prev,
              ...(res.data.portfolio.data || {})
            }));
          }
        } catch (err) {
          showToast('Erreur lors du chargement', 'error');
        } finally {
          setIsLoading(false);
        }
      };
      loadPortfolio();
    }
  }, [portfolioId]);

  const updateField = useCallback((field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
  }, []);

  const updateDemographics = (field, value) => {
    setData(prev => ({ ...prev, demographics: { ...prev.demographics, [field]: value } }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        templateId,
        type: 'mediakit',
        title: `Media Kit - ${data.fullName || 'Sans titre'}`,
        data: data
      };
      
      if (portfolioId) {
        await api.put(`/portfolios/${portfolioId}`, payload);
        showToast('Modifications enregistrées !');
      } else {
        const res = await api.post('/portfolios', payload);
        showToast('Nouveau Media Kit sauvegardé !');
        navigate(`/dashboard/mediakit/editor?template=${templateId}&id=${res.data.portfolio.id}`, { replace: true });
      }
    } catch (err) {
      showToast('Erreur lors de la sauvegarde.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const ensureSaved = async () => {
    if (portfolioId) return portfolioId;
    setSaving(true);
    try {
      const payload = {
        templateId,
        type: 'mediakit',
        title: `Media Kit - ${data.fullName || 'Sans titre'}`,
        data: data
      };
      const res = await api.post('/portfolios', payload);
      const newId = res.data.portfolio.id;
      navigate(`/dashboard/mediakit/editor?template=${templateId}&id=${newId}`, { replace: true });
      return newId;
    } catch (err) {
      showToast('Erreur lors de la préparation.', 'error');
      return null;
    } finally {
      setSaving(false);
    }
  };

  const handleShareLink = async () => {
    const currentId = await ensureSaved();
    if (!currentId) return;
    
    setIsCheckingPayment(true);
    try {
      const res = await api.get(`/cv/purchase/${templateId}`);
      if (!res.data.purchased) {
        setShowPaymentModal(true);
        return;
      }
    } catch (err) {
      showToast('Erreur de vérification.', 'error');
      return;
    } finally {
      setIsCheckingPayment(false);
    }
    navigator.clipboard.writeText(`${window.location.origin}/p/${currentId}`);
    showToast('Lien public copié dans le presse-papier !');
  };

  const handleExport = async () => {
    const currentId = await ensureSaved();
    if (!currentId) return;

    setIsCheckingPayment(true);
    try {
      const res = await api.get(`/cv/purchase/${templateId}`);
      if (!res.data.purchased) {
        setShowPaymentModal(true);
        return;
      }
    } catch (err) {
      showToast('Erreur de vérification.', 'error');
      return;
    } finally {
      setIsCheckingPayment(false);
    }
    localStorage.setItem('portfolio-print-data', JSON.stringify({
      templateId,
      type: 'mediakit',
      data: data,
    }));
    window.open('/print-portfolio', '_blank');
  };

  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploadingPhoto(true);
    try {
      const result = await uploadFile(file);
      updateField('photo', result.url);
      showToast('Photo uploadée !');
    } catch (err) {
      showToast('Erreur upload', 'error');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Stats arrays handlers
  const addStat = () => setData(prev => ({ ...prev, stats: [...prev.stats, { platform: '', followers: '', engagement: '', url: '' }] }));
  const updateStat = (i, field, val) => setData(prev => {
    const newStats = [...prev.stats];
    newStats[i][field] = val;
    return { ...prev, stats: newStats };
  });
  const removeStat = (i) => setData(prev => ({ ...prev, stats: prev.stats.filter((_, idx) => idx !== i) }));

  // Services arrays handlers
  const addService = () => setData(prev => ({ ...prev, services: [...prev.services, { name: '', price: '' }] }));
  const updateService = (i, field, val) => setData(prev => {
    const newServices = [...prev.services];
    newServices[i][field] = val;
    return { ...prev, services: newServices };
  });
  const removeService = (i) => setData(prev => ({ ...prev, services: prev.services.filter((_, idx) => idx !== i) }));

  // Brands handlers
  const addBrand = (e) => {
    if (e.key === 'Enter' && e.target.value.trim() !== '') {
      e.preventDefault();
      setData(prev => ({ ...prev, brands: [...(prev.brands || []), e.target.value.trim()] }));
      e.target.value = '';
    }
  };
  const removeBrand = (i) => setData(prev => ({ ...prev, brands: prev.brands.filter((_, idx) => idx !== i) }));

  const inputClass = "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium placeholder:text-[var(--color-white-muted)] focus:outline-none focus:border-[var(--color-champagne)] transition-all text-base";
  const labelClass = "block text-base font-bold text-white mb-2 tracking-wide";

  return (
    <div className="min-h-screen bg-[var(--color-obsidian)] flex flex-col">
      <div className="h-auto min-h-[3.5rem] border-b border-[rgba(255,255,255,0.06)] bg-[var(--color-charcoal)] flex items-center justify-between px-3 lg:px-6 py-2 shrink-0 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard/mediakit/templates')} className="text-[var(--color-white-muted)] hover:text-[var(--color-ivory)]">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-sm font-semibold text-[var(--color-ivory)]">Éditeur Media Kit</h2>
            <p className="text-[11px] text-[var(--color-white-muted)] hidden sm:block">{template.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 lg:gap-3 flex-wrap">
          <button onClick={handleSave} disabled={saving || isLoading} className="btn-ghost !py-2 !px-3 lg:!px-4 !text-xs flex items-center gap-1.5 disabled:opacity-50">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} 
            <span className="hidden sm:inline">Sauvegarder</span>
          </button>
          
          <button onClick={handleShareLink} disabled={saving || isLoading || isCheckingPayment} className="btn-ghost !py-2 !px-3 lg:!px-4 !text-xs flex items-center gap-1.5 disabled:opacity-50">
            {isCheckingPayment ? <Loader2 size={14} className="animate-spin" /> : <Globe size={14} />} 
            <span className="hidden sm:inline">Lien public</span>
          </button>

          <button onClick={handleExport} disabled={saving || isLoading || isCheckingPayment} className="btn-primary !py-2 !px-3 lg:!px-4 !text-xs flex items-center gap-1.5 disabled:opacity-50">
            {isCheckingPayment ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />} 
            <span className="hidden sm:inline">Exporter PDF</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden pb-16 lg:pb-0">
        {/* LEFT - Form */}
        <div className={`w-full lg:w-[45%] overflow-y-auto p-4 lg:p-6 space-y-6 lg:space-y-8 border-b lg:border-b-0 lg:border-r border-[rgba(255,255,255,0.06)] ${mobileTab === 'edit' ? 'block' : 'hidden lg:block'}`}>
          
          <section>
            <h3 className="text-lg font-bold text-[var(--color-ivory)] mb-4 flex items-center gap-2">Profil & Niche</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className={labelClass}>Nom de créateur</label>
                  <input type="text" value={data.fullName} onChange={e => updateField('fullName', e.target.value)} placeholder="Ex: Emma Creator" className={inputClass} />
                </div>
                <div className="shrink-0 flex flex-col items-center justify-end relative">
                  <label className="cursor-pointer group relative">
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" disabled={isUploadingPhoto} />
                    <div className="w-[46px] h-[46px] rounded-full border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden bg-white/5 hover:border-[var(--color-champagne)]">
                      {isUploadingPhoto ? <Loader2 size={20} className="animate-spin text-[var(--color-champagne)]" /> : data.photo ? <img src={data.photo} className="w-full h-full object-cover" /> : <Camera size={16} className="opacity-50" />}
                    </div>
                  </label>
                </div>
              </div>
              <div>
                <label className={labelClass}>Niche / Spécialité</label>
                <input type="text" value={data.niche} onChange={e => updateField('niche', e.target.value)} placeholder="Ex: Beauté, Lifestyle & Voyage" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Biographie (À propos)</label>
                <textarea value={data.bio} onChange={e => updateField('bio', e.target.value)} placeholder="Présentez-vous rapidement aux marques..." className={`${inputClass} min-h-[100px]`} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Email Contact</label>
                  <input type="email" value={data.email} onChange={e => updateField('email', e.target.value)} placeholder="hello@..." className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Localisation</label>
                  <input type="text" value={data.location} onChange={e => updateField('location', e.target.value)} placeholder="Ex: Paris, France" className={inputClass} />
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold text-[var(--color-ivory)] mb-4 flex items-center gap-2">Statistiques & Réseaux</h3>
            {data.stats.map((stat, i) => (
              <div key={i} className="mb-4 bg-white/5 p-4 rounded-xl border border-white/10 relative group">
                <button onClick={() => removeStat(i)} className="absolute top-2 right-2 text-white/40 hover:text-red-400 opacity-0 group-hover:opacity-100"><Trash2 size={14} /></button>
                <div className="flex flex-wrap gap-4 mb-3">
                  <div className="flex-1 min-w-[120px]">
                    <label className="text-xs font-bold text-white mb-1 block">Plateforme</label>
                    <input type="text" value={stat.platform} onChange={e => updateStat(i, 'platform', e.target.value)} placeholder="Instagram" className={inputClass} />
                  </div>
                  <div className="flex-1 min-w-[120px]">
                    <label className="text-xs font-bold text-white mb-1 block">Abonnés</label>
                    <input type="text" value={stat.followers} onChange={e => updateStat(i, 'followers', e.target.value)} placeholder="ex: 150K" className={inputClass} />
                  </div>
                  <div className="flex-1 min-w-[120px]">
                    <label className="text-xs font-bold text-white mb-1 block">Engagement</label>
                    <input type="text" value={stat.engagement} onChange={e => updateStat(i, 'engagement', e.target.value)} placeholder="ex: 4.5%" className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-white mb-1 block">Lien du profil (URL)</label>
                  <input type="url" value={stat.url || ''} onChange={e => updateStat(i, 'url', e.target.value)} placeholder="https://instagram.com/..." className={inputClass} />
                </div>
              </div>
            ))}
            <button onClick={addStat} className="text-xs text-[var(--color-champagne)] hover:underline flex items-center gap-1"><Plus size={14} /> Ajouter un réseau</button>
          </section>

          <section>
            <h3 className="text-lg font-bold text-[var(--color-ivory)] mb-4 flex items-center gap-2">Démographie Audience</h3>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Répartition par Âge</label>
                <input type="text" value={data.demographics.age} onChange={e => updateDemographics('age', e.target.value)} placeholder="ex: 18-24 ans (45%)" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Répartition Genre</label>
                <input type="text" value={data.demographics.gender} onChange={e => updateDemographics('gender', e.target.value)} placeholder="ex: 70% Femmes" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Localisation Principale</label>
                <input type="text" value={data.demographics.location} onChange={e => updateDemographics('location', e.target.value)} placeholder="ex: France, Belgique" className={inputClass} />
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold text-[var(--color-ivory)] mb-4 flex items-center gap-2">Services & Tarifs</h3>
            {data.services.map((svc, i) => (
              <div key={i} className="flex gap-2 items-center mb-2">
                <input type="text" value={svc.name} onChange={e => updateService(i, 'name', e.target.value)} placeholder="Prestation (Ex: Story)" className={`${inputClass} flex-1`} />
                <input type="text" value={svc.price} onChange={e => updateService(i, 'price', e.target.value)} placeholder="Prix" className={`${inputClass} w-1/3`} />
                <button onClick={() => removeService(i)} className="p-3 text-white/40 hover:text-red-400"><Trash2 size={16} /></button>
              </div>
            ))}
            <button onClick={addService} className="text-xs text-[var(--color-champagne)] hover:underline flex items-center gap-1 mt-2"><Plus size={14} /> Ajouter un service</button>
          </section>

          <section>
            <h3 className="text-lg font-bold text-[var(--color-ivory)] mb-4 flex items-center gap-2">Marques Partenaires</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {(data.brands || []).map((b, i) => (
                <span key={i} className="px-3 py-1 bg-white/10 text-white rounded-full text-xs flex items-center gap-2">{b} <button onClick={() => removeBrand(i)}><Trash2 size={12}/></button></span>
              ))}
            </div>
            <input type="text" onKeyDown={addBrand} placeholder="Nom de la marque puis Entrée..." className={inputClass} />
          </section>
        </div>

        {/* RIGHT - Preview */}
        <div className={`flex-1 overflow-y-auto bg-[var(--color-graphite)] p-4 lg:p-8 flex items-start justify-center ${mobileTab === 'preview' ? 'block' : 'hidden lg:block'}`}>
          <div className="w-full max-w-[794px]">
            <PreviewScaler>
              <MediaKitPreview template={template} data={data} />
            </PreviewScaler>
          </div>
        </div>
      </div>

      {createPortal(
        <AnimatePresence>
          {toast.show && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-[var(--color-obsidian)] border border-[var(--color-champagne)] shadow-2xl rounded-2xl p-8 text-center">
                <CheckCircle2 size={40} className="mx-auto text-green-500 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">{toast.message}</h3>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Payment Modal */}
      <PaymentModal 
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={() => {
          setHasPurchased(true);
          setShowPaymentModal(false);
          showToast('Paiement réussi ! Vous pouvez maintenant exporter et partager.');
        }}
        templateId={templateId}
        templateName={template?.name}
        price={template?.tier === 'premium' ? 5000 : 2000}
        productType="portfolio_premium"
      />

      {/* Mobile Nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-[var(--color-charcoal)] border-t border-white/10 flex items-center z-[100]">
        <button onClick={() => setMobileTab('edit')} className={`flex-1 h-full flex flex-col items-center justify-center gap-1 ${mobileTab === 'edit' ? 'text-[var(--color-champagne)]' : 'text-white/50'}`}><Edit2 size={20} /><span className="text-[10px] uppercase">Éditer</span></button>
        <button onClick={() => setMobileTab('preview')} className={`flex-1 h-full flex flex-col items-center justify-center gap-1 ${mobileTab === 'preview' ? 'text-[var(--color-champagne)]' : 'text-white/50'}`}><Eye size={20} /><span className="text-[10px] uppercase">Aperçu</span></button>
      </div>
    </div>
  );
}
