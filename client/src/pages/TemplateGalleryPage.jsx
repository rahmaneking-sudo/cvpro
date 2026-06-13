import TemplateGallery from '../components/cv/TemplateGallery';
import SEO from '../components/SEO';

export default function TemplateGalleryPage() {
  return (
    <>
      <SEO 
        title="Modèles de CV Premium - Samacvpro" 
        description="Découvrez notre collection de modèles de CV professionnels conçus pour maximiser vos chances d'entretien." 
        url="https://samacvpro.com/templates" 
      />
      <TemplateGallery />
    </>
  );
}
