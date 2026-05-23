import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, LogOut, LayoutDashboard, Bell } from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let intervalId;
    const fetchUnread = async () => {
      try {
        if (user) {
          const res = await api.get('/chat/unread');
          if (res.data.success) {
            setUnreadCount(res.data.count);
          }
        }
      } catch (e) {
        // Ignore error
      }
    };

    if (user) {
      fetchUnread();
      intervalId = setInterval(fetchUnread, 5000); // Check every 5s
    }

    return () => clearInterval(intervalId);
  }, [user]);

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

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const navLinks = [
    { label: 'CV & Modèles', href: '/templates' },
    { label: 'Portfolios', href: '/portfolios' },
    { label: 'Fonctionnalités', href: '/#features' },
    { label: 'Tarifs', href: '/#pricing' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        scrolled || mobileOpen
          ? 'bg-[rgba(10,10,10,0.95)] backdrop-blur-2xl border-b border-[rgba(201,169,110,0.1)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group"
            onClick={(e) => {
              if (window.location.pathname === '/') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                window.history.pushState(null, '', '/');
              }
            }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C9A96E] to-[#D4B878] flex items-center justify-center shadow-lg group-hover:shadow-[0_0_20px_rgba(201,169,110,0.3)] transition-shadow duration-500">
              <span className="text-[#0A0A0A] font-bold text-lg font-[var(--font-serif)]">S</span>
            </div>
            <span className="text-xl font-bold tracking-tight">
              <span className="text-[var(--color-ivory)]">Sama</span>
              <span className="text-gradient-gold">cvpro</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                onClick={(e) => {
                  if (link.href.startsWith('/#') && window.location.pathname === '/') {
                    const id = link.href.split('#')[1];
                    const el = document.getElementById(id);
                    if (el) {
                      e.preventDefault();
                      el.scrollIntoView({ behavior: 'smooth' });
                      window.history.pushState(null, '', link.href);
                    }
                  }
                }}
                className="text-sm text-[var(--color-white-muted)] hover:text-[var(--color-ivory)] transition-colors duration-300 relative group"
              >
                {link.label}
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

            {user ? (
              <>
                <div 
                  className="relative flex items-center text-[var(--color-white-muted)]"
                  title="Notifications"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[16px] h-[16px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold border border-[rgba(10,10,10,0.95)]">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <Link
                  to="/dashboard"
                  className="btn-primary !py-2.5 !px-6 !text-sm flex items-center gap-2"
                >
                  <LayoutDashboard size={16} />
                  Mon Espace
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm text-[var(--color-white-muted)] hover:text-red-400 transition-colors"
                  title="Se déconnecter"
                >
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-[var(--color-ivory)] hover:text-[var(--color-champagne)] transition-colors">
                  {t('nav.login')}
                </Link>
                <Link to="/register" className="btn-primary !py-2.5 !px-6 !text-sm">
                  {t('nav.signup')}
                </Link>
              </>
            )}
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
              {navLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  onClick={(e) => {
                    setMobileOpen(false);
                    if (link.href.startsWith('/#') && window.location.pathname === '/') {
                      const id = link.href.split('#')[1];
                      const el = document.getElementById(id);
                      if (el) {
                        e.preventDefault();
                        el.scrollIntoView({ behavior: 'smooth' });
                        window.history.pushState(null, '', link.href);
                      }
                    }
                  }}
                  className="text-lg text-[var(--color-ivory)] py-2 border-b border-[rgba(255,255,255,0.05)]"
                >
                  {link.label}
                </a>
              ))}

              <div className="flex items-center gap-4 pt-4">
                <button onClick={toggleLang} className="flex items-center gap-1.5 text-[var(--color-champagne)]">
                  <Globe size={18} />
                  <span className="uppercase font-medium">{i18n.language}</span>
                </button>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                {user ? (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="btn-primary !py-3 text-center flex items-center justify-center gap-2"
                    >
                      <LayoutDashboard size={16} />
                      Mon Espace
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="btn-ghost !py-3 text-center flex items-center justify-center gap-2 text-red-400"
                    >
                      <LogOut size={16} />
                      Se déconnecter
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-ghost !py-3 text-center">{t('nav.login')}</Link>
                    <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary !py-3 text-center">{t('nav.signup')}</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

