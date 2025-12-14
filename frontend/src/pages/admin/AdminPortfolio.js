import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiStar,
  FiSearch,
  FiFilter,
  FiX,
  FiImage,
  FiBriefcase,
  FiUsers,
  FiDollarSign,
  FiClock,
  FiSave,
  FiArrowLeft,
  FiLayers,
  FiMessageSquare
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const CATEGORIES = [
  { value: 'particulier', label: 'Particulier', color: 'bg-blue-500', icon: '👤' },
  { value: 'entreprise', label: 'Entreprise', color: 'bg-purple-500', icon: '🏢' },
  { value: 'pme', label: 'PME', color: 'bg-green-500', icon: '🏪' },
  { value: 'grand_compte', label: 'Grand Compte', color: 'bg-orange-500', icon: '🏛️' }
];

const PortfolioModal = ({ isOpen, onClose, portfolio, onSave, isLoading }) => {
  const [formData, setFormData] = useState({
    title: '',
    client: '',
    sector: '',
    teamSize: 1,
    challenge: '',
    solution: [''],
    results: [''],
    investment: 0,
    duration: '',
    category: 'particulier',
    image: '',
    gallery: [''],
    featured: false,
    published: true,
    technologies: [''],
    testimonial: {
      name: '',
      role: '',
      text: '',
      rating: 5
    }
  });
  const [imagePreview, setImagePreview] = useState('');
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    if (portfolio) {
      setFormData({
        ...portfolio,
        solution: portfolio.solution?.length ? portfolio.solution : [''],
        results: portfolio.results?.length ? portfolio.results : [''],
        gallery: portfolio.gallery?.length ? portfolio.gallery : [''],
        technologies: portfolio.technologies?.length ? portfolio.technologies : [''],
        testimonial: portfolio.testimonial || { name: '', role: '', text: '', rating: 5 }
      });
      setImagePreview(portfolio.image || '');
    } else {
      setFormData({
        title: '',
        client: '',
        sector: '',
        teamSize: 1,
        challenge: '',
        solution: [''],
        results: [''],
        investment: 0,
        duration: '',
        category: 'particulier',
        image: '',
        gallery: [''],
        featured: false,
        published: true,
        technologies: [''],
        testimonial: {
          name: '',
          role: '',
          text: '',
          rating: 5
        }
      });
      setImagePreview('');
    }
    setActiveTab('general');
  }, [portfolio, isOpen]);

  const handleArrayField = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field, index) => {
    if (formData[field].length > 1) {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }));
    }
  };

  const handleImageChange = (e) => {
    const url = e.target.value;
    setFormData(prev => ({ ...prev, image: url }));
    setImagePreview(url);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSend = {
      ...formData,
      solution: formData.solution.filter(Boolean),
      results: formData.results.filter(Boolean),
      gallery: formData.gallery.filter(Boolean),
      technologies: formData.technologies.filter(Boolean)
    };
    onSave(dataToSend);
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'general', label: 'Général', icon: FiBriefcase },
    { id: 'details', label: 'Détails', icon: FiLayers },
    { id: 'media', label: 'Médias', icon: FiImage },
    { id: 'testimonial', label: 'Témoignage', icon: FiMessageSquare }
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <FiBriefcase className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">
                  {portfolio ? 'Modifier le projet' : 'Nouveau projet'}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700 px-6">
            <div className="flex gap-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 font-medium transition-all border-b-2 ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* General Tab */}
            {activeTab === 'general' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-5">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Titre du projet *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      required
                      maxLength={200}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Installation réseau complet"
                    />
                  </div>

                  {/* Client */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Client *
                    </label>
                    <input
                      type="text"
                      value={formData.client}
                      onChange={(e) => setFormData(prev => ({ ...prev, client: e.target.value }))}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Nom du client"
                    />
                  </div>

                  {/* Sector */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Secteur d'activité
                    </label>
                    <input
                      type="text"
                      value={formData.sector}
                      onChange={(e) => setFormData(prev => ({ ...prev, sector: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="E-commerce, Santé, Education..."
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Catégorie *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {CATEGORIES.map(cat => (
                        <button
                          key={cat.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, category: cat.value }))}
                          className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                            formData.category === cat.value
                              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30'
                              : 'border-gray-200 dark:border-gray-600 hover:border-purple-300'
                          }`}
                        >
                          <span className="text-2xl">{cat.icon}</span>
                          <span className={`font-medium ${formData.category === cat.value ? 'text-purple-600 dark:text-purple-400' : 'text-gray-700 dark:text-gray-300'}`}>
                            {cat.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Investment & Duration */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        <FiDollarSign className="inline mr-1" /> Investissement (MAD) *
                      </label>
                      <input
                        type="number"
                        value={formData.investment}
                        onChange={(e) => setFormData(prev => ({ ...prev, investment: parseFloat(e.target.value) || 0 }))}
                        required
                        min={0}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        <FiClock className="inline mr-1" /> Durée
                      </label>
                      <input
                        type="text"
                        value={formData.duration}
                        onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="2 semaines"
                      />
                    </div>
                  </div>

                  {/* Team Size */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      <FiUsers className="inline mr-1" /> Taille de l'équipe
                    </label>
                    <input
                      type="number"
                      value={formData.teamSize}
                      onChange={(e) => setFormData(prev => ({ ...prev, teamSize: parseInt(e.target.value) || 1 }))}
                      min={1}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Challenge */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Le Défi *
                    </label>
                    <textarea
                      value={formData.challenge}
                      onChange={(e) => setFormData(prev => ({ ...prev, challenge: e.target.value }))}
                      required
                      maxLength={1000}
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                      placeholder="Décrivez le défi rencontré par le client..."
                    />
                  </div>

                  {/* Toggles */}
                  <div className="flex gap-6">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={formData.published}
                          onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                          className="sr-only"
                        />
                        <div className={`w-12 h-6 rounded-full transition-colors ${formData.published ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                          <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${formData.published ? 'translate-x-6' : 'translate-x-0.5'} mt-0.5`} />
                        </div>
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {formData.published ? <FiEye className="inline mr-1" /> : <FiEyeOff className="inline mr-1" />}
                        Publié
                      </span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={formData.featured}
                          onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                          className="sr-only"
                        />
                        <div className={`w-12 h-6 rounded-full transition-colors ${formData.featured ? 'bg-amber-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                          <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${formData.featured ? 'translate-x-6' : 'translate-x-0.5'} mt-0.5`} />
                        </div>
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        <FiStar className="inline mr-1" />
                        En vedette
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Details Tab */}
            {activeTab === 'details' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Solutions */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Solutions apportées
                  </label>
                  <div className="space-y-3">
                    {formData.solution.map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => handleArrayField('solution', index, e.target.value)}
                          className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                          placeholder={`Solution ${index + 1}`}
                        />
                        <button
                          type="button"
                          onClick={() => removeArrayItem('solution', index)}
                          className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-colors"
                        >
                          <FiX className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayItem('solution')}
                      className="flex items-center gap-2 px-4 py-2 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-xl transition-colors"
                    >
                      <FiPlus className="w-4 h-4" /> Ajouter une solution
                    </button>
                  </div>
                </div>

                {/* Results */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Résultats obtenus
                  </label>
                  <div className="space-y-3">
                    {formData.results.map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => handleArrayField('results', index, e.target.value)}
                          className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                          placeholder={`Résultat ${index + 1}`}
                        />
                        <button
                          type="button"
                          onClick={() => removeArrayItem('results', index)}
                          className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-colors"
                        >
                          <FiX className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayItem('results')}
                      className="flex items-center gap-2 px-4 py-2 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-xl transition-colors"
                    >
                      <FiPlus className="w-4 h-4" /> Ajouter un résultat
                    </button>
                  </div>
                </div>

                {/* Technologies */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Technologies utilisées
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {formData.technologies.map((tech, index) => (
                      <div key={index} className="flex items-center gap-2 bg-purple-50 dark:bg-purple-900/30 rounded-full px-3 py-1">
                        <input
                          type="text"
                          value={tech}
                          onChange={(e) => handleArrayField('technologies', index, e.target.value)}
                          className="bg-transparent border-none focus:ring-0 text-sm text-purple-600 dark:text-purple-400 w-24"
                          placeholder="Tech"
                        />
                        <button
                          type="button"
                          onClick={() => removeArrayItem('technologies', index)}
                          className="text-purple-400 hover:text-red-500"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayItem('technologies')}
                      className="flex items-center gap-1 px-3 py-1 text-purple-600 dark:text-purple-400 border-2 border-dashed border-purple-300 dark:border-purple-600 rounded-full hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
                    >
                      <FiPlus className="w-4 h-4" /> Tech
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Media Tab */}
            {activeTab === 'media' && (
              <div className="space-y-6">
                {/* Main Image */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <FiImage className="inline mr-1" /> Image principale
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={handleImageChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="https://example.com/image.jpg"
                  />
                  {imagePreview && (
                    <div className="mt-3 relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600 max-w-md">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover"
                        onError={() => setImagePreview('')}
                      />
                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-1 bg-black/50 text-white text-xs rounded-lg">
                          Aperçu
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Gallery */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Galerie d'images
                  </label>
                  <div className="space-y-3">
                    {formData.gallery.map((url, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="url"
                          value={url}
                          onChange={(e) => handleArrayField('gallery', index, e.target.value)}
                          className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                          placeholder="URL de l'image"
                        />
                        {url && (
                          <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                            <img src={url} alt="" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => removeArrayItem('gallery', index)}
                          className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-colors"
                        >
                          <FiX className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayItem('gallery')}
                      className="flex items-center gap-2 px-4 py-2 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-xl transition-colors"
                    >
                      <FiPlus className="w-4 h-4" /> Ajouter une image
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Testimonial Tab */}
            {activeTab === 'testimonial' && (
              <div className="max-w-2xl mx-auto space-y-5">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiMessageSquare className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">Témoignage Client</h3>
                  <p className="text-gray-500">Ajoutez le retour de votre client sur ce projet</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Nom
                    </label>
                    <input
                      type="text"
                      value={formData.testimonial.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, testimonial: { ...prev.testimonial, name: e.target.value } }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Jean Dupont"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Rôle / Fonction
                    </label>
                    <input
                      type="text"
                      value={formData.testimonial.role}
                      onChange={(e) => setFormData(prev => ({ ...prev, testimonial: { ...prev.testimonial, role: e.target.value } }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Directeur Technique"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Témoignage
                  </label>
                  <textarea
                    value={formData.testimonial.text}
                    onChange={(e) => setFormData(prev => ({ ...prev, testimonial: { ...prev.testimonial, text: e.target.value } }))}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                    placeholder="Ce que le client a dit sur votre travail..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Note <span className="text-gray-400 font-normal">({formData.testimonial.rating}/5)</span>
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, testimonial: { ...prev.testimonial, rating: star } }))}
                        className={`p-2 rounded-lg transition-colors ${
                          star <= formData.testimonial.rating
                            ? 'text-amber-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      >
                        <FiStar className="w-8 h-8 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white font-semibold hover:from-violet-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <FiSave className="w-5 h-5" />
                    {portfolio ? 'Mettre à jour' : 'Créer le projet'}
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const AdminPortfolio = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const fetchPortfolios = useCallback(async () => {
    try {
      setLoading(true);
      const params = { published: 'all', limit: 100 };
      if (filterCategory) params.category = filterCategory;
      
      const response = await api.get('/portfolio', { params });
      setPortfolios(response.data || []);
    } catch (error) {
      toast.error('Erreur lors du chargement des projets');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [filterCategory]);

  useEffect(() => {
    fetchPortfolios();
  }, [fetchPortfolios]);

  const handleSave = async (data) => {
    try {
      setSaving(true);
      if (selectedPortfolio?._id) {
        await api.put(`/portfolio/${selectedPortfolio._id}`, data);
        toast.success('Projet mis à jour avec succès!');
      } else {
        await api.post('/portfolio', data);
        toast.success('Projet créé avec succès!');
      }
      setModalOpen(false);
      setSelectedPortfolio(null);
      fetchPortfolios();
    } catch (error) {
      toast.error(error.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce projet?')) return;
    
    try {
      await api.delete(`/portfolio/${id}`);
      toast.success('Projet supprimé avec succès!');
      fetchPortfolios();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleEdit = (portfolio) => {
    setSelectedPortfolio(portfolio);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedPortfolio(null);
    setModalOpen(true);
  };

  const filteredPortfolios = portfolios.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.client?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getCategoryInfo = (value) => CATEGORIES.find(c => c.value === value) || CATEGORIES[0];
  const totalInvestment = portfolios.reduce((sum, p) => sum + (p.investment || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-fuchsia-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <div className="relative container mx-auto px-4 py-12">
          <div className="flex items-center justify-between">
            <div>
              <Link 
                to="/admin-dashboard-chabakapro"
                className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
              >
                <FiArrowLeft /> Retour au dashboard
              </Link>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                Gestion Portfolio
              </h1>
              <p className="text-purple-100 text-lg">
                Gérez vos projets et cas clients
              </p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreate}
              className="flex items-center gap-2 px-6 py-3 bg-white text-purple-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <FiPlus className="w-5 h-5" />
              Nouveau Projet
            </motion.button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { label: 'Total Projets', value: portfolios.length, icon: FiBriefcase },
              { label: 'Publiés', value: portfolios.filter(p => p.published).length, icon: FiEye },
              { label: 'En Vedette', value: portfolios.filter(p => p.featured).length, icon: FiStar },
              { label: 'Investissement', value: `${(totalInvestment / 1000).toFixed(0)}K MAD`, icon: FiDollarSign }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4"
              >
                <stat.icon className="w-6 h-6 text-white/80 mb-2" />
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-white/70">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher un projet..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <FiFilter className="text-gray-400" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="">Toutes catégories</option>
                {CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Portfolio Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin" />
          </div>
        ) : filteredPortfolios.length === 0 ? (
          <div className="text-center py-20">
            <FiBriefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Aucun projet trouvé
            </h3>
            <p className="text-gray-500 mb-6">
              Commencez par créer votre premier projet
            </p>
            <button
              onClick={handleCreate}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-semibold rounded-xl hover:from-violet-600 hover:to-purple-600 transition-all"
            >
              <FiPlus /> Créer un projet
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredPortfolios.map((portfolio, index) => {
                const category = getCategoryInfo(portfolio.category);
                return (
                  <motion.div
                    key={portfolio._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={portfolio.image || '/images/portfolio/default.jpg'}
                        alt={portfolio.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className={`px-3 py-1 ${category.color} text-white text-xs font-semibold rounded-full flex items-center gap-1`}>
                          <span>{category.icon}</span> {category.label}
                        </span>
                        {portfolio.featured && (
                          <span className="px-3 py-1 bg-amber-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                            <FiStar className="w-3 h-3" /> Vedette
                          </span>
                        )}
                      </div>

                      {/* Status */}
                      <div className="absolute top-3 right-3">
                        <span className={`px-3 py-1 ${portfolio.published ? 'bg-emerald-500' : 'bg-gray-500'} text-white text-xs font-semibold rounded-full flex items-center gap-1`}>
                          {portfolio.published ? <FiEye className="w-3 h-3" /> : <FiEyeOff className="w-3 h-3" />}
                          {portfolio.published ? 'Publié' : 'Brouillon'}
                        </span>
                      </div>

                      {/* Investment Badge */}
                      <div className="absolute bottom-3 right-3">
                        <span className="px-3 py-1 bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-white text-sm font-bold rounded-full">
                          {portfolio.investment?.toLocaleString()} MAD
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1 line-clamp-1 group-hover:text-purple-600 transition-colors">
                        {portfolio.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                        {portfolio.client} {portfolio.sector && `• ${portfolio.sector}`}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">
                        {portfolio.challenge}
                      </p>

                      {/* Technologies */}
                      {portfolio.technologies?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {portfolio.technologies.slice(0, 3).map((tech, i) => (
                            <span key={i} className="px-2 py-1 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs rounded-full">
                              {tech}
                            </span>
                          ))}
                          {portfolio.technologies.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 text-xs rounded-full">
                              +{portfolio.technologies.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Testimonial indicator */}
                      {portfolio.testimonial?.text && (
                        <div className="flex items-center gap-2 mb-4 text-xs text-gray-500">
                          <FiMessageSquare className="w-4 h-4" />
                          <span>Témoignage disponible</span>
                          {portfolio.testimonial.rating && (
                            <span className="flex items-center gap-1 text-amber-500">
                              <FiStar className="w-3 h-3 fill-current" />
                              {portfolio.testimonial.rating}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <button
                          onClick={() => handleEdit(portfolio)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-medium rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
                        >
                          <FiEdit2 className="w-4 h-4" />
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(portfolio._id)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-colors"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Modal */}
      <PortfolioModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedPortfolio(null);
        }}
        portfolio={selectedPortfolio}
        onSave={handleSave}
        isLoading={saving}
      />
    </div>
  );
};

export default AdminPortfolio;
