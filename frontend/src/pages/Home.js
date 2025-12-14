import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaLaptop, 
  FaWifi, 
  FaShieldAlt, 
  FaCamera,
  FaArrowRight,
  FaPhone,
  FaCheckCircle,
  FaTools,
  FaServer,
  FaNetworkWired,
  FaCloud,
  FaVideo,
  FaClock
} from 'react-icons/fa';
import SEO from '../components/common/SEO';
import HeroSlider from '../components/common/HeroSlider';
import WhatsAppButton from '../components/common/WhatsAppButton';
import { getPortfolioStats } from '../services/apiService';
import { useLanguage } from '../context/LanguageContext';

const Home = () => {
  const [stats, setStats] = useState(null);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsData = await getPortfolioStats();
        setStats(statsData.data || null);
      } catch (error) {
        console.error('Erreur chargement données:', error);
      }
    };

    fetchData();
  }, []);

  // Services principaux - Particuliers (simple et clair)
  const homeServices = [
    {
      icon: <FaLaptop className="text-5xl" />,
      title: t('services.pcRepair'),
      tagline: t('services.pcTagline'),
      techDetails: t('services.pcTech'),
      simpleDesc: t('services.pcSimple'),
      price: t('services.from') + ' 200 MAD',
      link: '/services/particuliers#depannage'
    },
    {
      icon: <FaWifi className="text-5xl" />,
      title: t('services.wifi'),
      tagline: t('services.wifiTagline'),
      techDetails: t('services.wifiTech'),
      simpleDesc: t('services.wifiSimple'),
      price: t('services.from') + ' 150 MAD',
      link: '/services/particuliers#wifi'
    },
    {
      icon: <FaShieldAlt className="text-5xl" />,
      title: t('services.security'),
      tagline: t('services.securityTagline'),
      techDetails: t('services.securityTech'),
      simpleDesc: t('services.securitySimple'),
      price: t('services.from') + ' 300 MAD',
      link: '/services/particuliers#securite'
    },
    {
      icon: <FaCamera className="text-5xl" />,
      title: t('services.cameras'),
      tagline: t('services.camerasTagline'),
      techDetails: t('services.camerasTech'),
      simpleDesc: t('services.camerasSimple'),
      price: t('services.from') + ' 500 MAD',
      link: '/services/particuliers#cameras'
    }
  ];

  // Services entreprises (bénéfices simples + technique)
  const businessServices = [
    {
      icon: <FaServer className="text-4xl text-white" />,
      title: t('business.servers'),
      description: t('business.serversDesc'),
      benefit1: t('business.serversBenefit1'),
      benefit2: t('business.serversBenefit2'),
      benefit3: t('business.serversBenefit3')
    },
    {
      icon: <FaNetworkWired className="text-4xl text-white" />,
      title: t('business.networks'),
      description: t('business.networksDesc'),
      benefit1: t('business.networksBenefit1'),
      benefit2: t('business.networksBenefit2'),
      benefit3: t('business.networksBenefit3')
    },
    {
      icon: <FaCloud className="text-4xl text-white" />,
      title: t('business.cloud'),
      description: t('business.cloudDesc'),
      benefit1: t('business.cloudBenefit1'),
      benefit2: t('business.cloudBenefit2'),
      benefit3: t('business.cloudBenefit3')
    },
    {
      icon: <FaVideo className="text-4xl text-white" />,
      title: t('business.videoconf'),
      description: t('business.videoconfDesc'),
      benefit1: t('business.videoconfBenefit1'),
      benefit2: t('business.videoconfBenefit2'),
      benefit3: t('business.videoconfBenefit3')
    }
  ];

  // Méthodologie simplifiée
  const workflowSteps = [
    {
      icon: <FaPhone className="text-3xl" />,
      number: '01',
      title: t('workflow.step1'),
      simple: t('workflow.step1Simple'),
      tech: t('workflow.step1Tech')
    },
    {
      icon: <FaClock className="text-3xl" />,
      number: '02',
      title: t('workflow.step2'),
      simple: t('workflow.step2Simple'),
      tech: t('workflow.step2Tech')
    },
    {
      icon: <FaTools className="text-3xl" />,
      number: '03',
      title: t('workflow.step3'),
      simple: t('workflow.step3Simple'),
      tech: t('workflow.step3Tech')
    },
    {
      icon: <FaCheckCircle className="text-3xl" />,
      number: '04',
      title: t('workflow.step4'),
      simple: t('workflow.step4Simple'),
      tech: t('workflow.step4Tech')
    }
  ];

  return (
    <>
      <SEO 
        title={t('nav.home')}
        description="Services IT & Dépannage Informatique à Casablanca. Intervention 24h pour particuliers et PME. Devis gratuit."
        keywords="dépannage informatique Casablanca, réparation PC, installation Wi-Fi, services IT Maroc"
      />

      {/* Hero Section with Image Slider */}
      <section className="relative">
        <HeroSlider autoPlay={true} interval={5000} />
      </section>

      {/* Services Particuliers - Dual language (simple + tech) */}
      <section className="section bg-gradient-to-br from-white via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 dark:text-white">
              {t('nav.servicesParticuliers')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t('hero.particularDescription')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {homeServices.map((service, index) => (
              <div 
                key={index} 
                className="group bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 border-2 border-transparent hover:border-cyan-400 relative overflow-hidden"
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-blue-600/0 group-hover:from-cyan-500/5 group-hover:to-blue-600/5 transition-all duration-500 rounded-3xl"></div>
                
                <div className="relative z-10">
                  <div className="text-cyan-600 dark:text-cyan-400 mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    {service.icon}
                  </div>
                  
                  <h3 className="text-2xl font-heading font-bold mb-3 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    {service.title}
                  </h3>
                  
                  {/* Simple tagline */}
                  <p className="text-lg font-semibold text-orange-600 dark:text-orange-400 mb-4">
                    {service.tagline}
                  </p>
                  
                  {/* Simple explanation */}
                  <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed text-base">
                    {service.simpleDesc}
                  </p>
                  
                  {/* Tech details (collapsed) */}
                  <details className="mb-4">
                    <summary className="text-sm text-cyan-600 dark:text-cyan-400 cursor-pointer hover:underline font-medium">
                      Détails techniques →
                    </summary>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 pl-3 border-l-2 border-cyan-300">
                      {service.techDetails}
                    </p>
                  </details>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      {service.price}
                    </span>
                    <a 
                      href={service.link}
                      className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 font-semibold inline-flex items-center gap-2 group-hover:gap-4 transition-all"
                    >
                      {t('services.see')} <FaArrowRight className="text-sm" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              to="/services/particuliers"
              className="btn bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-lg px-10 py-4 shadow-xl transform hover:scale-105 transition-all"
            >
              {t('services.allServicesParticuliers')} <FaArrowRight className="inline ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Services Entreprises - Simple & Bénéfices */}
      <section className="section bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-heading font-bold mb-6">
              {t('services.businessSolutions')}
            </h2>
            <p className="text-xl md:text-2xl text-cyan-300 max-w-4xl mx-auto leading-relaxed">
              {t('services.businessSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
            {businessServices.map((service, index) => (
              <div 
                key={index}
                className="group bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-3xl p-8 hover:from-cyan-900/90 hover:to-blue-900/90 transition-all duration-500 border-2 border-gray-700 hover:border-cyan-400 shadow-2xl hover:shadow-cyan-500/50 transform hover:-translate-y-2"
              >
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                    {service.icon}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-cyan-300 transition-colors">
                      {service.title}
                    </h3>
                    
                    {/* Description simple d'abord */}
                    <p className="text-base text-gray-300 mb-4 leading-relaxed">
                      {service.description}
                    </p>
                    
                    {/* Points clés - bénéfices */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-cyan-400">
                        <FaCheckCircle className="flex-shrink-0" />
                        <span>{service.benefit1 || 'Installation rapide'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-cyan-400">
                        <FaCheckCircle className="flex-shrink-0" />
                        <span>{service.benefit2 || 'Support technique inclus'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-cyan-400">
                        <FaCheckCircle className="flex-shrink-0" />
                        <span>{service.benefit3 || 'Garantie & maintenance'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link 
              to="/services/entreprises"
              className="group btn bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xl px-12 py-5 shadow-2xl transform hover:scale-110 transition-all duration-300 font-bold rounded-2xl inline-flex items-center gap-3"
            >
              {t('services.businessSolutions')} 
              <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Méthodologie Section - Dual language */}
      <section className="section bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 dark:text-white">
              {t('workflow.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t('workflow.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {workflowSteps.map((step, index) => (
              <div 
                key={index}
                className="relative bg-white dark:bg-gray-700 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-cyan-400 group"
              >
                {/* Step number badge */}
                <div className="absolute -top-5 -left-5 w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-extrabold text-2xl rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                  {step.number}
                </div>
                
                <div className="text-cyan-600 dark:text-cyan-400 mb-5 mt-6 group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>
                
                <h3 className="text-2xl font-bold mb-4 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                  {step.title}
                </h3>
                
                {/* Simple explanation */}
                <p className="text-base text-gray-800 dark:text-gray-200 mb-3 font-medium">
                  {step.simple}
                </p>
                
                {/* Tech details (collapsible) */}
                <details className="text-sm text-gray-600 dark:text-gray-400">
                  <summary className="cursor-pointer hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                    Détails techniques →
                  </summary>
                  <p className="mt-2 pl-3 border-l-2 border-cyan-300 text-xs">
                    {step.tech}
                  </p>
                </details>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {stats && (
        <section className="section">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div className="card">
                <p className="text-4xl font-bold text-primary mb-2">
                  {stats.totalClients || 50}+
                </p>
                <p className="text-gray-medium">{t('stats.satisfiedClients')}</p>
              </div>
              <div className="card">
                <p className="text-4xl font-bold text-primary mb-2">
                  {stats.totalProjects || 120}+
                </p>
                <p className="text-gray-medium">{t('stats.completedProjects')}</p>
              </div>
              <div className="card">
                <p className="text-4xl font-bold text-primary mb-2">
                  {stats.averageRating || 4.8}★
                </p>
                <p className="text-gray-medium">{t('stats.averageRating')}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      <WhatsAppButton />
    </>
  );
};

export default Home;
