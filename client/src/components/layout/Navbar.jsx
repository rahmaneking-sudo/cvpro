import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe } from 'lucide-react';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleLang = () => {
    const next = i18n.language === 'fr' ? 'en' : 'fr';
    i18n.changeLanguage(next);
    localStorage.setItem('cvpro-lang', next);
  };

  const navLinks = [
    { key: 'features', href: '#features' },
    { key: 'templates', href: '#templates' },
    { key: 'pricing', href: '#pricing' },
    { key: 'testimonials', href: '#testimonials' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        scrolled
          ? 'bg-[rgba(10,10,10,0.85)] backdrop-blur-xl border-b border-[rgba(201,169,110,0.1)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C9A96E] to-[#D4B878] flex items-center justify-center shadow-lg group-hover:shadow-[0_0_20px_rgba(201,169,110,0.3)] transition-shadow duration-500">
              <span className="text-[#0A0A0A] font-bold text-lg font-[var(--font-serif)]">C</span>
            </div>
            <span className="text-xl font-bold tracking-tight">
              <span className="text-[var(--color-ivory)]">CV</span>
              <span className="text-gradient-gold ml-1">Pro</span>
            </span>
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <a
                key={link.key}
                href={link.href}
                className="text-sm text-[var(--color-white-muted)] hover:text-[var(--color-ivory)] transition-colors duration-300 relative group"
              >
                {t(`nav.${link.key}`)}
                <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-[var(--color-champagne)] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 text-sm text-[var(--color-white-muted)] hover:text-[var(--color-champagne)] transition-colors cursor-interact"
              aria-label="Toggle language"
            >
              <Globe size={16} />
              <span className="uppercase font-medium">{i18n.language}</span>
            </button>

            <a href="/login" className="text-sm text-[var(--color-ivory)] hover:text-[var(--color-champagne)] transition-colors">
              {t('nav.login')}
            </a>

            <a href="/register" className="btn-primary !py-2.5 !px-6 !text-sm">
              {t('nav.signup')}
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-[var(--color-ivory)] p-2"
            aria-label="Menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="md:hidden bg-[rgba(10,10,10,0.97)] backdrop-blur-xl border-t border-[rgba(201,169,110,0.1)] overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {navLinks.map(link => (
                <a
                  key={link.key}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-lg text-[var(--color-ivory)] py-2 border-b border-[rgba(255,255,255,0.05)]"
                >
                  {t(`nav.${link.key}`)}
                </a>
              ))}

              <div className="flex items-center gap-4 pt-4">
                <button onClick={toggleLang} className="flex items-center gap-1.5 text-[var(--color-champagne)]">
                  <Globe size={18} />
                  <span className="uppercase font-medium">{i18n.language}</span>
                </button>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <a href="/login" className="btn-ghost !py-3 text-center">{t('nav.login')}</a>
                <a href="/register" className="btn-primary !py-3 text-center">{t('nav.signup')}</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
