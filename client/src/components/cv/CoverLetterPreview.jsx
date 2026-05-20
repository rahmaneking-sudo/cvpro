import React from 'react';

export default function CoverLetterPreview({ cvData, template }) {
  if (!template || template.layout !== 'cover-letter') return null;

  return (
    <div 
      className="w-full relative bg-white flex flex-col"
      style={{ 
        color: '#1A1A1A',
        backgroundColor: '#FFFFFF',
        fontFamily: "'Georgia', 'Times New Roman', serif",
        lineHeight: 1.7,
        minHeight: '1123px', // A4 height at 96dpi
        padding: '60px 70px'
      }}
    >
      {/* SENDER INFO (Top Left) */}
      <div style={{ fontSize: '13px', marginBottom: '40px', lineHeight: 1.6 }}>
        <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {cvData.fullName || 'Prénom NOM'}
        </div>
        {cvData.location && <div>{cvData.location}</div>}
        {cvData.phone && <div>{cvData.phone}</div>}
        {cvData.email && <div>{cvData.email}</div>}
      </div>

      {/* RECIPIENT INFO (Right-aligned) */}
      <div style={{ marginLeft: 'auto', width: '55%', fontSize: '13px', marginBottom: '30px', lineHeight: 1.6, paddingLeft: '16px' }}>
        <div style={{ fontWeight: 700, marginBottom: '2px' }}>
          {cvData.recipientCompany || "Nom de l'entreprise"}
        </div>
        {cvData.recipientName && <div>{cvData.recipientName}</div>}
        {cvData.recipientAddress && <div>{cvData.recipientAddress}</div>}
        {cvData.recipientCity && <div>{cvData.recipientCity}</div>}
      </div>

      {/* DATE & LOCATION (Right below recipient) */}
      <div style={{ marginLeft: 'auto', width: '55%', fontSize: '13px', marginBottom: '45px', paddingLeft: '16px', fontStyle: 'italic' }}>
        {cvData.dateAndLocation || 'Lieu, le Date'}
      </div>

      {/* SUBJECT LINE */}
      <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '30px', borderBottom: '1px solid #e0e0e0', paddingBottom: '8px' }}>
        <span style={{ color: '#555', fontWeight: 400, marginRight: '6px' }}>Objet :</span>
        {cvData.subject || 'Candidature pour le poste de…'}
      </div>

      {/* SALUTATION */}
      <div style={{ fontSize: '14px', marginBottom: '20px', fontWeight: 600 }}>
        {cvData.salutation || 'Madame, Monsieur,'}
      </div>

      {/* BODY TEXT */}
      <div style={{ fontSize: '13.5px', textAlign: 'justify', flexGrow: 1, whiteSpace: 'pre-wrap', lineHeight: 1.75 }}>
        <div style={{ marginBottom: '24px' }}>
          {cvData.body || "J'ai l'honneur de vous adresser ma candidature pour le poste mentionné en objet. Fort(e) d'une expérience significative dans ce domaine, je suis convaincu(e) que mon profil correspond aux exigences de ce poste.\n\nAu cours de mes précédentes expériences, j'ai développé des compétences solides en gestion de projet, communication et travail d'équipe. Ma capacité d'adaptation et mon sens de l'initiative me permettent de m'intégrer rapidement et de contribuer efficacement aux objectifs de l'entreprise.\n\nJe serais ravi(e) de pouvoir vous exposer de vive voix mes motivations et la manière dont je pourrais contribuer au développement de votre structure."}
        </div>
        <div style={{ marginBottom: '16px' }}>
          {cvData.closing || "Dans l'attente d'une réponse favorable de votre part, je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées."}
        </div>
      </div>

      {/* NAME AT BOTTOM (no signature block, just the name) */}
      <div style={{ marginLeft: 'auto', width: '55%', fontSize: '14px', fontWeight: 700, paddingTop: '30px', paddingLeft: '16px' }}>
        {cvData.fullName || 'Prénom NOM'}
      </div>
    </div>
  );
}
