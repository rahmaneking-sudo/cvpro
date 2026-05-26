import { useEffect } from 'react';

export function useGoogleFont(fontName) {
  useEffect(() => {
    if (!fontName) return;
    
    const fontId = 'font-' + fontName.toLowerCase().replace(/\s+/g, '-');
    if (document.getElementById(fontId)) return;
    
    const link = document.createElement('link');
    link.id = fontId;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, '+')}:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap`;
    document.head.appendChild(link);
  }, [fontName]);
}
