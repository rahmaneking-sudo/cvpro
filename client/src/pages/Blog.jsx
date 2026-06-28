import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, BookOpen } from 'lucide-react';
import SEO from '../components/SEO';
import AdBanner from '../components/AdBanner';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';


// Liste des articles avec images (Unsplash)
const articles = [
  {
    slug: 'comment-rediger-cv-senegal',
    title: 'Comment rédiger un CV au Sénégal en 2026 : Guide complet',
    description:
      'Apprenez à créer un CV professionnel adapté au marché sénégalais. Conseils pratiques, erreurs à éviter et modèles gratuits.',
    date: '15 Juin 2026',
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=800',
    category: 'Guides CV'
  },
  {
    slug: 'erreurs-cv-a-eviter',
    title: 'Les 10 erreurs fatales à éviter dans votre CV',
    description:
      'Découvrez les erreurs qui font rejeter votre CV et comment les corriger pour décrocher plus d\'entretiens.',
    date: '22 Juin 2026',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800',
    category: 'Conseils Pro'
  },
  {
    slug: 'cv-etudiant-stage',
    title: 'CV étudiant : comment faire un CV sans expérience',
    description:
      'Guide pour les étudiants et jeunes diplômés sénégalais. Comment valoriser vos compétences même sans expérience professionnelle.',
    date: '29 Juin 2026',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800',
    category: 'Étudiants'
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
      
      <Navbar />

      {/* Background Cinématique de base */}

      <div className="min-h-screen bg-[var(--color-obsidian)] text-[var(--color-ivory)] pt-24 pb-20 relative overflow-hidden">
        
        {/* Lueur d'arrière-plan */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--color-champagne)] opacity-[0.03] blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--color-champagne)] opacity-[0.03] blur-[150px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(201,169,110,0.1)] border border-[rgba(201,169,110,0.2)] text-[var(--color-champagne)] mb-6 text-sm font-semibold uppercase tracking-wider"
            >
              <BookOpen size={16} />
              <span>SamaCVPro Blog</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight font-[var(--font-serif)]">
              Conseils & <span className="text-gradient-gold">Inspirations</span>
            </h1>
            <p className="text-lg md:text-xl text-[var(--color-white-muted)]">
              Découvrez nos guides pratiques pour créer un CV professionnel percutant, trouver un emploi au Sénégal et exceller lors de vos entretiens.
            </p>
          </motion.div>

          {/* Pub AdSense Haut */}
          <div className="mb-12">
            <AdBanner />
          </div>

          {/* Grille d'Articles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <motion.article
                key={article.slug}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="group relative bg-[rgba(20,20,20,0.6)] backdrop-blur-md rounded-2xl border border-[rgba(255,255,255,0.05)] overflow-hidden hover:border-[rgba(201,169,110,0.3)] transition-all duration-500 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] flex flex-col h-full"
              >
                {/* Image Wrap */}
                <div className="relative h-56 overflow-hidden">
                  <div className="absolute inset-0 bg-[var(--color-obsidian)]/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                  <motion.img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 z-20">
                    <span className="px-3 py-1 bg-[rgba(10,10,10,0.8)] backdrop-blur-md border border-[rgba(201,169,110,0.3)] text-[var(--color-champagne)] text-xs font-bold uppercase tracking-wider rounded-full">
                      {article.category}
                    </span>
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-sm text-[var(--color-white-muted)] mb-3">
                    <Calendar size={14} className="text-[var(--color-champagne)]" />
                    <span>{article.date}</span>
                  </div>
                  
                  <Link to={`/blog/${article.slug}`} className="block group-hover:text-[var(--color-champagne)] transition-colors duration-300">
                    <h2 className="text-xl font-bold mb-3 line-clamp-2 leading-snug">
                      {article.title}
                    </h2>
                  </Link>
                  
                  <p className="text-[var(--color-white-muted)] text-sm mb-6 line-clamp-3 flex-grow">
                    {article.description}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-[rgba(255,255,255,0.05)]">
                    <Link
                      to={`/blog/${article.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-ivory)] group-hover:text-[var(--color-champagne)] transition-colors duration-300"
                    >
                      Lire l'article
                      <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Pub AdSense Bas */}
          <div className="mt-16">
            <AdBanner />
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
};

export default Blog;
