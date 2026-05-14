import { useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, Wand2, Upload, Loader2, Save, Download, GripVertical } from 'lucide-react';
import { getTemplate } from '../../data/templates';
import CVPreview from './CVPreview';
import api from '../../services/api';

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
  const template = getTemplate(templateId);

  const [cvData, setCVData] = useState(emptyCVData);
  const [experiences, setExperiences] = useState([{ ...emptyExperience }]);
  const [skillInput, setSkillInput] = useState('');
  const [langInput, setLangInput] = useState('');
  const [enhancingSection, setEnhancingSection] = useState(null);
  const [saving, setSaving] = useState(false);

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

  const inputClass = "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[var(--color-ivory)] placeholder:text-[var(--color-white-muted)] focus:outline-none focus:border-[var(--color-champagne)] focus:ring-1 focus:ring-[var(--color-champagne)] transition-all text-sm";
  const labelClass = "block text-sm font-medium text-[var(--color-white-muted)] mb-1.5";

  return (
    <div className="min-h-screen bg-[var(--color-obsidian)] flex flex-col">
      {/* Top bar */}
      <div className="h-16 border-b border-[rgba(255,255,255,0.06)] bg-[var(--color-charcoal)] flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="text-[var(--color-white-muted)] hover:text-[var(--color-ivory)] transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-sm font-semibold text-[var(--color-ivory)]">Éditeur de CV</h2>
            <p className="text-[11px] text-[var(--color-white-muted)]">{template?.name || templateId}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="btn-ghost !py-2 !px-4 !text-xs flex items-center gap-1.5">
            <Save size={14} /> Sauvegarder
          </button>
          <button className="btn-primary !py-2 !px-4 !text-xs flex items-center gap-1.5">
            <Download size={14} /> Exporter PDF
          </button>
        </div>
      </div>

      {/* Editor area */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT — Form */}
        <div className="w-[45%] overflow-y-auto p-6 space-y-6 border-r border-[rgba(255,255,255,0.06)]">
          {/* Personal Info */}
          <section>
            <h3 className="text-lg font-bold text-[var(--color-ivory)] mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-serif)' }}>
              <span className="w-7 h-7 rounded-lg bg-[rgba(201,169,110,0.15)] flex items-center justify-center text-xs text-[var(--color-champagne)] font-bold">1</span>
              Informations personnelles
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className={labelClass}>Nom complet *</label>
                <input type="text" value={cvData.fullName} onChange={e => updateField('fullName', e.target.value)} placeholder="Abdou Diallo" className={inputClass} />
              </div>
              <div className="col-span-2">
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
              <div>
                <label className={labelClass}>Site web</label>
                <input type="url" value={cvData.website} onChange={e => updateField('website', e.target.value)} placeholder="https://..." className={inputClass} />
              </div>
              <div className="col-span-2">
                <label className={labelClass}>LinkedIn</label>
                <input type="url" value={cvData.linkedin} onChange={e => updateField('linkedin', e.target.value)} placeholder="https://linkedin.com/in/..." className={inputClass} />
              </div>
            </div>
          </section>

          {/* Summary */}
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

          {/* Experiences */}
          <section>
            <h3 className="text-lg font-bold text-[var(--color-ivory)] mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-serif)' }}>
              <span className="w-7 h-7 rounded-lg bg-[rgba(201,169,110,0.15)] flex items-center justify-center text-xs text-[var(--color-champagne)] font-bold">3</span>
              Expérience professionnelle
            </h3>
            {experiences.map((exp, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-5 mb-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {/* Logo circle */}
                    <div className="w-11 h-11 rounded-full border-2 border-dashed border-[rgba(201,169,110,0.3)] flex items-center justify-center cursor-pointer hover:border-[var(--color-champagne)] transition-colors group">
                      {exp.logoUrl ? (
                        <img src={exp.logoUrl} alt="" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <span className="text-xs text-[var(--color-white-muted)] group-hover:text-[var(--color-champagne)]">
                          {exp.company ? exp.company.substring(0, 2).toUpperCase() : <Upload size={14} />}
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-medium text-[var(--color-ivory)]">Expérience {idx + 1}</span>
                  </div>
                  {experiences.length > 1 && (
                    <button onClick={() => removeExperience(idx)} className="text-[var(--color-white-muted)] hover:text-red-400 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
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
                  <div className="col-span-2 relative">
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

          {/* Skills */}
          <section>
            <h3 className="text-lg font-bold text-[var(--color-ivory)] mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-serif)' }}>
              <span className="w-7 h-7 rounded-lg bg-[rgba(201,169,110,0.15)] flex items-center justify-center text-xs text-[var(--color-champagne)] font-bold">4</span>
              Compétences
            </h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {cvData.skills.map((skill, i) => (
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
              <span className="w-7 h-7 rounded-lg bg-[rgba(201,169,110,0.15)] flex items-center justify-center text-xs text-[var(--color-champagne)] font-bold">5</span>
              Langues
            </h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {cvData.languages.map((lang, i) => (
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
        </div>

        {/* RIGHT — Live Preview */}
        <div className="flex-1 overflow-y-auto bg-[var(--color-graphite)] p-8 flex items-start justify-center">
          <div className="w-full max-w-[600px] shadow-[var(--shadow-cinematic)] rounded-lg overflow-hidden">
            <CVPreview template={template} cvData={cvData} experiences={experiences} />
          </div>
        </div>
      </div>
    </div>
  );
}
