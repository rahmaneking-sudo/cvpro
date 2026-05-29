const fs = require('fs');
const file = 'client/src/components/cv/CVPreview.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. LayoutTwoColumn tweaks
content = content.replace(
  'w-[238px] min-w-[238px] max-w-[238px] shrink-0 p-5 flex flex-col overflow-hidden',
  'w-[238px] min-w-[238px] max-w-[238px] shrink-0 px-4 py-5 flex flex-col overflow-hidden'
);
content = content.replace(
  'flex-1 w-[556px] min-w-[556px] max-w-[556px] p-6 flex flex-col gap-5 overflow-hidden',
  'flex-1 w-[556px] min-w-[556px] max-w-[556px] px-5 py-4 flex flex-col gap-4 overflow-hidden'
);
content = content.replace(
  '<header className="mb-6">\n  <h1 className="text-3xl font-bold tracking-tight mb-2"',
  '<header className="mb-4">\n  <h1 className="text-3xl font-bold tracking-tight mb-2"'
);
content = content.replace(
  '<section className="mb-6">\n  <h3 className="text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-3"',
  '<section className="mb-4">\n  <h3 className="text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-3"'
);
content = content.replace(
  'Expériences\n  <div className="flex-1 h-[1px]" style={{ background: dividerColor }} />\n  </h3>\n  <div className="space-y-3">',
  'Expériences\n  <div className="flex-1 h-[1px]" style={{ background: dividerColor }} />\n  </h3>\n  <div className="space-y-4">'
);
content = content.replace(
  '{/* Formation */}\n  {educations?.length > 0 && (\n  <section>',
  '{/* Formation */}\n  {educations?.length > 0 && (\n  <section className="mt-3">'
);

// 2. Make descriptions bolder (font-medium)
// In LayoutTwoColumn:
content = content.replace(
  /<p className="text-\[11px\] leading-\[1\.5\] " style=\{\{ color: mutedColor \}\}>\{exp\.description\}<\/p>/g,
  '<p className="text-[11px] leading-[1.5] font-medium" style={{ color: mutedColor }}>{exp.description}</p>'
);
content = content.replace(
  /<p className="text-\[11px\] leading-\[1\.5\] " style=\{\{ color: mutedColor \}\}>\{edu\.description\}<\/p>/g,
  '<p className="text-[11px] leading-[1.5] font-medium" style={{ color: mutedColor }}>{edu.description}</p>'
);
content = content.replace(
  /<p className="text-\[11px\] leading-\[1\.5\] " style=\{\{ color: mutedColor \}\}>\{cvData\.summary\}<\/p>/g,
  '<p className="text-[11px] leading-[1.5] font-medium" style={{ color: mutedColor }}>{cvData.summary}</p>'
);

// General tweaks for all layouts just to improve readability:
content = content.replace(
  /<p className="text-\[11px\] leading-\[1\.5\] text-justify " style=\{\{ color: mutedColor \}\}>/g,
  '<p className="text-[11px] leading-[1.5] text-justify font-medium" style={{ color: mutedColor }}>'
);
content = content.replace(
  /<p className="text-\[11px\] leading-\[1\.5\] mt-1" style=\{\{ color: mutedColor \}\}>/g,
  '<p className="text-[11px] leading-[1.5] mt-1 font-medium" style={{ color: mutedColor }}>'
);


fs.writeFileSync(file, content, 'utf8');
