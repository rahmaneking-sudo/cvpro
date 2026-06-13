import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import api from '../services/api';
import { getTemplate } from '../data/templates';
import CVPreview from '../components/cv/CVPreview';
import CoverLetterPreview from '../components/cv/CoverLetterPreview';
import SEO from '../components/SEO';

export default function PublicCVPage() {
  const { id } = useParams();
  const [cv, setCV] = useState(null);
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCV = async () => {
      try {
        const res = await api.get(`/cv/public/${id}`);
        if (res.data.cv) {
          const fetchedCV = res.data.cv;
          setCV(fetchedCV);
          
          // Find template
          const foundTemplate = getTemplate(fetchedCV.templateId);
          setTemplate(foundTemplate);
        }
      } catch (err) {
        console.error('Error fetching public CV:', err);
        setError('Ce CV n\'existe pas, a été supprimé ou est privé.');
      } finally {
        setLoading(false);
      }
    };

    fetchCV();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-obsidian)] flex flex-col items-center justify-center">
        <Loader2 size={48} className="animate-spin text-[var(--color-champagne)] mb-4" />
        <p className="text-[var(--color-ivory)] font-medium">Chargement du document...</p>
      </div>
    );
  }

  if (error || !cv || !template) {
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
    <div className="w-full min-h-screen bg-[var(--color-graphite)] flex justify-center py-10">
      <SEO 
        title={cv?.data?.personalInfo?.fullName ? `CV de ${cv.data.personalInfo.fullName} - Samacvpro` : "CV en ligne - Samacvpro"} 
        description="Découvrez ce CV professionnel interactif propulsé par Samacvpro." 
        url={`https://samacvpro.com/cv/${id}`} 
      />
      <div className="shadow-[var(--shadow-cinematic)] rounded-lg overflow-hidden" style={{ width: '794px', minHeight: '1123px' }}>
        {template.layout === 'cover-letter' ? (
          <CoverLetterPreview template={template} cvData={cv.data} />
        ) : (
          <CVPreview template={template} cvData={cv.data} experiences={cv.experiences} educations={cv.data.educations} />
        )}
      </div>
    </div>
  );
}
