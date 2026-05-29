const fs = require('fs');
const file = 'client/src/components/cv/CVPreview.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove overflow-hidden ONLY from aside and main tags
content = content.replace(/<aside ([^>]*) overflow-hidden([^>]*)>/g, '<aside >');
content = content.replace(/<main ([^>]*) overflow-hidden([^>]*)>/g, '<main >');

// 2. Add break-words to description paragraphs safely
content = content.replace(/<p className="([^"]*)"/g, (match, classes) => {
    if (!classes.includes('break-words')) {
        return '<p className="' + classes + ' break-words"';
    }
    return match;
});

// 3. Keep the leading-[1.35] optimization
content = content.replace(/leading-\[1\.5\]/g, 'leading-[1.35]');

fs.writeFileSync(file, content, 'utf8');
