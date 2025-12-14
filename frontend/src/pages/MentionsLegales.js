import React from 'react';
import SEO from '../components/common/SEO';
import { useLanguage } from '../context/LanguageContext';

const MentionsLegales = () => {
  const { t } = useLanguage();

  return (
    <>
      <SEO title="Mentions Légales" />
      <div className="pt-24 pb-12 min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-heading font-bold mb-8 text-gray-900 dark:text-white">
            Mentions Légales
          </h1>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 space-y-8">
            {/* Éditeur du site */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                1. Éditeur du site
              </h2>
              <div className="text-gray-600 dark:text-gray-400 space-y-2">
                <p><strong>Raison sociale :</strong> ChabakaPro</p>
                <p><strong>Activité :</strong> Services informatiques et solutions IT</p>
                <p><strong>Adresse :</strong> Casablanca, Maroc</p>
                <p><strong>Téléphone :</strong> +212 722-618635</p>
                <p><strong>Email :</strong> contact@chabakapro.ma</p>
                <p><strong>Site web :</strong> www.chabakapro.com</p>
              </div>
            </section>

            {/* Hébergement */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                2. Hébergement
              </h2>
              <div className="text-gray-600 dark:text-gray-400 space-y-2">
                <p><strong>Hébergeur :</strong> GitHub Pages / Cloudflare</p>
                <p><strong>Site :</strong> github.com / cloudflare.com</p>
              </div>
            </section>

            {/* Propriété intellectuelle */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                3. Propriété intellectuelle
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                L'ensemble du contenu de ce site (textes, images, logos, vidéos, etc.) est la propriété 
                exclusive de ChabakaPro ou de ses partenaires. Toute reproduction, distribution, modification, 
                adaptation, retransmission ou publication de ces différents éléments est strictement interdite 
                sans l'accord écrit préalable de ChabakaPro.
              </p>
            </section>

            {/* Responsabilité */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                4. Limitation de responsabilité
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                ChabakaPro s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées 
                sur ce site. Toutefois, ChabakaPro ne peut garantir l'exactitude, la précision ou l'exhaustivité 
                des informations mises à disposition sur ce site. ChabakaPro décline toute responsabilité 
                pour toute imprécision, inexactitude ou omission portant sur des informations disponibles sur ce site.
              </p>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                5. Cookies
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Ce site utilise des cookies pour améliorer l'expérience utilisateur et analyser le trafic. 
                Les cookies sont de petits fichiers texte stockés sur votre appareil. Vous pouvez configurer 
                votre navigateur pour refuser les cookies, mais certaines fonctionnalités du site pourraient 
                ne plus fonctionner correctement.
              </p>
            </section>

            {/* Droit applicable */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                6. Droit applicable
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Les présentes mentions légales sont soumises au droit marocain. En cas de litige, 
                les tribunaux marocains seront seuls compétents.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                7. Contact
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Pour toute question concernant ces mentions légales, vous pouvez nous contacter à 
                l'adresse email : <a href="mailto:contact@chabakapro.ma" className="text-cyan-600 hover:underline">contact@chabakapro.ma</a>
              </p>
            </section>

            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Dernière mise à jour : Décembre 2025
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MentionsLegales;
