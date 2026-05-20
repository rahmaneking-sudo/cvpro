import React, { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, Loader2, Save, Download, Upload, Globe, Camera, CheckCircle2, AlertCircle } from 'lucide-react';
import { portfolioTemplates } from '../../data/portfolioTemplates';
import PortfolioPreview from './PortfolioPreview';
import PaymentModal from '../shared/PaymentModal';
import api from '../../services/api';
import { uploadFile } from '../../services/cloudinaryUpload';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

const PreviewScaler = ({ children }) => {
  const containerRef = React.useRef(null);
  const contentRef = React.useRef(null);
  const [scale, setScale] = React.useState(1);
  const [contentHeight, setContentHeight] = React.useState(1123);

  React.useEffect(() => {
    const observer = new ResizeObserver(() => {
      if (containerRef.current) {
        const availableWidth = containerRef.current.clientWidth;
        setScale(Math.min(1, availableWidth / 794));
      }
      if (contentRef.current) {
        setContentHeight(contentRef.current.offsetHeight);
      }
    });
    if (containerRef.current) observer.observe(containerRef.current);
    if (contentRef.current) observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full flex justify-center print:!block print:!w-auto print:!m-0 print:!p-0">
      <div 
        className="print:!h-auto print:!w-full print:!static"
        style={{ 
          width: `${794 * scale}px`, 
          height: `${contentHeight * scale}px`,
          position: 'relative'
        }}
      >
        <div 
          id="portfolio-preview-container"
          ref={contentRef}
          className="shadow-[var(--shadow-cinematic)] rounded-lg overflow-hidden print:!transform-none print:!w-[210mm] print:!static print:!shadow-none print:!rounded-none"
          style={{ 
            width: '794px', 
            transform: `scale(${scale})`, 
            transformOrigin: 'top left',
            position: 'absolute',
            top: 0,
            left: 0
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

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
  
  const [saving, setSaving] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [isLoading, setIsLoading] = useState(!!portfolioId);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [isCheckingPurchase, setIsCheckingPurchase] = useState(true);

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
            setData(prev => {
              const loadedData = res.data.portfolio.data || {};
              return {
                ...prev,
                ...loadedData,
                socialLinks: loadedData.socialLinks || []
              };
            });
            if (res.data.portfolio.data?.projects) {
              setProjects(res.data.portfolio.data.projects || []);
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

  useEffect(() => {
    const checkPurchase = async () => {
      setIsCheckingPurchase(true);
      try {
        const res = await api.get(`/cv/purchase/${templateId}`);
        setHasPurchased(res.data.purchased);
      } catch (err) {
        console.error('Check purchase error:', err);
      } finally {
        setIsCheckingPurchase(false);
      }
    };
    checkPurchase();
  }, [templateId]);


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
    try {
      showToast('Upload de la photo en cours...', 'success');
      const result = await uploadFile(file);
      updateField('photo', result.url);
      showToast('Photo uploadée avec succès !');
    } catch (err) {
      console.error('Photo upload error:', err);
      showToast(err.message || 'Erreur lors de l\'upload.', 'error');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const [uploadProgress, setUploadProgress] = useState({});
  const handleFileUpload = async (index, file) => {
    if (!file) return;
    
    try {
      showToast('Upload en cours...', 'success');
      setUploadProgress(prev => ({ ...prev, [index]: 0 }));
      
      const result = await uploadFile(file, {
        onProgress: (percent) => setUploadProgress(prev => ({ ...prev, [index]: percent }))
      });
      
      updateProject(index, 'imageUrl', result.url);
      showToast('Fichier uploadé avec succès !');
    } catch (err) {
      console.error('Upload error:', err);
      showToast(err.message || 'Erreur lors de l\'upload du fichier.', 'error');
    } finally {
      setUploadProgress(prev => ({ ...prev, [index]: undefined }));
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
    if (hasPurchased) {
      const element = document.getElementById('portfolio-preview-container');
      if (!element) return;
      
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      let newWindow;
      
      if (isIOS) {
        newWindow = window.open('', '_blank');
        if (newWindow) {
          newWindow.document.write('<div style="font-family:sans-serif;padding:20px;text-align:center;color:#666;margin-top:50px;">Génération du PDF en cours...<br/>Veuillez patienter.</div>');
        }
      }
      
      showToast('Préparation du PDF en cours...', 'success');
      
      try {
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          logging: false,
          width: 794,
          windowWidth: 794,
          backgroundColor: null,
          onclone: (clonedDoc) => {
            try {
              const el = clonedDoc.getElementById('portfolio-preview-container');
              if (el) {
                const bgVal = template.bg || '#ffffff';
                clonedDoc.body.style.background = bgVal;
                clonedDoc.body.style.backgroundColor = bgVal;
                clonedDoc.documentElement.style.background = bgVal;
                clonedDoc.documentElement.style.backgroundColor = bgVal;

                // Reset transform, scaling, and force auto height to allow full vertical render
                el.style.transform = 'none';
                el.style.position = 'static';
                el.style.width = '794px';
                el.style.height = 'auto';
                el.style.minHeight = 'auto';
                el.style.overflow = 'visible';

                if (el.parentElement) {
                  el.parentElement.style.width = '794px';
                  el.parentElement.style.transform = 'none';
                  el.parentElement.style.height = 'auto';
                  el.parentElement.style.minHeight = 'auto';
                  el.parentElement.style.position = 'static';
                  el.parentElement.style.overflow = 'visible';
                }

                // Copy contents of all canvas elements (like PDF thumbnails)
                const originalCanvases = element.querySelectorAll('canvas');
                const clonedCanvases = el.querySelectorAll('canvas');
                originalCanvases.forEach((origCanvas, index) => {
                  const clonedCanvas = clonedCanvases[index];
                  if (clonedCanvas) {
                    const ctx = clonedCanvas.getContext('2d');
                    clonedCanvas.width = origCanvas.width;
                    clonedCanvas.height = origCanvas.height;
                    ctx.drawImage(origCanvas, 0, 0);
                  }
                });

                // Force image colors (remove grayscale)
                const images = el.getElementsByTagName('img');
                for (let img of images) {
                  if (img.classList && img.classList.remove) {
                    img.classList.remove('grayscale');
                  }
                  if (img.style) {
                    img.style.filter = 'none';
                    img.style.webkitFilter = 'none';
                  }
                  if (img.setAttribute && !img.hasAttribute('crossOrigin')) {
                    img.setAttribute('crossOrigin', 'anonymous');
                  }
                }
              }
            } catch (e) {
              console.error('onclone error:', e);
            }
          }
        });
        
        let imgData;
        try {
          imgData = canvas.toDataURL('image/jpeg', 0.98);
        } catch (e) {
          console.error('Canvas tainted or export failed:', e);
          showToast('Impossible d\'exporter : Certaines images bloquent la génération PDF (Erreur CORS).', 'error');
          if (isIOS && newWindow) newWindow.close();
          return;
        }

        const hexToRgb = (hexStr) => {
          const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
          const fullHex = hexStr.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
          const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
          return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
          } : { r: 255, g: 255, b: 255 };
        };

        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm
        
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const imgHeightInPdf = (canvasHeight * pdfWidth) / canvasWidth;
        
        let heightLeft = imgHeightInPdf;
        let position = 0;
        
        // Fill page background color first to guarantee uniform background
        const bgRgb = hexToRgb(template.bg || '#ffffff');
        pdf.setFillColor(bgRgb.r, bgRgb.g, bgRgb.b);
        pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');
        
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeightInPdf);
        heightLeft -= pdfHeight;
        
        while (heightLeft > 15) {
          position = heightLeft - imgHeightInPdf;
          pdf.addPage();
          
          // Fill new page background color first
          pdf.setFillColor(bgRgb.r, bgRgb.g, bgRgb.b);
          pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');
          
          pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeightInPdf);
          heightLeft -= pdfHeight;
        }
        
        const pdfBlob = pdf.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        
        showToast('PDF généré avec succès !');
        if (isIOS && newWindow) {
          newWindow.location.href = pdfUrl;
        } else {
          const link = document.createElement('a');
          link.href = pdfUrl;
          link.download = `${data.fullName || 'Portfolio'}.pdf`;
          link.click();
        }
        ensureSaved().catch(console.error);
      } catch (err) {
        console.error('PDF generation error:', err);
        showToast('Erreur lors de la génération du PDF.', 'error');
        if (isIOS && newWindow) newWindow.close();
      }
    } else {
      setShowPaymentModal(true);
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


  const inputClass = "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[var(--color-ivory)] placeholder:text-[var(--color-white-muted)] focus:outline-none focus:border-[var(--color-champagne)] transition-all text-sm";
  const labelClass = "block text-sm font-medium text-[var(--color-white-muted)] mb-1.5";

  return (
    <div className="min-h-screen bg-[var(--color-obsidian)] flex flex-col print:bg-white print:min-h-0 print:block">
      {/* Top bar */}
      <div className="h-auto min-h-[3.5rem] border-b border-[rgba(255,255,255,0.06)] bg-[var(--color-charcoal)] flex items-center justify-between px-3 lg:px-6 py-2 shrink-0 print:hidden flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard/portfolio/templates')} className="text-[var(--color-white-muted)] hover:text-[var(--color-ivory)] transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-sm font-semibold text-[var(--color-ivory)]">Éditeur de Portfolio</h2>
            <p className="text-[11px] text-[var(--color-white-muted)] hidden sm:block">{template.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 lg:gap-3 flex-wrap">
          <button 
            onClick={handleSave}
            disabled={saving || isLoading}
            className="btn-ghost !py-2 !px-3 lg:!px-4 !text-xs flex items-center gap-1.5 disabled:opacity-50"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} 
            <span className="hidden sm:inline">{saving ? 'Sauvegarde...' : 'Sauvegarder'}</span>
          </button>
          
          <button 
            onClick={handleShareLink}
            disabled={isCheckingPayment || isLoading || saving}
            className="btn-ghost !py-2 !px-3 lg:!px-4 !text-xs flex items-center gap-1.5 disabled:opacity-50"
            title="Générer un lien public"
          >
            {isCheckingPayment ? <Loader2 size={14} className="animate-spin" /> : <Globe size={14} />} 
            <span className="hidden sm:inline">Publier en ligne</span>
          </button>

          <button 
            onClick={handleExport}
            disabled={isLoading || saving || isCheckingPurchase}
            className="btn-primary !py-2 !px-3 lg:!px-4 !text-xs flex items-center gap-1.5 disabled:opacity-50"
            title="Télécharger au format PDF"
          >
            {isCheckingPurchase ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />} 
            <span className="hidden sm:inline">Exporter PDF</span>
          </button>
        </div>
      </div>

      {/* Editor area */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden print:overflow-visible print:block print:h-auto">
        {/* LEFT — Form */}
        <div className="w-full lg:w-[45%] overflow-y-auto p-4 lg:p-6 space-y-6 lg:space-y-8 border-b lg:border-b-0 lg:border-r border-[rgba(255,255,255,0.06)] print:hidden">
          
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      className={`${inputClass} appearance-none`}
                      style={{ colorScheme: 'dark' }}
                    >
                      <option value="LinkedIn" className="bg-[#1C1C1E] text-white">LinkedIn</option>
                      <option value="Twitter" className="bg-[#1C1C1E] text-white">Twitter / X</option>
                      <option value="Instagram" className="bg-[#1C1C1E] text-white">Instagram</option>
                      <option value="TikTok" className="bg-[#1C1C1E] text-white">TikTok</option>
                      <option value="Facebook" className="bg-[#1C1C1E] text-white">Facebook</option>
                      <option value="YouTube" className="bg-[#1C1C1E] text-white">YouTube</option>
                      <option value="Vimeo" className="bg-[#1C1C1E] text-white">Vimeo</option>
                      <option value="Pinterest" className="bg-[#1C1C1E] text-white">Pinterest</option>
                      <option value="Site Web" className="bg-[#1C1C1E] text-white">Site Web</option>
                      <option value="Autre" className="bg-[#1C1C1E] text-white">Autre</option>
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
            {(projects || []).map((proj, i) => (
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                          {uploadProgress[i] !== undefined ? (
                            <>
                              <Loader2 size={18} className="text-[var(--color-champagne)] animate-spin" />
                              <span className="text-xs font-bold text-[var(--color-champagne)]">Upload en cours... {uploadProgress[i]}%</span>
                              <div className="w-full h-1.5 bg-white/10 rounded-full mt-1 overflow-hidden">
                                <div className="h-full bg-[var(--color-champagne)] rounded-full transition-all duration-300" style={{ width: `${uploadProgress[i]}%` }} />
                              </div>
                            </>
                          ) : (
                            <>
                              <Upload size={18} className="text-[var(--color-champagne)] group-hover:-translate-y-1 transition-transform" />
                              <span className="text-xs font-bold text-[var(--color-ivory)]">Cliquez pour ajouter un fichier</span>
                              <span className="text-[10px] text-[var(--color-white-muted)]">(Images, PDF, Vidéos MP4 - Max 20 Mo)</span>
                            </>
                          )}
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
        <div className="flex-1 overflow-y-auto bg-[var(--color-graphite)] p-4 lg:p-8 flex items-start justify-center print:bg-white print:p-0 print:m-0 print:block print:w-full print:h-auto print:overflow-visible print:relative print:z-10">
          <div className="w-full max-w-[100%] lg:max-w-[794px] print:max-w-none print:w-full print:mx-auto print:overflow-visible">
            <PreviewScaler>
              <PortfolioPreview template={template} data={{ ...data, projects }} />
            </PreviewScaler>
          </div>
        </div>
      </div>

      {/* Success/Error Modal Notification */}
      {createPortal(
        <AnimatePresence>
          {toast.show && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
              style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
            >
              <motion.div 
                initial={{ scale: 0.9, y: 10, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 10, opacity: 0 }}
                className="bg-[var(--color-obsidian)] border border-[rgba(201,169,110,0.3)] shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-2xl p-6 md:p-8 max-w-sm w-full flex flex-col items-center text-center relative overflow-hidden"
              >
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 blur-[60px] opacity-20 rounded-full ${toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`} />
                
                <div className="relative z-10">
                  <div className="mb-5">
                    {toast.type === 'error' ? (
                      <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20 mx-auto">
                        <AlertCircle size={32} />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 border border-green-500/20 mx-auto">
                        <CheckCircle2 size={32} />
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-[var(--color-ivory)] mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
                    {toast.type === 'error' ? 'Oops !' : 'Succès !'}
                  </h3>
                  <p className="text-[var(--color-white-muted)] text-sm leading-relaxed">
                    {toast.message}
                  </p>
                </div>
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
        templateName={`Modèle: ${template.name}`}
        price={template.tier === 'premium' ? '5 000' : '2 000'}
      />
    </div>
  );
}
