const fs = require('fs');
const file = 'client/src/components/cv/CVPreview.jsx';
let content = fs.readFileSync(file, 'utf8');

const target1 =   return (
    <div className="flex items-center gap-2 text-[11px]" style={{ color }}>
      <Icon size={12} style={{ opacity: 0.7 }} />
      <span>{value}</span>
    </div>
  );;

const replacement1 =   return (
    <div className="flex items-start gap-2 text-[11px] leading-[1.4]" style={{ color }}>
      <Icon size={12} className="shrink-0 mt-[1.5px]" style={{ opacity: 0.7 }} />
      <span className="break-words flex-1">{value}</span>
    </div>
  );;

content = content.replace(target1, replacement1);

const target2 =                   <div className="h-[2px] w-full rounded-full" style={{ background: \\40\ }}>
                    <div className="h-full rounded-full" style={{ width: '75%', background: accent }} />
                  </div>;

const replacement2 =                   <div className="flex gap-[2px] mt-1.5">
                    {[1, 2, 3, 4, 5].map(level => (
                      <div key={level} className="h-[3px] flex-1 rounded-sm transition-all" style={{ background: accent, opacity: level <= 4 ? 1 : 0.2 }} />
                    ))}
                  </div>;

content = content.replace(target2, replacement2);

fs.writeFileSync(file, content, 'utf8');
