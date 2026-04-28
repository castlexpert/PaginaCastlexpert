import sharp from 'sharp';

const W = 1200;
const H = 630;

const bgSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#081225"/>
      <stop offset="0.55" stop-color="#0b2b57"/>
      <stop offset="1" stop-color="#160a2b"/>
    </linearGradient>
    <radialGradient id="r" cx="30%" cy="25%" r="70%">
      <stop offset="0" stop-color="#22d3ee" stop-opacity="0.40"/>
      <stop offset="1" stop-color="#22d3ee" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <circle cx="340" cy="180" r="420" fill="url(#r)"/>
  <circle cx="980" cy="520" r="520" fill="rgba(168,85,247,0.18)"/>
</svg>
`.trim();

const textSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <style>
    .t1{font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial; font-weight: 800; font-size: 86px; fill: #ffffff;}
    .t2{font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial; font-weight: 500; font-size: 34px; fill: rgba(255,255,255,0.82);}
    .chip{fill: rgba(255,255,255,0.10); stroke: rgba(34,211,238,0.55); stroke-width: 2;}
    .chipText{font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial; font-weight: 700; font-size: 22px; letter-spacing: 2px; fill: rgba(255,255,255,0.9);}
  </style>
  <rect x="92" y="92" rx="24" ry="24" width="240" height="54" class="chip"/>
  <text x="122" y="129" class="chipText">CASTLEXPERT</text>
  <text x="92" y="260" class="t1">CastleXpert</text>
  <text x="92" y="318" class="t2">Apps y sistemas a medida para tu negocio</text>
  <text x="92" y="366" class="t2">Custom apps and systems for your business</text>
</svg>
`.trim();

const logo = await sharp('public/castlexpert-logo.png').resize(150, 150, { fit: 'contain' }).png().toBuffer();

await sharp(Buffer.from(bgSvg))
  .composite([
    { input: logo, left: 92, top: 420 },
    { input: Buffer.from(textSvg), left: 0, top: 0 },
  ])
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toFile('public/og-image.png');

console.log('Wrote public/og-image.png');

