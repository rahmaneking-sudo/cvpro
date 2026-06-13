// src/components/SEO.jsx
// Composant SEO réutilisable — place-le sur chaque page
// INSTALLATION : npm install react-helmet-async

import { Helmet } from 'react-helmet-async';

const SEO = ({
  title = "SamaCVPro - Créer un CV professionnel en ligne gratuitement",
  description = "Créez votre CV professionnel en 5 minutes. Modèles gratuits, téléchargement PDF. Le meilleur outil CV au Sénégal.",
  url = "https://samacvpro.com",
  image = "https://samacvpro.com/og-image.png",
  article = false,
}) => {
  return (
    <Helmet>
      {/* Balises de base */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta name="robots" content="index, follow" />
      <html lang="fr" />

      {/* Open Graph — Facebook & LinkedIn */}
      <meta property="og:type" content={article ? "article" : "website"} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="SamaCVPro" />
      <meta property="og:locale" content="fr_SN" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Mots-clés SEO */}
      <meta
        name="keywords"
        content="CV, curriculum vitae, créer CV, CV professionnel, CV gratuit, CV en ligne, modèle CV, CV Sénégal, CV Dakar, CV PDF, faire un CV, rédiger CV, CV étudiant, CV stage"
      />
    </Helmet>
  );
};

export default SEO;
