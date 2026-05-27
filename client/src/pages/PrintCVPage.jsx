import { useEffect, useState } from 'react';
import { getTemplate } from '../data/templates';
import CVPreview from '../components/cv/CVPreview';
import CoverLetterPreview from '../components/cv/CoverLetterPreview';
import { Download } from 'lucide-react';

export default function PrintCVPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem('cv-print-data');
      if (storedData) {
        setData(JSON.parse(storedData));
      }
    } catch (e) {
      console.error('Failed to parse print data', e);
    }
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Aucune donnée trouvée. Veuillez retourner à l'éditeur.</p>
      </div>
    );
  }

  const { templateId, cvData, experiences } = data;
  const template = getTemplate(templateId);

  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      // 794px is the width of the CV container + 32px for padding (16px on each side)
      const availableWidth = window.innerWidth - 32;
      setScale(Math.min(1, availableWidth / 794));
    };
    
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col items-center p-4 print:p-0 print:bg-white overflow-x-hidden">
      {/* Floating Action Button (hidden in print) */}
      <div className="mb-6 print:hidden no-print flex flex-col items-center gap-3 w-full max-w-sm">
        <div className="text-center text-sm text-gray-600 bg-white p-3 rounded-xl shadow-sm border border-gray-200">
          Pour enregistrer ce CV sur votre iPhone, cliquez sur le bouton ci-dessous, puis choisissez l'option <strong>"Enregistrer dans Fichiers"</strong> ou <strong>"Partager &gt; Imprimer"</strong>.
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center justify-center gap-2 bg-[var(--color-champagne)] text-black px-6 py-3 rounded-xl font-bold shadow-lg hover:-translate-y-1 transition-transform w-full"
        >
          <Download size={20} />
          Enregistrer en PDF
        </button>
      </div>

      {/* Scaled Wrapper for screen, unscaled for print */}
      <div 
        className="print:!block print:!w-auto print:!m-0 print:!p-0 print:!h-auto flex justify-center"
        style={{ 
          height: `calc(1123px * ${scale})`,
          width: '100%'
        }}
      >
        {/* CV Container strictly sized to A4 */}
        <div 
          className="bg-white shadow-2xl print:shadow-none w-[794px] min-h-[1123px] overflow-hidden origin-top print:!transform-none" 
          style={{ 
            margin: 0, 
            padding: 0,
            transform: `scale(${scale})`
          }}
        >
          {template?.layout === 'cover-letter' ? (
            <CoverLetterPreview template={template} cvData={cvData} />
          ) : (
            <CVPreview template={template} cvData={cvData} experiences={experiences} educations={cvData?.educations} />
          )}
        </div>
      </div>

      <style>{`
        @media print {
          @page {
            margin: 0;
            size: A4;
          }
          body {
            background: white !important;
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          #root {
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
