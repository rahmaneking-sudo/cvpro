// src/pages/MentionsLegales.jsx
// Page Mentions Légales — obligatoire pour AdSense

import SEO from '../components/SEO';

const MentionsLegales = () => {
  return (
    <>
      <SEO
        title="Mentions Légales - SamaCVPro"
        description="Mentions légales du site SamaCVPro.com"
        url="https://samacvpro.com/mentions-legales"
      />

      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Mentions Légales</h1>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Éditeur du site</h2>
          <p className="text-gray-700 leading-relaxed">
            SamaCVPro est un service en ligne de création de CV professionnel.<br />
            Responsable de la publication : [Ton nom complet]<br />
            Adresse : Dakar, Sénégal<br />
            Email : contact@samacvpro.com
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Hébergement</h2>
          <p className="text-gray-700 leading-relaxed">
            Ce site est hébergé par Vercel Inc.<br />
            Adresse : 340 S Lemon Ave #4133, Walnut, CA 91789, USA<br />
            Site web : vercel.com
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Propriété intellectuelle</h2>
          <p className="text-gray-700 leading-relaxed">
            L'ensemble du contenu de ce site (textes, images, logos, design) est
            protégé par le droit d'auteur. Toute reproduction, même partielle,
            est interdite sans autorisation préalable.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Données personnelles</h2>
          <p className="text-gray-700 leading-relaxed">
            Pour en savoir plus sur la gestion de vos données personnelles,
            consultez notre{' '}
            <a href="/politique-de-confidentialite" className="text-blue-600 underline">
              Politique de Confidentialité
            </a>.
          </p>
        </section>
      </div>
    </>
  );
};

export default MentionsLegales;
