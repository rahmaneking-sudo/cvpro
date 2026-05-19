import React from 'react';

export default function CoverLetterPreview({ cvData, template }) {
  if (!template || template.layout !== 'cover-letter') return null;

  return (
    <div 
      className="w-full relative bg-white flex flex-col"
      style={{ 
        color: '#000000',
        backgroundColor: '#FFFFFF',
        fontFamily: "Arial, Helvetica, sans-serif",
        lineHeight: 1.5,
        minHeight: '297mm', // Format A4
        padding: '60px 80px' // Marges typiques d'une lettre
      }}
    >
      {/* SENDER INFO (Top Left) */}
      <div className="text-[14px] mb-10 leading-snug">
        <div className="font-bold text-[15px] mb-1">
          {cvData.fullName || 'NOM et Prénom'}
        </div>
        {cvData.address && <div>{cvData.address}</div>}
        {cvData.city && <div>{cvData.city}</div>}
        {cvData.phone && <div>{cvData.phone}</div>}
        {cvData.email && <div>{cvData.email}</div>}
      </div>

      {/* RECIPIENT INFO (Middle Right) */}
      <div className="ml-auto w-[50%] text-[14px] mb-8 leading-snug pl-4">
        <div className="font-bold mb-1">
          {cvData.recipientCompany || "Nom de l'entreprise"}
        </div>
        {cvData.recipientName && <div>{cvData.recipientName}</div>}
        {cvData.recipientAddress && <div>{cvData.recipientAddress}</div>}
        {cvData.recipientCity && <div>{cvData.recipientCity}</div>}
      </div>

      {/* DATE & LOCATION (Right below recipient) */}
      <div className="ml-auto w-[50%] text-[14px] mb-12 pl-4">
        {cvData.dateAndLocation || 'Lieu et date de rédaction'}
      </div>

      {/* SUBJECT (Left) */}
      <div className="font-bold text-[14px] mb-8">
        {cvData.subject || 'Objet de la lettre de motivation'}
      </div>

      {/* BODY */}
      <div className="text-[14px] text-justify flex-grow" style={{ whiteSpace: 'pre-wrap' }}>
        <div className="font-bold mb-6">
          {cvData.salutation || 'Madame, Monsieur,'}
        </div>
        <div className="mb-6 leading-[1.6]">
          {cvData.body || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras efficitur tincidunt velit. Etiam rhoncus lacinia mauris, non feugiat mauris. Phasellus porttitor quis lectus quis interdum.\n\nProin vel dolor neque. Aenean nunc ante, bibendum a dolor vel, suscipit facilisis libero. Pellentesque congue rhoncus justo eget laoreet. Suspendisse potenti.\n\nSed at felis magna. Curabitur mi purus, porttitor eu dui sed, maximus imperdiet mauris. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.'}
        </div>
        <div className="mb-12 leading-[1.6]">
          {cvData.closing || 'Dans l\'attente d\'une réponse de votre part, je vous prie Madame, Monsieur de bien vouloir recevoir mes plus respectueuses salutations.'}
        </div>
      </div>

      {/* SIGNATURE (Bottom Right) */}
      <div className="ml-auto w-[50%] text-[14px] font-bold pb-12 pl-4">
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
  );
}
