const fs = require('fs');
const path = require('path');

// Copy manifest and background script
fs.copyFileSync(
  path.join(__dirname, '../public/manifest.json'),
  path.join(__dirname, '../out/manifest.json')
);

fs.copyFileSync(
  path.join(__dirname, '../public/background.js'),
  path.join(__dirname, '../out/background.js')
);

// Copy icons
const iconSizes = ['16', '32', '48', '128'];
if (!fs.existsSync(path.join(__dirname, '../out/icons'))) {
  fs.mkdirSync(path.join(__dirname, '../out/icons'));
}

iconSizes.forEach(size => {
  fs.copyFileSync(
    path.join(__dirname, `../public/icons/icon-${size}.png`),
    path.join(__dirname, `../out/icons/icon-${size}.png`)
  );
});

// Update paths in HTML files
const htmlFiles = fs.readdirSync(path.join(__dirname, '../out'))
  .filter(file => file.endsWith('.html'));

htmlFiles.forEach(file => {
  let content = fs.readFileSync(
    path.join(__dirname, '../out', file),
    'utf8'
  );
  
  // Update asset paths
  content = content.replace(/\/_next\//g, './assets/');
  
  fs.writeFileSync(
    path.join(__dirname, '../out', file),
    content
  );
});

console.log('Extension files prepared successfully!');