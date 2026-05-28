import { useGoogleFont } from '../../hooks/useGoogleFont';
import { Mail, Phone, MapPin, Globe, Link2, Camera, Trash2, Loader2 } from 'lucide-react';

/* =========================================================
   UTILITIES & COMPONENTS
   ========================================================= */

function Initials({ name, accent }) {
  if (!name || name.trim() === '') return null;
  const initials = name.substring(0, 2).toUpperCase();
  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
      style={{ background: `${accent}20`, color: accent, border: `1px solid ${accent}30`, minWidth: '36px', minHeight: '36px' }}
    >
      {initials}
    </div>
  );
}

function ContactItem({ icon: Icon, value, color }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-2.5 text-[11px] leading-[1.4] font-medium" style={{ color }}>
      <Icon size={14} className="shrink-0" />
      <span className="break-words flex-1">{value}</span>
    </div>
  );
}

function SkillBadge({ skill, accent }) {
  return (
    <span className="px-2.5 py-1 rounded-sm text-[10px] font-medium"
      style={{ background: `${accent}15`, color: accent, border: `1px solid ${accent}25` }}>
      {skill}
    </span>
  );
}

/* =========================================================
   1. SINGLE COLUMN (Classic ATS Layout)
   - Highly structured, single column, clear headers.
   ========================================================= */
