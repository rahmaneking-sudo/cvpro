import { useState } from 'react';
import { Globe, ExternalLink, X } from 'lucide-react';

/* =========================================================
   PORTFOLIO LAYOUTS
   ========================================================= */

function LayoutStandard({ template, data }) {
  const { accent, text, bg, secondary } = template;
  const { fullName, jobTitle, bio, email, phone, location, projects, socialLinks } = data;
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="min-h-screen relative" style={{ background: bg, color: text }}>
      {/* Hero Section */}
      <header className="px-10 py-20 flex flex-col items-center justify-center text-center border-b" style={{ borderColor: `${text}15` }}>
        {data.photo && (
          <div className="w-24 h-24 rounded-full overflow-hidden mb-6 border-4 shadow-lg" style={{ borderColor: accent }}>
            <img src={data.photo} alt={fullName} className="w-full h-full object-cover" />
          </div>
        )}
        <h1 className="text-5xl font-black tracking-tight mb-4 uppercase" style={{ fontFamily: 'var(--font-serif)' }}>
          {fullName || 'Votre Nom'}
        </h1>
        <h2 className="text-xl tracking-[0.3em] uppercase mb-8" style={{ color: accent }}>
          {jobTitle || 'Votre Spécialité'}
        </h2>
        {bio && (
          <p className="max-w-2xl text-sm leading-loose opacity-80 mb-8">
            {bio}
          </p>
        )}
        <div className="flex gap-6 text-xs tracking-widest uppercase opacity-60 mb-6">
          {email && <span>{email}</span>}
          {phone && <span>{phone}</span>}
          {location && <span>{location}</span>}
        </div>
        
        {/* Social Links */}
        {socialLinks && socialLinks.length > 0 && (
          <div className="flex gap-4 flex-wrap justify-center">
            {socialLinks.map((link, idx) => (
              <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors border" style={{ borderColor: `${text}20`, color: text, hover: { background: `${text}10` } }}>
                {link.platform}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* Projects Section */}
      <section className="px-10 py-16 max-w-5xl mx-auto">
        <h3 className="text-sm font-bold tracking-[0.2em] uppercase mb-12 text-center" style={{ color: accent }}>
          Projets Sélectionnés
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {(projects?.length > 0 ? projects : [{}, {}]).map((proj, i) => (
            <article key={i} className="group cursor-pointer">
              {/* Project Image Placeholder */}
              <div 
                className="aspect-[4/3] rounded-xl mb-6 overflow-hidden relative border"
                style={{ background: secondary, borderColor: `${text}10` }}
              >
                {proj.imageUrl ? (
                  proj.imageUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                    <video 
                      src={proj.imageUrl} 
                      controls 
                      className="w-full h-full object-cover relative z-10"
                      preload="metadata"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <img src={proj.imageUrl} alt={proj.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                  )
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    <Globe size={48} />
                  </div>
                )}
                {/* Overlay on hover */}
                <div 
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                  onClick={() => {
                    // Si c'est une image (et pas une vidéo), on l'ouvre
                    if (proj.imageUrl && !proj.imageUrl.match(/\.(mp4|webm|ogg)$/i)) {
                      setSelectedImage(proj.imageUrl);
                    }
                  }}
                >
                  <span className="px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest bg-white text-black">
                    {proj.imageUrl && !proj.imageUrl.match(/\.(mp4|webm|ogg)$/i) ? 'Voir l\'image' : 'Voir le projet'}
                  </span>
                </div>
              </div>

              {/* Project Info */}
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-xl font-bold" style={{ fontFamily: 'var(--font-serif)' }}>
                  {proj.title || `Projet ${i + 1}`}
                </h4>
                {proj.link && <ExternalLink size={16} style={{ color: accent }} />}
              </div>
              <p className="text-xs leading-relaxed opacity-70 mb-4 line-clamp-3">
                {proj.description || 'Une description détaillée de ce projet, les défis rencontrés et les solutions apportées.'}
              </p>
              
              {/* Tags */}
              <div className="flex gap-2 flex-wrap">
                {(proj.tags?.length > 0 ? proj.tags : ['Design', 'Développement']).map((tag, j) => (
                  <span key={j} className="text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-sm" style={{ border: `1px solid ${accent}30`, color: accent }}>
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Footer */}
      {(email || phone) && (
        <footer className="py-12 text-center border-t" style={{ borderColor: `${text}15`, background: secondary }}>
          <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-serif)' }}>Prêt à collaborer ?</h2>
          {email && (
            <a href={`mailto:${email}`} className="inline-block px-8 py-4 rounded-full text-sm font-bold tracking-widest uppercase transition-transform hover:scale-105" style={{ background: accent, color: bg }}>
              Me contacter par email
            </a>
          )}
        </footer>
      )}

      {/* Image Modal (Lightbox) */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 backdrop-blur-sm print:hidden"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
          >
            <X size={32} />
          </button>
          <img 
            src={selectedImage} 
            alt="Projet en grand" 
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}
    </div>
  );
}

/* =========================================================
   MAIN EXPORT
   ========================================================= */
export default function PortfolioPreview({ template, data }) {
  if (!template) return null;

  const { bg, text } = template;

  return (
    <div
      className="w-full min-h-[297mm] relative print:min-h-[297mm]"
      style={{ background: bg, color: text }}
    >
      <LayoutStandard template={template} data={data || {}} />
    </div>
  );
}
