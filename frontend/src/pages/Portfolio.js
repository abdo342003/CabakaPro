import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';
import Loading from '../components/common/Loading';
import { getPortfolioCases, getPortfolioStats } from '../services/apiService';
import { useLanguage } from '../context/LanguageContext';
import { FiBriefcase, FiUsers, FiAward, FiTrendingUp } from 'react-icons/fi';

const Portfolio = () => {
  const [cases, setCases] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [casesData, statsData] = await Promise.all([
          getPortfolioCases(),
          getPortfolioStats()
        ]);
        setCases(casesData?.data || []);
        setStats(statsData?.data || null);
      } catch (error) {
        console.error('Error fetching portfolio:', error);
        setCases([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loading />;

  return (
    <>
      <SEO title={t('nav.portfolio') || "Portfolio - Nos Réalisations"} />
      <div className="pt-24 pb-12 min-h-screen dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-heading font-bold mb-4 dark:text-white">
              {t('portfolio.title') || 'Nos Réalisations'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('portfolio.subtitle') || 'Découvrez nos projets réussis pour particuliers et entreprises'}
            </p>
          </div>
          
          {/* Stats Section */}
          {stats && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center border border-gray-100 dark:border-gray-700">
                <FiUsers className="w-8 h-8 mx-auto mb-3 text-cyan-500" />
                <p className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">{stats.totalClients || 0}+</p>
                <p className="text-gray-600 dark:text-gray-400">{t('stats.satisfiedClients') || 'Clients Satisfaits'}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center border border-gray-100 dark:border-gray-700">
                <FiTrendingUp className="w-8 h-8 mx-auto mb-3 text-emerald-500" />
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{stats.totalProjects || 0}+</p>
                <p className="text-gray-600 dark:text-gray-400">{t('stats.completedProjects') || 'Projets Réussis'}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center border border-gray-100 dark:border-gray-700">
                <FiAward className="w-8 h-8 mx-auto mb-3 text-amber-500" />
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{stats.averageRating || 4.8}★</p>
                <p className="text-gray-600 dark:text-gray-400">{t('stats.averageRating') || 'Note Moyenne'}</p>
              </div>
            </div>
          )}

          {/* Portfolio Grid */}
          {cases.length === 0 ? (
            <div className="text-center py-20">
              <FiBriefcase className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400 mb-2">
                {t('portfolio.empty') || 'Aucun projet pour le moment'}
              </h3>
              <p className="text-gray-400 dark:text-gray-500">
                {t('portfolio.emptyDesc') || 'Nos réalisations arrivent bientôt!'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cases.map((caseItem) => (
                <Link 
                  key={caseItem._id} 
                  to={`/portfolio/${caseItem._id}`} 
                  className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700"
                >
                  {caseItem.image && (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={caseItem.image} 
                        alt={caseItem.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="mb-3">
                      <span className="inline-block bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-3 py-1 rounded-full text-sm font-medium capitalize">
                        {caseItem.category || caseItem.sector}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-gray-800 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                      {caseItem.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                      {caseItem.client || caseItem.sector}
                    </p>
                    {caseItem.investment > 0 && (
                      <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                        {caseItem.investment.toLocaleString()} MAD
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Portfolio;
