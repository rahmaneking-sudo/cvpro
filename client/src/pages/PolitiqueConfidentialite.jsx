// src/pages/PolitiqueConfidentialite.jsx
// Page Politique de Confidentialité — obligatoire pour AdSense

import SEO from '../components/SEO';

const PolitiqueConfidentialite = () => {
  return (
    <>
      <SEO
        title="Politique de Confidentialité - SamaCVPro"
        description="Politique de confidentialité de SamaCVPro. Découvrez comment nous protégeons vos données personnelles."
        url="https://samacvpro.com/politique-de-confidentialite"
      />

      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Politique de Confidentialité</h1>
        <p className="text-sm text-gray-500 mb-8">Dernière mise à jour : Juin 2026</p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
          <p className="text-gray-700 leading-relaxed">
            SamaCVPro (accessible depuis samacvpro.com) accorde une grande importance à
            la protection de vos données personnelles. Cette politique de confidentialité
            décrit les types de données que nous collectons, comment nous les utilisons
            et les mesures que nous prenons pour les protéger.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">2. Données collectées</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            Lorsque vous utilisez SamaCVPro, nous pouvons collecter les informations suivantes :
          </p>
          <p className="text-gray-700 leading-relaxed">
            <strong>Données fournies volontairement :</strong> les informations que vous
            saisissez dans votre CV (nom, prénom, expériences, compétences, etc.).
            Ces données restent sur votre navigateur et ne sont pas stockées sur nos serveurs
            sauf si vous créez un compte.
          </p>
          <p className="text-gray-700 leading-relaxed mt-3">
            <strong>Données de navigation :</strong> adresse IP, type de navigateur,
            pages visitées, durée de visite. Ces données sont collectées de manière
            anonyme via Google Analytics et Google AdSense.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">3. Utilisation des cookies</h2>
          <p className="text-gray-700 leading-relaxed">
            SamaCVPro utilise des cookies pour améliorer votre expérience de navigation
            et pour afficher des publicités personnalisées via Google AdSense.
            Les cookies publicitaires permettent à Google et ses partenaires de vous
            proposer des annonces pertinentes en fonction de vos visites sur notre site
            et d'autres sites. Vous pouvez gérer vos préférences de cookies dans les
            paramètres de votre navigateur.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">4. Google AdSense</h2>
          <p className="text-gray-700 leading-relaxed">
            Nous utilisons Google AdSense pour afficher des publicités sur notre site.
            Google AdSense utilise des cookies pour diffuser des annonces basées sur vos
            visites précédentes. Vous pouvez désactiver la publicité personnalisée en
            visitant les paramètres des annonces Google à l'adresse :
            <a href="https://www.google.com/settings/ads" className="text-blue-600 underline ml-1" target="_blank" rel="noopener noreferrer">
              google.com/settings/ads
            </a>.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">5. Protection des données</h2>
          <p className="text-gray-700 leading-relaxed">
            Nous mettons en œuvre des mesures de sécurité appropriées pour protéger
            vos données personnelles contre tout accès non autorisé, modification,
            divulgation ou destruction. Les données de votre CV sont traitées
            localement dans votre navigateur et ne transitent pas par nos serveurs.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">6. Vos droits</h2>
          <p className="text-gray-700 leading-relaxed">
            Conformément à la loi sénégalaise sur la protection des données personnelles,
            vous disposez d'un droit d'accès, de rectification et de suppression de vos
            données. Pour exercer ces droits, contactez-nous à l'adresse :
            <a href="mailto:contact@samacvpro.com" className="text-blue-600 underline ml-1">
              contact@samacvpro.com
            </a>.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">7. Contact</h2>
          <p className="text-gray-700 leading-relaxed">
            Pour toute question relative à cette politique de confidentialité,
            vous pouvez nous contacter par email à contact@samacvpro.com.
          </p>
        </section>
      </div>
    </>
  );
};

export default PolitiqueConfidentialite;
