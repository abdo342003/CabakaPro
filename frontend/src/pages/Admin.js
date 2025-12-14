import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FiBookOpen,
  FiBriefcase,
  FiMessageSquare,
  FiMail,
  FiTrendingUp,
  FiMenu,
  FiX,
  FiHome,
  FiEye,
  FiStar,
  FiActivity,
  FiLock,
  FiCheckCircle,
  FiAlertCircle,
  FiRefreshCw,
  FiLogOut,
  FiUsers,
  FiMonitor,
  FiSmartphone,
  FiGlobe
} from 'react-icons/fi';
import api from '../services/api';
import { getVisitorStats, getVisitors } from '../services/visitorTracking';

// Password for admin access - Change this in production!
const ADMIN_PASSWORD = 'ChabakaPro2025!';

const Admin = () => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Dashboard state
  const [stats, setStats] = useState({
    blogs: { total: 0, published: 0, featured: 0 },
    portfolios: { total: 0, published: 0, featured: 0, totalInvestment: 0 },
    contacts: { total: 0, new: 0, responded: 0 },
    devis: { total: 0, pending: 0, approved: 0 },
    testimonials: { total: 0, verified: 0, avgRating: 0 },
    visitors: { total: 0, today: 0, pageViews: 0 }
  });
  const [recentContacts, setRecentContacts] = useState([]);
  const [recentDevis, setRecentDevis] = useState([]);
  const [recentTestimonials, setRecentTestimonials] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const [visitorStats, setVisitorStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Check if already authenticated (session storage)
  useEffect(() => {
    const authStatus = sessionStorage.getItem('adminAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Handle login
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuthenticated', 'true');
      setPasswordError('');
    } else {
      setPasswordError('Mot de passe incorrect');
      setPassword('');
    }
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminAuthenticated');
    setPassword('');
  };

  // Fetch all data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    }
  }, [isAuthenticated]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // Note: api interceptor already returns response.data
      // So we get { success: true, data: [...], pagination: {...} } directly
      const [blogsRes, portfoliosRes, contactsRes, devisRes, testimonialsRes] = await Promise.all([
        api.get('/blog', { params: { published: 'all', limit: 1000 } }).catch(() => ({ data: [] })),
        api.get('/portfolio', { params: { published: 'all', limit: 1000 } }).catch(() => ({ data: [] })),
        api.get('/contact', { params: { limit: 100 } }).catch(() => ({ data: [] })),
        api.get('/devis', { params: { limit: 100 } }).catch(() => ({ data: [] })),
        api.get('/testimonials', { params: { published: 'all', limit: 100 } }).catch(() => ({ data: [] }))
      ]);

      // Extract data arrays - API response format: { success, data, pagination }
      // The interceptor returns response.data, so we get the object directly
      const blogs = blogsRes?.data || blogsRes || [];
      const portfolios = portfoliosRes?.data || portfoliosRes || [];
      const contacts = contactsRes?.data || contactsRes || [];
      const devis = devisRes?.data || devisRes || [];
      const testimonials = testimonialsRes?.data || testimonialsRes || [];

      setStats({
        blogs: {
          total: blogs.length,
          published: blogs.filter(b => b.published).length,
          featured: blogs.filter(b => b.featured).length
        },
        portfolios: {
          total: portfolios.length,
          published: portfolios.filter(p => p.published).length,
          featured: portfolios.filter(p => p.featured).length,
          totalInvestment: portfolios.reduce((sum, p) => sum + (p.investment || 0), 0)
        },
        contacts: {
          total: contacts.length,
          new: contacts.filter(c => c.status === 'nouveau' || c.status === 'new').length,
          responded: contacts.filter(c => c.status === 'traite' || c.status === 'responded').length
        },
        devis: {
          total: devis.length,
          pending: devis.filter(d => d.status === 'nouveau' || d.status === 'pending' || d.status === 'en_attente').length,
          approved: devis.filter(d => d.status === 'accepte' || d.status === 'approved').length
        },
        testimonials: {
          total: testimonials.length,
          verified: testimonials.filter(t => t.verified).length,
          avgRating: testimonials.length > 0 
            ? (testimonials.reduce((sum, t) => sum + (t.rating || 5), 0) / testimonials.length).toFixed(1)
            : 5
        },
        visitors: { total: 0, today: 0, pageViews: 0 }
      });

      setRecentContacts(contacts.slice(0, 10));
      setRecentDevis(devis.slice(0, 10));
      setRecentTestimonials(testimonials.slice(0, 10));

      // Fetch visitor stats
      try {
        const visitorStatsRes = await getVisitorStats(30);
        const visitorsRes = await getVisitors({ limit: 50 });
        
        if (visitorStatsRes?.data) {
          setVisitorStats(visitorStatsRes.data);
          setStats(prev => ({
            ...prev,
            visitors: {
              total: visitorStatsRes.data.totalVisitors || 0,
              today: visitorStatsRes.data.todayVisitors || 0,
              pageViews: visitorStatsRes.data.totalPageViews || 0
            }
          }));
        }
        
        if (visitorsRes?.data) {
          setVisitors(visitorsRes.data);
        }
      } catch (visitorError) {
        // Visitor stats not available - silent fail
      }

    } catch (error) {
      // Error fetching data - silent fail
    } finally {
      setLoading(false);
    }
  };

  // Update contact status
  const updateContactStatus = async (id, status) => {
    try {
      await api.patch(`/contact/${id}`, { status });
      fetchAllData();
    } catch (error) {
      // Error updating contact
    }
  };

  // Update devis status
  const updateDevisStatus = async (id, status) => {
    try {
      await api.patch(`/devis/${id}`, { status });
      fetchAllData();
    } catch (error) {
      // Error updating devis
    }
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        {/* Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-md"
        >
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FiLock className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Administration</h1>
              <p className="text-white/60">ChabakaPro - Tableau de bord</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all"
                    placeholder="Entrez le mot de passe admin"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                  >
                    <FiEye className="w-5 h-5" />
                  </button>
                </div>
                {passwordError && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 text-red-400 text-sm flex items-center gap-2"
                  >
                    <FiAlertCircle /> {passwordError}
                  </motion.p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Accéder au Dashboard
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/"
                className="text-white/50 hover:text-white text-sm transition-colors inline-flex items-center gap-2"
              >
                <FiHome /> Retour au site
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Quick Stats Cards
  const quickStats = [
    {
      label: 'Articles Blog',
      value: stats.blogs.total,
      icon: FiBookOpen,
      color: 'bg-emerald-500',
      change: `${stats.blogs.published} publiés`
    },
    {
      label: 'Projets Portfolio',
      value: stats.portfolios.total,
      icon: FiBriefcase,
      color: 'bg-purple-500',
      change: `${stats.portfolios.published} publiés`
    },
    {
      label: 'Messages Contact',
      value: stats.contacts.total,
      icon: FiMail,
      color: 'bg-blue-500',
      change: `${stats.contacts.new} nouveaux`
    },
    {
      label: 'Demandes Devis',
      value: stats.devis.total,
      icon: FiMessageSquare,
      color: 'bg-orange-500',
      change: `${stats.devis.pending} en attente`
    },
    {
      label: 'Témoignages',
      value: stats.testimonials.total,
      icon: FiStar,
      color: 'bg-amber-500',
      change: `★ ${stats.testimonials.avgRating} moyenne`
    },
    {
      label: 'Investissement Total',
      value: `${((stats.portfolios.totalInvestment || 0) / 1000).toFixed(0)}K`,
      icon: FiTrendingUp,
      color: 'bg-cyan-500',
      change: 'MAD'
    }
  ];

  const menuItems = [
    {
      title: 'Gestion du Blog',
      description: 'Créer et gérer vos articles',
      icon: FiBookOpen,
      link: '/admin/blog',
      color: 'from-emerald-500 to-teal-500',
      stats: [
        { label: 'Total', value: stats.blogs.total },
        { label: 'Publiés', value: stats.blogs.published }
      ]
    },
    {
      title: 'Gestion Portfolio',
      description: 'Gérer vos projets clients',
      icon: FiBriefcase,
      link: '/admin/portfolio',
      color: 'from-violet-500 to-purple-500',
      stats: [
        { label: 'Projets', value: stats.portfolios.total },
        { label: 'Publiés', value: stats.portfolios.published }
      ]
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      'nouveau': 'bg-blue-500',
      'new': 'bg-blue-500',
      'en_cours': 'bg-yellow-500',
      'pending': 'bg-yellow-500',
      'en_attente': 'bg-yellow-500',
      'traite': 'bg-green-500',
      'responded': 'bg-green-500',
      'accepte': 'bg-green-500',
      'approved': 'bg-green-500',
      'refuse': 'bg-red-500',
      'rejected': 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'nouveau': 'Nouveau',
      'new': 'Nouveau',
      'en_cours': 'En cours',
      'pending': 'En attente',
      'en_attente': 'En attente',
      'traite': 'Traité',
      'responded': 'Répondu',
      'accepte': 'Accepté',
      'approved': 'Approuvé',
      'refuse': 'Refusé',
      'rejected': 'Rejeté'
    };
    return labels[status] || status;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                {sidebarOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  ChabakaPro <span className="text-emerald-400">Admin</span>
                </h1>
                <p className="text-sm text-white/60">Tableau de bord d'administration</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={fetchAllData}
                className="flex items-center gap-2 px-4 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Rafraîchir"
              >
                <FiRefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <Link
                to="/"
                className="flex items-center gap-2 px-4 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <FiHome className="w-5 h-5" />
                <span className="hidden sm:inline">Site Public</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <FiLogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="relative z-10 border-b border-white/10 bg-black/10 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: FiActivity },
              { id: 'visitors', label: 'Visiteurs', icon: FiUsers, badge: stats.visitors.today },
              { id: 'contacts', label: 'Contacts', icon: FiMail, badge: stats.contacts.new },
              { id: 'devis', label: 'Devis', icon: FiMessageSquare, badge: stats.devis.pending },
              { id: 'testimonials', label: 'Témoignages', icon: FiStar }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-emerald-500 text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.badge > 0 && (
                  <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Welcome Section */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">
                  Bienvenue sur votre Dashboard 👋
                </h2>
                <p className="text-white/60">
                  Gérez votre contenu, contacts et demandes de devis
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
                {quickStats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-3 ${stat.color} rounded-xl group-hover:scale-110 transition-transform`}>
                        <stat.icon className="w-5 h-5 text-white" />
                      </div>
                      <FiActivity className="w-5 h-5 text-white/30" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-white/60">{stat.label}</div>
                    <div className="text-xs text-emerald-400 mt-1">{stat.change}</div>
                  </motion.div>
                ))}
              </div>

              {/* Management Cards */}
              <h3 className="text-xl font-semibold text-white mb-4">Gestion du Contenu</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    <Link
                      to={item.link}
                      className="block bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-4 bg-gradient-to-br ${item.color} rounded-2xl group-hover:scale-110 transition-transform`}>
                          <item.icon className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex gap-2">
                          {item.stats.map((stat, i) => (
                            <div key={i} className="text-center px-3 py-1 bg-white/5 rounded-lg">
                              <div className="text-lg font-bold text-white">{stat.value}</div>
                              <div className="text-xs text-white/50">{stat.label}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-white/60 mb-4">{item.description}</p>
                      
                      <div className="flex items-center text-emerald-400 font-medium group-hover:gap-3 transition-all gap-2">
                        <span>Accéder</span>
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Quick Actions */}
              <h3 className="text-xl font-semibold text-white mb-4">Actions Rapides</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Nouvel Article', icon: FiBookOpen, link: '/admin/blog', color: 'text-emerald-400' },
                  { label: 'Nouveau Projet', icon: FiBriefcase, link: '/admin/portfolio', color: 'text-purple-400' },
                  { label: 'Voir le Blog', icon: FiEye, link: '/blog', color: 'text-blue-400' },
                  { label: 'Voir Portfolio', icon: FiEye, link: '/portfolio', color: 'text-amber-400' }
                ].map((action, index) => (
                  <motion.div
                    key={action.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <Link
                      to={action.link}
                      className="flex flex-col items-center justify-center gap-3 p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group"
                    >
                      <action.icon className={`w-8 h-8 ${action.color} group-hover:scale-110 transition-transform`} />
                      <span className="text-sm font-medium text-white/80 group-hover:text-white text-center">
                        {action.label}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Visitors Tab */}
          {activeTab === 'visitors' && (
            <motion.div
              key="visitors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Analytiques Visiteurs</h2>
                <p className="text-white/60">Suivez les visiteurs de votre site en temps réel</p>
              </div>

              {/* Visitor Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <FiUsers className="w-5 h-5 text-blue-400" />
                    </div>
                    <span className="text-white/60 text-sm">Total Visiteurs</span>
                  </div>
                  <div className="text-3xl font-bold text-white">{visitorStats?.totalVisitors || 0}</div>
                  <div className="text-xs text-white/40 mt-1">30 derniers jours</div>
                </div>
                
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-emerald-500/20 rounded-lg">
                      <FiTrendingUp className="w-5 h-5 text-emerald-400" />
                    </div>
                    <span className="text-white/60 text-sm">Aujourd'hui</span>
                  </div>
                  <div className="text-3xl font-bold text-white">{visitorStats?.todayVisitors || 0}</div>
                  <div className="text-xs text-emerald-400 mt-1">visiteurs actifs</div>
                </div>
                
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <FiEye className="w-5 h-5 text-purple-400" />
                    </div>
                    <span className="text-white/60 text-sm">Pages Vues</span>
                  </div>
                  <div className="text-3xl font-bold text-white">{visitorStats?.totalPageViews || 0}</div>
                  <div className="text-xs text-white/40 mt-1">total des vues</div>
                </div>
                
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-amber-500/20 rounded-lg">
                      <FiRefreshCw className="w-5 h-5 text-amber-400" />
                    </div>
                    <span className="text-white/60 text-sm">Retours</span>
                  </div>
                  <div className="text-3xl font-bold text-white">{visitorStats?.returningVisitors || 0}</div>
                  <div className="text-xs text-white/40 mt-1">visiteurs fidèles</div>
                </div>
              </div>

              {/* Device & Browser Stats */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Device Stats */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <FiMonitor className="w-5 h-5 text-cyan-400" />
                    Appareils
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(visitorStats?.deviceStats || {}).map(([device, count]) => (
                      <div key={device} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {device === 'mobile' && <FiSmartphone className="w-4 h-4 text-white/60" />}
                          {device === 'desktop' && <FiMonitor className="w-4 h-4 text-white/60" />}
                          {device === 'tablet' && <FiMonitor className="w-4 h-4 text-white/60" />}
                          {device === 'unknown' && <FiGlobe className="w-4 h-4 text-white/60" />}
                          <span className="text-white/80 capitalize">{device}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-cyan-500 rounded-full"
                              style={{ 
                                width: `${visitorStats?.totalVisitors ? (count / visitorStats.totalVisitors * 100) : 0}%` 
                              }}
                            />
                          </div>
                          <span className="text-white/60 text-sm w-8 text-right">{count}</span>
                        </div>
                      </div>
                    ))}
                    {Object.keys(visitorStats?.deviceStats || {}).length === 0 && (
                      <p className="text-white/40 text-center py-4">Aucune donnée</p>
                    )}
                  </div>
                </div>

                {/* Browser Stats */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <FiGlobe className="w-5 h-5 text-purple-400" />
                    Navigateurs
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(visitorStats?.browserStats || {}).map(([browser, count]) => (
                      <div key={browser} className="flex items-center justify-between">
                        <span className="text-white/80">{browser}</span>
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-purple-500 rounded-full"
                              style={{ 
                                width: `${visitorStats?.totalVisitors ? (count / visitorStats.totalVisitors * 100) : 0}%` 
                              }}
                            />
                          </div>
                          <span className="text-white/60 text-sm w-8 text-right">{count}</span>
                        </div>
                      </div>
                    ))}
                    {Object.keys(visitorStats?.browserStats || {}).length === 0 && (
                      <p className="text-white/40 text-center py-4">Aucune donnée</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Top Pages */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">Pages les Plus Visitées</h3>
                <div className="space-y-2">
                  {(visitorStats?.topPages || []).slice(0, 10).map((page, index) => (
                    <div key={page._id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                      <div className="flex items-center gap-3">
                        <span className="text-white/40 text-sm w-6">{index + 1}.</span>
                        <span className="text-white/80">{page._id || '/'}</span>
                      </div>
                      <span className="text-cyan-400 font-medium">{page.views} vues</span>
                    </div>
                  ))}
                  {(!visitorStats?.topPages || visitorStats.topPages.length === 0) && (
                    <p className="text-white/40 text-center py-4">Aucune donnée de pages</p>
                  )}
                </div>
              </div>

              {/* Recent Visitors Table */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-white/10">
                  <h3 className="text-lg font-semibold text-white">Visiteurs Récents</h3>
                </div>
                {visitors.length === 0 ? (
                  <div className="p-12 text-center text-white/50">
                    <FiUsers className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Aucun visiteur enregistré</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-white/60 text-sm border-b border-white/10">
                          <th className="px-4 py-3">Appareil</th>
                          <th className="px-4 py-3">Navigateur</th>
                          <th className="px-4 py-3">OS</th>
                          <th className="px-4 py-3">Pages Vues</th>
                          <th className="px-4 py-3">Dernière Activité</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visitors.slice(0, 20).map((visitor) => (
                          <tr key={visitor._id} className="border-b border-white/5 hover:bg-white/5">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                {visitor.device?.type === 'mobile' && <FiSmartphone className="w-4 h-4 text-cyan-400" />}
                                {visitor.device?.type === 'desktop' && <FiMonitor className="w-4 h-4 text-purple-400" />}
                                {visitor.device?.type === 'tablet' && <FiMonitor className="w-4 h-4 text-amber-400" />}
                                {(!visitor.device?.type || visitor.device?.type === 'unknown') && <FiGlobe className="w-4 h-4 text-gray-400" />}
                                <span className="text-white capitalize">{visitor.device?.type || 'unknown'}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-white/80">{visitor.device?.browser || 'unknown'}</td>
                            <td className="px-4 py-3 text-white/80">{visitor.device?.os || 'unknown'}</td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-sm">
                                {visitor.pageViews || 0}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-white/60 text-sm">
                              {new Date(visitor.lastActivity).toLocaleString('fr-FR')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Contacts Tab */}
          {activeTab === 'contacts' && (
            <motion.div
              key="contacts"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Messages de Contact</h2>
                <p className="text-white/60">Gérez les messages reçus via le formulaire de contact</p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                {recentContacts.length === 0 ? (
                  <div className="p-12 text-center text-white/50">
                    <FiMail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Aucun message de contact</p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/10">
                    {recentContacts.map((contact) => (
                      <div key={contact._id} className="p-6 hover:bg-white/5 transition-colors">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-white">{contact.name}</h4>
                              <span className={`px-2 py-0.5 ${getStatusColor(contact.status)} text-white text-xs rounded-full`}>
                                {getStatusLabel(contact.status)}
                              </span>
                            </div>
                            <p className="text-white/60 text-sm mb-2">{contact.email} • {contact.phone}</p>
                            <p className="text-white/80 text-sm line-clamp-2">{contact.message}</p>
                            <p className="text-white/40 text-xs mt-2">
                              {new Date(contact.createdAt).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            {contact.status === 'nouveau' && (
                              <button
                                onClick={() => updateContactStatus(contact._id, 'traite')}
                                className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                                title="Marquer comme traité"
                              >
                                <FiCheckCircle className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Devis Tab */}
          {activeTab === 'devis' && (
            <motion.div
              key="devis"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Demandes de Devis</h2>
                <p className="text-white/60">Gérez les demandes de devis reçues</p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                {recentDevis.length === 0 ? (
                  <div className="p-12 text-center text-white/50">
                    <FiMessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Aucune demande de devis</p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/10">
                    {recentDevis.map((devis) => (
                      <div key={devis._id} className="p-6 hover:bg-white/5 transition-colors">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-white">{devis.name}</h4>
                              <span className={`px-2 py-0.5 ${getStatusColor(devis.status)} text-white text-xs rounded-full`}>
                                {getStatusLabel(devis.status)}
                              </span>
                              {devis.urgence === 'urgent' && (
                                <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                                  Urgent
                                </span>
                              )}
                            </div>
                            <p className="text-white/60 text-sm mb-2">
                              {devis.email} • {devis.phone} • {devis.clientType === 'entreprise' ? 'Entreprise' : 'Particulier'}
                            </p>
                            <p className="text-cyan-400 text-sm font-medium mb-1">Service: {devis.service}</p>
                            <p className="text-white/80 text-sm line-clamp-2">{devis.description}</p>
                            <p className="text-white/40 text-xs mt-2">
                              {new Date(devis.createdAt).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            {(devis.status === 'nouveau' || devis.status === 'en_attente') && (
                              <>
                                <button
                                  onClick={() => updateDevisStatus(devis._id, 'accepte')}
                                  className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                                  title="Accepter"
                                >
                                  <FiCheckCircle className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => updateDevisStatus(devis._id, 'refuse')}
                                  className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                                  title="Refuser"
                                >
                                  <FiX className="w-5 h-5" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Testimonials Tab */}
          {activeTab === 'testimonials' && (
            <motion.div
              key="testimonials"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Témoignages Clients</h2>
                <p className="text-white/60">Gérez les avis et témoignages de vos clients</p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                {recentTestimonials.length === 0 ? (
                  <div className="p-12 text-center text-white/50">
                    <FiStar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Aucun témoignage</p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/10">
                    {recentTestimonials.map((testimonial) => (
                      <div key={testimonial._id} className="p-6 hover:bg-white/5 transition-colors">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-white">{testimonial.name}</h4>
                              <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <FiStar
                                    key={i}
                                    className={`w-4 h-4 ${i < testimonial.rating ? 'text-amber-400 fill-current' : 'text-white/20'}`}
                                  />
                                ))}
                              </div>
                              {testimonial.verified && (
                                <span className="px-2 py-0.5 bg-green-500 text-white text-xs rounded-full flex items-center gap-1">
                                  <FiCheckCircle className="w-3 h-3" /> Vérifié
                                </span>
                              )}
                            </div>
                            <p className="text-white/60 text-sm mb-2">{testimonial.company || testimonial.service}</p>
                            <p className="text-white/80 text-sm line-clamp-3">"{testimonial.comment}"</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Admin;
