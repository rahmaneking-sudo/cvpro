import { useState, useEffect, useRef, useCallback } from 'react';
import { Globe, ExternalLink, X, ChevronLeft, ChevronRight, FileText, ZoomIn, ZoomOut, Download } from 'lucide-react';

// ── PDF.js Setup ──
import * as pdfjsLib from 'pdfjs-dist';
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString();

// Helper: detect if URL is a PDF (extension or Cloudinary raw path)
function isPdfUrl(url) {
  if (!url) return false;
  return url.match(/\.pdf($|\?)/i) || url.includes('/raw/upload/');
}

// Helper: detect if URL is a video
function isVideoUrl(url) {
  if (!url) return false;
  return url.match(/\.(mp4|webm|ogg)$/i) || url.includes('/video/upload/');
}

// ── PDF.js-based Viewer ──
// Renders PDF pages using Mozilla's PDF.js (works on all devices including mobile)
function PdfViewer({ url, onClose, accent }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scale, setScale] = useState(1.5);
  const canvasRef = useRef(null);
  const pdfDocRef = useRef(null);
  const renderTaskRef = useRef(null);

  // Load the PDF document once
  useEffect(() => {
    let cancelled = false;

    async function loadPdf() {
      try {
        setLoading(true);
        setError(null);
        const loadingTask = pdfjsLib.getDocument({
          url: url,
          // Disable range requests which can cause CORS issues with Cloudinary
          disableRange: true,
          disableStream: true,
        });
        const pdf = await loadingTask.promise;
        if (cancelled) return;
        pdfDocRef.current = pdf;
        setTotalPages(pdf.numPages);
        setCurrentPage(1);
      } catch (err) {
        if (cancelled) return;
        console.error('PDF Load Error:', err);
        setError('Impossible de charger le PDF. Le fichier est peut-être corrompu ou inaccessible.');
        setLoading(false);
      }
    }

    loadPdf();
    return () => { cancelled = true; };
  }, [url]);

  // Render the current page
  const renderPage = useCallback(async (pageNum) => {
    const pdf = pdfDocRef.current;
    if (!pdf) return;

    try {
      setLoading(true);

      // Cancel any ongoing render task
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
        renderTaskRef.current = null;
      }

      const page = await pdf.getPage(pageNum);
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      const viewport = page.getViewport({ scale });

      // Support HiDPI displays
      const outputScale = window.devicePixelRatio || 1;
      canvas.width = Math.floor(viewport.width * outputScale);
      canvas.height = Math.floor(viewport.height * outputScale);
      canvas.style.width = Math.floor(viewport.width) + 'px';
      canvas.style.height = Math.floor(viewport.height) + 'px';

      const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

      const renderContext = {
        canvasContext: ctx,
        viewport: viewport,
        transform: transform,
      };

      const renderTask = page.render(renderContext);
      renderTaskRef.current = renderTask;
      await renderTask.promise;
      renderTaskRef.current = null;
      setLoading(false);
    } catch (err) {
      if (err.name === 'RenderingCancelled') return;
      console.error('Page render error:', err);
      setError('Erreur lors du rendu de la page.');
      setLoading(false);
    }
  }, [scale]);

  // Re-render when page or scale changes
  useEffect(() => {
    if (pdfDocRef.current && totalPages > 0) {
      renderPage(currentPage);
    }
  }, [currentPage, totalPages, renderPage]);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const adjustScale = (delta) => {
    setScale(prev => Math.max(0.5, Math.min(3, prev + delta)));
  };

  const themeColor = accent || '#C9A96E';

  return (
    <div className="w-[95vw] sm:w-[90vw] max-w-4xl flex flex-col max-h-[95vh]" onClick={e => e.stopPropagation()}>
      {/* Header bar */}
      <div
        className="flex items-center justify-between px-4 sm:px-6 py-3 rounded-t-2xl"
        style={{ background: 'rgba(30,30,30,0.95)', backdropFilter: 'blur(20px)' }}
      >
        <div className="flex items-center gap-3">
          <FileText size={18} style={{ color: themeColor }} />
          <span className="text-white font-semibold text-sm">
            Document PDF — Page {currentPage}{totalPages > 0 ? ` / ${totalPages}` : ''}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {/* Zoom controls */}
          <button
            onClick={() => adjustScale(-0.25)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
            title="Zoom arrière"
          >
            <ZoomOut size={16} />
          </button>
          <span className="text-white/40 text-xs min-w-[40px] text-center">{Math.round(scale * 100)}%</span>
          <button
            onClick={() => adjustScale(0.25)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
            title="Zoom avant"
          >
            <ZoomIn size={16} />
          </button>
          {/* Download */}
          <a
            href={url}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex w-8 h-8 rounded-full items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
            title="Télécharger le PDF"
          >
            <Download size={16} />
          </a>
          {/* Close */}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* PDF Page Content */}
      <div
        className="flex-1 overflow-auto flex items-start justify-center p-2 sm:p-4"
        style={{ background: 'rgba(20,20,20,0.95)' }}
      >
        {error ? (
          <div className="flex flex-col items-center justify-center py-20 text-white/40">
            <FileText size={48} className="mb-4 opacity-50" />
            <p className="font-medium text-center px-4">{error}</p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 px-6 py-2 rounded-full text-xs font-bold text-white transition-colors"
              style={{ background: themeColor }}
            >
              Télécharger le fichier directement
            </a>
          </div>
        ) : (
          <div className="relative">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/30 rounded-lg">
                <div className="w-8 h-8 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
              </div>
            )}
            <canvas
              ref={canvasRef}
              className="max-w-full rounded-lg shadow-2xl"
              style={{ maxHeight: '72vh' }}
            />
          </div>
        )}
      </div>

      {/* Page Navigation */}
      {totalPages > 0 && !error && (
        <div
          className="flex items-center justify-center gap-4 py-3 px-4 rounded-b-2xl"
          style={{ background: 'rgba(30,30,30,0.95)' }}
        >
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-all disabled:opacity-20 disabled:cursor-not-allowed hover:bg-white/10"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-white/60 text-sm font-medium min-w-[100px] text-center">
            Page {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-all disabled:opacity-20 disabled:cursor-not-allowed hover:bg-white/10"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}

// ── PDF Thumbnail (uses PDF.js to render page 1 as preview) ──
function PdfThumbnail({ url, alt, className, onError }) {
  const canvasRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function renderThumbnail() {
      try {
        const loadingTask = pdfjsLib.getDocument({
          url: url,
          disableRange: true,
          disableStream: true,
        });
        const pdf = await loadingTask.promise;
        if (cancelled) return;

        const page = await pdf.getPage(1);
        const canvas = canvasRef.current;
        if (!canvas || cancelled) return;

        // Scale to fit 800px width max
        const desiredWidth = 800;
        const unscaledViewport = page.getViewport({ scale: 1 });
        const scale = desiredWidth / unscaledViewport.width;
        const viewport = page.getViewport({ scale });

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: canvas.getContext('2d'),
          viewport: viewport,
        }).promise;

        if (!cancelled) setLoaded(true);
      } catch (err) {
        if (!cancelled) {
          console.error('PDF thumbnail error:', err);
          setFailed(true);
          if (onError) onError(err);
        }
      }
    }

    renderThumbnail();
    return () => { cancelled = true; };
  }, [url]);

  if (failed) {
    return (
      <div className={`${className} flex flex-col items-center justify-center bg-gray-800/50`}>
        <div className="text-4xl mb-3">📄</div>
        <span className="text-xs font-bold uppercase tracking-wider opacity-70">Document PDF</span>
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      alt={alt}
      className={className}
      style={{ opacity: loaded ? 1 : 0.3 }}
    />
  );
}

