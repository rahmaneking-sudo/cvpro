const fs = require('fs');
const file = 'client/src/components/cv/CVPreview.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Fix ContactItem alignment
content = content.replace(
  /<div className="flex items-center gap-2 text-\[11px\]" style=\{\{ color \}\}>\s*<Icon size=\{12\} className="shrink-0" \/>/g,
  '<div className="flex items-start gap-2 text-[11px] leading-[1.4]" style={{ color }}>\n      <Icon size={12} className="shrink-0 mt-[1.5px]" />'
);

// 2. Decorate skill bars in LayoutTwoColumn
// Replace the old continuous bar with a segmented premium bar and more margin
content = content.replace(
  /<div className="h-\[2px\] w-full rounded-full" style=\{\{ background: \\\\$\\\{accent\\\}.*?\}\}>\s*<div className="h-full rounded-full" style=\{\{ width: '75%', background: accent \}\} \/>\s*<\/div>/g,
  '<div className="flex gap-[2px] mt-1.5">\n                    {[1, 2, 3, 4, 5].map(level => (\n                      <div key={level} className="h-[3px] flex-1 rounded-sm transition-all" style={{ background: accent, opacity: level <= 4 ? 1 : 0.2 }} />\n                    ))}\n                  </div>'
);

fs.writeFileSync(file, content, 'utf8');
