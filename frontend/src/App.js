import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Analytics - import before lazy components
import { initGA, logPageView } from './utils/analytics';
import { initTracking, trackPageVisit } from './services/visitorTracking';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/common/ScrollToTop';
import WhatsAppButton from './components/common/WhatsAppButton';
import ErrorBoundary from './components/common/ErrorBoundary';
import Loading from './components/common/Loading';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const ServicesParticuliers = lazy(() => import('./pages/ServicesParticuliers'));
const ServicesEntreprises = lazy(() => import('./pages/ServicesEntreprises'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const PortfolioDetail = lazy(() => import('./pages/PortfolioDetail'));
const About = lazy(() => import('./pages/About'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Admin = lazy(() => import('./pages/Admin'));
const AdminBlog = lazy(() => import('./pages/admin/AdminBlog'));
const AdminPortfolio = lazy(() => import('./pages/admin/AdminPortfolio'));
const MentionsLegales = lazy(() => import('./pages/MentionsLegales'));
const Confidentialite = lazy(() => import('./pages/Confidentialite'));

// Page loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loading />
  </div>
);

function App() {
  const location = useLocation();

  useEffect(() => {
    // Initialize Google Analytics
    if (process.env.REACT_APP_GOOGLE_ANALYTICS_ID) {
      initGA();
    }
    
    // Initialize visitor tracking
    initTracking();
  }, []);

  // Log page views on route change
  useEffect(() => {
    logPageView(location.pathname + location.search);
    // Track page visit for our analytics
    trackPageVisit(document.title);
  }, [location]);

  return (
    <ErrorBoundary>
      <div className="App bg-white dark:bg-gray-900 transition-colors duration-300">
        <ScrollToTop />
        <Navbar />
        
        <main className="min-h-screen dark:bg-gray-900 dark:text-white">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services/particuliers" element={<ServicesParticuliers />} />
              <Route path="/services/entreprises" element={<ServicesEntreprises />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/portfolio/:id" element={<PortfolioDetail />} />
              <Route path="/a-propos" element={<About />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin-dashboard-chabakapro" element={<Admin />} />
              <Route path="/admin/blog" element={<AdminBlog />} />
              <Route path="/admin/portfolio" element={<AdminPortfolio />} />
              <Route path="/mentions-legales" element={<MentionsLegales />} />
              <Route path="/confidentialite" element={<Confidentialite />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        
        <Footer />
        <WhatsAppButton />
        
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastClassName="dark:bg-gray-800 dark:text-white"
        />
      </div>
    </ErrorBoundary>
  );
}

export default App;
