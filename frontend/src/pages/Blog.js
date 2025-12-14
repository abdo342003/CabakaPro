import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';
import Loading from '../components/common/Loading';
import { getBlogPosts } from '../services/apiService';
import { useLanguage } from '../context/LanguageContext';
import { FiBookOpen, FiCalendar, FiClock } from 'react-icons/fi';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getBlogPosts({ limit: 12 });
        setPosts(data?.data || []);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return <Loading />;

  return (
    <>
      <SEO title={t('nav.blog') || "Blog IT & Informatique"} />
      <div className="pt-24 pb-12 min-h-screen dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-heading font-bold mb-4 dark:text-white">
              {t('nav.blog') || 'Blog'} IT & Informatique
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('blog.subtitle') || 'Conseils, astuces et actualités du monde informatique'}
            </p>
          </div>
          
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <FiBookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400 mb-2">
                {t('blog.empty') || 'Aucun article pour le moment'}
              </h3>
              <p className="text-gray-400 dark:text-gray-500">
                {t('blog.emptyDesc') || 'De nouveaux articles arrivent bientôt!'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link 
                  key={post._id} 
                  to={`/blog/${post.slug}`} 
                  className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700"
                >
                  {post.image && (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="mb-3">
                      <span className="inline-block bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 px-3 py-1 rounded-full text-sm font-medium">
                        {post.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-gray-800 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-500">
                      <div className="flex items-center gap-1">
                        <FiClock className="w-4 h-4" />
                        <span>{post.readTime || 5} min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FiCalendar className="w-4 h-4" />
                        <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
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

export default Blog;
