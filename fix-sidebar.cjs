const fs = require('fs');
const file = 'client/src/components/cv/CVPreview.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Reduce Expertise gap from space-y-2 to space-y-1
content = content.replace(/<ul className="space-y-2">\s*\{cvData\.skills/g, '<ul className="space-y-1">\n              {cvData.skills');

// 2. Reduce Expertise text margin from mb-1 to mb-0.5 and font to text-[10px]
content = content.replace(/<span className="text-\[11px\] font-medium block mb-1"/g, '<span className="text-[10px] font-medium block mb-0.5"');

// 3. Remove mt-8 from Langues section in aside
content = content.replace(/\{cvData\.languages\?\.length > 0 && \(\s*<section className="mt-8">\s*<h3 className="text-\[11px\] font-bold uppercase tracking-widest mb-2\.5" style=\{\{ color: accent \}\}>Langues<\/h3>/g, '{cvData.languages?.length > 0 && (\n          <section className="mt-3">\n            <h3 className="text-[11px] font-bold uppercase tracking-widest mb-2.5" style={{ color: accent }}>Langues</h3>');

fs.writeFileSync(file, content, 'utf8');
