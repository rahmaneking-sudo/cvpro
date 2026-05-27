import { useEffect, useState, useRef } from 'react';
import { getTemplate } from '../data/templates';
import CVPreview from '../components/cv/CVPreview';
import CoverLetterPreview from '../components/cv/CoverLetterPreview';
import { Download } from 'lucide-react';

// Composant qui scale le CV pour qu'il rentre dans l'écran mobile
// tout en gardant le vrai rendu 794px pour l'impression
function MobileScaler({ children }) {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const compute = () => {
      if (containerRef.current) {
        const available = containerRef.current.clientWidth;
        setScale(Math.min(1, available / 794));
      }
    };
    compute();
    const ro = new ResizeObserver(compute);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const scaledHeight = 1123 * scale;

  return (
    <div ref={containerRef} className="w-full flex justify-center print:block print:w-auto">
      {/* Outer div keeps the scaled height so page doesn't overlap */}
      <div className="mobile-scaler-outer" style={{ width: `${794 * scale}px`, height: `${scaledHeight}px`, position: 'relative' }}>
        {/* Inner div is always 794px, scaled down visually */}
        <div
          className="mobile-scaler-inner"
          style={{
            width: '794px',
            height: '1123px',
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            position: 'absolute',
            top: 0,
            left: 0,
            overflow: 'hidden',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

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

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col items-center p-4 print:p-0 print:bg-white print:block print:min-h-0">
      {/* Bouton visible seulement à l'écran, masqué à l'impression */}
      <div className="mb-4 w-full no-print print:hidden flex flex-col items-center gap-3">
        <div className="text-center max-w-sm text-sm text-gray-600 bg-white p-3 rounded-xl shadow-sm border border-gray-200">
          Pour enregistrer ce CV sur votre iPhone, appuyez sur <strong>"Enregistrer en PDF"</strong> ci-dessous, puis choisissez <strong>"Enregistrer dans Fichiers"</strong> ou <strong>"Partager → Imprimer"</strong>.
        </div>
        <button
          onClick={async () => {
            const { default: html2canvas } = await import('html2canvas');
            const { default: jsPDF } = await import('jspdf');
            const inner = document.querySelector('.mobile-scaler-inner');
            const savedTransform = inner.style.transform;
            inner.style.transform = 'none';
            const canvas = await html2canvas(inner, {
              scale: 2,
              useCORS: true,
              width: 794,
              height: 1123,
              windowWidth: 794,
              windowHeight: 1123,
            });
            inner.style.transform = savedTransform;
            const pdf = new jsPDF('portrait', 'mm', 'a4');
            pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, 210, 297);
            pdf.save('mon-cv.pdf');
          }}
          style={{ backgroundColor: '#c9a96e' }}
          className="flex items-center gap-2 text-black px-8 py-3 rounded-xl font-bold shadow-lg active:scale-95 transition-transform text-base"
        >
          <Download size={20} />
          Enregistrer en PDF
        </button>
      </div>

      {/* Affichage : Scalé pour le mobile, désactivé à l'impression */}
      <div className="w-full flex justify-center">
        <MobileScaler>
          <div className="bg-white w-[794px] h-[1123px] overflow-hidden">
            {template?.layout === 'cover-letter' ? (
              <CoverLetterPreview template={template} cvData={cvData} />
            ) : (
              <CVPreview
                template={template}
                cvData={cvData}
                experiences={experiences}
                educations={cvData?.educations}
              />
            )}
          </div>
        </MobileScaler>
      </div>
    </div>
  );
}
