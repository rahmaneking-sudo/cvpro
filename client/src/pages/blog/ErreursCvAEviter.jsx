import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Calendar, User } from 'lucide-react';
import SEO from '../../components/SEO';
import AdBanner from '../../components/AdBanner';

const ErreursCvAEviter = () => {
  return (
    <>
      <SEO
        title="Les 10 erreurs fatales à éviter dans votre CV - SamaCVPro"
        description="Découvrez les erreurs qui font rejeter votre CV immédiatement par les recruteurs et comment les corriger pour décrocher plus d'entretiens."
        url="https://samacvpro.com/blog/erreurs-cv-a-eviter"
        article={true}
      />

      <div className="min-h-screen bg-[var(--color-obsidian)] text-[var(--color-ivory)] pt-24 pb-20 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[var(--color-champagne)] opacity-[0.03] blur-[150px] rounded-full pointer-events-none" />
        
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
              Conseils Pro
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight leading-tight font-[var(--font-serif)]">
              Les 10 erreurs fatales à <span className="text-gradient-gold">éviter dans votre CV</span>
            </h1>
            
            <div className="flex items-center gap-6 text-sm text-[var(--color-white-muted)] border-b border-[rgba(255,255,255,0.05)] pb-8">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-[var(--color-champagne)]" />
                <span>22 Juin 2026</span>
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
              src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1200" 
              alt="Personne examinant des documents" 
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
              Un recruteur passe en moyenne moins de 7 secondes à examiner un CV. Dans ce court laps de temps, la moindre erreur peut envoyer votre candidature directement à la corbeille.
            </p>
            <p className="mb-10">
              Pour mettre toutes les chances de votre côté et décrocher l'entretien de vos rêves, nous avons listé les 10 erreurs les plus courantes et comment les éviter.
            </p>

            <AdBanner />

            <h2 className="text-2xl md:text-3xl font-semibold mt-12 mb-6 text-[var(--color-ivory)] border-l-4 border-[var(--color-champagne)] pl-4">
              1. Les fautes d'orthographe et de grammaire
            </h2>
            <p className="mb-8">
              C'est l'erreur numéro un ! Une faute d'orthographe montre un manque de rigueur et d'attention aux détails. Relisez-vous plusieurs fois et faites relire votre CV par un proche ou utilisez des correcteurs en ligne.
            </p>

            <h2 className="text-2xl md:text-3xl font-semibold mt-12 mb-6 text-[var(--color-ivory)] border-l-4 border-[var(--color-champagne)] pl-4">
              2. Un CV trop long et désordonné
            </h2>
            <p className="mb-8">
              Un bon CV doit tenir sur une, voire deux pages maximum. Ne racontez pas toute votre vie, allez à l'essentiel et utilisez des puces pour rendre la lecture fluide. Les gros blocs de texte sont à proscrire.
            </p>

            <h2 className="text-2xl md:text-3xl font-semibold mt-12 mb-6 text-[var(--color-ivory)] border-l-4 border-[var(--color-champagne)] pl-4">
              3. Une adresse email non professionnelle
            </h2>
            <p className="mb-8">
              Les adresses du type "bg-du-75@gmail.com" ou "princesse-dakar@yahoo.fr" décrédibilisent immédiatement votre candidature. Créez une adresse simple au format <strong>prenom.nom@gmail.com</strong>.
            </p>

            <AdBanner />

            <h2 className="text-2xl md:text-3xl font-semibold mt-12 mb-6 text-[var(--color-ivory)] border-l-4 border-[var(--color-champagne)] pl-4">
              4. Oublier de mettre un titre à son CV
            </h2>
            <p className="mb-8">
              Le recruteur doit savoir immédiatement pour quel poste vous postulez ou quelle est votre spécialité. Mettez un titre clair sous votre nom, par exemple : "Développeur Web Full-Stack - 3 ans d'expérience".
            </p>

            <h2 className="text-2xl md:text-3xl font-semibold mt-12 mb-6 text-[var(--color-ivory)] border-l-4 border-[var(--color-champagne)] pl-4">
              En conclusion
            </h2>
            <p className="mb-12">
              Créer un CV parfait demande du temps et de la méthode. En évitant ces erreurs classiques, vous sortirez déjà du lot et montrerez un grand professionnalisme aux yeux des recruteurs.
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
              Ne faites plus ces erreurs !
            </h3>
            <p className="text-[var(--color-white-muted)] mb-8 max-w-2xl mx-auto">
              Évitez les faux pas de mise en page grâce à nos modèles de CV optimisés et professionnels. Laissez-nous gérer le design, concentrez-vous sur le contenu.
            </p>
            <Link
              to="/templates"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C9A96E] to-[#D4B878] text-[#0A0A0A] font-bold px-8 py-4 rounded-xl hover:shadow-[0_0_20px_rgba(201,169,110,0.4)] transition-all duration-300 hover:scale-105"
            >
              Voir les modèles de CV
              <ArrowRight size={20} />
            </Link>
          </motion.div>

        </div>
      </div>
    </>
  );
};

export default ErreursCvAEviter;
