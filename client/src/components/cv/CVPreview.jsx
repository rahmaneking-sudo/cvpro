import { Mail, Phone, MapPin, Globe, Link2 } from 'lucide-react';

// Generates initials from company name for logo fallback
function Initials({ name, accent }) {
  const initials = name ? name.substring(0, 2).toUpperCase() : '??';
  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
      style={{ background: `${accent}25`, color: accent, border: `1.5px solid ${accent}40` }}
    >
      {initials}
    </div>
  );
}

function ContactItem({ icon: Icon, value, color }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-2 text-[11px]" style={{ color: `${color}90` }}>
      <Icon size={11} style={{ color }} />
      <span>{value}</span>
    </div>
  );
}

export default function CVPreview({ template, cvData, experiences }) {
  if (!template) return null;

  const { bg, text, accent, secondary, layout } = template;
  const isTwoColumn = layout === 'two-column' || layout === 'grid';
  const isDark = bg === '#0A0A0A' || bg === '#0D0D0D' || bg === '#0F0F23' || bg === '#1A0F00' || bg === '#1A1A1A' || bg === '#1B2A4A' || bg === '#2C2C2E';

  const mutedColor = isDark ? `${text}80` : `${text}99`;
  const dividerColor = isDark ? `${text}15` : `${text}12`;

  return (
    <div
      className="w-full min-h-[842px] relative"
      style={{
        background: bg,
        color: text,
        fontFamily: "'Inter', sans-serif",
        fontSize: '12px',
        lineHeight: '1.5',
      }}
    >
      {isTwoColumn ? (
        <TwoColumnLayout
          template={template} cvData={cvData} experiences={experiences}
          mutedColor={mutedColor} dividerColor={dividerColor} isDark={isDark}
        />
      ) : (
        <SingleColumnLayout
          template={template} cvData={cvData} experiences={experiences}
          mutedColor={mutedColor} dividerColor={dividerColor} isDark={isDark}
        />
      )}
    </div>
  );
}

