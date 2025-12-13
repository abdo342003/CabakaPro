import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaEnvelope, FaFileInvoice, FaBlog, FaBriefcase, 
  FaStar, FaEye, FaChartLine, FaSignOutAlt, FaTrash, FaCheck,
  FaTimes, FaCalendar, FaPhone, FaUser, FaBuilding,
  FaSync, FaCopy, FaExternalLinkAlt, FaFilter, FaSearch,
  FaClock, FaMoneyBillWave, FaWhatsapp, FaEnvelopeOpen,
  FaChartBar, FaHome, FaCheckCircle, FaExclamationTriangle
} from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

// Determine API URL based on environment
const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'www.chabakapro.com' || hostname === 'chabakapro.com') {
      return 'https://church-pushed-mere-annually.trycloudflare.com/api';
    }
    if (hostname === 'localhost' && window.location.port === '4000') {
      return '/api'; // Docker nginx proxy
    }
  }
  return process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
};

const API_URL = getApiUrl();

const Admin = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // États pour les données
  const [contacts, setContacts] = useState([]);
  const [devis, setDevis] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [stats, setStats] = useState({
    totalContacts: 0,
    totalDevis: 0,
    totalBlogs: 0,
    totalPortfolios: 0,
    totalTestimonials: 0,
    pendingContacts: 0,
    pendingDevis: 0,
    todayContacts: 0,
    todayDevis: 0,
    weekContacts: 0,
    weekDevis: 0
  });

  // Charger toutes les données
  const loadAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [contactsRes, devisRes, blogsRes, portfoliosRes, testimonialsRes] = await Promise.all([
        axios.get(`${API_URL}/contact`).catch(() => ({ data: { data: [] } })),
        axios.get(`${API_URL}/devis`).catch(() => ({ data: { data: [] } })),
        axios.get(`${API_URL}/blog`).catch(() => ({ data: { data: [] } })),
        axios.get(`${API_URL}/portfolio`).catch(() => ({ data: { data: [] } })),
        axios.get(`${API_URL}/testimonials`).catch(() => ({ data: { data: [] } }))
      ]);

      const contactsData = contactsRes.data?.data || [];
      const devisData = devisRes.data?.data || [];
      const blogsData = blogsRes.data?.data || [];
      const portfoliosData = portfoliosRes.data?.data || [];
      const testimonialsData = testimonialsRes.data?.data || [];

      setContacts(contactsData);
      setDevis(devisData);
      setBlogs(blogsData);
      setPortfolios(portfoliosData);
      setTestimonials(testimonialsData);

      // Calculer statistiques
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

      setStats({
        totalContacts: contactsData.length,
        totalDevis: devisData.length,
        totalBlogs: blogsData.length,
        totalPortfolios: portfoliosData.length,
        totalTestimonials: testimonialsData.length,
        pendingContacts: contactsData.filter(c => c.status === 'pending').length,
        pendingDevis: devisData.filter(d => d.status === 'pending').length,
        todayContacts: contactsData.filter(c => new Date(c.createdAt) >= today).length,
        todayDevis: devisData.filter(d => new Date(d.createdAt) >= today).length,
        weekContacts: contactsData.filter(c => new Date(c.createdAt) >= weekAgo).length,
        weekDevis: devisData.filter(d => new Date(d.createdAt) >= weekAgo).length
      });

    } catch (error) {
      console.error('Erreur chargement données:', error);
      toast.error('Erreur de connexion au serveur');
    }
    setLoading(false);
  }, []);

  // Authentification
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'chabakapro2025') {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuth', 'true');
      localStorage.setItem('adminAuthTime', Date.now().toString());
      toast.success('Bienvenue dans le Dashboard ChabakaPro!');
      loadAllData();
    } else {
      toast.error('Mot de passe incorrect');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminAuthTime');
    navigate('/');
  };

  // Vérifier session (expire après 24h)
  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    const authTime = localStorage.getItem('adminAuthTime');
    const oneDayMs = 24 * 60 * 60 * 1000;
    
    if (auth === 'true' && authTime && (Date.now() - parseInt(authTime)) < oneDayMs) {
      setIsAuthenticated(true);
      loadAllData();
    } else {
      localStorage.removeItem('adminAuth');
      localStorage.removeItem('adminAuthTime');
    }
  }, [loadAllData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAllData();
    setRefreshing(false);
    toast.success('Données actualisées');
  };

  // Actions CRUD
  const updateContactStatus = async (id, status) => {
    try {
      await axios.patch(`${API_URL}/contact/${id}`, { status });
      toast.success('Statut mis à jour');
      loadAllData();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const deleteContact = async (id) => {
    if (!window.confirm('Supprimer ce message de contact?')) return;
    try {
      await axios.delete(`${API_URL}/contact/${id}`);
      toast.success('Contact supprimé');
      loadAllData();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const deleteDevis = async (id) => {
    if (!window.confirm('Supprimer cette demande de devis?')) return;
    try {
      await axios.delete(`${API_URL}/devis/${id}`);
      toast.success('Devis supprimé');
      loadAllData();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const deleteTestimonial = async (id) => {
    if (!window.confirm('Supprimer ce témoignage?')) return;
    try {
      await axios.delete(`${API_URL}/testimonials/${id}`);
      toast.success('Témoignage supprimé');
      loadAllData();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const toggleTestimonialStatus = async (id, currentStatus) => {
    try {
      await axios.patch(`${API_URL}/testimonials/${id}`, { published: !currentStatus });
      toast.success('Statut mis à jour');
      loadAllData();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  // Copier dans le presse-papier
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copié!');
  };

  // Ouvrir WhatsApp
  const openWhatsApp = (phone) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone}`, '_blank');
  };

  // Filtrer les données
  const filterData = (data) => {
    return data.filter(item => {
      const matchesSearch = !searchTerm || 
        JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  };

  // Format date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Modal pour voir les détails
  const DetailModal = ({ item, type, onClose }) => {
    if (!item) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
            <h3 className="text-xl font-bold">
              {type === 'contact' ? 'Message de Contact' : 'Demande de Devis'}
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <FaTimes />
            </button>
          </div>
          
          <div className="p-6 space-y-4">
            {/* Info Client */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FaUser className="text-blue-600" /> Informations Client
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-gray-500">Nom</p>
                  <p className="font-medium">{item.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{item.email}</p>
                    <button onClick={() => copyToClipboard(item.email)} className="text-blue-600 hover:text-blue-800">
                      <FaCopy size={12} />
                    </button>
                    <a href={`mailto:${item.email}`} className="text-blue-600 hover:text-blue-800">
                      <FaExternalLinkAlt size={12} />
                    </a>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Téléphone</p>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{item.phone}</p>
                    <button onClick={() => copyToClipboard(item.phone)} className="text-blue-600 hover:text-blue-800">
                      <FaCopy size={12} />
                    </button>
                    <button onClick={() => openWhatsApp(item.phone)} className="text-green-600 hover:text-green-800">
                      <FaWhatsapp size={14} />
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{new Date(item.createdAt).toLocaleString('fr-FR')}</p>
                </div>
              </div>
            </div>

            {/* Info Demande */}
            {type === 'devis' && (
              <div className="bg-blue-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <FaFileInvoice className="text-blue-600" /> Détails du Devis
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm text-gray-500">Type Client</p>
                    <p className="font-medium flex items-center gap-2">
                      {item.clientType === 'entreprise' ? <FaBuilding /> : <FaHome />}
                      {item.clientType}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Service</p>
                    <p className="font-medium">{item.service}</p>
                  </div>
                  {item.budget && (
                    <div>
                      <p className="text-sm text-gray-500">Budget</p>
                      <p className="font-medium flex items-center gap-2">
                        <FaMoneyBillWave className="text-green-600" />
                        {item.budget}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500">Urgence</p>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      item.urgency === 'urgent' ? 'bg-red-100 text-red-700' :
                      item.urgency === 'normal' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {item.urgency || 'Normal'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {type === 'contact' && item.subject && (
              <div className="bg-purple-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-700 mb-2">Sujet</h4>
                <p className="font-medium">{item.subject}</p>
              </div>
            )}

            {/* Message */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-700 mb-2">Message / Description</h4>
              <p className="whitespace-pre-wrap text-gray-700">{item.message || item.description}</p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-4 border-t">
              <a 
                href={`mailto:${item.email}?subject=Re: ${type === 'contact' ? item.subject || 'Votre message' : 'Votre demande de devis'}`}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                <FaEnvelope /> Répondre par Email
              </a>
              <button 
                onClick={() => openWhatsApp(item.phone)}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
              >
                <FaWhatsapp /> WhatsApp
              </button>
              <a 
                href={`tel:${item.phone}`}
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition flex items-center justify-center gap-2"
              >
                <FaPhone /> Appeler
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Interface de connexion
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl font-bold text-blue-600">CP</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Administration</h1>
            <p className="text-gray-600 mt-2">ChabakaPro Dashboard</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Mot de passe administrateur
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="••••••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
            >
              Se connecter
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>🔒 Accès sécurisé réservé aux administrateurs</p>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard Admin
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-lg font-bold text-white">CP</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">ChabakaPro Admin</h1>
              <p className="text-xs text-gray-500">Tableau de bord</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className={`p-2 rounded-lg hover:bg-gray-100 transition ${refreshing ? 'animate-spin' : ''}`}
              title="Actualiser"
            >
              <FaSync className="text-gray-600" />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
            >
              <FaSignOutAlt />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-blue-100 text-sm">Messages</p>
                <h3 className="text-3xl font-bold">{stats.totalContacts}</h3>
                {stats.pendingContacts > 0 && (
                  <p className="text-blue-200 text-sm mt-1 flex items-center gap-1">
                    <FaExclamationTriangle /> {stats.pendingContacts} en attente
                  </p>
                )}
              </div>
              <FaEnvelope className="text-3xl text-blue-200" />
            </div>
            {stats.todayContacts > 0 && (
              <div className="mt-2 pt-2 border-t border-blue-400">
                <p className="text-xs text-blue-200">+{stats.todayContacts} aujourd'hui</p>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-4 text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-green-100 text-sm">Devis</p>
                <h3 className="text-3xl font-bold">{stats.totalDevis}</h3>
                {stats.pendingDevis > 0 && (
                  <p className="text-green-200 text-sm mt-1 flex items-center gap-1">
                    <FaExclamationTriangle /> {stats.pendingDevis} en attente
                  </p>
                )}
              </div>
              <FaFileInvoice className="text-3xl text-green-200" />
            </div>
            {stats.todayDevis > 0 && (
              <div className="mt-2 pt-2 border-t border-green-400">
                <p className="text-xs text-green-200">+{stats.todayDevis} aujourd'hui</p>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-4 text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-purple-100 text-sm">Blog</p>
                <h3 className="text-3xl font-bold">{stats.totalBlogs}</h3>
              </div>
              <FaBlog className="text-3xl text-purple-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-4 text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-yellow-100 text-sm">Témoignages</p>
                <h3 className="text-3xl font-bold">{stats.totalTestimonials}</h3>
              </div>
              <FaStar className="text-3xl text-yellow-200" />
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-2xl shadow-sm mb-6 overflow-x-auto">
          <div className="flex border-b min-w-max">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: FaChartLine },
              { id: 'contacts', label: `Messages (${stats.totalContacts})`, icon: FaEnvelope },
              { id: 'devis', label: `Devis (${stats.totalDevis})`, icon: FaFileInvoice },
              { id: 'testimonials', label: 'Témoignages', icon: FaStar },
              { id: 'blogs', label: 'Blog', icon: FaBlog },
              { id: 'portfolios', label: 'Portfolio', icon: FaBriefcase }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSearchTerm(''); setStatusFilter('all'); }}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search & Filter Bar */}
        {(activeTab === 'contacts' || activeTab === 'devis') && (
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px] relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="processed">Traité</option>
                <option value="closed">Fermé</option>
              </select>
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-sm">
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>
              <p className="text-gray-600 mt-4">Chargement des données...</p>
            </div>
          ) : (
            <>
              {/* Dashboard Tab */}
              {activeTab === 'dashboard' && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <FaChartBar className="text-blue-600" /> Vue d'ensemble
                  </h2>
                  
                  {/* Weekly Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="bg-blue-50 rounded-xl p-4">
                      <h3 className="font-semibold text-blue-800 mb-2">Cette semaine</h3>
                      <div className="flex gap-6">
                        <div>
                          <p className="text-3xl font-bold text-blue-600">{stats.weekContacts}</p>
                          <p className="text-sm text-blue-600">messages</p>
                        </div>
                        <div>
                          <p className="text-3xl font-bold text-green-600">{stats.weekDevis}</p>
                          <p className="text-sm text-green-600">devis</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-orange-50 rounded-xl p-4">
                      <h3 className="font-semibold text-orange-800 mb-2">À traiter</h3>
                      <div className="flex gap-6">
                        <div>
                          <p className="text-3xl font-bold text-orange-600">{stats.pendingContacts}</p>
                          <p className="text-sm text-orange-600">messages</p>
                        </div>
                        <div>
                          <p className="text-3xl font-bold text-orange-600">{stats.pendingDevis}</p>
                          <p className="text-sm text-orange-600">devis</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Derniers contacts */}
                    <div className="border rounded-xl">
                      <div className="px-4 py-3 border-b bg-gray-50 rounded-t-xl">
                        <h3 className="font-bold flex items-center gap-2">
                          <FaEnvelope className="text-blue-600" />
                          Derniers messages
                        </h3>
                      </div>
                      <div className="divide-y max-h-80 overflow-y-auto">
                        {contacts.length === 0 ? (
                          <p className="p-4 text-gray-500 text-center">Aucun message</p>
                        ) : contacts.slice(0, 5).map(contact => (
                          <div 
                            key={contact._id} 
                            className="p-4 hover:bg-gray-50 cursor-pointer transition"
                            onClick={() => { setSelectedItem(contact); setShowModal('contact'); }}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold truncate">{contact.name}</p>
                                <p className="text-sm text-gray-600 truncate">{contact.email}</p>
                                <p className="text-sm text-gray-500 mt-1 truncate">{contact.subject || contact.message?.substring(0, 50)}</p>
                              </div>
                              <div className="ml-3 flex flex-col items-end gap-1">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  contact.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                                  contact.status === 'processed' ? 'bg-green-100 text-green-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {contact.status === 'pending' ? 'En attente' : 
                                   contact.status === 'processed' ? 'Traité' : 'Fermé'}
                                </span>
                                <span className="text-xs text-gray-400">{formatDate(contact.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Derniers devis */}
                    <div className="border rounded-xl">
                      <div className="px-4 py-3 border-b bg-gray-50 rounded-t-xl">
                        <h3 className="font-bold flex items-center gap-2">
                          <FaFileInvoice className="text-green-600" />
                          Dernières demandes de devis
                        </h3>
                      </div>
                      <div className="divide-y max-h-80 overflow-y-auto">
                        {devis.length === 0 ? (
                          <p className="p-4 text-gray-500 text-center">Aucun devis</p>
                        ) : devis.slice(0, 5).map(d => (
                          <div 
                            key={d._id} 
                            className="p-4 hover:bg-gray-50 cursor-pointer transition"
                            onClick={() => { setSelectedItem(d); setShowModal('devis'); }}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold truncate">{d.name}</p>
                                <p className="text-sm text-gray-600 truncate">{d.email}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                  <span className="inline-flex items-center gap-1">
                                    {d.clientType === 'entreprise' ? <FaBuilding size={10} /> : <FaUser size={10} />}
                                    {d.service}
                                  </span>
                                </p>
                              </div>
                              <div className="ml-3 flex flex-col items-end gap-1">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  d.urgency === 'urgent' ? 'bg-red-100 text-red-700' :
                                  d.urgency === 'normal' ? 'bg-blue-100 text-blue-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {d.urgency || 'Normal'}
                                </span>
                                <span className="text-xs text-gray-400">{formatDate(d.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Contacts Tab */}
              {activeTab === 'contacts' && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Messages de contact</h2>
                  
                  {filterData(contacts).length === 0 ? (
                    <div className="text-center py-12">
                      <FaEnvelopeOpen className="text-6xl text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Aucun message {statusFilter !== 'all' && `avec le statut "${statusFilter}"`}</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filterData(contacts).map(contact => (
                        <div 
                          key={contact._id} 
                          className={`border rounded-xl p-4 hover:shadow-md transition cursor-pointer ${
                            contact.status === 'pending' ? 'border-l-4 border-l-orange-500' : ''
                          }`}
                          onClick={() => { setSelectedItem(contact); setShowModal('contact'); }}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-bold text-lg">{contact.name}</h3>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  contact.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                                  contact.status === 'processed' ? 'bg-green-100 text-green-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {contact.status === 'pending' ? 'En attente' : 
                                   contact.status === 'processed' ? 'Traité' : 'Fermé'}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
                                <span className="flex items-center gap-1"><FaEnvelope /> {contact.email}</span>
                                <span className="flex items-center gap-1"><FaPhone /> {contact.phone}</span>
                                <span className="flex items-center gap-1"><FaClock /> {formatDate(contact.createdAt)}</span>
                              </div>
                              {contact.subject && (
                                <p className="text-sm font-medium text-blue-600 mb-1">Sujet: {contact.subject}</p>
                              )}
                              <p className="text-gray-700 line-clamp-2">{contact.message}</p>
                            </div>
                            <div className="flex gap-2 ml-4" onClick={e => e.stopPropagation()}>
                              <select
                                value={contact.status}
                                onChange={(e) => updateContactStatus(contact._id, e.target.value)}
                                className="text-sm border rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="pending">En attente</option>
                                <option value="processed">Traité</option>
                                <option value="closed">Fermé</option>
                              </select>
                              <button
                                onClick={() => deleteContact(contact._id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Devis Tab */}
              {activeTab === 'devis' && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Demandes de devis</h2>
                  
                  {filterData(devis).length === 0 ? (
                    <div className="text-center py-12">
                      <FaFileInvoice className="text-6xl text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Aucune demande de devis</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filterData(devis).map(d => (
                        <div 
                          key={d._id} 
                          className={`border rounded-xl p-4 hover:shadow-md transition cursor-pointer ${
                            d.urgency === 'urgent' ? 'border-l-4 border-l-red-500' : ''
                          }`}
                          onClick={() => { setSelectedItem(d); setShowModal('devis'); }}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className="font-bold text-lg">{d.name}</h3>
                                <span className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${
                                  d.clientType === 'entreprise' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                }`}>
                                  {d.clientType === 'entreprise' ? <FaBuilding size={10} /> : <FaUser size={10} />}
                                  {d.clientType}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                <span className="flex items-center gap-1"><FaEnvelope /> {d.email}</span>
                                <span className="flex items-center gap-1"><FaPhone /> {d.phone}</span>
                                <span className="flex items-center gap-1"><FaClock /> {formatDate(d.createdAt)}</span>
                              </div>
                            </div>
                            <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                              <span className={`px-3 py-1 rounded-full text-sm ${
                                d.urgency === 'urgent' ? 'bg-red-100 text-red-700' :
                                d.urgency === 'normal' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {d.urgency || 'Normal'}
                              </span>
                              <button
                                onClick={() => deleteDevis(d._id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm bg-gray-50 rounded-lg p-3">
                            <div>
                              <p className="text-gray-500">Service</p>
                              <p className="font-semibold">{d.service}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Budget</p>
                              <p className="font-semibold">{d.budget || 'Non spécifié'}</p>
                            </div>
                            {d.company && (
                              <div>
                                <p className="text-gray-500">Entreprise</p>
                                <p className="font-semibold">{d.company}</p>
                              </div>
                            )}
                          </div>
                          
                          {(d.message || d.description) && (
                            <p className="mt-3 text-gray-700 line-clamp-2">{d.message || d.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Testimonials Tab */}
              {activeTab === 'testimonials' && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Témoignages</h2>
                  
                  {testimonials.length === 0 ? (
                    <div className="text-center py-12">
                      <FaStar className="text-6xl text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Aucun témoignage</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {testimonials.map(t => (
                        <div key={t._id} className="border rounded-xl p-4 hover:shadow-md transition">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-bold">{t.name}</h3>
                              <p className="text-sm text-gray-600">{t.company || t.location}</p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => toggleTestimonialStatus(t._id, t.published)}
                                className={`p-2 rounded-lg transition ${
                                  t.published ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                                title={t.published ? 'Publié - Cliquer pour masquer' : 'Masqué - Cliquer pour publier'}
                              >
                                {t.published ? <FaCheck /> : <FaTimes />}
                              </button>
                              <button
                                onClick={() => deleteTestimonial(t._id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 mb-3">
                            {[...Array(5)].map((_, i) => (
                              <FaStar 
                                key={i} 
                                className={i < t.rating ? 'text-yellow-400' : 'text-gray-300'}
                              />
                            ))}
                            <span className="text-sm text-gray-500 ml-2">({t.rating}/5)</span>
                          </div>
                          
                          <p className="text-gray-700 italic">"{t.text}"</p>
                          
                          <div className="mt-3 pt-3 border-t flex flex-wrap gap-2 text-xs">
                            <span className="text-gray-500">{formatDate(t.createdAt)}</span>
                            {t.verified && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full flex items-center gap-1">
                                <FaCheckCircle size={10} /> Vérifié
                              </span>
                            )}
                            {t.featured && (
                              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                                ⭐ En vedette
                              </span>
                            )}
                            <span className={`px-2 py-1 rounded-full ${
                              t.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {t.published ? 'Publié' : 'Masqué'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Blogs Tab */}
              {activeTab === 'blogs' && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Articles de blog</h2>
                  
                  {blogs.length === 0 ? (
                    <div className="text-center py-12">
                      <FaBlog className="text-6xl text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Aucun article de blog</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {blogs.map(blog => (
                        <div key={blog._id} className="border rounded-xl p-4 hover:shadow-md transition">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-bold text-lg mb-2">{blog.title}</h3>
                              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{blog.excerpt}</p>
                              
                              <div className="flex flex-wrap gap-2 items-center text-sm">
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                                  {blog.category}
                                </span>
                                <span className="flex items-center gap-1 text-gray-600">
                                  <FaEye /> {blog.views || 0} vues
                                </span>
                                <span className="flex items-center gap-1 text-gray-600">
                                  <FaCalendar /> {formatDate(blog.createdAt)}
                                </span>
                                <span className={`px-2 py-1 rounded-full ${
                                  blog.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                }`}>
                                  {blog.published ? 'Publié' : 'Brouillon'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Portfolios Tab */}
              {activeTab === 'portfolios' && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Portfolio</h2>
                  
                  {portfolios.length === 0 ? (
                    <div className="text-center py-12">
                      <FaBriefcase className="text-6xl text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Aucun projet dans le portfolio</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {portfolios.map(p => (
                        <div key={p._id} className="border rounded-xl overflow-hidden hover:shadow-lg transition">
                          {p.image && (
                            <img 
                              src={p.image} 
                              alt={p.title} 
                              className="w-full h-48 object-cover"
                            />
                          )}
                          <div className="p-4">
                            <h3 className="font-bold text-lg mb-2">{p.title}</h3>
                            <p className="text-gray-600 text-sm mb-3">{p.client}</p>
                            
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-500">Catégorie:</span>
                                <span className="font-semibold">{p.category}</span>
                              </div>
                              
                              {p.investment && (
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Investissement:</span>
                                  <span className="font-semibold text-green-600">{p.investment} MAD</span>
                                </div>
                              )}
                            </div>
                            
                            {p.technologies && p.technologies.length > 0 && (
                              <div className="mt-3 pt-3 border-t">
                                <div className="flex flex-wrap gap-1">
                                  {p.technologies.map((tech, i) => (
                                    <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            <div className="mt-3 text-xs text-gray-500">
                              {formatDate(p.createdAt)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {showModal && (
        <DetailModal 
          item={selectedItem} 
          type={showModal} 
          onClose={() => { setShowModal(false); setSelectedItem(null); }} 
        />
      )}
    </div>
  );
};

export default Admin;
