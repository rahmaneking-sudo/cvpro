const fs = require('fs');
const file = 'client/src/components/cv/CVPreview.jsx';
let lines = fs.readFileSync(file, 'utf8').split('\n');

let inLayoutTwoColumn = false;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('function LayoutTwoColumn')) {
    inLayoutTwoColumn = true;
  }
  if (inLayoutTwoColumn && lines[i].includes('function LayoutGrid')) {
    inLayoutTwoColumn = false;
  }

  if (inLayoutTwoColumn) {
    if (lines[i].includes('<header className="mb-6">')) {
      lines[i] = lines[i].replace('mb-6', 'mb-2');
    }
    if (lines[i].includes('className="space-y-4"')) {
      lines[i] = lines[i].replace('space-y-4', 'space-y-6');
    }
    // Also, initially it was space-y-3. Let's cover that just in case it wasn't matched!
    if (lines[i].includes('className="space-y-3"')) {
      lines[i] = lines[i].replace('space-y-3', 'space-y-6');
    }
    if (lines[i].includes('<section>')) {
      // In LayoutTwoColumn Formation section was originally just <section>
      lines[i] = lines[i].replace('<section>', '<section className="mt-8">');
    }
    if (lines[i].includes('<section className="mt-3">')) {
      lines[i] = lines[i].replace('mt-3', 'mt-8');
    }
  }
}

fs.writeFileSync(file, lines.join('\n'), 'utf8');
