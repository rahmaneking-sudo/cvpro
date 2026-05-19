import React from 'react';

export default function CoverLetterPreview({ cvData, template }) {
  if (!template || template.layout !== 'cover-letter') return null;

  const { text, bg, accent } = template;

  return (
    <div 
      className="w-full h-full relative bg-white"
      style={{ 
        color: text || '#1A1A1A', 
        backgroundColor: bg || '#FFFFFF',
        fontFamily: "'Inter', sans-serif",
        lineHeight: 1.6
      }}
    >
      <div className="absolute inset-0 p-12 sm:p-16 flex flex-col">
        {/* SENDER INFO (Top Left) */}
        <div className="text-sm">
          <div className="font-bold text-base text-[var(--color-obsidian)]" style={{ color: accent }}>
            {cvData.fullName || 'NOM et Prénom'}
          </div>
          {cvData.address && <div>{cvData.address}</div>}
          {cvData.city && <div>{cvData.city}</div>}
          {cvData.phone && <div>{cvData.phone}</div>}
          {cvData.email && <div>{cvData.email}</div>}
        </div>

        {/* RECIPIENT INFO (Middle Right) */}
        <div className="mt-8 self-end text-right text-sm sm:w-1/2">
          <div className="font-bold" style={{ color: text }}>
            {cvData.recipientCompany || 'Nom de l\'entreprise'}
          </div>
          {cvData.recipientName && <div>{cvData.recipientName}</div>}
          {cvData.recipientAddress && <div>{cvData.recipientAddress}</div>}
          {cvData.recipientCity && <div>{cvData.recipientCity}</div>}
        </div>

        {/* DATE & LOCATION (Right below recipient) */}
        <div className="mt-8 self-end text-right text-sm">
          {cvData.dateAndLocation || 'Lieu et date de rédaction'}
        </div>

        {/* SUBJECT (Left) */}
        <div className="mt-12 font-bold text-sm">
          {cvData.subject || 'Objet de la lettre de motivation'}
        </div>

        {/* BODY */}
        <div className="mt-8 flex-grow text-sm text-justify" style={{ whiteSpace: 'pre-wrap' }}>
          <div className="font-bold mb-4">
            {cvData.salutation || 'Madame, Monsieur,'}
          </div>
          <div>
            {cvData.body || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras efficitur tincidunt velit. Etiam rhoncus lacinia mauris, non feugiat mauris. Phasellus porttitor quis lectus quis interdum.\n\nProin vel dolor neque. Aenean nunc ante, bibendum a dolor vel, suscipit facilisis libero. Pellentesque congue rhoncus justo eget laoreet. Suspendisse potenti.\n\nSed at felis magna. Curabitur mi purus, porttitor eu dui sed, maximus imperdiet mauris. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.'}
          </div>
          <div className="mt-6">
            {cvData.closing || 'Dans l\'attente d\'une réponse de votre part, je vous prie Madame, Monsieur de bien vouloir recevoir mes plus respectueuses salutations.'}
          </div>
        </div>

        {/* SIGNATURE (Bottom Right) */}
        <div className="mt-12 self-end text-right text-sm">
          <div className="font-bold" style={{ color: accent }}>
            {cvData.fullName ? (
              // Extract First Name (Prénom) and Last Name (NOM) if possible
              (() => {
                const parts = cvData.fullName.trim().split(' ');
                if (parts.length > 1) {
                  const lastName = parts.pop().toUpperCase();
                  const firstName = parts.join(' ');
                  return `${firstName} ${lastName}`;
                }
                return cvData.fullName.toUpperCase();
              })()
            ) : 'Prénom et NOM'}
          </div>
        </div>
      </div>
    </div>
  );
}
