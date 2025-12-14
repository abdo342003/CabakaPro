import React from 'react';
import { Link } from 'react-router-dom';
import { FaServer, FaNetworkWired, FaCloud, FaVideo, FaCheckCircle, FaArrowRight, FaShieldAlt, FaClock, FaHeadset } from 'react-icons/fa';
import SEO from '../components/common/SEO';
import Logo from '../components/common/Logo';
import { useLanguage } from '../context/LanguageContext';

const ServicesEntreprises = () => {
  const { t } = useLanguage();
  
  const services = [
    {
      id: 'servers',
      icon: <FaServer className="text-6xl" />,
      title: t('business.servers'),
      description: t('business.serversDesc'),
      price: t('cta.onQuote'),
      included: [
        t('business.serversBenefit1'),
        t('business.serversBenefit2'),
        t('business.serversBenefit3'),
        t('advantages.activeDirectory'),
        t('advantages.userManagement'),
        t('advantages.monitoring')
      ],
      gradient: 'from-blue-600 to-indigo-700',
      iconBg: 'from-blue-100 to-indigo-100',
      iconBgDark: 'from-blue-900/30 to-indigo-900/30'
    },
    {
      id: 'networks',
      icon: <FaNetworkWired className="text-6xl" />,
      title: t('business.networks'),
      description: t('business.networksDesc'),
      price: t('cta.onQuote'),
      included: [
        t('business.networksBenefit1'),
        t('business.networksBenefit2'),
        t('business.networksBenefit3'),
        t('advantages.structuredCabling'),
        t('advantages.vlanSegmentation'),
        t('advantages.managedSwitches')
      ],
      gradient: 'from-cyan-600 to-teal-700',
      iconBg: 'from-cyan-100 to-teal-100',
      iconBgDark: 'from-cyan-900/30 to-teal-900/30'
    },
    {
      id: 'cloud',
      icon: <FaCloud className="text-6xl" />,
      title: t('business.cloud'),
      description: t('business.cloudDesc'),
      price: t('cta.onQuote'),
      included: [
        t('business.cloudBenefit1'),
        t('business.cloudBenefit2'),
        t('business.cloudBenefit3'),
        t('advantages.cloudMigration'),
        t('advantages.virtualization'),
        t('advantages.autoBackup')
      ],
      gradient: 'from-purple-600 to-pink-700',
      iconBg: 'from-purple-100 to-pink-100',
      iconBgDark: 'from-purple-900/30 to-pink-900/30'
    },
    {
      id: 'videoconf',
      icon: <FaVideo className="text-6xl" />,
      title: t('business.videoconf'),
      description: t('business.videoconfDesc'),
      price: t('cta.onQuote'),
      included: [
        t('business.videoconfBenefit1'),
        t('business.videoconfBenefit2'),
        t('business.videoconfBenefit3'),
        t('advantages.interactiveScreens'),
        t('advantages.proAudio'),
        t('advantages.teamTraining')
      ],
      gradient: 'from-red-600 to-orange-700',
      iconBg: 'from-red-100 to-orange-100',
      iconBgDark: 'from-red-900/30 to-orange-900/30'
    }
  ];

  const advantages = [
    {
      icon: <FaShieldAlt className="text-4xl text-cyan-500" />,
      title: t('advantages.security'),
      description: t('advantages.securityDesc')
    },
    {
      icon: <FaClock className="text-4xl text-blue-500" />,
      title: t('advantages.support'),
      description: t('advantages.supportDesc')
    },
    {
      icon: <FaHeadset className="text-4xl text-purple-500" />,
      title: t('advantages.expertise'),
      description: t('advantages.expertiseDesc')
    }
  ];

  return (
    <>
      <SEO title={t('nav.servicesEntreprises')} />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Logo className="h-16" />
            </div>
            <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6">
              {t('services.businessSolutions')}
            </h1>
            <p className="text-xl md:text-2xl text-cyan-300 mb-8 leading-relaxed">
              {t('services.businessSubtitle')}
            </p>
            
            {/* Advantages Pills */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {advantages.map((adv, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="flex flex-col items-center text-center gap-2">
                    {adv.icon}
                    <h3 className="font-bold">{adv.title}</h3>
                    <p className="text-sm text-gray-300">{adv.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <Link 
              to="/contact"
              className="btn bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-lg px-10 py-4 shadow-2xl transform hover:scale-105 transition-all inline-flex items-center gap-3"
            >
              {t('cta.requestQuote')}
              <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {services.map((service) => (
              <div 
                key={service.id} 
                id={service.id} 
                className="group bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-cyan-400 dark:border-gray-700 dark:hover:border-cyan-500 transform hover:-translate-y-2"
              >
                {/* Icon */}
                <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                  <div className="text-white">
                    {service.icon}
                  </div>
                </div>
                
                {/* Content */}
                <h2 className="text-3xl font-heading font-bold mb-3 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-500 group-hover:to-blue-600 transition-all">
                  {service.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  {service.description}
                </p>
                
                {/* Included */}
                <ul className="space-y-3 mb-6">
                  {service.included.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 dark:text-gray-300">
                      <FaCheckCircle className="text-green-500 flex-shrink-0 mt-1" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                
                {/* CTA */}
                <div className="pt-6 border-t-2 border-gray-200 dark:border-gray-700">
                  <Link 
                    to="/contact" 
                    className={`w-full btn bg-gradient-to-r ${service.gradient} hover:shadow-xl text-white px-6 py-3 inline-flex items-center justify-center gap-2`}
                  >
                    {t('cta.requestQuote')}
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ServicesEntreprises;
