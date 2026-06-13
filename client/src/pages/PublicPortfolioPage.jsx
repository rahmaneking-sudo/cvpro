import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import api from '../services/api';
import { portfolioTemplates } from '../data/portfolioTemplates';
import { mediaKitTemplates } from '../data/mediaKitTemplates';
import PortfolioPreview from '../components/portfolio/PortfolioPreview';
import MediaKitPreview from '../components/mediakit/MediaKitPreview';
import SEO from '../components/SEO';

export default function PublicPortfolioPage() {
  const { id } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await api.get(`/portfolios/public/${id}`);
        if (res.data.portfolio) {
          const fetchedPortfolio = res.data.portfolio;
          setPortfolio(fetchedPortfolio);
          
          if (fetchedPortfolio.type === 'mediakit') {
            const foundTemplate = mediaKitTemplates.find(t => t.id === fetchedPortfolio.templateId);
            setTemplate(foundTemplate || mediaKitTemplates[0]);
          } else {
            const foundTemplate = portfolioTemplates.find(t => t.id === fetchedPortfolio.templateId);
            setTemplate(foundTemplate || portfolioTemplates[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching public portfolio:', err);
        setError('Ce document n\'existe pas ou a été supprimé.');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-obsidian)] flex flex-col items-center justify-center">
        <Loader2 size={48} className="animate-spin text-[var(--color-champagne)] mb-4" />
        <p className="text-[var(--color-ivory)] font-medium">Chargement...</p>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen bg-[var(--color-obsidian)] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-3xl font-bold text-[var(--color-ivory)] mb-4">Document Introuvable</h1>
        <p className="text-[var(--color-white-muted)] mb-8">{error}</p>
        <Link to="/" className="px-6 py-3 bg-[rgba(201,169,110,0.1)] text-[var(--color-champagne)] rounded-xl border border-[rgba(201,169,110,0.3)] hover:bg-[rgba(201,169,110,0.2)] transition-colors">
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      <SEO 
        title={portfolio?.title ? `${portfolio.title} - Samacvpro` : "Portfolio en ligne - Samacvpro"} 
        description="Découvrez ce portfolio professionnel propulsé par Samacvpro." 
        url={`https://samacvpro.com/p/${id}`} 
      />
      {portfolio.type === 'mediakit' ? (
        <MediaKitPreview template={template} data={portfolio.data} />
      ) : (
        <PortfolioPreview template={template} data={portfolio.data} />
      )}
    </div>
  );
}
