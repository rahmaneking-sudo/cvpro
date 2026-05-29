import { Heart, Users, MessageCircle, BarChart3, Mail, MapPin } from 'lucide-react';

export default function MediaKitPreview({ template, data, isPlaceholder = false }) {
  if (!template) return null;

  const { bg, text, accent, secondary } = template;
  
  // Default mock data if empty
  const fullName = data.fullName || (isPlaceholder ? 'Emma Creator' : '');
  const niche = data.niche || (isPlaceholder ? 'Lifestyle & Beauté' : '');
  const bio = data.bio || (isPlaceholder ? 'Créatrice passionnée par la mode responsable et les voyages. Je partage mon quotidien avec une communauté engagée.' : '');
  const photo = data.photo || null;
  const location = data.location || (isPlaceholder ? 'Paris, France' : '');
  const email = data.email || (isPlaceholder ? 'hello@emmacreator.com' : '');
  
  const stats = data.stats?.length > 0 ? data.stats : (isPlaceholder ? [
    { platform: 'Instagram', followers: '150K', engagement: '4.2%' },
    { platform: 'TikTok', followers: '320K', engagement: '6.8%' },
    { platform: 'YouTube', followers: '45K', engagement: '5.1%' }
  ] : []);

  const demographics = data.demographics || (isPlaceholder ? {
    age: '18-24 ans (45%), 25-34 ans (35%)',
    gender: '70% Femmes, 30% Hommes',
    location: 'France, Belgique, Suisse'
  } : { age: '', gender: '', location: '' });

  const services = data.services?.length > 0 ? data.services : (isPlaceholder ? [
    { name: 'Post Sponsorisé Instagram', price: 'Sur devis' },
    { name: 'Story Instagram (x3)', price: 'Sur devis' },
    { name: 'Vidéo TikTok Dédiée', price: 'Sur devis' },
    { name: 'Intégration YouTube', price: 'Sur devis' }
  ] : []);

  const brands = data.brands?.length > 0 ? data.brands : (isPlaceholder ? ['Sephora', 'L\'Oréal', 'Dyson', 'Garnier', 'Zalando', 'ASOS'] : []);

  return (
    <div className="w-full relative min-h-screen" style={{ background: bg, color: text }}>
      <div className="max-w-4xl mx-auto px-6 py-12 sm:px-12 sm:py-20">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-16 text-center md:text-left">
          {photo ? (
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden shrink-0 border-4 shadow-xl" style={{ borderColor: accent }}>
              <img src={photo} crossOrigin="anonymous" alt={fullName} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-full shrink-0 flex items-center justify-center text-5xl font-black shadow-xl" style={{ background: `linear-gradient(135deg, ${accent}, ${accent}80)`, color: bg }}>
              {fullName ? fullName.charAt(0) : 'MC'}
            </div>
          )}
          
          <div className="flex-1">
            <h1 className="text-4xl md:text-6xl font-black mb-2 uppercase tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>{fullName}</h1>
            <h2 className="text-lg md:text-2xl font-bold tracking-[0.2em] uppercase mb-6" style={{ color: accent }}>{niche}</h2>
            <p className="text-base md:text-lg opacity-90 leading-relaxed max-w-2xl">{bio}</p>
          </div>
        </header>

        {/* Stats Section */}
        <section className="mb-16">
          <h3 className="text-sm font-bold uppercase tracking-[0.3em] mb-8 text-center" style={{ color: accent }}>Audience & Chiffres Clés</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {stats.map((stat, i) => {
              const BlockContent = (
                <div className="p-6 rounded-2xl text-center border shadow-lg transition-transform hover:-translate-y-2 h-full" style={{ background: secondary, borderColor: `${text}10` }}>
                  <p className="text-sm font-bold opacity-70 uppercase tracking-widest mb-4">{stat.platform}</p>
                  <div className="text-4xl font-black mb-2" style={{ color: accent }}>{stat.followers}</div>
                  <p className="text-sm font-medium uppercase tracking-wider opacity-80">Abonnés</p>
                  <div className="mt-4 pt-4 border-t" style={{ borderColor: `${text}10` }}>
                    <p className="text-lg font-bold">{stat.engagement} <span className="text-xs opacity-60">d'engagement</span></p>
                  </div>
                </div>
              );

              return stat.url ? (
                <a key={i} href={stat.url.startsWith('http') ? stat.url : `https://${stat.url}`} target="_blank" rel="noopener noreferrer" className="block outline-none focus:ring-2 focus:ring-opacity-50 rounded-2xl" style={{ focusRingColor: accent }}>
                  {BlockContent}
                </a>
              ) : (
                <div key={i}>{BlockContent}</div>
              );
            })}
          </div>
        </section>

        {/* Demographics */}
        <section className="mb-16 p-8 rounded-3xl border" style={{ background: secondary, borderColor: `${text}10` }}>
          <h3 className="text-sm font-bold uppercase tracking-[0.3em] mb-8 text-center" style={{ color: accent }}>Démographie</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <Users size={32} className="mx-auto mb-4" style={{ color: accent }} />
              <p className="text-xs uppercase tracking-widest opacity-60 mb-2">Tranches d'âge</p>
              <p className="font-bold text-lg">{demographics.age || '—'}</p>
            </div>
            <div>
              <Heart size={32} className="mx-auto mb-4" style={{ color: accent }} />
              <p className="text-xs uppercase tracking-widest opacity-60 mb-2">Répartition</p>
              <p className="font-bold text-lg">{demographics.gender || '—'}</p>
            </div>
            <div>
              <MapPin size={32} className="mx-auto mb-4" style={{ color: accent }} />
              <p className="text-xs uppercase tracking-widest opacity-60 mb-2">Localisation</p>
              <p className="font-bold text-lg">{demographics.location || '—'}</p>
            </div>
          </div>
        </section>

        {/* Brands */}
        {(brands.length > 0) && (
          <section className="mb-16">
            <h3 className="text-sm font-bold uppercase tracking-[0.3em] mb-8 text-center" style={{ color: accent }}>Ils m'ont fait confiance</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {brands.map((brand, i) => (
                <div key={i} className="px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider border shadow-sm" style={{ background: secondary, borderColor: `${text}15`, color: text }}>
                  {brand}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Services & Tarifs */}
        <section className="mb-16">
          <h3 className="text-sm font-bold uppercase tracking-[0.3em] mb-8 text-center" style={{ color: accent }}>Services & Prestations</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {services.map((service, i) => (
              <div key={i} className="flex justify-between items-center p-5 rounded-xl border" style={{ background: secondary, borderColor: `${text}10` }}>
                <span className="font-bold text-sm md:text-base">{service.name}</span>
                <span className="font-black text-sm px-3 py-1 rounded-full" style={{ background: `${accent}20`, color: accent }}>{service.price}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <footer className="text-center pt-12 border-t" style={{ borderColor: `${text}15` }}>
          <h3 className="text-2xl font-black mb-8 uppercase" style={{ fontFamily: 'var(--font-serif)' }}>Prêt(e) à collaborer ?</h3>
          <div className="flex flex-wrap justify-center gap-6">
            {email && (
              <a href={`mailto:${email}`} className="flex items-center gap-3 px-8 py-4 rounded-full font-bold uppercase tracking-widest transition-transform hover:scale-105 shadow-xl" style={{ background: accent, color: bg }}>
                <Mail size={18} /> Me contacter
              </a>
            )}
          </div>
        </footer>

      </div>
    </div>
  );
}
