import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, Eye, EyeOff, FileText, Briefcase, DollarSign, 
  ArrowLeft, Activity, ShieldAlert, Loader2, ArrowUpRight, MessageCircle 
} from 'lucide-react';
import axios from 'axios';
import AdminChatPanel from '../components/admin/AdminChatPanel';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  
  // Custom auth for admin
  const [adminToken, setAdminToken] = useState(localStorage.getItem('cvpro-admin-token'));
  
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      // We use standard axios to bypass the main api.js interceptor which might mess up tokens
      const res = await axios.get('/api/admin/stats', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      setStats(res.data);
      setError('');
    } catch (err) {
      console.error('Erreur chargement admin:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('cvpro-admin-token');
        setAdminToken(null);
      } else {
        setError('Impossible de charger les statistiques. Vérifiez vos permissions.');
      }
    } finally {
      setLoading(false);
    }
  }, [adminToken]);

  useEffect(() => {
    if (adminToken) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchStats();
    }
  }, [adminToken, fetchStats]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');
    try {
      const res = await axios.post('/api/admin/login', { email, password });
      if (res.data.token) {
        localStorage.setItem('cvpro-admin-token', res.data.token);
        setAdminToken(res.data.token);
      }
    } catch {
      setLoginError('Identifiants administrateur incorrects.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('cvpro-admin-token');
    setAdminToken(null);
  };

  // Not logged in -> Show Admin Login Form
  if (!adminToken) {
    return (
      <div className="min-h-screen bg-[var(--color-obsidian)] flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--color-champagne)]/10 rounded-full blur-[100px] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md relative z-10"
        >
          <button onClick={() => navigate('/')} className="text-[var(--color-white-muted)] hover:text-white flex items-center gap-2 mb-8 text-sm transition-colors">
            <ArrowLeft size={16} /> Retour au site
          </button>
          
          <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl shadow-2xl">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-[var(--color-champagne)]/10 border border-[var(--color-champagne)]/30 flex items-center justify-center">
                <ShieldAlert size={32} className="text-[var(--color-champagne)]" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-center text-[var(--color-ivory)] mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
              Accès Administrateur
            </h1>
            <p className="text-center text-[var(--color-white-muted)] text-sm mb-8">
              Panneau de contrôle indépendant.
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[var(--color-white-muted)] uppercase tracking-widest mb-2">Email Admin</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value.trim())}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-champagne)] transition-colors"
                  placeholder="admin@exemple.com"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--color-white-muted)] uppercase tracking-widest mb-2">Mot de passe</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value.trim())}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-white focus:outline-none focus:border-[var(--color-champagne)] transition-colors"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-white-muted)] hover:text-[var(--color-ivory)]"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              
              {loginError && <p className="text-red-400 text-xs text-center">{loginError}</p>}

              <button 
                type="submit" 
                disabled={isLoggingIn}
                className="w-full bg-[var(--color-champagne)] text-black font-bold py-3.5 rounded-xl hover:bg-[var(--color-gold-light)] transition-colors mt-2 flex items-center justify-center gap-2"
              >
                {isLoggingIn ? <Loader2 size={18} className="animate-spin" /> : 'Se connecter'}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  // Loading stats for Admin
  if (loading && !error) {
    return (
      <div className="min-h-screen bg-[var(--color-obsidian)] flex items-center justify-center">
        <Loader2 size={40} className="animate-spin text-[var(--color-champagne)]" />
      </div>
    );
  }

  // Admin stats error
  if (error) {
    return (
      <div className="min-h-screen bg-[var(--color-obsidian)] flex flex-col items-center justify-center text-center p-6">
        <ShieldAlert size={64} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Erreur Serveur</h2>
        <p className="text-[var(--color-white-muted)] mb-6">{error}</p>
        <button onClick={fetchStats} className="btn-primary mb-2">Réessayer</button>
        <button onClick={handleLogout} className="text-[var(--color-white-muted)] hover:text-white text-sm">Se déconnecter de l'admin</button>
      </div>
    );
  }

  const statCards = [
    { 
      label: 'Visites Totales', 
      value: stats?.visitsCount?.toLocaleString('fr-FR') || 0, 
      icon: <Eye size={24} />, 
      color: 'text-blue-400', 
      bg: 'bg-blue-400/10' 
    },
    { 
      label: 'Utilisateurs Inscrits', 
      value: stats?.usersCount?.toLocaleString('fr-FR') || 0, 
      icon: <Users size={24} />, 
      color: 'text-green-400', 
      bg: 'bg-green-400/10' 
    },
    { 
      label: 'CVs Créés', 
      value: stats?.cvsCount?.toLocaleString('fr-FR') || 0, 
      icon: <FileText size={24} />, 
      color: 'text-purple-400', 
      bg: 'bg-purple-400/10' 
    },
    { 
      label: 'Portfolios', 
      value: stats?.portfoliosCount?.toLocaleString('fr-FR') || 0, 
      icon: <Briefcase size={24} />, 
      color: 'text-orange-400', 
      bg: 'bg-orange-400/10' 
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-obsidian)] py-12 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <button onClick={() => navigate('/')} className="text-[var(--color-white-muted)] hover:text-white flex items-center gap-2 text-sm transition-colors">
                <ArrowLeft size={16} /> Retour au site
              </button>
              <div className="w-[1px] h-4 bg-white/10" />
              <button onClick={handleLogout} className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors">
                Se déconnecter
              </button>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-ivory)] mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
              Dashboard Administrateur
            </h1>
            <p className="text-[var(--color-white-muted)] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Connecté en tant que Super Admin
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-[var(--color-champagne)] to-[#B8860B] p-[1px] rounded-2xl shadow-xl shadow-[var(--color-champagne)]/10">
            <div className="bg-[#1A1A1A] rounded-2xl px-6 py-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[var(--color-champagne)]/10 flex items-center justify-center text-[var(--color-champagne)]">
                <DollarSign size={24} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-[var(--color-white-muted)] mb-1">Revenus Totaux</p>
                <p className="text-2xl font-bold text-[var(--color-ivory)]">
                  {stats?.totalRevenue?.toLocaleString('fr-FR')} <span className="text-[var(--color-champagne)] text-lg">FCFA</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-white/20 transition-colors"
            >
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                  {stat.icon}
                </div>
                <Activity size={20} className="text-white/10 group-hover:text-white/20 transition-colors" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-1 relative z-10">{stat.value}</h3>
              <p className="text-sm font-medium text-[var(--color-white-muted)] relative z-10">{stat.label}</p>
              
              {/* Decorative background glow */}
              <div className={`absolute -bottom-6 -right-6 w-32 h-32 rounded-full ${stat.bg} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            </motion.div>
          ))}
        </div>

        {/* Recent Users Table */}
        <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-white/10 flex justify-between items-center">
            <h3 className="text-xl font-bold text-[var(--color-ivory)]" style={{ fontFamily: 'var(--font-serif)' }}>
              Dernières Inscriptions
            </h3>
            <span className="text-xs font-medium px-3 py-1 bg-white/10 rounded-full text-white">5 plus récents</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-[var(--color-white-muted)] text-xs uppercase tracking-widest">
                  <th className="px-6 py-4 font-medium">Utilisateur</th>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Date d'inscription</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {stats?.recentUsers?.length > 0 ? (
                  stats.recentUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[var(--color-champagne)]/20 flex items-center justify-center text-[var(--color-champagne)] font-bold text-xs">
                            {(u.name || u.email).charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-white">{u.name || 'Utilisateur sans nom'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--color-white-muted)]">{u.email}</td>
                      <td className="px-6 py-4 text-sm text-[var(--color-white-muted)]">
                        {new Date(u.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[var(--color-white-muted)] hover:text-white hover:bg-white/10 transition-colors ml-auto">
                          <ArrowUpRight size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-[var(--color-white-muted)]">
                      Aucun utilisateur récent trouvé.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Support Chat Panel */}
        <div className="mt-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-champagne)]/10 flex items-center justify-center text-[var(--color-champagne)]">
              <MessageCircle size={20} />
            </div>
            <h2 className="text-2xl font-bold text-[var(--color-ivory)]" style={{ fontFamily: 'var(--font-serif)' }}>
              Support Client En Direct
            </h2>
          </div>
          <AdminChatPanel adminToken={adminToken} />
        </div>

      </div>
    </div>
  );
}
