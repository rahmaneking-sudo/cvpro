import { useEffect, useState, useRef } from 'react';
import { portfolioTemplates } from '../data/portfolioTemplates';
import PortfolioPreview from '../components/portfolio/PortfolioPreview';
import { Download } from 'lucide-react';

function MobileScaler({ children }) {
  const containerRef = useRef(null);
  const innerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [innerHeight, setInnerHeight] = useState(0);

  useEffect(() => {
    const compute = () => {
      if (containerRef.current) {
        const available = containerRef.current.clientWidth;
        setScale(Math.min(1, available / 794));
      }
      if (innerRef.current) {
        const actualHeight = innerRef.current.scrollHeight;
        if (actualHeight > 0) {
          setInnerHeight(actualHeight);
        }
      }
    };
    compute();
    // Use a small timeout to ensure initial render is measured properly
    setTimeout(compute, 100);
    setTimeout(compute, 500);

    const ro = new ResizeObserver(compute);
    if (containerRef.current) ro.observe(containerRef.current);
    if (innerRef.current) ro.observe(innerRef.current);
    return () => ro.disconnect();
  }, []);

  const scaledHeight = innerHeight * scale;

  return (
    <div ref={containerRef} className="w-full flex justify-center print:block print:w-auto">
      {/* Outer div keeps the scaled height so page doesn't overlap */}
      <div className="mobile-scaler-outer" style={{ width: `${794 * scale}px`, height: `${scaledHeight}px`, position: 'relative' }}>
        {/* Inner div is always 794px, scaled down visually */}
        <div
          ref={innerRef}
          className="mobile-scaler-inner"
          style={{
            width: '794px',
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default function PrintPortfolioPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    document.body.classList.add('is-portfolio-print-page');
    try {
      const storedData = localStorage.getItem('portfolio-print-data');
      if (storedData) {
        setData(JSON.parse(storedData));
      }
    } catch (e) {
      console.error('Failed to parse print data', e);
    }
    return () => {
      document.body.classList.remove('is-portfolio-print-page');
    };
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Aucune donnée trouvée. Veuillez retourner à l'éditeur.</p>
      </div>
    );
  }

  const { templateId, data: portfolioData } = data;
  const template = portfolioTemplates.find(t => t.id === templateId) || portfolioTemplates[0];

  return (
    <div className="bg-[#f3f4f6] flex flex-col items-center print:bg-white print:block print:min-h-0">
      {/* Bouton visible seulement à l'écran, masqué à l'impression */}
      <div className="mb-4 w-full no-print print:hidden flex flex-col items-center gap-3">
        <div className="text-center max-w-sm text-sm text-gray-600 bg-white p-3 rounded-xl shadow-sm border border-gray-200">
          Pour enregistrer ce Portfolio sur votre iPhone, appuyez sur <strong>"Enregistrer en PDF"</strong> ci-dessous.
        </div>
        <button
          onClick={async () => {
            const { default: html2canvas } = await import('html2canvas');
            const { default: jsPDF } = await import('jspdf');
            const inner = document.querySelector('.mobile-scaler-inner');
            const savedTransform = inner.style.transform;
            const savedPosition = inner.style.position;
            
            // Fix html2canvas cutoff bug: scroll to top
            window.scrollTo(0, 0);
            
            // Temporarily remove transform and absolute position to ensure accurate DOM dimensions
            inner.style.transform = 'none';
            inner.style.position = 'static';
            
            // Allow the browser to repaint and calculate layout
            await new Promise(r => setTimeout(r, 100));
            
            const totalHeight = inner.offsetHeight;

            const canvas = await html2canvas(inner, {
              scale: 2,
              useCORS: true,
              width: 794,
              height: totalHeight,
              windowWidth: 794,
              windowHeight: totalHeight,
              backgroundColor: null,
              onclone: (clonedDoc) => {
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = 1;
                tempCanvas.height = 1;
                const ctx = tempCanvas.getContext('2d', { willReadFrequently: true });
                const convertColor = (val) => {
                  if (!val || (!val.includes('oklab') && !val.includes('oklch') && !val.includes('color('))) return val;
                  ctx.clearRect(0,0,1,1);
                  ctx.fillStyle = val;
                  ctx.fillRect(0,0,1,1);
                  const colorData = ctx.getImageData(0,0,1,1).data;
                  return `rgba(${colorData[0]}, ${colorData[1]}, ${colorData[2]}, ${colorData[3]/255})`;
                };
                const elements = clonedDoc.querySelectorAll('*');
                for (let i = 0; i < elements.length; i++) {
                  const el = elements[i];
                  const style = clonedDoc.defaultView ? clonedDoc.defaultView.getComputedStyle(el) : window.getComputedStyle(el);
                  const bg = style.backgroundColor;
                  const c = style.color;
                  const bc = style.borderColor;
                  if (bg && (bg.includes('okl') || bg.includes('color('))) el.style.backgroundColor = convertColor(bg);
                  if (c && (c.includes('okl') || c.includes('color('))) el.style.color = convertColor(c);
                  if (bc && (bc.includes('okl') || bc.includes('color('))) el.style.borderColor = convertColor(bc);
                }
              }
            });
            
            // Restore original styles
            inner.style.transform = savedTransform;
            inner.style.position = savedPosition;
            
            const pdf = new jsPDF('portrait', 'mm', 'a4');
            const imgWidth = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            const pageHeight = 297;
            let position = 0;
            let heightLeft = imgHeight;

            pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            // Only add a new page if there's more than 1mm of content left
            while (heightLeft > 1) {
              position -= pageHeight;
              pdf.addPage();
              pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, position, imgWidth, imgHeight);
              heightLeft -= pageHeight;
            }

            const fileName = portfolioData.fullName ? `Portfolio_${portfolioData.fullName.replace(/\s+/g, '_')}.pdf` : 'Portfolio.pdf';
            pdf.save(fileName);
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
          <div className="w-[794px]">
            <PortfolioPreview
              template={template}
              data={portfolioData}
            />
          </div>
        </MobileScaler>
      </div>
    </div>
  );
}
