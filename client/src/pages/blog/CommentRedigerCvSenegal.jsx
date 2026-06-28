import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Calendar, User } from 'lucide-react';
import SEO from '../../components/SEO';
import AdBanner from '../../components/AdBanner';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';


const CommentRedigerCvSenegal = () => {
  return (
    <>
      <SEO
        title="Comment rédiger un CV au Sénégal en 2026 : Guide complet - SamaCVPro"
        description="Apprenez à créer un CV professionnel adapté au marché sénégalais. Conseils pratiques, structure idéale, erreurs à éviter et modèles gratuits sur SamaCVPro."
        url="https://samacvpro.com/blog/comment-rediger-cv-senegal"
        article={true}
      />
      <Navbar />

      <div className="min-h-screen bg-[var(--color-obsidian)] text-[var(--color-ivory)] pt-24 pb-20 relative overflow-hidden">

        {/* Glow Effects */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[var(--color-champagne)] opacity-[0.03] blur-[150px] rounded-full pointer-events-none" />
        
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
              Guides CV
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight leading-tight font-[var(--font-serif)]">
              Comment rédiger un <span className="text-gradient-gold">CV au Sénégal</span> en 2026 : Guide complet
            </h1>
            
            <div className="flex items-center gap-6 text-sm text-[var(--color-white-muted)] border-b border-[rgba(255,255,255,0.05)] pb-8">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-[var(--color-champagne)]" />
                <span>15 Juin 2026</span>
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
              src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=1200" 
              alt="Bureau de travail" 
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
              Que vous soyez jeune diplômé à la recherche de votre premier emploi à Dakar,
              professionnel expérimenté souhaitant changer de poste, ou étudiant en quête
              de stage, votre CV est votre premier ambassadeur auprès des recruteurs
              sénégalais. Un CV bien rédigé peut faire la différence entre décrocher un
              entretien et voir votre candidature ignorée.
            </p>
            <p className="mb-10">
              Dans ce guide complet, nous vous montrons étape par étape comment créer un CV
              professionnel adapté au marché de l'emploi au Sénégal.
            </p>

            <AdBanner />

            <h2 className="text-2xl md:text-3xl font-semibold mt-12 mb-6 text-[var(--color-ivory)] border-l-4 border-[var(--color-champagne)] pl-4">
              1. La structure idéale d'un CV sénégalais
            </h2>
            <p className="mb-4">
              Les recruteurs au Sénégal, qu'il s'agisse d'entreprises privées, de la fonction
              publique ou d'organisations internationales basées à Dakar, s'attendent à une
              structure claire et professionnelle. Voici l'ordre recommandé :
            </p>
            <ul className="list-disc pl-6 mb-8 space-y-2">
              <li><strong>Informations personnelles :</strong> nom, téléphone, email et quartier/ville. La photo est courante, assurez-vous qu'elle soit professionnelle.</li>
              <li><strong>Titre professionnel :</strong> clair et précis (ex: "Comptable junior — 2 ans d'expérience").</li>
              <li><strong>Expériences :</strong> de la plus récente à la plus ancienne.</li>
              <li><strong>Formation & Compétences :</strong> techniques et linguistiques.</li>
            </ul>

            <h2 className="text-2xl md:text-3xl font-semibold mt-12 mb-6 text-[var(--color-ivory)] border-l-4 border-[var(--color-champagne)] pl-4">
              2. Les compétences recherchées en 2026
            </h2>
            <p className="mb-4">
              Le marché de l'emploi sénégalais évolue rapidement. En 2026, les compétences
              les plus demandées incluent la maîtrise des outils informatiques, le marketing digital, 
              le bilinguisme (français/anglais), et la gestion de projet. Les recruteurs apprécient 
              particulièrement les candidats qui s'adaptent vite aux nouvelles technologies.
            </p>

            <h2 className="text-2xl md:text-3xl font-semibold mt-12 mb-6 text-[var(--color-ivory)] border-l-4 border-[var(--color-champagne)] pl-4">
              3. Les erreurs à éviter absolument
            </h2>
            <p className="mb-8">
              Évitez les CV trop longs (1 ou 2 pages maximum), les fautes d'orthographe (faites toujours relire), 
              et l'absence de chiffres concrets. Au lieu d'écrire "responsable des ventes", écrivez "responsable 
              d'une équipe de 5 commerciaux, augmentation du CA de 20%".
            </p>

            <AdBanner />

            <h2 className="text-2xl md:text-3xl font-semibold mt-12 mb-6 text-[var(--color-ivory)] border-l-4 border-[var(--color-champagne)] pl-4">
              4. Adapter votre CV au poste visé
            </h2>
            <p className="mb-12">
              N'envoyez jamais le même CV pour tous les postes. Identifiez les mots-clés de l'offre et 
              intégrez-les. Si vous postulez dans une ONG, mettez en avant vos expériences de terrain et 
              vos langues. Pour le secteur privé, insistez sur vos résultats chiffrés.
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
              Prêt à vous démarquer ?
            </h3>
            <p className="text-[var(--color-white-muted)] mb-8 max-w-2xl mx-auto">
              Ne perdez plus de temps sur Word. Choisissez parmi nos modèles professionnels adaptés au marché sénégalais, remplissez vos informations et téléchargez votre CV en PDF.
            </p>
            <Link
              to="/templates"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C9A96E] to-[#D4B878] text-[#0A0A0A] font-bold px-8 py-4 rounded-xl hover:shadow-[0_0_20px_rgba(201,169,110,0.4)] transition-all duration-300 hover:scale-105"
            >
              Créer mon CV gratuitement
              <ArrowRight size={20} />
            </Link>
          </motion.div>

        </div>
      </div>
      <Footer />
    </>
  );
};


export default CommentRedigerCvSenegal;
