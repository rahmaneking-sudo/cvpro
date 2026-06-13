// src/pages/Blog.jsx
// Page Blog — liste des articles SEO

import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import AdBanner from '../components/AdBanner';

// Liste de tes articles — ajoute-en au fur et à mesure
const articles = [
  {
    slug: 'comment-rediger-cv-senegal',
    title: 'Comment rédiger un CV au Sénégal en 2026 : Guide complet',
    description:
      'Apprenez à créer un CV professionnel adapté au marché sénégalais. Conseils pratiques, erreurs à éviter et modèles gratuits.',
    date: '2026-06-15',
  },
  {
    slug: 'erreurs-cv-a-eviter',
    title: 'Les 10 erreurs fatales à éviter dans votre CV',
    description:
      'Découvrez les erreurs qui font rejeter votre CV et comment les corriger pour décrocher plus d\'entretiens.',
    date: '2026-06-22',
  },
  {
    slug: 'cv-etudiant-stage',
    title: 'CV étudiant : comment faire un CV quand on n\'a pas d\'expérience',
    description:
      'Guide pour les étudiants et jeunes diplômés sénégalais. Comment valoriser vos compétences même sans expérience professionnelle.',
    date: '2026-06-29',
  },
];

const Blog = () => {
  return (
    <>
      <SEO
        title="Blog SamaCVPro - Conseils CV et emploi au Sénégal"
        description="Conseils pratiques pour créer un CV professionnel, trouver un emploi au Sénégal et réussir vos entretiens. Articles et guides gratuits."
        url="https://samacvpro.com/blog"
      />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-4">Blog SamaCVPro</h1>
        <p className="text-gray-600 mb-10">
          Conseils pratiques pour créer un CV professionnel et trouver un emploi au Sénégal.
        </p>

        {/* Pub AdSense en haut du blog */}
        <AdBanner />

        <div className="space-y-8">
          {articles.map((article) => (
            <article
              key={article.slug}
              className="border-b border-gray-200 pb-8"
            >
              <p className="text-sm text-gray-400 mb-2">{article.date}</p>
              <Link to={`/blog/${article.slug}`}>
                <h2 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors mb-2">
                  {article.title}
                </h2>
              </Link>
              <p className="text-gray-600 mb-3">{article.description}</p>
              <Link
                to={`/blog/${article.slug}`}
                className="text-blue-600 font-medium hover:underline"
              >
                Lire l'article →
              </Link>
            </article>
          ))}
        </div>

        {/* Pub AdSense en bas du blog */}
        <AdBanner />
      </div>
    </>
  );
};

export default Blog;
