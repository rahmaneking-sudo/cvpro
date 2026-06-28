import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Calendar, User } from 'lucide-react';
import SEO from '../../components/SEO';
import AdBanner from '../../components/AdBanner';

const CvEtudiantStage = () => {
  return (
    <>
      <SEO
        title="CV étudiant : comment faire un CV sans expérience - SamaCVPro"
        description="Guide complet pour les étudiants et jeunes diplômés. Découvrez comment valoriser vos compétences et vos projets même sans expérience professionnelle."
        url="https://samacvpro.com/blog/cv-etudiant-stage"
        article={true}
      />

      <div className="min-h-screen bg-[var(--color-obsidian)] text-[var(--color-ivory)] pt-24 pb-20 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] bg-[var(--color-champagne)] opacity-[0.03] blur-[150px] rounded-full pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10">
          
          {/* Retour Navigation */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <Link 
              to="/blog" 
              className="inline-flex items-center gap-2 text-[var(--color-white-muted)] hover:text-[var(--color-champagne)] transition-colors duration-300 group font-medium"
            >
              <ArrowLeft size={18} className="transition-transform duration-300 group-hover:-translate-x-1" />
              Retour au blog
            </Link>
          </motion.div>

          {/* Hero Article */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="mb-12"
          >
            <div className="inline-block px-3 py-1 mb-6 rounded-full bg-[rgba(201,169,110,0.1)] border border-[rgba(201,169,110,0.2)] text-[var(--color-champagne)] text-xs font-bold uppercase tracking-wider">
              Étudiants
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight leading-tight font-[var(--font-serif)]">
              CV étudiant : comment faire un <span className="text-gradient-gold">CV sans expérience</span>
            </h1>
            
            <div className="flex items-center gap-6 text-sm text-[var(--color-white-muted)] border-b border-[rgba(255,255,255,0.05)] pb-8">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-[var(--color-champagne)]" />
                <span>29 Juin 2026</span>
              </div>
              <div className="flex items-center gap-2">
                <User size={16} className="text-[var(--color-champagne)]" />
                <span>Équipe SamaCVPro</span>
              </div>
            </div>
          </motion.div>

          {/* Image de Couverture */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-12 border border-[rgba(255,255,255,0.05)]"
          >
            <img 
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200" 
              alt="Étudiant travaillant" 
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Contenu de l'article */}
          <motion.article 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="prose prose-invert prose-lg max-w-none text-[var(--color-white-muted)]"
          >
            <p className="text-xl leading-relaxed mb-8 text-[var(--color-ivory)]">
              Le fameux paradoxe du jeune diplômé : "On me demande de l'expérience pour trouver un travail, mais j'ai besoin de travailler pour acquérir de l'expérience." Rassurez-vous, tout le monde commence quelque part.
            </p>
            <p className="mb-10">
              Dans cet article, nous allons voir comment construire un CV percutant même lorsque la rubrique "Expériences Professionnelles" est vide.
            </p>

            <AdBanner />

            <h2 className="text-2xl md:text-3xl font-semibold mt-12 mb-6 text-[var(--color-ivory)] border-l-4 border-[var(--color-champagne)] pl-4">
              1. Mettez votre formation en avant
            </h2>
            <p className="mb-8">
              Si vous n'avez pas d'expérience, votre atout principal est votre éducation. Placez la section "Formation" en haut de votre CV (juste après l'en-tête). Détaillez vos diplômes, mais aussi les mentions obtenues et surtout les modules pertinents pour le poste visé.
            </p>

            <h2 className="text-2xl md:text-3xl font-semibold mt-12 mb-6 text-[var(--color-ivory)] border-l-4 border-[var(--color-champagne)] pl-4">
              2. Valorisez vos projets académiques et personnels
            </h2>
            <p className="mb-8">
              Vous avez sûrement réalisé des projets tuteurés, des mémoires, des exposés complexes ou des projets personnels (création d'un blog, gestion des réseaux sociaux d'une association, etc.). Présentez ces projets comme de véritables expériences professionnelles : détaillez votre rôle, les outils utilisés et les résultats.
            </p>

            <h2 className="text-2xl md:text-3xl font-semibold mt-12 mb-6 text-[var(--color-ivory)] border-l-4 border-[var(--color-champagne)] pl-4">
              3. Ne négligez pas vos soft skills (savoir-être)
            </h2>
            <p className="mb-8">
              À défaut d'expérience technique approfondie, les recruteurs cherchent un candidat motivé avec de bonnes qualités humaines. Mettez en valeur votre esprit d'équipe, votre capacité d'adaptation, votre sens de l'organisation ou votre créativité.
            </p>

            <AdBanner />

            <h2 className="text-2xl md:text-3xl font-semibold mt-12 mb-6 text-[var(--color-ivory)] border-l-4 border-[var(--color-champagne)] pl-4">
              4. Le design compte encore plus
            </h2>
            <p className="mb-12">
              Puisque votre CV sera peut-être moins dense que celui d'un professionnel confirmé, soignez particulièrement la présentation. Un CV aéré, clair et élégant donnera une excellente première impression et traduira votre professionnalisme.
            </p>
          </motion.article>

          {/* CTA Bas de page */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-16 bg-[rgba(20,20,20,0.6)] backdrop-blur-md border border-[rgba(201,169,110,0.3)] rounded-2xl p-8 md:p-12 text-center shadow-[0_0_30px_rgba(201,169,110,0.05)]"
          >
            <h3 className="text-2xl font-bold mb-4 text-[var(--color-ivory)]">
              Étudiants, démarquez-vous !
            </h3>
            <p className="text-[var(--color-white-muted)] mb-8 max-w-2xl mx-auto">
              Utilisez nos modèles spécialement conçus pour valoriser votre parcours académique et vos compétences, même sans expérience préalable.
            </p>
            <Link
              to="/templates"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C9A96E] to-[#D4B878] text-[#0A0A0A] font-bold px-8 py-4 rounded-xl hover:shadow-[0_0_20px_rgba(201,169,110,0.4)] transition-all duration-300 hover:scale-105"
            >
              Créer mon premier CV
              <ArrowRight size={20} />
            </Link>
          </motion.div>

        </div>
      </div>
    </>
  );
};

export default CvEtudiantStage;