function LayoutSingleColumn({ template, cvData, experiences, educations, colors }) {
  const { accent, text } = template;
  const { mutedColor, dividerColor } = colors;

  return (
    <div className="p-6">
      {/* Header compact */}
      <header className="flex items-center gap-4 mb-4 pb-3 border-b" style={{ borderColor: dividerColor }}>
        <Initials name={cvData.fullName} accent={accent} photo={cvData.photo} />
        <div className="flex-1">
          <h1 className="text-xl font-bold tracking-tight uppercase" style={{ color: text }}>
            {cvData.fullName || 'Votre Nom'}
          </h1>
          <h2 className="text-xs font-semibold tracking-[0.15em] uppercase" style={{ color: accent }}>
            {cvData.jobTitle || 'Votre Titre'}
          </h2>
        </div>
        <div className="flex flex-col gap-1 text-right">
          <ContactItem icon={Mail} value={cvData.email} color={mutedColor} />
          <ContactItem icon={Phone} value={cvData.phone} color={mutedColor} />
          <ContactItem icon={MapPin} value={cvData.location} color={mutedColor} />
        </div>
      </header>

      {/* Profil */}
      {cvData.summary && (
        <section className="mb-4">
          <h3 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: text }}>Profil Professionnel</h3>
          <p className="text-[11px] leading-[1.5] text-justify" style={{ color: mutedColor }}>{cvData.summary}</p>
        </section>
      )}

      {/* Expériences */}
      {experiences?.length > 0 && (
        <section className="mb-4">
          <h3 className="text-xs font-bold uppercase tracking-widest mb-2.5 pb-1 border-b" style={{ color: text, borderColor: dividerColor }}>
            Expériences
          </h3>
          <div className="space-y-3">
            {(experiences || []).filter(e => e.company || e.position).map((exp, i) => (
              <article key={i}>
                <div className="flex items-baseline justify-between">
                  <h4 className="font-bold text-[12px]" style={{ color: text }}>{exp.position}</h4>
                  <span className="text-[10px] font-medium shrink-0 ml-2" style={{ color: accent }}>
                    {exp.startDate}{exp.endDate ? ` — ${exp.endDate}` : ''}
                  </span>
                </div>
                <div className="text-[11px] font-medium" style={{ color: text, opacity: 1 }}>{exp.company}</div>
                {exp.description && (
                  <p className="text-[11px] leading-[1.5] mt-1 font-medium" style={{ color: mutedColor }}>{exp.description}</p>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Formation */}
      {educations?.length > 0 && (
        <section className="mb-4">
          <h3 className="text-xs font-bold uppercase tracking-widest mb-2.5 pb-1 border-b" style={{ color: text, borderColor: dividerColor }}>
            Formation
          </h3>
          <div className="space-y-3">
            {(educations || []).filter(e => e.institution || e.degree).map((edu, i) => (
              <article key={i}>
                <div className="flex items-baseline justify-between">
                  <h4 className="font-bold text-[12px]" style={{ color: text }}>{edu.degree}</h4>
                  <span className="text-[10px] font-medium shrink-0 ml-2" style={{ color: accent }}>
                    {edu.startDate}{edu.endDate ? ` — ${edu.endDate}` : ''}
                  </span>
                </div>
                <div className="text-[11px] font-medium" style={{ color: text, opacity: 1 }}>{edu.institution}</div>
                {edu.description && (
                  <p className="text-[11px] leading-[1.5] mt-1 font-medium" style={{ color: mutedColor }}>{edu.description}</p>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Compétences + Langues côte à côte */}
      <div className="flex gap-6">
        {cvData.skills?.length > 0 && (
          <section className="flex-1">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-2 pb-1 border-b" style={{ color: text, borderColor: dividerColor }}>
              Compétences
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {cvData.skills?.map((skill, i) => <SkillBadge key={i} skill={skill} accent={accent} />)}
            </div>
          </section>
        )}
        {cvData.languages?.length > 0 && (
          <section className="w-[222px] shrink-0">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-2 pb-1 border-b" style={{ color: text, borderColor: dividerColor }}>
              Langues
            </h3>
            <ul className="space-y-0.5">
              {cvData.languages?.map((lang, i) => (
                <li key={i} className="text-[11px] flex items-center gap-1.5" style={{ color: mutedColor }}>
                  <span className="w-1 h-1 rounded-full bg-current opacity-50" /> {lang}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   2. TWO COLUMN (Modern Sidebar Layout)
   - Left sidebar for info/skills, right for content.
   ========================================================= */
function LayoutTwoColumn({ template, cvData, experiences, educations, colors, onPhotoUpload, onPhotoRemove, isUploadingPhoto }) {
  const { accent, text, secondary } = template;
  const { mutedColor, dividerColor } = colors;

  return (
    <div className="flex flex-nowrap w-[794px] min-w-[794px] max-w-[794px]" style={{ minHeight: '1123px' }}>
      {/* Sidebar */}
      <aside className="w-[238px] min-w-[238px] max-w-[238px] shrink-0 px-4 py-3 flex flex-col gap-2 overflow-hidden" style={{ background: secondary }}>
        {/* Photo / Initiales avec upload */}
        <div className="relative shrink-0 group mx-auto mb-5">
          {cvData.photo && !isUploadingPhoto && onPhotoRemove && (
            <button 
              onClick={onPhotoRemove}
              className="absolute -top-1 -right-1 z-20 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100 print:hidden"
              title="Supprimer la photo"
            >
              <Trash2 size={12} />
            </button>
          )}
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-xl font-bold shadow-lg overflow-hidden relative"
            style={{ 
              background: `linear-gradient(135deg, ${accent}, ${accent}80)`, 
              color: secondary,
              width: '80px',
              height: '80px',
              minWidth: '80px',
              minHeight: '80px',
              borderRadius: '50%'
            }}>
            {isUploadingPhoto ? (
              <Loader2 size={24} className="animate-spin text-current z-10" />
            ) : cvData.photo ? (
              <img 
                src={cvData.photo} 
                crossOrigin="anonymous" 
                alt={cvData.fullName} 
                className="w-full h-full object-cover absolute inset-0 z-0" 
                style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              <span className="z-0 opacity-60">
                {cvData.fullName ? cvData.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : '??'}
              </span>
            )}
            {onPhotoUpload && (
              <label className={`absolute inset-0 cursor-pointer flex flex-col items-center justify-center text-white transition-opacity z-10 print:hidden ${cvData.photo ? 'bg-black/40 opacity-0 group-hover:opacity-100' : 'bg-black/20 hover:bg-black/40 opacity-100'}`}>
                <input type="file" accept="image/*" onChange={onPhotoUpload} className="hidden" disabled={isUploadingPhoto} />
                {!isUploadingPhoto && (
                  <>
                    <Camera size={18} className="mb-0.5" />
                    <span className="text-[8px] font-bold uppercase tracking-widest">Photo</span>
                  </>
                )}
              </label>
            )}
          </div>
        </div>

        {/* Contact */}
        <section className="space-y-2.5 mb-5">
          <ContactItem icon={Mail} value={cvData.email} color={mutedColor} />
          <ContactItem icon={Phone} value={cvData.phone} color={mutedColor} />
          <ContactItem icon={MapPin} value={cvData.location} color={mutedColor} />
          <ContactItem icon={Globe} value={cvData.website} color={mutedColor} />
          <ContactItem icon={Link2} value={cvData.linkedin} color={mutedColor} />
        </section>

        {/* Compétences */}
        {cvData.skills?.length > 0 && (
          <section className="mb-5">
            <h3 className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: accent }}>Expertise</h3>
            <ul className="space-y-1">
              {cvData.skills.map((skill, i) => (
                <li key={i}>
                  <span className="text-[10px] font-medium block mb-0.5" style={{ color: mutedColor }}>{skill}</span>
                  <div className="flex gap-[2px] mt-1.5">
                    {[1, 2, 3, 4, 5].map(level => (
                      <div key={level} className="h-[3px] flex-1 rounded-sm" style={{ background: accent, opacity: level <= 4 ? 1 : 0.2 }} />
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Langues */}
        {cvData.languages?.length > 0 && (
          <section className="mt-3">
            <h3 className="text-[11px] font-bold uppercase tracking-widest mb-2.5" style={{ color: accent }}>Langues</h3>
            <ul className="space-y-1.5">
              {cvData.languages?.map((lang, i) => (
                <li key={i} className="text-[11px]" style={{ color: mutedColor }}>
                  {lang} <span style={{ color: accent }}>•••</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-[556px] min-w-[556px] max-w-[556px] px-5 py-2 flex flex-col gap-2 overflow-hidden">
        {/* Nom + Titre */}
        <header className="mb-2">
          <h1 className="text-3xl font-bold tracking-tight mb-2" style={{ color: text, fontFamily: template.fontTitle ? `"${template.fontTitle}", serif` : undefined }}>
            {cvData.fullName || 'Votre Nom'}
          </h1>
          <h2 className="text-sm font-semibold tracking-widest uppercase" style={{ color: accent, fontFamily: template.fontTitle ? `"${template.fontTitle}", serif` : undefined }}>
            {cvData.jobTitle || 'Votre Titre'}
          </h2>
        </header>

        {/* Profil */}
        {cvData.summary && (
          <section className="mb-4">
            <div className="w-8 h-0.5 mb-2" style={{ background: accent }} />
            <p className="text-[11px] leading-[1.5]" style={{ color: mutedColor }}>{cvData.summary}</p>
          </section>
        )}

        {/* Expériences */}
        {experiences?.length > 0 && (
          <section className="mb-6">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-3" style={{ color: text, fontFamily: template.fontTitle ? `"${template.fontTitle}", serif` : undefined }}>
              Expériences
              <div className="flex-1 h-[1px]" style={{ background: dividerColor }} />
            </h3>
            <div className="space-y-6">
              {(experiences || []).filter(e => e.company || e.position).map((exp, i) => (
                <article key={i} className="flex gap-3">
                  {exp.logoUrl ? (
                    <img src={exp.logoUrl} crossOrigin="anonymous" alt="" className="w-9 h-9 rounded shadow-sm shrink-0 object-cover" />
                  ) : (
                    <Initials name={exp.company} accent={accent} />
                  )}
                  <div className="flex-1">
                    <h4 className="font-bold text-[12px]" style={{ color: text }}>{exp.position}</h4>
                    <div className="flex items-center gap-2 text-[10px] mb-1" style={{ color: mutedColor }}>
                      <span className="font-semibold" style={{ color: accent }}>{exp.company}</span>
                      <span>•</span>
                      <span>{exp.startDate}{exp.endDate ? ` - ${exp.endDate}` : ''}</span>
                    </div>
                    {exp.description && (
                      <p className="text-[11px] leading-[1.35] break-words font-medium" style={{ color: mutedColor }}>{exp.description}</p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Formation */}
        {educations?.length > 0 && (
          <section className="mt-8">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-3" style={{ color: text, fontFamily: template.fontTitle ? `"${template.fontTitle}", serif` : undefined }}>
              Formation
              <div className="flex-1 h-[1px]" style={{ background: dividerColor }} />
            </h3>
            <div className="space-y-6">
              {(educations || []).filter(e => e.institution || e.degree).map((edu, i) => (
                <article key={i} className="flex gap-3">
                  <Initials name={edu.institution} accent={accent} />
                  <div className="flex-1">
                    <h4 className="font-bold text-[13px] tracking-wide" style={{ color: text }}>{edu.degree}</h4>
                    <div className="text-[11px] font-semibold flex items-center gap-2 mb-1" style={{ color: accent }}>
                      <span>{edu.institution}</span>
                      <span className="w-1 h-1 rounded-full" style={{ background: dividerColor }} />
                      <span>{edu.startDate}{edu.endDate ? ` - ${edu.endDate}` : ''}</span>
                    </div>
                    {edu.description && (
                      <p className="text-[11px] leading-[1.35] break-words font-medium" style={{ color: mutedColor }}>{edu.description}</p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

/* =========================================================
   3. GRID (Grid Timeline Layout)
   - Left small col for dates, right for content. Tech feel.
   ========================================================= */
function LayoutGrid({ template, cvData, experiences, educations, colors }) {
  const { accent, text, secondary } = template;
  const { mutedColor, dividerColor } = colors;

  return (
    <div className="p-6 font-mono">
      {/* Header compact */}
      <header className="border-b-3 pb-3 mb-3" style={{ borderColor: accent }}>
        <h1 className="text-xl font-bold uppercase mb-0.5" style={{ color: text }}>
          {cvData.fullName || 'NOM PRENOM'}
        </h1>
        <div className="flex items-center justify-between">
          <h2 className="text-xs uppercase tracking-widest font-semibold" style={{ color: accent }}>{cvData.jobTitle || 'TITRE DU POSTE'}</h2>
          <div className="flex gap-3 text-[10px]" style={{ color: mutedColor }}>
            <span>{cvData.email}</span>
            <span>|</span>
            <span>{cvData.phone}</span>
            <span>|</span>
            <span>{cvData.location}</span>
          </div>
        </div>
      </header>

      {/* Profil */}
      {cvData.summary && (
        <section className="mb-3 p-3 rounded-sm border-l-2" style={{ background: secondary, borderColor: accent }}>
          <p className="text-[11px] leading-[1.4] font-sans" style={{ color: text }}>{cvData.summary}</p>
        </section>
      )}

      <div className="grid grid-cols-[1fr_200px] gap-5">
        {/* Expériences */}
        <section>
          <h3 className="text-xs font-bold uppercase mb-2" style={{ color: text }}>&gt; Expériences</h3>
          <div className="relative border-l ml-2" style={{ borderColor: dividerColor }}>
            {experiences?.filter(e => e.company || e.position).map((exp, i) => (
              <article key={i} className="mb-2.5 pl-3 relative">
                <div className="absolute w-1.5 h-1.5 rounded-full -left-[4px] top-1.5" style={{ background: accent }} />
                <div className="text-[9px] font-bold uppercase" style={{ color: accent }}>
                  {exp.startDate} - {exp.endDate || 'PRÉSENT'}
                </div>
                <h4 className="font-bold text-[11px] uppercase" style={{ color: text }}>{exp.position}</h4>
                <div className="text-[10px]" style={{ color: mutedColor }}>@ {exp.company}</div>
                {exp.description && (
                  <p className="text-[11px] font-sans leading-[1.4] mt-0.5" style={{ color: text, opacity: 1 }}>{exp.description}</p>
                )}
              </article>
            ))}
          </div>
        </section>

        {/* Formation */}
        {educations?.length > 0 && (
          <section className="mt-6">
            <h3 className="text-xs font-bold uppercase mb-2" style={{ color: text }}>&gt; Formation</h3>
            <div className="relative border-l ml-2" style={{ borderColor: dividerColor }}>
              {(educations || []).filter(e => e.institution || e.degree).map((edu, i) => (
                <article key={i} className="mb-2.5 pl-3 relative">
                  <div className="absolute w-1.5 h-1.5 rounded-full -left-[4px] top-1.5" style={{ background: accent }} />
                  <div className="text-[9px] font-bold uppercase" style={{ color: accent }}>
                    {edu.startDate} - {edu.endDate || 'PRÉSENT'}
                  </div>
                  <h4 className="font-bold text-[11px] uppercase" style={{ color: text }}>{edu.degree}</h4>
                  <div className="text-[10px]" style={{ color: mutedColor }}>@ {edu.institution}</div>
                  {edu.description && (
                    <p className="text-[11px] font-sans leading-[1.4] mt-0.5" style={{ color: text, opacity: 1 }}>{edu.description}</p>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Sidebar: Stack Tech + Langues */}
        <aside className="space-y-4">
          <section>
            <h3 className="text-xs font-bold uppercase mb-2" style={{ color: text }}>&gt; Stack Tech</h3>
            <div className="flex flex-wrap gap-1">
              {cvData.skills?.map((s, i) => (
                <span key={i} className="text-[10px] px-1.5 py-0.5 border" style={{ color: text, borderColor: dividerColor }}>{s}</span>
              ))}
            </div>
          </section>
          <section>
            <h3 className="text-xs font-bold uppercase mb-2" style={{ color: text }}>&gt; Langues</h3>
            <ul className="text-[11px] font-sans space-y-0.5" style={{ color: mutedColor }}>
              {cvData.languages?.map((l, i) => <li key={i}>[{l}]</li>)}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}

/* =========================================================
   4. ASYMMETRIC (Editorial Asymmetric Layout)
   - Heavy typography, large names, luxurious feel.
   ========================================================= */
function LayoutAsymmetric({ template, cvData, experiences, educations, colors }) {
  const { accent, text } = template;
  const { mutedColor, dividerColor } = colors;

  return (
    <div className="p-6 flex flex-col min-h-[1123px]">
      {/* Header compact */}
      <header className="flex justify-between items-end mb-4 pb-3 border-b-2" style={{ borderColor: text }}>
        <div className="w-[516px] shrink-0">
          <h1 className="text-2xl font-black uppercase leading-none tracking-tighter mb-1" style={{ color: text, fontFamily: "'Playfair Display', serif" }}>
            {cvData.fullName || 'VOTRE NOM'}
          </h1>
          <h2 className="text-sm italic" style={{ color: accent, fontFamily: "'Playfair Display', serif" }}>
            {cvData.jobTitle || 'Votre Titre'}
          </h2>
        </div>
        <div className="text-right text-[10px] space-y-0.5 font-medium uppercase tracking-widest" style={{ color: mutedColor }}>
          <p>{cvData.email}</p>
          <p>{cvData.phone}</p>
          <p>{cvData.location}</p>
        </div>
      </header>

      <div className="flex gap-6 flex-1">
        {/* Main content */}
        <main className="flex-1">
          {/* Profil */}
          {cvData.summary && (
            <section className="mb-4">
              <h3 className="text-[9px] font-bold uppercase tracking-[0.3em] mb-2" style={{ color: accent }}>A propos</h3>
              <p className="text-[11px] leading-[1.4] font-serif" style={{ color: text }}>{cvData.summary}</p>
            </section>
          )}

          {/* Parcours */}
          <section className="mb-4">
            <h3 className="text-[9px] font-bold uppercase tracking-[0.3em] mb-3" style={{ color: accent }}>Parcours</h3>
            <div className="space-y-2.5">
              {experiences?.filter(e => e.company || e.position).map((exp, i) => (
                <article key={i} className="flex gap-4 border-b pb-2.5" style={{ borderColor: dividerColor }}>
                  <div className="w-20 shrink-0 text-[9px] font-bold uppercase tracking-wider pt-0.5" style={{ color: mutedColor }}>
                    {exp.startDate}<br/>|<br/>{exp.endDate}
                  </div>
                  <div>
                    <h4 className="text-[12px] font-bold uppercase tracking-wide" style={{ color: text }}>{exp.position}</h4>
                    <p className="text-[11px] font-serif italic" style={{ color: accent }}>{exp.company}</p>
                    {exp.description && (
                      <p className="text-[11px] leading-[1.4] mt-0.5" style={{ color: mutedColor }}>{exp.description}</p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Formation */}
          {educations?.length > 0 && (
            <section>
              <h3 className="text-[9px] font-bold uppercase tracking-[0.3em] mb-3" style={{ color: accent }}>Formation</h3>
              <div className="space-y-2">
                {(educations || []).filter(e => e.institution || e.degree).map((edu, i) => (
                  <article key={i} className="flex gap-4 border-b pb-2" style={{ borderColor: dividerColor }}>
                    <div className="w-20 shrink-0 text-[9px] font-bold uppercase tracking-wider pt-0.5" style={{ color: mutedColor }}>
                      {edu.startDate}<br/>|<br/>{edu.endDate}
                    </div>
                    <div>
                      <h4 className="text-[12px] font-bold uppercase tracking-wide" style={{ color: text }}>{edu.degree}</h4>
                      <p className="text-[11px] font-serif italic" style={{ color: accent }}>{edu.institution}</p>
                      {edu.description && (
                        <p className="text-[11px] leading-[1.4] mt-0.5" style={{ color: mutedColor }}>{edu.description}</p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </main>

        {/* Sidebar */}
        <aside className="w-[160px] shrink-0 space-y-5">
          <section>
            <h3 className="text-[9px] font-bold uppercase tracking-[0.3em] mb-2" style={{ color: accent }}>Expertise</h3>
            <ul className="space-y-1">
              {cvData.skills?.map((skill, i) => (
                <li key={i} className="text-[11px] font-medium uppercase tracking-wider" style={{ color: text }}>{skill}</li>
              ))}
            </ul>
          </section>
          <section>
            <h3 className="text-[9px] font-bold uppercase tracking-[0.3em] mb-2" style={{ color: accent }}>Langues</h3>
            <ul className="space-y-1">
              {cvData.languages?.map((lang, i) => (
                <li key={i} className="text-[11px] font-serif italic" style={{ color: mutedColor }}>{lang}</li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}

/* =========================================================
   5. CREATIVE (Creative Floating Layout)
   - Rounded corners, vibrant, badges everywhere.
   ========================================================= */
function LayoutCreative({ template, cvData, experiences, educations, colors }) {
  const { accent, text, secondary, bg } = template;
  const { mutedColor, dividerColor } = colors;

  return (
    <div className="p-5">
      {/* Header compact */}
      <div className="rounded-xl p-5 mb-4 relative overflow-hidden" style={{ background: secondary }}>
        <div className="absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-20" style={{ background: accent }} />
        <h1 className="text-2xl font-extrabold mb-1 relative z-10" style={{ color: text }}>{cvData.fullName || 'Votre Nom'}</h1>
        <h2 className="text-xs font-bold uppercase tracking-widest relative z-10" style={{ color: accent }}>{cvData.jobTitle || 'Votre Titre'}</h2>
        
        <div className="flex gap-3 mt-3 relative z-10 flex-wrap">
          {cvData.email && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10" style={{ color: text }}>{cvData.email}</span>}
          {cvData.phone && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10" style={{ color: text }}>{cvData.phone}</span>}
          {cvData.location && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10" style={{ color: text }}>{cvData.location}</span>}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Main content (2/3) */}
        <div className="col-span-2 space-y-3">
          {/* Profil */}
          {cvData.summary && (
            <section className="p-4 rounded-xl border" style={{ borderColor: dividerColor }}>
              <p className="text-[11px] leading-[1.4] font-medium" style={{ color: mutedColor }}>{cvData.summary}</p>
            </section>
          )}

          {/* Expériences */}
          <section>
            <h3 className="text-xs font-black uppercase mb-2 pl-2 border-l-4" style={{ color: text, borderColor: accent }}>Expériences</h3>
            <div className="space-y-2">
              {experiences?.filter(e => e.company || e.position).map((exp, i) => (
                <article key={i} className="p-3 rounded-lg" style={{ background: secondary }}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h4 className="font-bold text-[12px]" style={{ color: text }}>{exp.position}</h4>
                      <div className="text-[11px] font-semibold" style={{ color: accent }}>{exp.company}</div>
                    </div>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/5 shrink-0 ml-2" style={{ color: mutedColor }}>{exp.startDate} - {exp.endDate}</span>
                  </div>
                  {exp.description && (
                    <p className="text-[11px] leading-[1.4] mt-1" style={{ color: mutedColor }}>{exp.description}</p>
                  )}
                </article>
              ))}
            </div>
          </section>

          {/* Formation */}
          {educations?.length > 0 && (
            <section>
              <h3 className="text-xs font-black uppercase mb-2 pl-2 border-l-4" style={{ color: text, borderColor: accent }}>Formation</h3>
              <div className="space-y-2">
                {(educations || []).filter(e => e.institution || e.degree).map((edu, i) => (
                  <article key={i} className="p-3 rounded-lg" style={{ background: secondary }}>
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h4 className="font-bold text-[12px]" style={{ color: text }}>{edu.degree}</h4>
                        <div className="text-[11px] font-semibold" style={{ color: accent }}>{edu.institution}</div>
                      </div>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/5 shrink-0 ml-2" style={{ color: mutedColor }}>{edu.startDate} - {edu.endDate}</span>
                    </div>
                    {edu.description && (
                      <p className="text-[11px] leading-[1.4] mt-1" style={{ color: mutedColor }}>{edu.description}</p>
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar (1/3) */}
        <div className="space-y-4">
          <section className="p-4 rounded-xl" style={{ background: secondary }}>
            <h3 className="text-[11px] font-black uppercase mb-2" style={{ color: text }}>Super Pouvoirs</h3>
            <div className="flex flex-col gap-1.5">
              {cvData.skills?.map((skill, i) => (
                <div key={i} className="px-2 py-1.5 rounded-lg text-[10px] font-bold flex justify-between" style={{ background: bg, color: text }}>
                  <span>{skill}</span>
                  <span style={{ color: accent }}>+</span>
                </div>
              ))}
            </div>
          </section>
          
          <section className="p-4 rounded-xl border" style={{ borderColor: dividerColor }}>
            <h3 className="text-[11px] font-black uppercase mb-2" style={{ color: text }}>Langues</h3>
            <div className="flex flex-wrap gap-1.5">
              {cvData.languages?.map((lang, i) => (
                <span key={i} className="w-full text-center px-2 py-1.5 rounded text-[10px] font-bold border" style={{ borderColor: accent, color: accent }}>{lang}</span>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   6. MEDIA KIT (Influencer Layout)
   - Heavy focus on stats, collaborations, brand identity.
   ========================================================= */
function LayoutMediaKitClassic({ template, cvData, colors, onPhotoUpload, onPhotoRemove, isUploadingPhoto }) {
  const { accent, text, secondary, bg } = template;
  const { mutedColor, dividerColor } = colors;

  return (
    <div className="flex flex-col min-h-[1123px]" style={{ background: bg, color: text }}>
      {/* Header compact */}
      <header className="p-6 pb-4 flex items-center justify-between" style={{ background: secondary }}>
        <div className="flex-1">
          <h1 className="text-2xl font-black uppercase tracking-tighter mb-1" style={{ color: text }}>
            {cvData.fullName || 'VOTRE NOM'}
          </h1>
          <h2 className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: accent }}>
            {cvData.jobTitle || 'Influenceur & Créateur'}
          </h2>
        </div>
        <div className="relative shrink-0 group">
          {cvData.photo && !isUploadingPhoto && onPhotoRemove && (
            <button 
              onClick={onPhotoRemove}
              className="absolute -top-2 -right-2 z-20 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100 print:hidden"
              title="Supprimer la photo"
            >
              <Trash2 size={12} />
            </button>
          )}

          <div className="w-20 h-20 rounded-full border-3 shadow-xl flex items-center justify-center text-2xl font-bold overflow-hidden relative"
            style={{ 
              borderColor: accent, 
              background: bg, 
              color: accent,
              width: '80px',
              height: '80px',
              minWidth: '80px',
              minHeight: '80px',
              borderRadius: '50%'
            }}>

            {isUploadingPhoto ? (
              <Loader2 size={24} className="animate-spin text-current z-10" />
            ) : cvData.photo ? (
              <img 
                src={cvData.photo} 
                crossOrigin="anonymous" 
                alt={cvData.fullName} 
                className="w-full h-full object-cover absolute inset-0 z-0" 
                style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center z-0 opacity-50">
                {cvData.fullName ? cvData.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : '??'}
              </div>
            )}

            {onPhotoUpload && (
              <label className={`absolute inset-0 cursor-pointer flex flex-col items-center justify-center text-white transition-opacity z-10 print:hidden ${cvData.photo ? 'bg-black/40 opacity-0 group-hover:opacity-100' : 'bg-black/20 hover:bg-black/40 opacity-100'}`}>
                <input type="file" accept="image/*" onChange={onPhotoUpload} className="hidden" disabled={isUploadingPhoto} />
                {!isUploadingPhoto && (
                  <>
                    <Camera size={18} className="mb-0.5" />
                    <span className="text-[8px] font-bold uppercase tracking-widest">Photo</span>
                  </>
                )}
              </label>
            )}
          </div>
        </div>
      </header>

      <div className="p-6 flex-1 flex flex-col gap-4">
        <section className="text-center">
          <p className="text-[11px] leading-[1.4] font-medium max-w-2xl mx-auto" style={{ color: mutedColor }}>
            {cvData.summary}
          </p>
        </section>

        {cvData.socialStats && (
          <section className="grid grid-cols-4 gap-3">
            <div className="p-3 rounded-lg text-center border" style={{ borderColor: dividerColor, background: secondary }}>
              <div className="text-lg font-black mb-0.5" style={{ color: text }}>{cvData.socialStats.instagram}</div>
              <div className="text-[9px] font-bold uppercase tracking-wider" style={{ color: accent }}>Instagram</div>
            </div>
            <div className="p-3 rounded-lg text-center border" style={{ borderColor: dividerColor, background: secondary }}>
              <div className="text-lg font-black mb-0.5" style={{ color: text }}>{cvData.socialStats.tiktok}</div>
              <div className="text-[9px] font-bold uppercase tracking-wider" style={{ color: accent }}>TikTok</div>
            </div>
            <div className="p-3 rounded-lg text-center border" style={{ borderColor: dividerColor, background: secondary }}>
              <div className="text-lg font-black mb-0.5" style={{ color: text }}>{cvData.socialStats.youtube}</div>
              <div className="text-[9px] font-bold uppercase tracking-wider" style={{ color: accent }}>YouTube</div>
            </div>
            <div className="p-3 rounded-lg text-center border" style={{ borderColor: dividerColor, background: accent }}>
              <div className="text-lg font-black mb-0.5" style={{ color: bg }}>{cvData.socialStats.engagement}</div>
              <div className="text-[9px] font-bold uppercase tracking-wider" style={{ color: bg }}>Engagement</div>
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-5">
          <section>
            <h3 className="text-[11px] font-black uppercase mb-2 tracking-widest border-b pb-1" style={{ color: accent, borderColor: dividerColor }}>
              Ligne Éditoriale & Thèmes
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {((cvData.mediaKitDetails?.editorial || []) || cvData.skills)?.map((theme, i) => (
                <span key={i} className="px-2 py-1 rounded-full text-[9px] font-bold uppercase" style={{ background: secondary, color: text }}>
                  {theme}
                </span>
              ))}
            </div>
            {cvData.mediaKitDetails?.primaryNetwork && (
              <div className="mt-3 pt-3 border-t" style={{ borderColor: dividerColor }}>
                <p className="text-[9px] font-bold uppercase tracking-widest mb-0.5" style={{ color: mutedColor }}>Réseau Principal</p>
                <p className="text-xs font-black" style={{ color: accent }}>{cvData.mediaKitDetails.primaryNetwork}</p>
              </div>
            )}
          </section>
          
          <section>
            <h3 className="text-[11px] font-black uppercase mb-2 tracking-widest border-b pb-1" style={{ color: accent, borderColor: dividerColor }}>
              Localisation de l'Audience
            </h3>
            <div className="space-y-2">
              {(cvData.mediaKitDetails?.demographics || []).map((demo, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: text }}>
                    <span>{demo.location}</span>
                    <span style={{ color: accent }}>{demo.percentage}%</span>
                  </div>
                  <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: secondary }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${demo.percentage}%`, background: accent }} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {cvData.collaborations && (
          <section className="mt-auto pt-4 border-t" style={{ borderColor: dividerColor }}>
            <h3 className="text-[9px] font-bold uppercase mb-3 tracking-widest text-center" style={{ color: mutedColor }}>Ils m'ont fait confiance</h3>
            <div className="flex justify-center flex-wrap gap-4">
              {cvData.collaborations?.map((brand, i) => (
                <div key={i} className="text-sm font-black uppercase opacity-60 tracking-tighter" style={{ color: text, fontFamily: template.fontTitle ? `"${template.fontTitle}", serif` : undefined }}>
                  {brand}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <footer className="p-3 text-center text-[9px] font-bold tracking-widest uppercase flex justify-center gap-4" style={{ background: accent, color: bg }}>
        <span>{cvData.email}</span>
        <span>{cvData.phone}</span>
        {cvData.linkedin && <span>{cvData.linkedin.replace('linkedin.com/in/', '@')}</span>}
      </footer>
    </div>
  );
}





/* =========================================================
   7. MEDIA KIT SPLIT
   ========================================================= */
function LayoutMediaKitSplit({ template, cvData, colors, onPhotoUpload, onPhotoRemove, isUploadingPhoto }) {
  const { accent, text, secondary, bg, fontTitle, fontBody } = template;
  const { mutedColor, dividerColor } = colors;

  return (
    <div className="flex w-full h-full min-h-[1123px]" style={{ background: bg, color: text }}>
      {/* Left Column */}
      <div className="w-[300px] shrink-0 p-8 flex flex-col gap-8 relative" style={{ background: secondary }}>
        {/* Photo */}
        <div className="relative group mx-auto w-48 h-48 z-10">
          {cvData.photo && !isUploadingPhoto && onPhotoRemove && (
            <button onClick={onPhotoRemove} className="absolute -top-2 -right-2 z-20 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg opacity-0 group-hover:opacity-100 print:hidden"><Trash2 size={14} /></button>
          )}
          <div className="w-full h-full bg-white shadow-xl flex items-center justify-center text-4xl font-bold overflow-hidden relative" style={{ color: secondary }}>
            {isUploadingPhoto ? <Loader2 size={32} className="animate-spin text-current z-10" /> : cvData.photo ? <img src={cvData.photo} crossOrigin="anonymous" alt={cvData.fullName} className="w-full h-full object-cover absolute inset-0 z-0" /> : <div className="absolute inset-0 flex items-center justify-center z-0 opacity-50">{cvData.fullName ? cvData.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : '??'}</div>}
            {onPhotoUpload && <label className={"absolute inset-0 cursor-pointer flex flex-col items-center justify-center text-white transition-opacity z-10 print:hidden " + (cvData.photo ? 'bg-black/40 opacity-0 group-hover:opacity-100' : 'bg-black/20 hover:bg-black/40 opacity-100')}><input type="file" accept="image/*" onChange={onPhotoUpload} className="hidden" disabled={isUploadingPhoto} />{!isUploadingPhoto && <><Camera size={24} className="mb-1" /><span className="text-[10px] font-bold uppercase tracking-widest">Photo</span></>}</label>}
          </div>
        </div>

        {cvData.mediaKitDetails?.primaryNetwork && (
          <div className="text-center font-bold text-lg tracking-wider relative z-10" style={{ color: bg }}>
            @{cvData.mediaKitDetails.primaryNetwork}
          </div>
        )}

        {/* SOCIALS */}
        <div className="mt-4 relative z-10">
          <div className="bg-[#1A1A1A] text-white py-2 px-4 mb-4 font-bold tracking-widest text-sm inline-block transform -rotate-90 origin-bottom-left absolute -left-12 mt-32" style={{ letterSpacing: '0.3em' }}>
            SOCIALS
          </div>
          <div className="grid grid-cols-2 gap-4 pl-8">
            <div className="text-center">
              <div className="text-xl font-bold mb-1" style={{ color: bg }}>{cvData.socialStats?.instagram || '10K+'}</div>
              <div className="text-[10px] font-bold uppercase" style={{ color: text }}>Instagram</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold mb-1" style={{ color: bg }}>{cvData.socialStats?.tiktok || '15K+'}</div>
              <div className="text-[10px] font-bold uppercase" style={{ color: text }}>TikTok</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold mb-1" style={{ color: bg }}>{cvData.socialStats?.youtube || '5K+'}</div>
              <div className="text-[10px] font-bold uppercase" style={{ color: text }}>YouTube</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold mb-1" style={{ color: bg }}>{cvData.socialStats?.engagement || '3%'}</div>
              <div className="text-[10px] font-bold uppercase" style={{ color: text }}>Engagement</div>
            </div>
          </div>
        </div>

        {/* STATS BLOCKS */}
        <div className="grid grid-cols-3 gap-2 mt-8 relative z-10">
          <div className="bg-[#1A1A1A] text-white p-2 text-center rounded">
            <div className="font-bold text-sm">20K</div>
            <div className="text-[8px] opacity-70">Abonnés Email</div>
          </div>
          <div className="bg-[#1A1A1A] text-white p-2 text-center rounded">
            <div className="font-bold text-sm">30K</div>
            <div className="text-[8px] opacity-70">Visiteurs / Mois</div>
          </div>
          <div className="bg-[#1A1A1A] text-white p-2 text-center rounded">
            <div className="font-bold text-sm">17K</div>
            <div className="text-[8px] opacity-70">Vues / Mois</div>
          </div>
        </div>

        {/* SAY HELLO */}
        <div className="mt-auto text-center relative z-10 pt-10">
          <h3 className="text-5xl mb-4" style={{ fontFamily: '"Playfair Display", serif', color: bg, fontStyle: 'italic', fontWeight: 700 }}>Say Hello!</h3>
          <p className="text-sm font-bold mb-1" style={{ color: text }}>{cvData.website || 'www.votre-site.com'}</p>
          <p className="text-sm font-bold" style={{ color: text }}>{cvData.email || 'hello@votre-site.com'}</p>
        </div>
      </div>

      {/* Right Column */}
      <div className="flex-1 p-12 flex flex-col gap-10">
        <header className="text-center border-b pb-6" style={{ borderColor: dividerColor }}>
          <h1 className="text-5xl font-bold tracking-[0.2em] uppercase mb-4" style={{ fontFamily: \`"\${fontTitle}", sans-serif\` }}>
            {cvData.fullName || 'VOTRE NOM'}
          </h1>
          <h2 className="text-sm font-medium tracking-wide" style={{ color: mutedColor }}>
            {cvData.jobTitle || 'Votre Titre de Créateur'}
          </h2>
        </header>

        <section>
          <h3 className="text-center text-sm font-bold tracking-[0.2em] uppercase mb-6" style={{ color: secondary }}>
            A PROPOS DE MOI
          </h3>
          <p className="text-[13px] leading-relaxed text-justify font-medium" style={{ color: mutedColor }}>
            {cvData.summary || "Votre bio apparaitra ici..."}
          </p>
        </section>

        <section>
          <h3 className="text-center text-sm font-bold tracking-[0.2em] uppercase mb-8" style={{ color: secondary }}>
            AUDIENCE
            <div className="flex justify-center mt-4">
              <div className="h-[1px] w-32" style={{ background: dividerColor }} />
            </div>
          </h3>
          <div className="flex items-center justify-around">
            <div className="space-y-4 font-bold text-sm">
              {(cvData.mediaKitDetails?.demographics || []).map((demo, i) => (
                <div key={i} className="flex gap-4">
                  <span>{demo.percentage}%</span>
                  <span className="font-normal" style={{ color: mutedColor }}>{demo.location}</span>
                </div>
              ))}
            </div>
            <div className="w-48 h-32 opacity-20 bg-gray-300 rounded-xl flex items-center justify-center">
               (Carte du Monde)
            </div>
          </div>
        </section>

        {cvData.collaborations && (
          <section className="mt-auto">
             <h3 className="text-center text-sm font-bold tracking-[0.2em] uppercase mb-8" style={{ color: secondary }}>
              PRESS & PARTNERSHIPS
              <div className="flex justify-center mt-4">
                <div className="h-[1px] w-32" style={{ background: dividerColor }} />
              </div>
            </h3>
            <div className="grid grid-cols-3 gap-6 text-center">
              {cvData.collaborations?.map((brand, i) => (
                <div key={i} className="font-bold uppercase tracking-wider text-sm" style={{ color: text }}>
                  {brand}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   8. MEDIA KIT DARK
   ========================================================= */
function LayoutMediaKitDark({ template, cvData, colors, onPhotoUpload, onPhotoRemove, isUploadingPhoto }) {
  const { accent, text, secondary, bg, fontTitle } = template;
  const { mutedColor, dividerColor } = colors;

  return (
    <div className="flex flex-col min-h-[1123px] p-8" style={{ background: bg, color: text }}>
      <header className="flex gap-8 mb-8 items-center border-b pb-8" style={{ borderColor: dividerColor }}>
         <div className="relative shrink-0 group">
          {cvData.photo && !isUploadingPhoto && onPhotoRemove && (
            <button onClick={onPhotoRemove} className="absolute -top-2 -right-2 z-20 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg opacity-0 group-hover:opacity-100 print:hidden"><Trash2 size={12} /></button>
          )}
          <div className="w-32 h-32 rounded-2xl flex items-center justify-center text-2xl font-bold overflow-hidden relative" style={{ background: secondary, color: text }}>
            {isUploadingPhoto ? <Loader2 size={24} className="animate-spin text-current z-10" /> : cvData.photo ? <img src={cvData.photo} crossOrigin="anonymous" className="w-full h-full object-cover absolute inset-0 z-0" /> : <div className="opacity-50">??</div>}
            {onPhotoUpload && <label className={"absolute inset-0 cursor-pointer flex flex-col items-center justify-center text-white transition-opacity z-10 print:hidden " + (cvData.photo ? 'bg-black/40 opacity-0 group-hover:opacity-100' : 'bg-black/20 hover:bg-black/40 opacity-100')}><input type="file" accept="image/*" onChange={onPhotoUpload} className="hidden" disabled={isUploadingPhoto} />{!isUploadingPhoto && <><Camera size={18} className="mb-0.5" /><span className="text-[8px] uppercase tracking-widest">Photo</span></>}</label>}
          </div>
        </div>
        <div className="flex-1">
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-2" style={{ fontFamily: fontTitle }}>{cvData.fullName || 'VOTRE NOM'}</h1>
          <h2 className="text-xl font-bold" style={{ color: accent }}>{cvData.jobTitle || 'Votre Titre'}</h2>
          <div className="flex gap-4 mt-4 text-xs font-mono uppercase tracking-widest" style={{ color: mutedColor }}>
            <span>{cvData.email}</span>
            <span>{cvData.phone}</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-8 flex-1">
        <div className="col-span-2 space-y-8">
          <section>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-4">
              <span className="w-2 h-2 rounded-full" style={{ background: accent }}></span> A PROPOS
            </h3>
            <p className="text-[13px] leading-relaxed" style={{ color: mutedColor }}>{cvData.summary}</p>
          </section>

          <section>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-4">
               <span className="w-2 h-2 rounded-full" style={{ background: accent }}></span> COLLABORATIONS
            </h3>
            <div className="flex flex-wrap gap-3">
              {cvData.collaborations?.map((c, i) => (
                <div key={i} className="px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider" style={{ background: secondary, border: \`1px solid \${dividerColor}\` }}>
                  {c}
                </div>
              ))}
            </div>
          </section>

          <section>
             <h3 className="text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-4">
               <span className="w-2 h-2 rounded-full" style={{ background: accent }}></span> AUDIENCE GEO
            </h3>
            <div className="space-y-4">
              {(cvData.mediaKitDetails?.demographics || []).map((demo, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-24 text-xs font-bold uppercase">{demo.location}</div>
                  <div className="flex-1 h-2 rounded-full bg-black/20" style={{ background: secondary }}>
                     <div className="h-full rounded-full" style={{ width: \`\${demo.percentage}%\`, background: accent }}></div>
                  </div>
                  <div className="w-10 text-right text-xs font-bold" style={{ color: accent }}>{demo.percentage}%</div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
           <div className="p-6 rounded-2xl" style={{ background: secondary, border: \`1px solid \${dividerColor}\` }}>
              <h3 className="text-xs font-bold uppercase tracking-widest mb-6 text-center" style={{ color: mutedColor }}>Statistiques Sociales</h3>
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-3xl font-black mb-1" style={{ color: accent }}>{cvData.socialStats?.instagram || '0'}</div>
                  <div className="text-[10px] uppercase tracking-widest">Instagram</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black mb-1" style={{ color: accent }}>{cvData.socialStats?.tiktok || '0'}</div>
                  <div className="text-[10px] uppercase tracking-widest">TikTok</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black mb-1" style={{ color: accent }}>{cvData.socialStats?.youtube || '0'}</div>
                  <div className="text-[10px] uppercase tracking-widest">YouTube</div>
                </div>
                <div className="text-center pt-6 border-t" style={{ borderColor: dividerColor }}>
                  <div className="text-2xl font-black mb-1 text-white">{cvData.socialStats?.engagement || '0%'}</div>
                  <div className="text-[10px] uppercase tracking-widest" style={{ color: mutedColor }}>Engagement</div>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN EXPORT
   ========================================================= */
export default function CVPreview({ template, cvData, experiences, educations, onPhotoUpload, onPhotoRemove, isUploadingPhoto }) {
  if (!template) return null;

  const { bg, text, layout, fontTitle, fontBody } = template;

  useGoogleFont(fontTitle);
  useGoogleFont(fontBody);
  const isDark = bg === '#0A0A0A' || bg === '#0D0D0D' || bg === '#0F0F23' || bg === '#1A0F00' || bg === '#1A1A1A' || bg === '#1B2A4A' || bg === '#2C2C2E' || bg === '#000000' || bg === '#050510' || bg === '#020617' || bg === '#0A0A14' || bg === '#0A0505' || bg === '#1A0B13' || bg === '#0D0D12';
  
  const colors = {
    mutedColor: text,
    dividerColor: isDark ? '#3F3F46' : '#D1D5DB'
  };

  const LayoutComponent = {
    'single-column': LayoutSingleColumn,
    'two-column': LayoutTwoColumn,
    'grid': LayoutGrid,
    'asymmetric': LayoutAsymmetric,
    'creative': LayoutCreative,
    'media-kit-classic': LayoutMediaKitClassic,
    'media-kit-split': LayoutMediaKitSplit,
    'media-kit-dark': LayoutMediaKitDark
  }[layout] || LayoutSingleColumn;

  return (
    <div
      className="w-[794px] min-w-[794px] max-w-[794px] min-h-[1123px] relative print:min-w-[210mm] print:w-[210mm] print:min-h-[297mm] print:m-0 print:p-0"
      style={{
        background: bg,
        color: text,
      }}
    >
      <LayoutComponent 
        template={template} 
        cvData={cvData} 
        experiences={experiences} 
        educations={educations} 
        colors={colors}
        onPhotoUpload={onPhotoUpload}
        onPhotoRemove={onPhotoRemove}
        isUploadingPhoto={isUploadingPhoto}
      />
    </div>
  );
}







