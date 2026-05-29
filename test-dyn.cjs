const fs = require('fs');
const file = 'client/src/components/cv/CVPreview.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/\bline-clamp-\d+\b/g, '');
content = content.replace(/\btruncate\b/g, '');
content = content.replace(/\bellipsis\b/g, '');

// Clean up extra spaces inside className strings, without touching indentation!
// We can do this by matching className="..." and replacing multiple spaces inside it.
content = content.replace(/className=\"([^\"]+)\"/g, (match, p1) => {
    return 'className=\"' + p1.replace(/\s+/g, ' ').trim() + '\"';
});

fs.writeFileSync(file, content, 'utf8');
