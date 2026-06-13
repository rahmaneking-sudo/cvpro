import MediaKitGallery from '../components/mediakit/MediaKitGallery';
import SEO from '../components/SEO';

export default function MediaKitGalleryPage() {
  return (
    <>
      <SEO 
        title="Modèles de Media Kits - Samacvpro" 
        description="Créez votre Media Kit professionnel pour collaborer avec des marques et des agences." 
        url="https://samacvpro.com/dashboard/mediakit/templates" 
      />
      <MediaKitGallery />
    </>
  );
}