function LayoutStandard({ template, data }) {
  const { accent, text, bg, secondary } = template;
  const { fullName, jobTitle, bio, email, phone, location, projects, socialLinks } = data;
  const [selectedMedia, setSelectedMedia] = useState(null);

  return (
    <div className="min-h-screen relative" style={{ background: bg, color: text }}>
      {/* Hero Section */}
      <header className="px-4 sm:px-10 py-10 sm:py-20 flex flex-col items-center justify-center text-center border-b" style={{ borderColor: `${text}15` }}>
        {data.photo && (
          <div className="w-24 h-24 rounded-full overflow-hidden mb-6 border-4 shadow-lg" style={{ borderColor: accent }}>
            <img src={data.photo} alt={fullName} className="w-full h-full object-cover" />
          </div>
        )}
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-3 sm:mb-4 uppercase break-words" style={{ fontFamily: 'var(--font-serif)' }}>
          {fullName || 'Votre Nom'}
        </h1>
        <h2 className="text-base sm:text-xl tracking-[0.15em] sm:tracking-[0.3em] uppercase mb-4 sm:mb-8" style={{ color: accent }}>
          {jobTitle || 'Votre Spécialité'}
        </h2>
        {bio && (
          <p className="max-w-2xl text-sm leading-loose opacity-80 mb-8">
            {bio}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-6 text-[10px] sm:text-xs tracking-widest uppercase opacity-60 mb-4 sm:mb-6">
          {email && <span>{email}</span>}
          {phone && <span>{phone}</span>}
          {location && <span>{location}</span>}
        </div>
        
        {/* Social Links */}
        {socialLinks && socialLinks.length > 0 && (
          <div className="flex gap-4 flex-wrap justify-center">
            {socialLinks.map((link, idx) => (
              <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors border" style={{ borderColor: `${text}20`, color: text, hover: { background: `${text}10` } }}>
                {link.platform}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* Projects Section */}
      <section className="px-4 sm:px-10 py-8 sm:py-16 max-w-5xl mx-auto">
        <h3 className="text-sm font-bold tracking-[0.2em] uppercase mb-12 text-center" style={{ color: accent }}>
          Projets Sélectionnés
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {(projects?.length > 0 ? projects : [{}, {}]).map((proj, i) => (
            <article key={i} className="group cursor-pointer">
              {/* Project Image — click opens viewer */}
              <div 
                className="aspect-[4/3] rounded-xl mb-6 overflow-hidden relative border cursor-pointer"
                style={{ background: secondary, borderColor: `${text}10` }}
                onClick={() => {
                  if (proj.imageUrl && isPdfUrl(proj.imageUrl)) {
                    setSelectedMedia({ type: 'pdf', url: proj.imageUrl });
                  } else if (proj.imageUrl && !isVideoUrl(proj.imageUrl)) {
                    setSelectedMedia({ type: 'image', url: proj.imageUrl });
                  }
                }}
              >
                {proj.imageUrl ? (
                  isVideoUrl(proj.imageUrl) ? (
                    <video 
                      src={proj.imageUrl} 
                      controls 
                      className="w-full h-full object-cover"
                      preload="metadata"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : isPdfUrl(proj.imageUrl) ? (
                    // PDF: render page 1 thumbnail using PDF.js
                    <PdfThumbnail
                      url={proj.imageUrl}
                      alt={proj.title || 'PDF'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img src={proj.imageUrl} alt={proj.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                  )
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    <Globe size={48} />
                  </div>
                )}
                {/* Hover overlay — purely visual */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                  <span className="px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest bg-white text-black">
                    {isVideoUrl(proj.imageUrl) ? 'Voir le projet' : 
                     isPdfUrl(proj.imageUrl) ? 'Voir le PDF' : 'Voir l\'image'}
                  </span>
                </div>
              </div>

              {/* Project Info */}
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-xl font-bold" style={{ fontFamily: 'var(--font-serif)' }}>
                  {proj.title || `Projet ${i + 1}`}
                </h4>
                {proj.link && <ExternalLink size={16} style={{ color: accent }} />}
              </div>
              <p className="text-xs leading-relaxed opacity-70 mb-4 line-clamp-3">
                {proj.description || 'Une description détaillée de ce projet, les défis rencontrés et les solutions apportées.'}
              </p>
              
              {/* Tags */}
              <div className="flex gap-2 flex-wrap">
                {(proj.tags?.length > 0 ? proj.tags : ['Design', 'Développement']).map((tag, j) => (
                  <span key={j} className="text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-sm" style={{ border: `1px solid ${accent}30`, color: accent }}>
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Footer */}
      {(email || phone) && (
        <footer className="py-12 text-center border-t" style={{ borderColor: `${text}15`, background: secondary }}>
          <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-serif)' }}>Prêt à collaborer ?</h2>
          {email && (
            <a href={`mailto:${email}`} className="inline-block px-8 py-4 rounded-full text-sm font-bold tracking-widest uppercase transition-transform hover:scale-105" style={{ background: accent, color: bg }}>
              Me contacter par email
            </a>
          )}
        </footer>
      )}

      {/* Media Modal (Lightbox for Images + PDF Viewer) */}
      {selectedMedia && (
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 backdrop-blur-sm print:hidden"
          onClick={() => setSelectedMedia(null)}
        >
          {selectedMedia.type === 'pdf' ? (
            <PdfViewer 
              url={selectedMedia.url} 
              onClose={() => setSelectedMedia(null)}
              accent={accent}
            />
          ) : (
            <>
              <button 
                onClick={() => setSelectedMedia(null)}
                className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
              >
                <X size={32} />
              </button>
              <img 
                src={selectedMedia.url} 
                alt="Projet en grand" 
                className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()} 
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   MAIN EXPORT
   ========================================================= */
export default function PortfolioPreview({ template, data }) {
  if (!template) return null;

  const { bg, text } = template;

  return (
    <div
      className="w-full min-h-[297mm] relative print:min-h-[297mm]"
      style={{ background: bg, color: text }}
    >
      <LayoutStandard template={template} data={data || {}} />
    </div>
  );
}
