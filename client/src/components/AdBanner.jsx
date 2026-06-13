// src/components/AdBanner.jsx
// Composant Google AdSense
//
// AVANT D'UTILISER :
// 1. Va sur adsense.google.com et crée ton compte
// 2. Remplace "ca-pub-XXXXXXXXXXXXXXXX" par ton vrai client ID
// 3. Remplace "XXXXXXXXXX" par ton vrai ad-slot ID
// 4. Ajoute le script AdSense dans public/index.html (voir index.html)

import { useEffect, useRef } from 'react';

const AdBanner = ({ format = 'auto', slot = 'XXXXXXXXXX' }) => {
  const adRef = useRef(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (!pushed.current && adRef.current) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushed.current = true;
      } catch (e) {
        console.error('AdSense error:', e);
      }
    }
  }, []);

  return (
    <div style={{ textAlign: 'center', margin: '20px 0' }}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-9993346594195336"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdBanner;
