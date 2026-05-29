const fs = require('fs');
const file = 'client/src/components/cv/CVPreview.jsx';
let content = fs.readFileSync(file, 'utf8');

// Change leading-[1.5] to leading-[1.3] for descriptions to save vertical space!
content = content.replace(/leading-\[1\.5\]/g, 'leading-[1.35]');

fs.writeFileSync(file, content, 'utf8');
