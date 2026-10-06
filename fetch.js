const https = require('https');
const fs = require('fs');
const icons = {
  amazon: 'https://api.iconify.design/ri/amazon-fill.svg?color=%23ff9900',
  swiggy: 'https://api.iconify.design/simple-icons/swiggy.svg?color=%23fc8019',
  ola: 'https://api.iconify.design/arcticons/ola.svg?color=%23cddc39',
  adobe: 'https://api.iconify.design/logos/adobe-icon.svg',
  coffee: 'https://api.iconify.design/lucide/coffee.svg?color=%23b08d6a'
};
let code = 'import React from "react";\n\nexport const MerchantLogos: Record<string, React.FC<any>> = {';
let pending = Object.keys(icons).length;
Object.keys(icons).forEach(key => {
  https.get(icons[key], res => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', () => {
      let reactSvg = data.replace(/([a-z]+)-([a-z]+)=/g, (match, p1, p2) => p1 + p2[0].toUpperCase() + p2.slice(1) + '=');
      reactSvg = reactSvg.replace('width="1em"', 'width="100%"').replace('height="1em"', 'height="100%"');
      // Fix style="fill:currentColor" if exists
      reactSvg = reactSvg.replace(/style="([^"]*)"/g, "");
      code += '\n  ' + key + ': (props: any) => ' + reactSvg.replace('<svg ', '<svg {...props} ') + ',';
      pending--;
      if (pending === 0) {
        code += '\n};\n';
        fs.writeFileSync('frontend/src/pages/Dashboard/MerchantLogos.tsx', code);
        console.log('Done');
      }
    });
  });
});

