import { useTranslation } from 'react-i18next';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[var(--color-charcoal)] border-t border-[rgba(201,169,110,0.08)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C9A96E] to-[#D4B878] flex items-center justify-center">
                <span className="text-[#0A0A0A] font-bold text-lg font-[var(--font-serif)]">S</span>
              </div>
              <span className="text-xl font-bold">
                <span className="text-[var(--color-ivory)]">Sama</span>
                <span className="text-gradient-gold">cvpro</span>
              </span>
            </div>
            <p className="text-sm text-[var(--color-white-muted)] leading-relaxed">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--color-champagne)] uppercase tracking-wider mb-4">
              {t('footer.product')}
            </h4>
            <ul className="space-y-3">
              {['features', 'templates', 'pricing'].map(k => (
                <li key={k}>
                  <a href={`#${k}`} className="text-sm text-[var(--color-white-muted)] hover:text-[var(--color-ivory)] transition-colors">
                    {t(`nav.${k}`)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--color-champagne)] uppercase tracking-wider mb-4">
              {t('footer.company')}
            </h4>
            <ul className="space-y-3">
              {['about', 'contact'].map(k => (
                <li key={k}>
                  <a href={`#${k}`} className="text-sm text-[var(--color-white-muted)] hover:text-[var(--color-ivory)] transition-colors">
                    {t(`footer.${k}`)}
                  </a>
                </li>
              ))}
              <li>
                <Link to="/blog" className="text-sm text-[var(--color-white-muted)] hover:text-[var(--color-ivory)] transition-colors">
                  Blog & Conseils
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--color-champagne)] uppercase tracking-wider mb-4">
              {t('footer.legal')}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/politique-de-confidentialite" className="text-sm text-[var(--color-white-muted)] hover:text-[var(--color-ivory)] transition-colors">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link to="/mentions-legales" className="text-sm text-[var(--color-white-muted)] hover:text-[var(--color-ivory)] transition-colors">
                  Mentions légales
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-[rgba(255,255,255,0.05)] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--color-white-muted)]">
            © {year} Samacvpro. {t('footer.rights')}.
          </p>
          <p className="text-xs text-[var(--color-white-muted)] flex items-center gap-1">
            Made with <Heart size={12} className="text-[var(--color-champagne)]" fill="currentColor" /> in Dakar & Paris
          </p>
        </div>
      </div>
    </footer>
  );
}
