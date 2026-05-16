import { useState } from 'react';
import { useAuth } from '../store/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Wand2, Globe, Briefcase, Layout, LogOut, User, ShoppingBag, ShieldAlert, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const modules = [
  { id: 'cv-creator', icon: FileText, label: 'Créateur de CV', desc: '16 modèles cinématographiques', color: '#C9A96E', route: '/dashboard/cv/templates' },
  { id: 'cv-enhance', icon: Wand2, label: 'Améliorer mon CV', desc: 'IA GPT-4o • 2,29€/utilisation', color: '#D4B878', route: '/dashboard/cv/enhance' },
  { id: 'cv-online', icon: Globe, label: 'CV en ligne', desc: 'Page web publique animée', color: '#43A047', route: '/dashboard/cv/online' },
  { id: 'portfolio-premium', icon: Briefcase, label: 'Portfolio Premium', desc: '8 modèles cinématographiques', color: '#6366F1', route: '/dashboard/portfolio/templates' },
  { id: 'portfolio-simple', icon: Layout, label: 'Portfolio Simple', desc: '8 modèles avec export PDF', color: '#FF6B35', route: '/dashboard/portfolio/templates' },
];

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNav = (route) => {
    navigate(route);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[var(--color-obsidian)] flex">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[var(--color-charcoal)] border-r border-[rgba(201,169,110,0.08)] flex flex-col
        transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo + close */}
        <div className="px-6 py-6 border-b border-[rgba(255,255,255,0.05)] flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C9A96E] to-[#D4B878] flex items-center justify-center">
              <span className="text-[#0A0A0A] font-bold text-lg" style={{ fontFamily: 'var(--font-serif)' }}>C</span>
            </div>
            <span className="text-xl font-bold">
              <span className="text-[var(--color-ivory)]">CV</span>
              <span className="text-gradient-gold ml-1">Pro</span>
            </span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-[var(--color-white-muted)] hover:text-[var(--color-ivory)]">
            <X size={22} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {modules.map((mod, i) => (
            <motion.button
              key={mod.id}
              onClick={() => handleNav(mod.route)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left hover:bg-white/5 transition-colors group"
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${mod.color}15` }}>
                <mod.icon size={18} style={{ color: mod.color }} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-[var(--color-ivory)] group-hover:text-[var(--color-champagne)] transition-colors truncate">{mod.label}</p>
                <p className="text-[11px] text-[var(--color-white-muted)] truncate">{mod.desc}</p>
              </div>
            </motion.button>
          ))}

          {/* Separator */}
          <div className="!my-4 h-[1px] bg-white/5" />

          {user?.email === 'rahmaneking@gmail.com' && (
            <button onClick={() => handleNav('/admin')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left bg-[var(--color-champagne)]/10 hover:bg-[var(--color-champagne)]/20 transition-colors mb-2">
              <ShieldAlert size={18} className="text-[var(--color-champagne)]" />
              <span className="text-sm font-bold text-[var(--color-champagne)]">Admin Dashboard</span>
            </button>
          )}

          <button onClick={() => handleNav('/dashboard/purchases')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left hover:bg-white/5 transition-colors">
            <ShoppingBag size={18} className="text-[var(--color-white-muted)]" />
            <span className="text-sm text-[var(--color-white-muted)]">Mes achats</span>
          </button>
        </nav>

        {/* User */}
        <div className="px-4 py-4 border-t border-[rgba(255,255,255,0.05)]">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--color-champagne)] to-[var(--color-gold-light)] flex items-center justify-center text-[var(--color-obsidian)] font-bold text-sm shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : <User size={16} />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-[var(--color-ivory)] truncate">{user?.name || 'Utilisateur'}</p>
              <p className="text-[11px] text-[var(--color-white-muted)] truncate">{user?.email}</p>
            </div>
            <button onClick={logout} className="text-[var(--color-white-muted)] hover:text-red-400 transition-colors" title="Se déconnecter">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 overflow-auto">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center gap-4 px-4 py-4 border-b border-[rgba(255,255,255,0.05)] sticky top-0 bg-[var(--color-obsidian)] z-30">
          <button onClick={() => setSidebarOpen(true)} className="text-[var(--color-ivory)] p-2 -ml-2 hover:bg-white/5 rounded-xl transition-colors">
            <Menu size={22} />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C9A96E] to-[#D4B878] flex items-center justify-center">
              <span className="text-[#0A0A0A] font-bold text-sm" style={{ fontFamily: 'var(--font-serif)' }}>C</span>
            </div>
            <span className="text-lg font-bold">
              <span className="text-[var(--color-ivory)]">CV</span>
              <span className="text-gradient-gold ml-1">Pro</span>
            </span>
          </Link>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-ivory)] mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
              Bienvenue{user?.name ? `, ${user.name.split(' ')[0]}` : ''} 👋
            </h1>
            <p className="text-sm sm:text-base text-[var(--color-white-muted)] mb-8 sm:mb-10">
              Que souhaitez-vous créer aujourd'hui ?
            </p>

            {/* Quick access cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {modules.map((mod, i) => (
                <motion.div
                  key={mod.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                  whileHover={{ y: -4, borderColor: `${mod.color}40` }}
                  onClick={() => handleNav(mod.route)}
                  className="glass-card p-5 sm:p-6 cursor-pointer group"
                >
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-4" style={{ background: `${mod.color}15` }}>
                    <mod.icon size={20} style={{ color: mod.color }} />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[var(--color-ivory)] mb-1 group-hover:text-[var(--color-champagne)] transition-colors" style={{ fontFamily: 'var(--font-serif)' }}>
                    {mod.label}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--color-white-muted)]">{mod.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
