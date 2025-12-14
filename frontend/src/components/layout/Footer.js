import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaLinkedin, FaWhatsapp } from 'react-icons/fa';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import Logo from '../common/Logo';
import { useLanguage } from '../../context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { name: t('nav.home') || 'Accueil', path: '/' },
    { name: t('nav.servicesParticuliers') || 'Particuliers', path: '/services/particuliers' },
    { name: t('nav.servicesEntreprises') || 'Entreprises', path: '/services/entreprises' },
    { name: t('nav.portfolio') || 'Portfolio', path: '/portfolio' },
    { name: t('nav.blog') || 'Blog', path: '/blog' },
    { name: t('nav.contact') || 'Contact', path: '/contact' }
  ];

  const socialLinks = [
    { icon: FaFacebook, href: 'https://facebook.com/chabakapro', label: 'Facebook' },
    { icon: FaInstagram, href: 'https://instagram.com/chabakapro', label: 'Instagram' },
    { icon: FaLinkedin, href: 'https://linkedin.com/company/chabakapro', label: 'LinkedIn' },
    { icon: FaWhatsapp, href: 'https://wa.me/212722618635', label: 'WhatsApp' }
  ];

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 transition-colors">
      <div className="container mx-auto px-4 py-10">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8 pb-8 border-b border-gray-200 dark:border-gray-800">
          {/* Logo & Description */}
          <div className="text-center lg:text-left">
            <Logo className="h-10 mx-auto lg:mx-0 mb-3" />
            <p className="text-gray-600 dark:text-gray-400 text-sm max-w-xs">
              {t('footer.aboutText') || 'Solutions informatiques professionnelles à Casablanca'}
            </p>
          </div>

          {/* Contact Info */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <a href="tel:+212722618635" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
              <FiPhone className="text-cyan-500" />
              <span>+212 722-618635</span>
            </a>
            <a href="mailto:contact@chabakapro.ma" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
              <FiMail className="text-cyan-500" />
              <span>contact@chabakapro.ma</span>
            </a>
            <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <FiMapPin className="text-cyan-500" />
              <span>{t('footer.casablanca') || 'Casablanca, Maroc'}</span>
            </span>
          </div>

          {/* Social Links */}
          <div className="flex gap-3">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="w-10 h-10 bg-gray-200 dark:bg-gray-800 hover:bg-cyan-500 dark:hover:bg-cyan-600 text-gray-600 dark:text-gray-400 hover:text-white rounded-full flex items-center justify-center transition-all"
              >
                <social.icon className="text-lg" />
              </a>
            ))}
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 py-6">
          {navLinks.map((link, index) => (
            <Link
              key={index}
              to={link.path}
              className="text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 text-sm font-medium transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-800 text-center">
          <p className="text-gray-500 dark:text-gray-500 text-sm">
            © {currentYear} <span className="text-cyan-600 dark:text-cyan-400 font-semibold">ChabakaPro</span>. {t('footer.rights') || 'Tous droits réservés'}.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
