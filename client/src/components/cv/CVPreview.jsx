import { Mail, Phone, MapPin, Globe, Link2, Camera, Trash2, Loader2 } from 'lucide-react';

/* =========================================================
   UTILITIES & COMPONENTS
   ========================================================= */

function Initials({ name, accent, photo }) {
  if (photo) {
    return (
      <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2" style={{ borderColor: accent }}>
        <img src={photo} crossOrigin="anonymous" alt={name} className="w-full h-full object-cover" />
      </div>
    );
  }

  const initials = name ? name.substring(0, 2).toUpperCase() : '??';
  return (
    <div
      className="w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
      style={{ background: `${accent}20`, color: accent, border: `1px solid ${accent}30` }}
    >
      {initials}
    </div>
  );
}

function ContactItem({ icon: Icon, value, color }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-2 text-[11px]" style={{ color }}>
      <Icon size={12} style={{ opacity: 0.7 }} />
      <span>{value}</span>
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
  const { accent, text, secondary } = template;
  const { mutedColor, dividerColor } = colors;

  return (
    <div className="p-10">
      <header className="flex flex-col items-center text-center mb-8 pb-6 border-b" style={{ borderColor: dividerColor }}>
        <div className="mb-4">
          <Initials name={cvData.fullName} accent={accent} photo={cvData.photo} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 uppercase" style={{ color: text }}>
          {cvData.fullName || 'Votre Nom'}
        </h1>
        <h2 className="text-sm font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: accent }}>
          {cvData.jobTitle || 'Votre Titre'}
        </h2>
        <div className="flex items-center justify-center gap-5 flex-wrap">
          <ContactItem icon={Mail} value={cvData.email} color={mutedColor} />
          <ContactItem icon={Phone} value={cvData.phone} color={mutedColor} />
          <ContactItem icon={MapPin} value={cvData.location} color={mutedColor} />
        </div>
      </header>

      {cvData.summary && (
        <section className="mb-8">
          <h3 className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: text }}>Profil Professionnel</h3>
          <p className="text-[11px] leading-[1.8] text-justify" style={{ color: mutedColor }}>{cvData.summary}</p>
        </section>
      )}

      {experiences?.length > 0 && (
        <section className="mb-8">
          <h3 className="text-[11px] font-bold uppercase tracking-widest mb-4 pb-2 border-b" style={{ color: text, borderColor: dividerColor }}>
            Expériences
          </h3>
          <div className="space-y-5">
            {(experiences || []).filter(e => e.company || e.position).map((exp, i) => (
              <article key={i}>
                <div className="flex items-baseline justify-between mb-1">
                  <h4 className="font-bold text-[12px]" style={{ color: text }}>{exp.position}</h4>
                  <span className="text-[10px] font-medium" style={{ color: accent }}>
                    {exp.startDate}{exp.endDate ? ` — ${exp.endDate}` : ''}
                  </span>
                </div>
                <div className="text-[11px] font-medium mb-2" style={{ color: text, opacity: 0.8 }}>{exp.company}</div>
                {exp.description && (
                  <p className="text-[11px] leading-[1.7]" style={{ color: mutedColor }}>{exp.description}</p>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {educations?.length > 0 && (
        <section className="mb-8">
          <h3 className="text-[11px] font-bold uppercase tracking-widest mb-4 pb-2 border-b" style={{ color: text, borderColor: dividerColor }}>
            Formation
          </h3>
          <div className="space-y-4">
            {(educations || []).filter(e => e.institution || e.degree).map((edu, i) => (
              <article key={i}>
                <div className="flex items-baseline justify-between mb-1">
                  <h4 className="font-bold text-[12px]" style={{ color: text }}>{edu.degree}</h4>
                  <span className="text-[10px] font-medium" style={{ color: accent }}>
                    {edu.startDate}{edu.endDate ? ` — ${edu.endDate}` : ''}
                  </span>
                </div>
                <div className="text-[11px] font-medium mb-1" style={{ color: text, opacity: 0.8 }}>{edu.institution}</div>
                {edu.description && (
                  <p className="text-[11px] leading-[1.7]" style={{ color: mutedColor }}>{edu.description}</p>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      <div className="flex gap-8">
        {cvData.skills?.length > 0 && (
          <section className="flex-1">
            <h3 className="text-[11px] font-bold uppercase tracking-widest mb-3 pb-2 border-b" style={{ color: text, borderColor: dividerColor }}>
              Compétences
            </h3>
            <div className="flex flex-wrap gap-2">
              {cvData.skills?.map((skill, i) => <SkillBadge key={i} skill={skill} accent={accent} />)}
            </div>
          </section>
        )}
        {cvData.languages?.length > 0 && (
          <section className="w-1/3">
            <h3 className="text-[11px] font-bold uppercase tracking-widest mb-3 pb-2 border-b" style={{ color: text, borderColor: dividerColor }}>
              Langues
            </h3>
            <ul className="space-y-1">
              {cvData.languages?.map((lang, i) => (
                <li key={i} className="text-[11px] flex items-center gap-2" style={{ color: mutedColor }}>
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
function LayoutTwoColumn({ template, cvData, experiences, educations, colors }) {
  const { accent, text, secondary } = template;
  const { mutedColor, dividerColor } = colors;

  return (
    <div className="flex min-h-[842px]">
      <aside className="w-[32%] p-8 flex flex-col" style={{ background: secondary }}>
        <div className="w-24 h-24 rounded-full mb-6 mx-auto flex items-center justify-center text-2xl font-bold shadow-lg overflow-hidden relative"
          style={{ background: `linear-gradient(135deg, ${accent}, ${accent}80)`, color: secondary }}>
          {cvData.photo ? (
            <img src={cvData.photo} crossOrigin="anonymous" alt={cvData.fullName} className="w-full h-full object-cover absolute inset-0" />
          ) : (
            cvData.fullName ? cvData.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : '??'
          )}
        </div>

        <section className="space-y-3 mb-8">
          <ContactItem icon={Mail} value={cvData.email} color={mutedColor} />
          <ContactItem icon={Phone} value={cvData.phone} color={mutedColor} />
          <ContactItem icon={MapPin} value={cvData.location} color={mutedColor} />
          <ContactItem icon={Globe} value={cvData.website} color={mutedColor} />
          <ContactItem icon={Link2} value={cvData.linkedin} color={mutedColor} />
        </section>

        {cvData.skills?.length > 0 && (
          <section className="mb-8">
            <h3 className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: accent }}>Expertise</h3>
            <div className="space-y-3">
              {cvData.skills?.map((skill, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[10px] mb-1" style={{ color: text }}>
                    <span>{skill}</span>
                  </div>
                  <div className="h-1 rounded-full bg-black/10 w-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ background: accent, width: `${Math.max(60, 100 - i * 10)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {cvData.languages?.length > 0 && (
          <section>
            <h3 className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: accent }}>Langues</h3>
            <div className="space-y-2">
              {cvData.languages?.map((lang, i) => (
                <div key={i} className="text-[11px] flex justify-between" style={{ color: mutedColor }}>
                  {lang} <span style={{ color: accent }}>•••</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </aside>

      <main className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold mb-1" style={{ color: text, fontFamily: "'Inter', sans-serif" }}>
            {cvData.fullName || 'Votre Nom'}
          </h1>
          <h2 className="text-sm font-medium" style={{ color: accent }}>
            {cvData.jobTitle || 'Votre Titre'}
          </h2>
        </header>

        {cvData.summary && (
          <section className="mb-8">
            <div className="w-8 h-1 mb-3" style={{ background: accent }} />
            <p className="text-[11.5px] leading-relaxed" style={{ color: mutedColor }}>{cvData.summary}</p>
          </section>
        )}

        {experiences?.length > 0 && (
          <section>
            <h3 className="text-[12px] font-bold uppercase tracking-widest mb-5 flex items-center gap-3" style={{ color: text }}>
              Expériences
              <div className="flex-1 h-[1px]" style={{ background: dividerColor }} />
            </h3>
            <div className="space-y-6">
              {(experiences || []).filter(e => e.company || e.position).map((exp, i) => (
                <article key={i} className="flex gap-4">
                  {exp.logoUrl ? (
                    <img src={exp.logoUrl} crossOrigin="anonymous" alt="" className="w-10 h-10 rounded shadow-sm shrink-0 object-cover" />
                  ) : (
                    <Initials name={exp.company} accent={accent} />
                  )}
                  <div>
                    <h4 className="font-bold text-[12px] mb-0.5" style={{ color: text }}>{exp.position}</h4>
                    <div className="flex items-center gap-2 text-[10px] mb-2" style={{ color: mutedColor }}>
                      <span className="font-semibold" style={{ color: accent }}>{exp.company}</span>
                      <span>•</span>
                      <span>{exp.startDate}{exp.endDate ? ` - ${exp.endDate}` : ''}</span>
                    </div>
                    {exp.description && (
                      <p className="text-[11px] leading-relaxed" style={{ color: mutedColor }}>{exp.description}</p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {educations?.length > 0 && (
          <section className="mt-8">
            <h3 className="text-[12px] font-bold uppercase tracking-widest mb-5 flex items-center gap-3" style={{ color: text }}>
              Formation
              <div className="flex-1 h-[1px]" style={{ background: dividerColor }} />
            </h3>
            <div className="space-y-5">
              {(educations || []).filter(e => e.institution || e.degree).map((edu, i) => (
                <article key={i} className="flex gap-4">
                  <Initials name={edu.institution} accent={accent} />
                  <div>
                    <h4 className="font-bold text-[12px] mb-0.5" style={{ color: text }}>{edu.degree}</h4>
                    <div className="flex items-center gap-2 text-[10px] mb-1" style={{ color: mutedColor }}>
                      <span className="font-semibold" style={{ color: accent }}>{edu.institution}</span>
                      <span>•</span>
                      <span>{edu.startDate}{edu.endDate ? ` - ${edu.endDate}` : ''}</span>
                    </div>
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
    <div className="p-8 font-mono">
      <header className="border-b-4 pb-6 mb-6" style={{ borderColor: accent }}>
        <h1 className="text-4xl font-bold uppercase mb-2" style={{ color: text }}>
          {cvData.fullName || 'NOM PRENOM'}
        </h1>
        <div className="flex items-center justify-between">
          <h2 className="text-sm uppercase tracking-widest font-semibold" style={{ color: accent }}>{cvData.jobTitle || 'TITRE DU POSTE'}</h2>
          <div className="flex gap-4 text-[10px]" style={{ color: mutedColor }}>
            <span>{cvData.email}</span>
            <span>|</span>
            <span>{cvData.location}</span>
          </div>
        </div>
      </header>

      {cvData.summary && (
        <section className="mb-8 p-4 rounded-sm border-l-2" style={{ background: secondary, borderColor: accent }}>
          <p className="text-[11px] leading-relaxed font-sans" style={{ color: text }}>{cvData.summary}</p>
        </section>
      )}

      <div className="grid grid-cols-[1fr_250px] gap-8">
        <section>
          <h3 className="text-xs font-bold uppercase mb-4" style={{ color: text }}>&gt; Expériences</h3>
          <div className="relative border-l ml-2" style={{ borderColor: dividerColor }}>
            {experiences?.filter(e => e.company || e.position).map((exp, i) => (
              <article key={i} className="mb-6 pl-4 relative">
                <div className="absolute w-2 h-2 rounded-full -left-[5px] top-1" style={{ background: accent }} />
                <div className="text-[9px] font-bold uppercase mb-1" style={{ color: accent }}>
                  {exp.startDate} - {exp.endDate || 'PRÉSENT'}
                </div>
                <h4 className="font-bold text-[12px] uppercase mb-0.5" style={{ color: text }}>{exp.position}</h4>
                <div className="text-[10px] mb-2" style={{ color: mutedColor }}>@ {exp.company}</div>
                <p className="text-[11px] font-sans leading-relaxed" style={{ color: text, opacity: 0.8 }}>{exp.description}</p>
              </article>
            ))}
          </div>
        </section>

        {educations?.length > 0 && (
          <section className="mt-8">
            <h3 className="text-xs font-bold uppercase mb-4" style={{ color: text }}>&gt; Formation</h3>
            <div className="relative border-l ml-2" style={{ borderColor: dividerColor }}>
              {(educations || []).filter(e => e.institution || e.degree).map((edu, i) => (
                <article key={i} className="mb-5 pl-4 relative">
                  <div className="absolute w-2 h-2 rounded-full -left-[5px] top-1" style={{ background: accent }} />
                  <div className="text-[9px] font-bold uppercase mb-1" style={{ color: accent }}>
                    {edu.startDate} - {edu.endDate || 'PRÉSENT'}
                  </div>
                  <h4 className="font-bold text-[12px] uppercase mb-0.5" style={{ color: text }}>{edu.degree}</h4>
                  <div className="text-[10px]" style={{ color: mutedColor }}>@ {edu.institution}</div>
                </article>
              ))}
            </div>
          </section>
        )}

        <aside className="space-y-8">
          <section>
            <h3 className="text-xs font-bold uppercase mb-3" style={{ color: text }}>&gt; Stack Tech</h3>
            <div className="flex flex-wrap gap-1.5">
              {cvData.skills?.map((s, i) => (
                <span key={i} className="text-[10px] px-2 py-0.5 border" style={{ color: text, borderColor: dividerColor }}>{s}</span>
              ))}
            </div>
          </section>
          <section>
            <h3 className="text-xs font-bold uppercase mb-3" style={{ color: text }}>&gt; Langues</h3>
            <ul className="text-[11px] font-sans space-y-1" style={{ color: mutedColor }}>
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
  const { accent, text, secondary } = template;
  const { mutedColor, dividerColor } = colors;

  return (
    <div className="p-10 flex flex-col min-h-[842px]">
      <header className="flex justify-between items-end mb-10 pb-6 border-b-2" style={{ borderColor: text }}>
        <div className="w-[60%]">
          <h1 className="text-5xl font-black uppercase leading-none tracking-tighter mb-2" style={{ color: text, fontFamily: "'Playfair Display', serif" }}>
            {cvData.fullName || 'VOTRE NOM'}
          </h1>
          <h2 className="text-lg italic" style={{ color: accent, fontFamily: "'Playfair Display', serif" }}>
            {cvData.jobTitle || 'Votre Titre'}
          </h2>
        </div>
        <div className="text-right text-[10px] space-y-1 font-medium uppercase tracking-widest" style={{ color: mutedColor }}>
          <p>{cvData.email}</p>
          <p>{cvData.phone}</p>
          <p>{cvData.location}</p>
        </div>
      </header>

      <div className="flex gap-10 flex-1">
        <main className="flex-1">
          {cvData.summary && (
            <section className="mb-10">
              <h3 className="text-[9px] font-bold uppercase tracking-[0.3em] mb-4" style={{ color: accent }}>A propos</h3>
              <p className="text-[12px] leading-loose font-serif" style={{ color: text }}>{cvData.summary}</p>
            </section>
          )}

          <section>
            <h3 className="text-[9px] font-bold uppercase tracking-[0.3em] mb-6" style={{ color: accent }}>Parcours</h3>
            <div className="space-y-6">
              {experiences?.filter(e => e.company || e.position).map((exp, i) => (
                <article key={i} className="flex gap-6 border-b pb-6" style={{ borderColor: dividerColor }}>
                  <div className="w-24 shrink-0 text-[9px] font-bold uppercase tracking-wider pt-1" style={{ color: mutedColor }}>
                    {exp.startDate}<br/>|<br/>{exp.endDate}
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold uppercase tracking-wide mb-1" style={{ color: text }}>{exp.position}</h4>
                    <p className="text-[11px] font-serif italic mb-3" style={{ color: accent }}>{exp.company}</p>
                    <p className="text-[11.5px] leading-relaxed" style={{ color: mutedColor }}>{exp.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {educations?.length > 0 && (
            <section className="mt-10">
              <h3 className="text-[9px] font-bold uppercase tracking-[0.3em] mb-6" style={{ color: accent }}>Formation</h3>
              <div className="space-y-5">
                {(educations || []).filter(e => e.institution || e.degree).map((edu, i) => (
                  <article key={i} className="flex gap-6 border-b pb-5" style={{ borderColor: dividerColor }}>
                    <div className="w-24 shrink-0 text-[9px] font-bold uppercase tracking-wider pt-1" style={{ color: mutedColor }}>
                      {edu.startDate}<br/>|<br/>{edu.endDate}
                    </div>
                    <div>
                      <h4 className="text-[14px] font-bold uppercase tracking-wide mb-1" style={{ color: text }}>{edu.degree}</h4>
                      <p className="text-[11px] font-serif italic" style={{ color: accent }}>{edu.institution}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </main>

        <aside className="w-[200px] shrink-0 space-y-10">
          <section>
            <h3 className="text-[9px] font-bold uppercase tracking-[0.3em] mb-4" style={{ color: accent }}>Expertise</h3>
            <ul className="space-y-2">
              {cvData.skills?.map((skill, i) => (
                <li key={i} className="text-[11px] font-medium uppercase tracking-wider" style={{ color: text }}>{skill}</li>
              ))}
            </ul>
          </section>
          <section>
            <h3 className="text-[9px] font-bold uppercase tracking-[0.3em] mb-4" style={{ color: accent }}>Langues</h3>
            <ul className="space-y-2">
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
    <div className="p-6">
      <div className="rounded-2xl p-8 mb-6 relative overflow-hidden" style={{ background: secondary }}>
        <div className="absolute top-0 right-0 w-32 h-32 rounded-bl-full opacity-20" style={{ background: accent }} />
        <h1 className="text-4xl font-extrabold mb-2 relative z-10" style={{ color: text }}>{cvData.fullName || 'Votre Nom'}</h1>
        <h2 className="text-sm font-bold uppercase tracking-widest relative z-10" style={{ color: accent }}>{cvData.jobTitle || 'Votre Titre'}</h2>
        
        <div className="flex gap-4 mt-6 relative z-10 flex-wrap">
          {cvData.email && <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-white/10" style={{ color: text }}>{cvData.email}</span>}
          {cvData.location && <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-white/10" style={{ color: text }}>{cvData.location}</span>}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          {cvData.summary && (
            <section className="p-6 rounded-2xl border" style={{ borderColor: dividerColor }}>
              <div className="w-8 h-8 rounded-full mb-3 flex items-center justify-center text-white" style={{ background: accent }}>!</div>
              <p className="text-[12px] leading-relaxed font-medium" style={{ color: mutedColor }}>{cvData.summary}</p>
            </section>
          )}

          <section>
            <h3 className="text-sm font-black uppercase mb-4 pl-2 border-l-4" style={{ color: text, borderColor: accent }}>Expériences</h3>
            <div className="space-y-4">
              {experiences?.filter(e => e.company || e.position).map((exp, i) => (
                <article key={i} className="p-5 rounded-xl transition-transform" style={{ background: secondary }}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-[13px]" style={{ color: text }}>{exp.position}</h4>
                      <div className="text-[11px] font-semibold" style={{ color: accent }}>{exp.company}</div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-1 rounded bg-black/5" style={{ color: mutedColor }}>{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <p className="text-[11.5px] leading-relaxed mt-3" style={{ color: mutedColor }}>{exp.description}</p>
                </article>
              ))}
            </div>
          </section>

          {educations?.length > 0 && (
            <section className="mt-8">
              <h3 className="text-sm font-black uppercase mb-4 pl-2 border-l-4" style={{ color: text, borderColor: accent }}>Formation</h3>
              <div className="space-y-4">
                {(educations || []).filter(e => e.institution || e.degree).map((edu, i) => (
                  <article key={i} className="p-4 rounded-xl transition-transform" style={{ background: secondary }}>
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h4 className="font-bold text-[13px]" style={{ color: text }}>{edu.degree}</h4>
                        <div className="text-[11px] font-semibold" style={{ color: accent }}>{edu.institution}</div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-1 rounded bg-black/5" style={{ color: mutedColor }}>{edu.startDate} - {edu.endDate}</span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="space-y-6">
          <section className="p-6 rounded-2xl" style={{ background: secondary }}>
            <h3 className="text-xs font-black uppercase mb-4" style={{ color: text }}>Super Pouvoirs</h3>
            <div className="flex flex-col gap-2">
              {cvData.skills?.map((skill, i) => (
                <div key={i} className="px-3 py-2 rounded-lg text-[11px] font-bold flex justify-between" style={{ background: bg, color: text }}>
                  <span>{skill}</span>
                  <span style={{ color: accent }}>+</span>
                </div>
              ))}
            </div>
          </section>
          
          <section className="p-6 rounded-2xl border" style={{ borderColor: dividerColor }}>
            <h3 className="text-xs font-black uppercase mb-4" style={{ color: text }}>Langues</h3>
            <div className="flex flex-wrap gap-2">
              {cvData.languages?.map((lang, i) => (
                <span key={i} className="w-full text-center px-2 py-2 rounded text-[11px] font-bold border" style={{ borderColor: accent, color: accent }}>{lang}</span>
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
function LayoutMediaKit({ template, cvData, experiences, educations, colors, onPhotoUpload, onPhotoRemove, isUploadingPhoto }) {
  const { accent, text, secondary, bg } = template;
  const { mutedColor, dividerColor } = colors;

  return (
    <div className="flex flex-col min-h-[842px]" style={{ background: bg, color: text }}>
      <header className="p-10 pb-6 flex items-center justify-between" style={{ background: secondary }}>
        <div className="flex-1">
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-2" style={{ color: text }}>
            {cvData.fullName || 'VOTRE NOM'}
          </h1>
          <h2 className="text-sm font-bold uppercase tracking-[0.3em]" style={{ color: accent }}>
            {cvData.jobTitle || 'Influenceur & Créateur'}
          </h2>
        </div>
        <div className="relative shrink-0 group">
          {cvData.photo && !isUploadingPhoto && onPhotoRemove && (
            <button 
              onClick={onPhotoRemove}
              className="absolute -top-2 -right-2 z-20 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100 print:hidden"
              title="Supprimer la photo"
            >
              <Trash2 size={14} />
            </button>
          )}

          <div className="w-28 h-28 rounded-full border-4 shadow-2xl flex items-center justify-center text-4xl font-bold overflow-hidden relative"
            style={{ borderColor: accent, background: bg, color: accent }}>

            {isUploadingPhoto ? (
              <Loader2 size={32} className="animate-spin text-current z-10" />
            ) : cvData.photo ? (
              <img src={cvData.photo} crossOrigin="anonymous" alt={cvData.fullName} className="w-full h-full object-cover absolute inset-0 z-0" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center z-0 opacity-50">
                {cvData.fullName ? cvData.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : '??'}
              </div>
            )}

            {/* Upload overlay */}
            {onPhotoUpload && (
              <label className={`absolute inset-0 cursor-pointer flex flex-col items-center justify-center text-white transition-opacity z-10 print:hidden ${cvData.photo ? 'bg-black/40 opacity-0 group-hover:opacity-100' : 'bg-black/20 hover:bg-black/40 opacity-100'}`}>
                <input type="file" accept="image/*" onChange={onPhotoUpload} className="hidden" disabled={isUploadingPhoto} />
                {!isUploadingPhoto && (
                  <>
                    <Camera size={24} className="mb-1" />
                    <span className="text-[9px] font-bold uppercase tracking-widest">Photo</span>
                  </>
                )}
              </label>
            )}
          </div>
        </div>
      </header>

      <div className="p-10 flex-1 flex flex-col gap-8">
        <section className="text-center">
          <p className="text-[13px] leading-relaxed font-medium max-w-2xl mx-auto" style={{ color: mutedColor }}>
            {cvData.summary}
          </p>
        </section>

        {cvData.socialStats && (
          <section className="grid grid-cols-4 gap-4">
            <div className="p-4 rounded-xl text-center border" style={{ borderColor: dividerColor, background: secondary }}>
              <div className="text-2xl font-black mb-1" style={{ color: text }}>{cvData.socialStats.instagram}</div>
              <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: accent }}>Instagram</div>
            </div>
            <div className="p-4 rounded-xl text-center border" style={{ borderColor: dividerColor, background: secondary }}>
              <div className="text-2xl font-black mb-1" style={{ color: text }}>{cvData.socialStats.tiktok}</div>
              <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: accent }}>TikTok</div>
            </div>
            <div className="p-4 rounded-xl text-center border" style={{ borderColor: dividerColor, background: secondary }}>
              <div className="text-2xl font-black mb-1" style={{ color: text }}>{cvData.socialStats.youtube}</div>
              <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: accent }}>YouTube</div>
            </div>
            <div className="p-4 rounded-xl text-center border" style={{ borderColor: dividerColor, background: accent }}>
              <div className="text-2xl font-black mb-1" style={{ color: bg }}>{cvData.socialStats.engagement}</div>
              <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: bg }}>Engagement</div>
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-8 mt-4">
          <section>
            <h3 className="text-xs font-black uppercase mb-4 tracking-widest border-b pb-2" style={{ color: accent, borderColor: dividerColor }}>
              Ligne Éditoriale & Thèmes
            </h3>
            <div className="flex flex-wrap gap-2">
              {((cvData.mediaKitDetails?.editorial || []) || cvData.skills)?.map((theme, i) => (
                <span key={i} className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase" style={{ background: secondary, color: text }}>
                  {theme}
                </span>
              ))}
            </div>
            {cvData.mediaKitDetails?.primaryNetwork && (
              <div className="mt-4 pt-4 border-t" style={{ borderColor: dividerColor }}>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: mutedColor }}>Réseau Principal</p>
                <p className="text-sm font-black" style={{ color: accent }}>{cvData.mediaKitDetails.primaryNetwork}</p>
              </div>
            )}
          </section>
          
          <section>
            <h3 className="text-xs font-black uppercase mb-4 tracking-widest border-b pb-2" style={{ color: accent, borderColor: dividerColor }}>
              Localisation de l'Audience
            </h3>
            <div className="space-y-3">
              {(cvData.mediaKitDetails?.demographics || []).map((demo, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: text }}>
                    <span>{demo.location}</span>
                    <span style={{ color: accent }}>{demo.percentage}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: secondary }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${demo.percentage}%`, background: accent }} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {cvData.collaborations && (
          <section className="mt-auto pt-6 border-t" style={{ borderColor: dividerColor }}>
            <h3 className="text-[10px] font-bold uppercase mb-4 tracking-widest text-center" style={{ color: mutedColor }}>Ils m'ont fait confiance</h3>
            <div className="flex justify-center flex-wrap gap-6">
              {cvData.collaborations?.map((brand, i) => (
                <div key={i} className="text-lg font-black uppercase opacity-60 tracking-tighter" style={{ color: text, fontFamily: "'Inter', sans-serif" }}>
                  {brand}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <footer className="p-4 text-center text-[10px] font-bold tracking-widest uppercase flex justify-center gap-6" style={{ background: accent, color: bg }}>
        <span>{cvData.email}</span>
        <span>{cvData.phone}</span>
        {cvData.linkedin && <span>{cvData.linkedin.replace('linkedin.com/in/', '@')}</span>}
      </footer>
    </div>
  );
}

/* =========================================================
   MAIN EXPORT
   ========================================================= */
export default function CVPreview({ template, cvData, experiences, educations, onPhotoUpload, onPhotoRemove, isUploadingPhoto }) {
  if (!template) return null;

  const { bg, text, layout } = template;
  const isDark = bg === '#0A0A0A' || bg === '#0D0D0D' || bg === '#0F0F23' || bg === '#1A0F00' || bg === '#1A1A1A' || bg === '#1B2A4A' || bg === '#2C2C2E' || bg === '#000000' || bg === '#050510' || bg === '#020617' || bg === '#0A0A14' || bg === '#0A0505' || bg === '#1A0B13' || bg === '#0D0D12';
  
  const colors = {
    mutedColor: isDark ? `${text}80` : `${text}90`,
    dividerColor: isDark ? `${text}15` : `${text}12`
  };

  const LayoutComponent = {
    'single-column': LayoutSingleColumn,
    'two-column': LayoutTwoColumn,
    'grid': LayoutGrid,
    'asymmetric': LayoutAsymmetric,
    'creative': LayoutCreative,
    'media-kit': LayoutMediaKit
  }[layout] || LayoutSingleColumn;

  return (
    <div
      className="w-full min-h-[297mm] relative print:min-h-[297mm]"
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