function SingleColumnLayout({ template, cvData, experiences, mutedColor, dividerColor, isDark }) {
  const { accent, text, secondary } = template;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Playfair Display', serif", color: text }}>
          {cvData.fullName || 'Votre Nom'}
        </h1>
        <p className="text-sm font-medium mb-3" style={{ color: accent }}>
          {cvData.jobTitle || 'Votre Titre'}
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <ContactItem icon={Mail} value={cvData.email} color={mutedColor} />
          <ContactItem icon={Phone} value={cvData.phone} color={mutedColor} />
          <ContactItem icon={MapPin} value={cvData.location} color={mutedColor} />
        </div>
      </div>

      {/* Divider */}
      <div className="h-[1px] mb-5" style={{ background: `linear-gradient(90deg, transparent, ${accent}40, transparent)` }} />

      {/* Summary */}
      {cvData.summary && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>Profil</h2>
          <p className="text-[11px] leading-relaxed" style={{ color: mutedColor }}>{cvData.summary}</p>
        </div>
      )}

      {/* Experience */}
      {experiences?.some(e => e.company || e.position) && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: accent }}>Expérience</h2>
          {experiences.filter(e => e.company || e.position).map((exp, i) => (
            <div key={i} className="mb-4 flex gap-3">
              {exp.logoUrl ? (
                <img src={exp.logoUrl} alt="" className="w-9 h-9 rounded-full object-cover shrink-0" />
              ) : (
                <Initials name={exp.company} accent={accent} />
              )}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-[12px]" style={{ color: text }}>{exp.position || 'Poste'}</p>
                    <p className="text-[11px]" style={{ color: accent }}>{exp.company || 'Entreprise'}</p>
                  </div>
                  <p className="text-[10px] shrink-0" style={{ color: mutedColor }}>
                    {exp.startDate}{exp.endDate ? ` — ${exp.endDate}` : ''}
                  </p>
                </div>
                {exp.description && (
                  <p className="text-[10.5px] mt-1.5 leading-relaxed whitespace-pre-line" style={{ color: mutedColor }}>
                    {exp.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {cvData.skills?.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>Compétences</h2>
          <div className="flex flex-wrap gap-1.5">
            {cvData.skills.map((skill, i) => (
              <span key={i} className="px-2.5 py-1 rounded-full text-[10px] font-medium"
                style={{ background: `${accent}15`, color: accent, border: `1px solid ${accent}25` }}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {cvData.languages?.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>Langues</h2>
          <div className="flex flex-wrap gap-2">
            {cvData.languages.map((lang, i) => (
              <span key={i} className="text-[11px]" style={{ color: mutedColor }}>
                {lang}{i < cvData.languages.length - 1 ? ' •' : ''}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TwoColumnLayout({ template, cvData, experiences, mutedColor, dividerColor, isDark }) {
  const { accent, text, secondary, bg } = template;

  return (
    <div className="flex min-h-[842px]">
      {/* Left sidebar */}
      <div className="w-[35%] p-6" style={{ background: secondary }}>
        {/* Photo placeholder */}
        <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-xl font-bold"
          style={{ background: `${accent}20`, color: accent, border: `2px solid ${accent}40` }}>
          {cvData.fullName ? cvData.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : '?'}
        </div>

        <h1 className="text-lg font-bold text-center mb-0.5" style={{ fontFamily: "'Playfair Display', serif", color: text }}>
          {cvData.fullName || 'Votre Nom'}
        </h1>
        <p className="text-[11px] text-center mb-5 font-medium" style={{ color: accent }}>
          {cvData.jobTitle || 'Votre Titre'}
        </p>

        {/* Contact */}
        <div className="space-y-2 mb-6">
          <ContactItem icon={Mail} value={cvData.email} color={mutedColor} />
          <ContactItem icon={Phone} value={cvData.phone} color={mutedColor} />
          <ContactItem icon={MapPin} value={cvData.location} color={mutedColor} />
          <ContactItem icon={Globe} value={cvData.website} color={mutedColor} />
          <ContactItem icon={Link2} value={cvData.linkedin} color={mutedColor} />
        </div>

        {/* Skills */}
        {cvData.skills?.length > 0 && (
          <div className="mb-6">
            <h3 className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>Compétences</h3>
            <div className="space-y-1.5">
              {cvData.skills.map((skill, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
                  <span className="text-[10.5px]" style={{ color: mutedColor }}>{skill}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {cvData.languages?.length > 0 && (
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>Langues</h3>
            <div className="space-y-1.5">
              {cvData.languages.map((lang, i) => (
                <p key={i} className="text-[10.5px]" style={{ color: mutedColor }}>{lang}</p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right content */}
      <div className="flex-1 p-6">
        {/* Summary */}
        {cvData.summary && (
          <div className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>Profil</h2>
            <p className="text-[11px] leading-relaxed" style={{ color: mutedColor }}>{cvData.summary}</p>
          </div>
        )}

        <div className="h-[1px] mb-5" style={{ background: dividerColor }} />

        {/* Experience */}
        {experiences?.some(e => e.company || e.position) && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: accent }}>Expérience</h2>
            {experiences.filter(e => e.company || e.position).map((exp, i) => (
              <div key={i} className="mb-4 flex gap-3">
                {exp.logoUrl ? (
                  <img src={exp.logoUrl} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
                ) : (
                  <Initials name={exp.company} accent={accent} />
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-[12px]" style={{ color: text }}>{exp.position || 'Poste'}</p>
                      <p className="text-[11px]" style={{ color: accent }}>{exp.company || 'Entreprise'}</p>
                    </div>
                    <p className="text-[10px] shrink-0" style={{ color: mutedColor }}>
                      {exp.startDate}{exp.endDate ? ` — ${exp.endDate}` : ''}
                    </p>
                  </div>
                  {exp.description && (
                    <p className="text-[10.5px] mt-1.5 leading-relaxed whitespace-pre-line" style={{ color: mutedColor }}>
                      {exp.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
