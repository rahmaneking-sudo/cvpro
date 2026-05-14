import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './i18n';
import './index.css';
import App from './App.jsx';

// ==========================================
// PROTECTION ANTI-INSPECTION EN PRODUCTION
// ==========================================
if (import.meta.env.PROD) {
  // Désactiver clic droit
  document.addEventListener('contextmenu', (e) => e.preventDefault());

  // Bloquer les raccourcis DevTools
  document.addEventListener('keydown', (e) => {
    // F12
    if (e.key === 'F12') { e.preventDefault(); return false; }
    // Ctrl+Shift+I (Inspector)
    if (e.ctrlKey && e.shiftKey && e.key === 'I') { e.preventDefault(); return false; }
    // Ctrl+Shift+J (Console)
    if (e.ctrlKey && e.shiftKey && e.key === 'J') { e.preventDefault(); return false; }
    // Ctrl+Shift+C (Select element)
    if (e.ctrlKey && e.shiftKey && e.key === 'C') { e.preventDefault(); return false; }
    // Ctrl+U (View source)
    if (e.ctrlKey && e.key === 'u') { e.preventDefault(); return false; }
    // Ctrl+S (Save page)
    if (e.ctrlKey && e.key === 's') { e.preventDefault(); return false; }
  });

  // Détection ouverture DevTools (méthode anti-debug)
  const devToolsDetector = setInterval(() => {
    const threshold = 160;
    if (
      window.outerWidth - window.innerWidth > threshold ||
      window.outerHeight - window.innerHeight > threshold
    ) {
      document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#0A0A0A;color:#C9A96E;font-family:Inter,sans-serif;font-size:18px;text-align:center;padding:20px;">🔒 Accès non autorisé. Les outils de développement sont désactivés.</div>';
      clearInterval(devToolsDetector);
    }
  }, 1000);

  // Supprimer les logs console en production
  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};
  console.info = () => {};
  console.debug = () => {};
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
