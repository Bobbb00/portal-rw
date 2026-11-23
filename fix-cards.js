const fs = require('fs');
const files = [
  'src/components/cards/ActivityCard.tsx',
  'src/components/cards/AnnouncementCard.tsx',
  'src/components/cards/BusinessCard.tsx',
  'src/components/cards/DocumentCard.tsx',
  'src/components/cards/FacilityCard.tsx',
  'src/components/cards/GameCard.tsx',
  'src/components/cards/ServiceCard.tsx'
];
files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/className="ct[0-9]+ ?(card|card-padded)(.*?)\s+bg-\(--color-rw-primary-pale\)(.*?)"/gm, 'className="$1$4$5"');
    fs.writeFileSync(file, content);
    console.log('Processed ' + file);
  }
});