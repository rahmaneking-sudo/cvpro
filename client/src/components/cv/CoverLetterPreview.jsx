
export default function CoverLetterPreview({ cvData, template }) {
  if (!template || template.layout !== 'cover-letter') return null;

  return (
    <div 
      className="w-full relative bg-white flex flex-col"
      style={{ 
        color: '#1A1A1A',
        backgroundColor: '#FFFFFF',
        fontFamily: template?.fontBody ? `"${template.fontBody}", sans-serif` : "'Arial', sans-serif",
        lineHeight: 1.7,
        minHeight: '1123px', // A4 height at 96dpi
        padding: '60px 70px'
      }}
    >
      {/* SENDER INFO (Top Left) */}
      <div style={{ fontSize: '14px', marginBottom: '40px', lineHeight: 1.6, fontWeight: 600 }}>
        <div style={{ fontWeight: 800, fontSize: '16px', marginBottom: '4px' }}>
          {cvData.fullName || 'NOM et Prénom'}
        </div>
        {cvData.address && <div>{cvData.address}</div>}
        {cvData.location && <div>{cvData.location}</div>}
        {cvData.phone && <div>{cvData.phone}</div>}
        {cvData.email && <div>{cvData.email}</div>}
      </div>

      {/* RECIPIENT INFO (Right-aligned) */}
      <div style={{ marginLeft: 'auto', width: '45%', fontSize: '14px', marginBottom: '45px', lineHeight: 1.6, fontWeight: 600 }}>
        <div style={{ fontWeight: 800, marginBottom: '4px', fontSize: '15px' }}>
          {cvData.recipientCompany || "Nom de l'entreprise"}
        </div>
        {cvData.recipientName && <div>{cvData.recipientName}</div>}
        {cvData.recipientAddress && <div>{cvData.recipientAddress}</div>}
        {cvData.recipientCity && <div>{cvData.recipientCity}</div>}
        
        {/* DATE & LOCATION */}
        <div style={{ marginTop: '24px', fontWeight: 600 }}>
          {cvData.dateAndLocation || 'Lieu et date de rédaction'}
        </div>
      </div>

      {/* SUBJECT LINE */}
      <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '40px' }}>
        {cvData.subject || 'Objet de la lettre de motivation'}
      </div>

      {/* SALUTATION */}
      <div style={{ fontSize: '14px', marginBottom: '20px', fontWeight: 700 }}>
        {cvData.salutation || 'Madame, Monsieur,'}
      </div>

      {/* BODY TEXT */}
      <div style={{ fontSize: '13.5px', textAlign: 'justify', flexGrow: 1, whiteSpace: 'pre-wrap', lineHeight: 1.75, fontWeight: 600 }}>
        <div style={{ marginBottom: '24px' }}>
          {cvData.body || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras efficitur tincidunt velit. Etiam rhoncus lacinia mauris, non feugiat mauris. Phasellus porttitor quis lectus quis interdum. Nunc in laoreet velit. Donec vitae mi facilisis, luctus odio eget, consequat elit. Sed tempor sed dui id congue. Praesent eget consequat ex.\n\nProin vel dolor neque. Aenean nunc ante, bibendum a dolor vel, suscipit facilisis libero. Pellentesque congue rhoncus justo eget laoreet. Suspendisse potenti. Fusce id lectus velit. Curabitur pharetra, lorem eu egestas rhoncus, metus lorem pellentesque urna, non gravida lacus felis eu diam.\n\nSed at felis magna. Curabitur mi purus, porttitor eu dui sed, maximus imperdiet mauris. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vivamus blandit vestibulum purus eget lobortis. Morbi sed venenatis elit. Nunc gravida sed turpis at pharetra."}
        </div>
        <div style={{ marginBottom: '40px' }}>
          {cvData.closing || "Dans l'attente d'une réponse de votre part, je vous prie Madame, Monsieur de bien vouloir recevoir mes plus respectueuses salutations."}
        </div>
      </div>

      {/* NAME AT BOTTOM (no signature block, just the name) */}
      <div style={{ marginLeft: 'auto', width: '30%', fontSize: '14px', fontWeight: 700, textAlign: 'left' }}>
        {cvData.fullName || 'Prénom et NOM'}
      </div>
    </div>
  );
}
