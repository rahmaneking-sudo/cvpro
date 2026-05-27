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

  const { templateId, cvData, experiences, educations, colors } = data;
  const template = getTemplate(templateId);

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col items-center p-4 print:p-0 print:bg-white">
      {/* Floating Action Button (hidden in print) */}
      <div className="mb-6 print:hidden no-print flex flex-col items-center gap-3">
        <div className="text-center max-w-sm text-sm text-gray-600 bg-white p-3 rounded-xl shadow-sm border border-gray-200">
          Pour enregistrer ce CV sur votre iPhone, cliquez sur le bouton ci-dessous, puis choisissez l'option <strong>"Enregistrer dans Fichiers"</strong> ou <strong>"Partager &gt; Imprimer"</strong>.
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-[var(--color-champagne)] text-black px-6 py-3 rounded-xl font-bold shadow-lg hover:-translate-y-1 transition-transform"
        >
          <Download size={20} />
          Enregistrer en PDF
        </button>
      </div>

      {/* CV Container strictly sized to A4 */}
      <div className="bg-white shadow-2xl print:shadow-none w-[794px] min-h-[1123px] overflow-hidden" style={{ margin: 0, padding: 0 }}>
        {template?.layout === 'cover-letter' ? (
          <CoverLetterPreview template={template} cvData={cvData} colors={colors} />
        ) : (
          <CVPreview template={template} cvData={cvData} experiences={experiences} educations={educations} colors={colors} />
        )}
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
