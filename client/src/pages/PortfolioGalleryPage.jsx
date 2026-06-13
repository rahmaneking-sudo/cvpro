import PortfolioGallery from '../components/portfolio/PortfolioGallery';
import SEO from '../components/SEO';

export default function PortfolioGalleryPage() {
  return (
    <>
      <SEO 
        title="Modèles de Portfolio Premium - Samacvpro" 
        description="Découvrez nos modèles de portfolios premium pour mettre en valeur vos réalisations professionnelles." 
        url="https://samacvpro.com/portfolios" 
      />
      <PortfolioGallery />
    </>
  );
}
