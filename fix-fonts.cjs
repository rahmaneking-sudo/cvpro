const fs = require('fs');
const file = 'client/src/components/cv/CVPreview.jsx';
let content = fs.readFileSync(file, 'utf8');

// Ensure all descriptions are font-medium for readability
content = content.replace(/<p className="text-\[11px\] leading-\[1\.5\]" style=\{\{ color: mutedColor \}\}>\{exp\.description\}<\/p>/g, '<p className="text-[11px] leading-[1.4] font-medium break-words" style={{ color: mutedColor }}>{exp.description}</p>');
content = content.replace(/<p className="text-\[11px\] leading-\[1\.5\]" style=\{\{ color: mutedColor \}\}>\{edu\.description\}<\/p>/g, '<p className="text-[11px] leading-[1.4] font-medium break-words" style={{ color: mutedColor }}>{edu.description}</p>');

fs.writeFileSync(file, content, 'utf8');
