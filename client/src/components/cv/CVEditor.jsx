import React, { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, Wand2, Upload, Loader2, Save, Download, Camera, CheckCircle2, AlertCircle } from 'lucide-react';
import { getTemplate } from '../../data/templates';
import CVPreview from './CVPreview';
import PaymentModal from '../shared/PaymentModal';
import api from '../../services/api';
import { uploadFile } from '../../services/cloudinaryUpload';
import { Country, State, City } from 'country-state-city';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';
import CoverLetterPreview from './CoverLetterPreview';

const PreviewScaler = ({ children }) => {
  const containerRef = React.useRef(null);
  const contentRef = React.useRef(null);
  const [scale, setScale] = React.useState(1);
  const [contentHeight, setContentHeight] = React.useState(1123);

  React.useEffect(() => {
    const observer = new ResizeObserver(() => {
      if (containerRef.current) {
        const availableWidth = containerRef.current.clientWidth;
        // 794px = 210mm at 96dpi. Max scale is 1.
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
          id="cv-preview-container"
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

const DemographicItem = React.memo(({ demo, idx, updateDemographic, removeDemographic, inputClass }) => {
  let countryCode = demo.countryCode || '';
  if (!countryCode && demo.location) {
    const match = Country.getAllCountries().find(c => demo.location.toLowerCase().includes(c.name.toLowerCase()));
    if (match) countryCode = match.isoCode;
  }

  const states = React.useMemo(() => countryCode ? State.getStatesOfCountry(countryCode) : [], [countryCode]);
  const cities = React.useMemo(() => {
    if (!countryCode) return [];
    const allCities = City.getCitiesOfCountry(countryCode);
    // Limit to avoid DOM freeze, but keep a large enough number
    return allCities.length > 2000 ? allCities.slice(0, 2000) : allCities;
  }, [countryCode]);

  return (
    <div className="flex flex-wrap sm:flex-nowrap gap-3 mb-3 items-end bg-white/5 p-4 rounded-xl border border-white/10">
      <div className="flex-1 min-w-[140px]">
        <label className="text-[10px] uppercase tracking-widest text-[var(--color-white-muted)] mb-1.5 block">Pays</label>
        <select 
          value={countryCode}
          onChange={e => {
            const code = e.target.value;
            const countryName = code ? Country.getCountryByCode(code).name : '';
            updateDemographic(idx, {
              countryCode: code,
              city: '',
              location: countryName
            });
          }}
          className={inputClass}
        >
          <option value="" className="text-black bg-white">Sélectionner un pays</option>
          {Country.getAllCountries().map(c => (
            <option key={c.isoCode} value={c.isoCode} className="text-black bg-white">{c.name}</option>
          ))}
        </select>
      </div>
      
      <div className="flex-1 min-w-[140px]">
        <label className="text-[10px] uppercase tracking-widest text-[var(--color-white-muted)] mb-1.5 block">Région / Ville</label>
        <select
          value={demo.city || ''}
          onChange={e => {
            const city = e.target.value;
            const countryName = countryCode ? Country.getCountryByCode(countryCode).name : '';
            updateDemographic(idx, {
              city: city,
              location: city ? `${city}, ${countryName}` : countryName
            });
          }}
          disabled={!countryCode || (states.length === 0 && cities.length === 0)}
          className={`${inputClass} disabled:opacity-50`}
        >
          <option value="" className="text-black bg-white">Tout le pays</option>
          {states.length > 0 && (
            <optgroup label="Régions / États" className="text-black bg-gray-200 font-bold">
              {states.map(s => (
                <option key={`state-${s.isoCode}`} value={s.name} className="text-black bg-white font-normal">{s.name}</option>
              ))}
            </optgroup>
          )}
          {cities.length > 0 && (
            <optgroup label="Villes" className="text-black bg-gray-200 font-bold">
              {cities.map((c, i) => (
                <option key={`city-${c.name}-${i}`} value={c.name} className="text-black bg-white font-normal">{c.name}</option>
              ))}
            </optgroup>
          )}
        </select>
      </div>

      <div className="w-24">
        <label className="text-[10px] uppercase tracking-widest text-[var(--color-white-muted)] mb-1.5 block">Part (%)</label>
        <div className="relative">
          <input type="number" value={demo.percentage || ''} onChange={e => updateDemographic(idx, 'percentage', parseInt(e.target.value) || 0)} placeholder="Ex: 45" className={`${inputClass} pr-8`} />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-white-muted)] text-sm">%</span>
        </div>
      </div>

      <button onClick={() => removeDemographic(idx)} className="h-[46px] px-3 text-[var(--color-white-muted)] hover:text-red-400 bg-white/5 hover:bg-red-500/10 rounded-xl transition-colors border border-transparent hover:border-red-500/20 flex items-center justify-center shrink-0">
        <Trash2 size={16} />
      </button>
    </div>
  );
});

const emptyCVData = {
  fullName: '',
  jobTitle: '',
  summary: '',
  email: '',
  phone: '',
  location: '',
  website: '',
  linkedin: '',
  photo: '',
  skills: [],
  languages: [],
  educations: [{ institution: '', degree: '', startDate: '', endDate: '', description: '' }],
  socialStats: { instagram: '', tiktok: '', youtube: '', engagement: '' },
  mediaKitDetails: {
    editorial: [],
    primaryNetwork: '',
    demographics: []
  },
  collaborations: [],
  // Cover Letter fields
  recipientCompany: '',
  recipientName: '',
  recipientAddress: '',
  recipientCity: '',
  dateAndLocation: '',
  subject: '',
  salutation: '',
  body: '',
  closing: ''
};

const emptyExperience = {
  company: '',
  position: '',
  description: '',
  startDate: '',
  endDate: '',
  logoUrl: '',
};

export default function CVEditor() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const templateId = searchParams.get('template') || 'midnight-executive';
  const cvId = searchParams.get('cvId');
  const template = getTemplate(templateId);
  const isMediaKit = template?.layout === 'media-kit';
  const isCoverLetter = template?.layout === 'cover-letter';

  const [cvData, setCVData] = useState(emptyCVData);
  const [experiences, setExperiences] = useState([{ ...emptyExperience }]);
  const [skillInput, setSkillInput] = useState('');
  const [langInput, setLangInput] = useState('');
  const [enhancingSection, setEnhancingSection] = useState(null);
  const [saving, setSaving] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [isLoadingCV, setIsLoadingCV] = useState(!!cvId);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [isCheckingPurchase, setIsCheckingPurchase] = useState(true);


  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  useEffect(() => {
    if (cvId) {
      const loadCV = async () => {
        try {
          const res = await api.get(`/cv/${cvId}`);
          if (res.data.cv) {
            setCVData(prev => {
              const loadedData = res.data.cv.data || {};
              return {
                ...prev,
                ...loadedData,
                skills: loadedData.skills || [],
                languages: loadedData.languages || [],
                educations: loadedData.educations && loadedData.educations.length > 0 
                  ? loadedData.educations 
                  : [{ institution: '', degree: '', startDate: '', endDate: '', description: '' }],
                socialStats: { ...prev.socialStats, ...(loadedData.socialStats || {}) },
                mediaKitDetails: { ...prev.mediaKitDetails, ...(loadedData.mediaKitDetails || {}) },
                collaborations: loadedData.collaborations || []
              };
            });
            if (res.data.cv.experiences) {
              setExperiences(res.data.cv.experiences || []);
            }
          }
        } catch (err) {
          console.error('Error loading CV:', err);
          showToast('Erreur lors du chargement du CV', 'error');
        } finally {
          setIsLoadingCV(false);
        }
      };
      loadCV();
    }
  }, [cvId]);

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


  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        templateId,
        title: `${template?.name} - ${cvData.fullName || 'Sans titre'}`,
        data: cvData,
        experiences
      };
      
      if (cvId) {
        await api.put(`/cv/${cvId}`, payload);
        showToast('Modifications enregistrées !');
      } else {
        const res = await api.post('/cv', payload);
        showToast('Nouveau CV sauvegardé !');
        // Optionnel : on pourrait mettre à jour l'URL avec le nouvel ID
        navigate(`/dashboard/cv/editor?template=${templateId}&cvId=${res.data.cv.id}`, { replace: true });
      }
    } catch (err) {
      console.error('Save error:', err);
      showToast('Erreur lors de la sauvegarde.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async () => {
    // if (!hasPurchased) {
    //   setShowPaymentModal(true);
    //   return;
    // }

    const element = document.getElementById('cv-preview-container');
    if (!element) return;

    showToast('Préparation du PDF en cours...', 'success');

    try {
      // ─── html2canvas avec onclone ────────────────────────────────────────
      // onclone reçoit une COPIE INTERNE du document gérée par html2canvas.
      // Le DOM original (ce que l'utilisateur voit) n'est JAMAIS modifié.
      // Aucun wrapper n'est ajouté au body → aucune perturbation du layout.
      // ─────────────────────────────────────────────────────────────────────
      // ─── CORRECTION BUG iOS SAFARI ──────────────────────────────────────────
      // iOS Safari `html2canvas` utilise getBoundingClientRect() de l'élément original
      // Si l'élément a `transform: scale(0.4)`, iOS Safari coupe le canvas à 317px !
      // On retire temporairement le transform pour forcer 794px réels pendant la capture.
      const originalTransform = element.style.transform;
      element.style.transform = 'none';
      
      // Laisser le navigateur appliquer le changement de taille avant la capture
      await new Promise(r => setTimeout(r, 50));

      let canvas;
      try {
        canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        logging: false,
        width: 794,
        height: 1123,
        x: 0,
        y: 0,
        scrollX: 0,
        scrollY: 0,
        windowWidth: 794,
        windowHeight: 1123,
        backgroundColor: template.bg || '#ffffff',
        onclone: (clonedDoc, clonedEl) => {
          try {
            // clonedEl = copie du #cv-preview-container dans le doc interne html2canvas
            // Pas de transform, taille A4 exacte, overflow caché → 1 page
            clonedEl.style.cssText = [
              'width:794px',
              'height:1123px',
              'min-height:1123px',
              'max-height:1123px',
              'overflow:hidden',
              'transform:none',
              'position:static',
              'box-shadow:none',
            ].join(';');

            // Fond de page dans le clone
            clonedDoc.body.style.cssText = [
              `background:${template.bg || '#ffffff'}`,
              'margin:0',
              'padding:0',
              'width:794px',
            ].join(';');

            // Retirer les boutons (upload photo, supprimer) — pas dans le PDF
            clonedEl.querySelectorAll('button, input[type="file"], label[for], .print\\:hidden')
              .forEach(el => el.remove());

            // Corriger les images (CORS + pas de filtre grayscale)
            clonedEl.querySelectorAll('img').forEach(img => {
              img.crossOrigin = 'anonymous';
              img.style.filter = 'none';
              img.style.webkitFilter = 'none';
            });

          } catch (e) {
            console.warn('onclone error:', e);
          }
        }
      });
      } finally {
        // Restaurer le transform visuel immédiatement
        if (originalTransform) element.style.transform = originalTransform;
      }

      // ─── Génération PDF ──────────────────────────────────────────────────
      let imgData;
      try {
        imgData = canvas.toDataURL('image/jpeg', 0.95);
      } catch (e) {
        showToast("Erreur CORS : une image bloque l'export PDF.", 'error');
        return;
      }

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = pdf.internal.pageSize.getHeight();

      // Fond de couleur
      const hex2rgb = (h) => {
        const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
          h.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (_, a,b,c) => a+a+b+b+c+c)
        );
        return r ? { r:parseInt(r[1],16), g:parseInt(r[2],16), b:parseInt(r[3],16) } : {r:255,g:255,b:255};
      };
      const bg = hex2rgb(template.bg || '#ffffff');
      pdf.setFillColor(bg.r, bg.g, bg.b);
      pdf.rect(0, 0, pdfW, pdfH, 'F');

      // Image CV — 1 seule page A4
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfW, pdfH);

      // Couche ATS (texte invisible pour les parseurs)
      try {
        pdf.setFontSize(0.1);
        pdf.setTextColor(255, 255, 255);
        const ats = [
          cvData.fullName, cvData.jobTitle, cvData.email,
          cvData.phone, cvData.location, cvData.summary,
          ...(experiences||[]).flatMap(e => [e.position, e.company, e.description]),
          ...(educations||[]).flatMap(e => [e.degree, e.institution]),
          cvData.skills?.join(', '),
          cvData.languages?.join(', '),
        ].filter(Boolean);
        let y = 1;
        ats.forEach(l => { if (y < 290) { try { pdf.text(String(l).slice(0,500), 0, y); } catch(e){} y += 0.3; } });
      } catch(e) { /* ATS optionnel */ }

      // ─── Téléchargement ──────────────────────────────────────────────────
      const filename = `${cvData.fullName || 'CV'}_${template.name || 'SamaCVPro'}.pdf`;
      
      // Desktop / Android / iOS Moderne : pdf.save() intègre son propre téléchargement (<a> caché)
      pdf.save(filename);
      showToast('\u2705 PDF téléchargé avec succès !');

    } catch (err) {
      console.error('PDF generation error:', err);
      showToast('Erreur lors de la génération du PDF.', 'error');
    }
  };


  const updateField = useCallback((field, value) => {
    setCVData(prev => ({ ...prev, [field]: value }));
  }, []);

  const updateExperience = useCallback((index, field, value) => {
    setExperiences(prev => prev.map((exp, i) => i === index ? { ...exp, [field]: value } : exp));
  }, []);

  const addExperience = () => {
    setExperiences(prev => [...prev, { ...emptyExperience }]);
  };

  const removeExperience = (index) => {
    if (experiences.length <= 1) return;
    setExperiences(prev => prev.filter((_, i) => i !== index));
  };

  const addSkill = () => {
    if (!skillInput.trim()) return;
    setCVData(prev => ({ ...prev, skills: [...prev.skills, skillInput.trim()] }));
    setSkillInput('');
  };

  const removeSkill = (index) => {
    setCVData(prev => ({ ...prev, skills: prev.skills.filter((_, i) => i !== index) }));
  };

  const addLanguage = () => {
    if (!langInput.trim()) return;
    setCVData(prev => ({ ...prev, languages: [...prev.languages, langInput.trim()] }));
    setLangInput('');
  };

  const removeLanguage = (index) => {
    setCVData(prev => ({ ...prev, languages: prev.languages.filter((_, i) => i !== index) }));
  };

  const updateEducation = useCallback((index, field, value) => {
    setCVData(prev => ({
      ...prev,
      educations: prev.educations.map((edu, i) => i === index ? { ...edu, [field]: value } : edu)
    }));
  }, []);

  const addEducation = () => {
    setCVData(prev => ({
      ...prev,
      educations: [...(prev.educations || []), { institution: '', degree: '', startDate: '', endDate: '', description: '' }]
    }));
  };

  const removeEducation = (index) => {
    setCVData(prev => {
      const newEducations = prev.educations.filter((_, i) => i !== index);
      return { ...prev, educations: newEducations.length > 0 ? newEducations : [{ institution: '', degree: '', startDate: '', endDate: '', description: '' }] };
    });
  };

  // --- MEDIA KIT HELPERS ---
  const updateSocialStat = (field, value) => {
    setCVData(prev => ({
      ...prev,
      socialStats: { ...(prev.socialStats || {}), [field]: value }
    }));
  };

  const updateMediaKitDetail = (field, value) => {
    setCVData(prev => ({
      ...prev,
      mediaKitDetails: { ...(prev.mediaKitDetails || {}), [field]: value }
    }));
  };

  const [themeInput, setThemeInput] = useState('');
  const addTheme = () => {
    if (!themeInput.trim()) return;
    const current = cvData.mediaKitDetails?.editorial || [];
    updateMediaKitDetail('editorial', [...current, themeInput.trim()]);
    setThemeInput('');
  };
  const removeTheme = (index) => {
    const current = cvData.mediaKitDetails?.editorial || [];
    updateMediaKitDetail('editorial', current.filter((_, i) => i !== index));
  };

  const [collabInput, setCollabInput] = useState('');
  const addCollaboration = () => {
    if (!collabInput.trim()) return;
    setCVData(prev => ({ ...prev, collaborations: [...(prev.collaborations || []), collabInput.trim()] }));
    setCollabInput('');
  };
  const removeCollaboration = (index) => {
    setCVData(prev => ({ ...prev, collaborations: (prev.collaborations || []).filter((_, i) => i !== index) }));
  };

  const addDemographic = () => {
    const current = cvData.mediaKitDetails?.demographics || [];
    updateMediaKitDetail('demographics', [...current, { location: '', percentage: 0 }]);
  };
  const updateDemographic = useCallback((index, fieldOrUpdates, value) => {
    setCVData(prev => {
      const current = prev.mediaKitDetails?.demographics || [];
      const updated = current.map((demo, i) => {
        if (i !== index) return demo;
        if (typeof fieldOrUpdates === 'object') {
          return { ...demo, ...fieldOrUpdates };
        }
        return { ...demo, [fieldOrUpdates]: value };
      });
      return {
        ...prev,
        mediaKitDetails: { ...(prev.mediaKitDetails || {}), demographics: updated }
      };
    });
  }, []);
  const removeDemographic = (index) => {
    const current = cvData.mediaKitDetails?.demographics || [];
    updateMediaKitDetail('demographics', current.filter((_, i) => i !== index));
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

  const [uploadingLogos, setUploadingLogos] = useState({});
  const handleExperienceLogoUpload = async (idx, e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingLogos(prev => ({ ...prev, [idx]: true }));
    try {
      showToast('Upload du logo en cours...', 'success');
      const result = await uploadFile(file);
      updateExperience(idx, 'logoUrl', result.url);
      showToast('Logo uploadé avec succès !');
    } catch (err) {
      console.error('Experience logo upload error:', err);
      showToast(err.message || 'Erreur lors de l\'upload du logo.', 'error');
    } finally {
      setUploadingLogos(prev => ({ ...prev, [idx]: false }));
    }
  };

  const enhanceSection = async (section, content, setter) => {
    if (!content?.trim()) return;
    setEnhancingSection(section);
    try {
      const res = await api.post(`/cv/0/enhance`, { section, content, language: 'fr' });
      setter(res.data.enhanced);
    } catch (err) {
      console.error('AI enhance error:', err);
    } finally {
      setEnhancingSection(null);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsScanning(true);
    setScanSuccess(false);

    const formData = new FormData();
    formData.append('document', file);

    try {
      const res = await api.post('/ai/scan', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success && res.data.data) {
        const parsed = res.data.data;
        
        // Update basic info
        setCVData(prev => ({
          ...prev,
          fullName: parsed.fullName || prev.fullName,
          jobTitle: parsed.jobTitle || prev.jobTitle,
          summary: parsed.summary || prev.summary,
          email: parsed.email || prev.email,
          phone: parsed.phone || prev.phone,
          location: parsed.location || prev.location,
          linkedin: parsed.linkedin || prev.linkedin,
          skills: parsed.skills?.length > 0 ? parsed.skills : prev.skills,
          languages: parsed.languages?.length > 0 ? parsed.languages : prev.languages,
          educations: parsed.educations?.length > 0 ? parsed.educations : prev.educations,
        }));

        // Update experiences
        if (parsed.experiences && parsed.experiences.length > 0) {
          setExperiences(parsed.experiences.map(exp => ({
            company: exp.company || '',
            position: exp.position || '',
            description: exp.description || '',
            startDate: exp.startDate || '',
            endDate: exp.endDate || '',
            logoUrl: ''
          })));
        }

        setScanSuccess(true);
        showToast('Analyse IA terminée avec succès !');
        setTimeout(() => setScanSuccess(false), 3000);
      }
    } catch (err) {
      console.error('AI Scan Error:', err);
      showToast('Le service d\'analyse est momentanément indisponible. Veuillez réessayer plus tard.', 'error');
    } finally {
      setIsScanning(false);
      // Reset input so the same file can be uploaded again if needed
      e.target.value = null;
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[var(--color-ivory)] placeholder:text-[var(--color-white-muted)] focus:outline-none focus:border-[var(--color-champagne)] focus:ring-1 focus:ring-[var(--color-champagne)] transition-all text-sm";
  const labelClass = "block text-sm font-medium text-[var(--color-white-muted)] mb-1.5";

  return (
    <div className="min-h-screen bg-[var(--color-obsidian)] flex flex-col print:bg-white print:min-h-0 print:block">
      {/* Top bar */}
      <div className="h-auto min-h-[3.5rem] border-b border-[rgba(255,255,255,0.06)] bg-[var(--color-charcoal)] flex items-center justify-between px-3 lg:px-6 py-2 shrink-0 print:hidden flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="text-[var(--color-white-muted)] hover:text-[var(--color-ivory)] transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-sm font-semibold text-[var(--color-ivory)]">Éditeur de CV</h2>
            <p className="text-[11px] text-[var(--color-white-muted)] hidden sm:block">{template?.name || templateId}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 lg:gap-3">
          <button 
            onClick={handleSave}
            disabled={saving}
            className="btn-ghost !py-2 !px-3 lg:!px-4 !text-xs flex items-center gap-1.5 disabled:opacity-50"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} 
            <span className="hidden sm:inline">{saving ? 'Sauvegarde...' : 'Sauvegarder'}</span>
          </button>
          <button 
            onClick={handleExport}
            disabled={saving || isLoadingCV || isCheckingPurchase}
            className="btn-primary !py-2 !px-3 lg:!px-4 !text-xs flex items-center gap-1.5 disabled:opacity-50"
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
          {/* AI Import Box */}
          <section className="relative overflow-hidden rounded-2xl border border-[rgba(201,169,110,0.3)] bg-gradient-to-br from-[rgba(201,169,110,0.05)] to-transparent p-6 group cursor-pointer transition-colors hover:border-[var(--color-champagne)]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-champagne)] opacity-5 blur-[60px] rounded-full group-hover:opacity-10 transition-opacity" />
            <div className="flex items-start gap-4 relative z-10">
              <div className="w-12 h-12 rounded-full bg-[rgba(201,169,110,0.15)] flex items-center justify-center text-[var(--color-champagne)] shrink-0">
                <Wand2 size={24} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--color-champagne)] mb-1">Magie IA : Scannez votre CV</h3>
                <p className="text-xs text-[var(--color-white-muted)] mb-3 leading-relaxed">
                  Importez une photo ou un PDF de votre ancien CV. L'IA de Samacvpro va lire le document et remplir toutes les cases ci-dessous instantanément.
                </p>
                <label className={`relative inline-block ${isScanning ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isScanning}
                  />
                  <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                      scanSuccess 
                        ? 'bg-green-500 text-white' 
                        : 'bg-[var(--color-champagne)] text-[var(--color-obsidian)] hover:scale-105'
                    } ${isScanning ? 'opacity-70 scale-100' : ''}`}
                  >
                    {isScanning ? (
                      <><Loader2 size={14} className="animate-spin" /> Analyse en cours...</>
                    ) : scanSuccess ? (
                      <>Import réussi !</>
                    ) : (
                      <><Upload size={14} /> Importer un document</>
                    )}
                  </div>
                </label>
              </div>
            </div>
          </section>

          {/* Personal Info */}
          <section>
            <h3 className="text-lg font-bold text-[var(--color-ivory)] mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-serif)' }}>
              <span className="w-7 h-7 rounded-lg bg-[rgba(201,169,110,0.15)] flex items-center justify-center text-xs text-[var(--color-champagne)] font-bold">1</span>
              Informations personnelles
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="col-span-1 sm:col-span-2 flex gap-4">
                <div className="flex-1">
                  <label className={labelClass}>Nom complet *</label>
                  <input type="text" value={cvData.fullName} onChange={e => updateField('fullName', e.target.value)} placeholder="Abdou Diallo" className={inputClass} />
                </div>
                <div className="shrink-0 flex flex-col items-center justify-end pb-1 relative">
                  {cvData.photo && !isUploadingPhoto && (
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
                      ) : cvData.photo ? (
                        <img src={cvData.photo} alt="Profil" className="w-full h-full object-cover" />
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
              <div className="col-span-1 sm:col-span-2">
                <label className={labelClass}>Titre du poste *</label>
                <input type="text" value={cvData.jobTitle} onChange={e => updateField('jobTitle', e.target.value)} placeholder="Product Manager Senior" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input type="email" value={cvData.email} onChange={e => updateField('email', e.target.value)} placeholder="email@exemple.com" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Téléphone</label>
                <input type="tel" value={cvData.phone} onChange={e => updateField('phone', e.target.value)} placeholder="+221 77 000 00 00" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Localisation</label>
                <input type="text" value={cvData.location} onChange={e => updateField('location', e.target.value)} placeholder="Dakar, Sénégal" className={inputClass} />
              </div>
              {isCoverLetter && (
                <div>
                  <label className={labelClass}>Adresse</label>
                  <input type="text" value={cvData.address || ''} onChange={e => updateField('address', e.target.value)} placeholder="123 Rue Exemple" className={inputClass} />
                </div>
              )}
              <div>
                <label className={labelClass}>Site web</label>
                <input type="url" value={cvData.website} onChange={e => updateField('website', e.target.value)} placeholder="https://..." className={inputClass} />
              </div>
              <div className="col-span-1 sm:col-span-2">
                <label className={labelClass}>LinkedIn</label>
                <input type="url" value={cvData.linkedin} onChange={e => updateField('linkedin', e.target.value)} placeholder="https://linkedin.com/in/..." className={inputClass} />
              </div>
            </div>
          </section>

          {/* Summary */}
          {!isCoverLetter && !isMediaKit && (
            <section>
              <h3 className="text-lg font-bold text-[var(--color-ivory)] mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-serif)' }}>
                <span className="w-7 h-7 rounded-lg bg-[rgba(201,169,110,0.15)] flex items-center justify-center text-xs text-[var(--color-champagne)] font-bold">2</span>
                Accroche professionnelle
              </h3>
              <div className="relative">
                <textarea
                  value={cvData.summary}
                  onChange={e => updateField('summary', e.target.value)}
                  placeholder="Décrivez votre profil professionnel en quelques lignes percutantes..."
                  rows={4}
                  className={`${inputClass} resize-none`}
                />
                <button
                  onClick={() => enhanceSection('accroche', cvData.summary, (v) => updateField('summary', v))}
                  disabled={enhancingSection === 'accroche'}
                  className="absolute top-2 right-2 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[rgba(201,169,110,0.15)] hover:bg-[rgba(201,169,110,0.25)] text-[var(--color-champagne)] text-[11px] font-medium transition-colors"
                >
                  {enhancingSection === 'accroche' ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
                  IA
                </button>
              </div>
            </section>
          )}

          {isCoverLetter ? (
            <>
              <section>
                <h3 className="text-lg font-bold text-[var(--color-ivory)] mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-serif)' }}>
                  <span className="w-7 h-7 rounded-lg bg-[rgba(201,169,110,0.15)] flex items-center justify-center text-xs text-[var(--color-champagne)] font-bold">2</span>
                  Destinataire
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="col-span-1 sm:col-span-2">
                    <label className={labelClass}>Nom de l'entreprise *</label>
                    <input type="text" value={cvData.recipientCompany} onChange={e => updateField('recipientCompany', e.target.value)} placeholder="Entreprise XYZ" className={inputClass} />
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <label className={labelClass}>Personne à contacter / Service</label>
                    <input type="text" value={cvData.recipientName} onChange={e => updateField('recipientName', e.target.value)} placeholder="M. le Directeur des Ressources Humaines" className={inputClass} />
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <label className={labelClass}>Adresse de l'entreprise</label>
                    <input type="text" value={cvData.recipientAddress} onChange={e => updateField('recipientAddress', e.target.value)} placeholder="123 Rue de l'Innovation" className={inputClass} />
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <label className={labelClass}>Ville du destinataire</label>
                    <input type="text" value={cvData.recipientCity} onChange={e => updateField('recipientCity', e.target.value)} placeholder="Dakar, Sénégal" className={inputClass} />
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold text-[var(--color-ivory)] mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-serif)' }}>
                  <span className="w-7 h-7 rounded-lg bg-[rgba(201,169,110,0.15)] flex items-center justify-center text-xs text-[var(--color-champagne)] font-bold">3</span>
                  En-tête et Corps du texte
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className={labelClass}>Lieu et date de rédaction</label>
                    <input type="text" value={cvData.dateAndLocation} onChange={e => updateField('dateAndLocation', e.target.value)} placeholder="Dakar, le 19 Mai 2026" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Objet de la lettre *</label>
                    <input type="text" value={cvData.subject} onChange={e => updateField('subject', e.target.value)} placeholder="Candidature pour le poste de..." className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Salutation</label>
                    <input type="text" value={cvData.salutation} onChange={e => updateField('salutation', e.target.value)} placeholder="Madame, Monsieur," className={inputClass} />
                  </div>
                  <div className="relative">
                    <label className={labelClass}>Corps du texte *</label>
                    <textarea 
                      value={cvData.body} 
                      onChange={e => updateField('body', e.target.value)} 
                      placeholder="Texte de votre lettre de motivation..." 
                      rows={12} 
                      className={`${inputClass} resize-y`} 
                    />
                    <button
                      onClick={() => enhanceSection('lettre de motivation', cvData.body, (v) => updateField('body', v))}
                      disabled={enhancingSection === 'lettre de motivation'}
                      className="absolute top-8 right-2 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[rgba(201,169,110,0.15)] hover:bg-[rgba(201,169,110,0.25)] text-[var(--color-champagne)] text-[11px] font-medium transition-colors"
                    >
                      {enhancingSection === 'lettre de motivation' ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
                      IA
                    </button>
                  </div>
                  <div>
                    <label className={labelClass}>Formule de politesse</label>
                    <textarea 
                      value={cvData.closing} 
                      onChange={e => updateField('closing', e.target.value)} 
                      placeholder="Dans l'attente d'une réponse de votre part..." 
                      rows={2} 
                      className={`${inputClass} resize-none`} 
                    />
                  </div>
                </div>
              </section>
            </>
          ) : !isMediaKit ? (
            <>
          {/* Experiences */}
          <section>
            <h3 className="text-lg font-bold text-[var(--color-ivory)] mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-serif)' }}>
              <span className="w-7 h-7 rounded-lg bg-[rgba(201,169,110,0.15)] flex items-center justify-center text-xs text-[var(--color-champagne)] font-bold">3</span>
              Expérience professionnelle
            </h3>
            {(experiences || []).map((exp, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-5 mb-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center gap-2 group cursor-pointer">
                      <div className="w-12 h-12 rounded-full border-2 border-dashed border-[rgba(201,169,110,0.3)] flex items-center justify-center hover:border-[var(--color-champagne)] hover:bg-[rgba(201,169,110,0.05)] transition-all relative">
                        <label className="cursor-pointer w-full h-full flex items-center justify-center">
                          <input 
                            type="file" 
                            id={`exp-logo-${idx}`}
                            name={`exp-logo-${idx}`}
                            accept="image/*" 
                            onChange={e => handleExperienceLogoUpload(idx, e)} 
                            className="hidden" 
                            disabled={uploadingLogos[idx]} 
                          />
                          {uploadingLogos[idx] ? (
                            <Loader2 size={16} className="animate-spin text-[var(--color-champagne)]" />
                          ) : exp.logoUrl ? (
                            <img src={exp.logoUrl} alt="" className="w-full h-full rounded-full object-cover" />
                          ) : (
                            <Upload size={16} className="text-[var(--color-champagne)] opacity-50 group-hover:opacity-100" />
                          )}
                        </label>
                        {exp.logoUrl && !uploadingLogos[idx] && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              updateExperience(idx, 'logoUrl', '');
                            }}
                            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white text-[10px] hover:bg-red-600 transition-colors"
                            title="Supprimer le logo"
                          >
                            ×
                          </button>
                        )}
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--color-champagne)] opacity-60 group-hover:opacity-100 transition-opacity">Logo</span>
                    </div>
                    <span className="text-sm font-medium text-[var(--color-ivory)]">Expérience {idx + 1}</span>
                  </div>
                  {experiences.length > 1 && (
                    <button onClick={() => removeExperience(idx)} className="text-[var(--color-white-muted)] hover:text-red-400 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Entreprise *</label>
                    <input type="text" value={exp.company} onChange={e => updateExperience(idx, 'company', e.target.value)} placeholder="Google" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Poste *</label>
                    <input type="text" value={exp.position} onChange={e => updateExperience(idx, 'position', e.target.value)} placeholder="Product Manager" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Début</label>
                    <input type="text" value={exp.startDate} onChange={e => updateExperience(idx, 'startDate', e.target.value)} placeholder="Jan 2022" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Fin</label>
                    <input type="text" value={exp.endDate} onChange={e => updateExperience(idx, 'endDate', e.target.value)} placeholder="Présent" className={inputClass} />
                  </div>
                  <div className="col-span-1 sm:col-span-2 relative">
                    <label className={labelClass}>Description</label>
                    <textarea
                      value={exp.description}
                      onChange={e => updateExperience(idx, 'description', e.target.value)}
                      placeholder="• Dirigé une équipe de 12 développeurs..."
                      rows={3}
                      className={`${inputClass} resize-none`}
                    />
                    <button
                      onClick={() => enhanceSection('expérience', exp.description, (v) => updateExperience(idx, 'description', v))}
                      disabled={enhancingSection === 'expérience'}
                      className="absolute top-8 right-2 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[rgba(201,169,110,0.15)] hover:bg-[rgba(201,169,110,0.25)] text-[var(--color-champagne)] text-[10px] font-medium transition-colors"
                    >
                      {enhancingSection === 'expérience' ? <Loader2 size={10} className="animate-spin" /> : <Wand2 size={10} />}
                      IA
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
            <button onClick={addExperience} className="w-full py-3 rounded-xl border border-dashed border-[rgba(201,169,110,0.2)] text-sm text-[var(--color-champagne)] hover:bg-[rgba(201,169,110,0.05)] transition-colors flex items-center justify-center gap-2">
              <Plus size={16} /> Ajouter une expérience
            </button>
          </section>

          {/* Education */}
          <section>
            <h3 className="text-lg font-bold text-[var(--color-ivory)] mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-serif)' }}>
              <span className="w-7 h-7 rounded-lg bg-[rgba(201,169,110,0.15)] flex items-center justify-center text-xs text-[var(--color-champagne)] font-bold">4</span>
              Formation
            </h3>
            {(cvData.educations || []).map((edu, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-5 mb-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-[var(--color-ivory)]">Formation {idx + 1}</span>
                  {(cvData.educations?.length || 0) > 1 && (
                    <button onClick={() => removeEducation(idx)} className="text-[var(--color-white-muted)] hover:text-red-400 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Établissement *</label>
                    <input type="text" value={edu.institution} onChange={e => updateEducation(idx, 'institution', e.target.value)} placeholder="Université de Dakar" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Diplôme *</label>
                    <input type="text" value={edu.degree} onChange={e => updateEducation(idx, 'degree', e.target.value)} placeholder="Master en Informatique" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Début</label>
                    <input type="text" value={edu.startDate} onChange={e => updateEducation(idx, 'startDate', e.target.value)} placeholder="2018" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Fin</label>
                    <input type="text" value={edu.endDate} onChange={e => updateEducation(idx, 'endDate', e.target.value)} placeholder="2020" className={inputClass} />
                  </div>
                  <div className="col-span-1 sm:col-span-2 relative">
                    <label className={labelClass}>Description</label>
                    <textarea
                      value={edu.description}
                      onChange={e => updateEducation(idx, 'description', e.target.value)}
                      placeholder="• Spécialisation en génie logiciel..."
                      rows={2}
                      className={`${inputClass} resize-none`}
                    />
                    <button
                      onClick={() => enhanceSection('formation', edu.description, (v) => updateEducation(idx, 'description', v))}
                      disabled={enhancingSection === 'formation'}
                      className="absolute top-8 right-2 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[rgba(201,169,110,0.15)] hover:bg-[rgba(201,169,110,0.25)] text-[var(--color-champagne)] text-[10px] font-medium transition-colors"
                    >
                      {enhancingSection === 'formation' ? <Loader2 size={10} className="animate-spin" /> : <Wand2 size={10} />}
                      IA
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
            <button onClick={addEducation} className="w-full py-3 rounded-xl border border-dashed border-[rgba(201,169,110,0.2)] text-sm text-[var(--color-champagne)] hover:bg-[rgba(201,169,110,0.05)] transition-colors flex items-center justify-center gap-2">
              <Plus size={16} /> Ajouter une formation
            </button>
          </section>

          {/* Skills */}
          <section>
            <h3 className="text-lg font-bold text-[var(--color-ivory)] mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-serif)' }}>
              <span className="w-7 h-7 rounded-lg bg-[rgba(201,169,110,0.15)] flex items-center justify-center text-xs text-[var(--color-champagne)] font-bold">5</span>
              Compétences
            </h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {(cvData.skills || []).map((skill, i) => (
                <span key={i} className="px-3 py-1.5 rounded-full bg-[rgba(201,169,110,0.1)] border border-[rgba(201,169,110,0.2)] text-xs text-[var(--color-champagne)] flex items-center gap-1.5">
                  {skill}
                  <button onClick={() => removeSkill(i)} className="hover:text-red-400">×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                placeholder="Ex: React, Gestion de projet..."
                className={`${inputClass} flex-1`}
              />
              <button onClick={addSkill} className="btn-ghost !py-2 !px-4 !text-xs shrink-0">Ajouter</button>
            </div>
          </section>

          {/* Languages */}
          <section className="pb-8">
            <h3 className="text-lg font-bold text-[var(--color-ivory)] mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-serif)' }}>
              <span className="w-7 h-7 rounded-lg bg-[rgba(201,169,110,0.15)] flex items-center justify-center text-xs text-[var(--color-champagne)] font-bold">6</span>
              Langues
            </h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {(cvData.languages || []).map((lang, i) => (
                <span key={i} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-[var(--color-ivory)] flex items-center gap-1.5">
                  {lang}
                  <button onClick={() => removeLanguage(i)} className="hover:text-red-400">×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={langInput}
                onChange={e => setLangInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
                placeholder="Ex: Français (natif), Anglais (courant)..."
                className={`${inputClass} flex-1`}
              />
              <button onClick={addLanguage} className="btn-ghost !py-2 !px-4 !text-xs shrink-0">Ajouter</button>
            </div>
          </section>
            </>
          ) : (
            <>
              {/* Media Kit Fields */}
              <section>
                <h3 className="text-lg font-bold text-[var(--color-ivory)] mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-serif)' }}>
                  <span className="w-7 h-7 rounded-lg bg-[rgba(201,169,110,0.15)] flex items-center justify-center text-xs text-[var(--color-champagne)] font-bold">3</span>
                  Statistiques Réseaux Sociaux
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Abonnés Instagram</label>
                    <input type="text" value={cvData.socialStats?.instagram || ''} onChange={e => updateSocialStat('instagram', e.target.value)} placeholder="Ex: 10.5K" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Abonnés TikTok</label>
                    <input type="text" value={cvData.socialStats?.tiktok || ''} onChange={e => updateSocialStat('tiktok', e.target.value)} placeholder="Ex: 50K" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Abonnés YouTube</label>
                    <input type="text" value={cvData.socialStats?.youtube || ''} onChange={e => updateSocialStat('youtube', e.target.value)} placeholder="Ex: 5K" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Taux d'Engagement</label>
                    <input type="text" value={cvData.socialStats?.engagement || ''} onChange={e => updateSocialStat('engagement', e.target.value)} placeholder="Ex: 4.5%" className={inputClass} />
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold text-[var(--color-ivory)] mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-serif)' }}>
                  <span className="w-7 h-7 rounded-lg bg-[rgba(201,169,110,0.15)] flex items-center justify-center text-xs text-[var(--color-champagne)] font-bold">4</span>
                  Ligne Éditoriale
                </h3>
                <div className="mb-4">
                  <label className={labelClass}>Réseau Principal</label>
                  <input type="text" value={cvData.mediaKitDetails?.primaryNetwork || ''} onChange={e => updateMediaKitDetail('primaryNetwork', e.target.value)} placeholder="Ex: TIKTOK" className={inputClass} />
                </div>
                <label className={labelClass}>Thèmes abordés (Entrée pour ajouter)</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {(cvData.mediaKitDetails?.editorial || []).map((theme, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-full bg-[rgba(201,169,110,0.1)] border border-[rgba(201,169,110,0.2)] text-xs text-[var(--color-champagne)] flex items-center gap-1.5">
                      {theme}
                      <button onClick={() => removeTheme(i)} className="hover:text-red-400">×</button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input type="text" value={themeInput} onChange={e => setThemeInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTheme())} placeholder="Ex: Lifestyle, Mode, Tech..." className={`${inputClass} flex-1`} />
                  <button onClick={addTheme} className="btn-ghost !py-2 !px-4 !text-xs shrink-0">Ajouter</button>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold text-[var(--color-ivory)] mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-serif)' }}>
                  <span className="w-7 h-7 rounded-lg bg-[rgba(201,169,110,0.15)] flex items-center justify-center text-xs text-[var(--color-champagne)] font-bold">5</span>
                  Localisation de l'Audience
                </h3>
                {(cvData.mediaKitDetails?.demographics || []).map((demo, idx) => (
                  <DemographicItem 
                    key={idx} 
                    demo={demo} 
                    idx={idx} 
                    updateDemographic={updateDemographic} 
                    removeDemographic={removeDemographic} 
                    inputClass={inputClass} 
                  />
                ))}
                <button onClick={addDemographic} className="text-sm font-medium text-[var(--color-champagne)] mt-3 flex items-center gap-1.5 hover:bg-[rgba(201,169,110,0.1)] px-3 py-1.5 rounded-lg transition-colors"><Plus size={16} /> Ajouter une localisation</button>
              </section>

              <section className="pb-8">
                <h3 className="text-lg font-bold text-[var(--color-ivory)] mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-serif)' }}>
                  <span className="w-7 h-7 rounded-lg bg-[rgba(201,169,110,0.15)] flex items-center justify-center text-xs text-[var(--color-champagne)] font-bold">6</span>
                  Collaborations & Marques
                </h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {(cvData.collaborations || []).map((collab, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-[var(--color-ivory)] flex items-center gap-1.5">
                      {collab}
                      <button onClick={() => removeCollaboration(i)} className="hover:text-red-400">×</button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input type="text" value={collabInput} onChange={e => setCollabInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCollaboration())} placeholder="Ex: L'Oréal, Nike, Samsung..." className={`${inputClass} flex-1`} />
                  <button onClick={addCollaboration} className="btn-ghost !py-2 !px-4 !text-xs shrink-0">Ajouter</button>
                </div>
              </section>
            </>
          )}
        </div>

        {/* RIGHT — Live Preview */}
        <div className="flex-1 overflow-y-auto bg-[var(--color-graphite)] p-4 lg:p-8 flex items-start justify-center print:bg-white print:p-0 print:m-0 print:block print:w-full print:h-auto print:overflow-visible print:relative print:z-10">
          <div className="w-full max-w-[100%] lg:max-w-[794px] print:max-w-none print:w-full print:mx-auto print:overflow-visible">
            <PreviewScaler>
              {isCoverLetter ? (
                <CoverLetterPreview template={template} cvData={cvData} />
              ) : (
                <CVPreview 
                  template={template} 
                  cvData={cvData} 
                  experiences={experiences}
                  educations={cvData.educations}
                  onPhotoUpload={handlePhotoUpload}
                  onPhotoRemove={() => updateField('photo', '')}
                  isUploadingPhoto={isUploadingPhoto}
                />
              )}
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

      {/* Payment Modal Simulation */}
      <PaymentModal 
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={() => {
          setHasPurchased(true);
          setShowPaymentModal(false);
          showToast('Paiement réussi ! Vous pouvez maintenant exporter.');
        }}
        templateId={templateId}
        templateName={`Modèle: ${template?.name || templateId}`}
        price={isMediaKit ? "2 000" : "1 500"}
      />
    </div>
  );
}
