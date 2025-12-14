import React from 'react';
import SEO from '../components/common/SEO';
import { useLanguage } from '../context/LanguageContext';

const Confidentialite = () => {
  const { t } = useLanguage();

  return (
    <>
      <SEO title="Politique de Confidentialité" />
      <div className="pt-24 pb-12 min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-heading font-bold mb-8 text-gray-900 dark:text-white">
            Politique de Confidentialité
          </h1>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                1. Introduction
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                ChabakaPro s'engage à protéger la vie privée de ses utilisateurs. Cette politique de 
                confidentialité explique comment nous collectons, utilisons et protégeons vos données 
                personnelles lorsque vous utilisez notre site web et nos services.
              </p>
            </section>

            {/* Données collectées */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                2. Données collectées
              </h2>
              <div className="text-gray-600 dark:text-gray-400 space-y-3">
                <p>Nous pouvons collecter les types de données suivants :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Données d'identification :</strong> nom, prénom, adresse email, numéro de téléphone</li>
                  <li><strong>Données de contact :</strong> adresse postale, ville</li>
                  <li><strong>Données de navigation :</strong> adresse IP, type de navigateur, pages visitées</li>
                  <li><strong>Données de demande :</strong> type de service demandé, description du problème</li>
                </ul>
              </div>
            </section>

            {/* Utilisation des données */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                3. Utilisation des données
              </h2>
              <div className="text-gray-600 dark:text-gray-400 space-y-3">
                <p>Vos données sont utilisées pour :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Traiter vos demandes de devis et de contact</li>
                  <li>Fournir les services demandés</li>
                  <li>Vous envoyer des informations relatives à nos services</li>
                  <li>Améliorer notre site web et nos services</li>
                  <li>Respecter nos obligations légales</li>
                </ul>
              </div>
            </section>

            {/* Protection des données */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                4. Protection des données
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées 
                pour protéger vos données personnelles contre tout accès non autorisé, modification, 
                divulgation ou destruction. Ces mesures incluent le chiffrement des données, des pare-feu 
                et des contrôles d'accès stricts.
              </p>
            </section>

            {/* Conservation des données */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                5. Conservation des données
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Vos données personnelles sont conservées pendant la durée nécessaire aux finalités pour 
                lesquelles elles ont été collectées, et conformément aux obligations légales applicables. 
                Les données de contact sont généralement conservées pendant 3 ans après le dernier contact.
              </p>
            </section>

            {/* Vos droits */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                6. Vos droits
              </h2>
              <div className="text-gray-600 dark:text-gray-400 space-y-3">
                <p>Conformément à la loi, vous disposez des droits suivants :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Droit d'accès :</strong> obtenir une copie de vos données</li>
                  <li><strong>Droit de rectification :</strong> corriger vos données inexactes</li>
                  <li><strong>Droit à l'effacement :</strong> demander la suppression de vos données</li>
                  <li><strong>Droit d'opposition :</strong> vous opposer au traitement de vos données</li>
                  <li><strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré</li>
                </ul>
              </div>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                7. Cookies
              </h2>
              <div className="text-gray-600 dark:text-gray-400 space-y-3">
                <p>Notre site utilise des cookies pour :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Assurer le bon fonctionnement du site</li>
                  <li>Mémoriser vos préférences (langue, thème)</li>
                  <li>Analyser le trafic du site (Google Analytics)</li>
                </ul>
                <p className="mt-3">
                  Vous pouvez désactiver les cookies dans les paramètres de votre navigateur.
                </p>
              </div>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                8. Contact
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Pour exercer vos droits ou pour toute question relative à cette politique de confidentialité, 
                contactez-nous à : <a href="mailto:contact@chabakapro.ma" className="text-cyan-600 hover:underline">contact@chabakapro.ma</a>
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

export default Confidentialite;
