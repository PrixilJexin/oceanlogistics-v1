const fs = require('fs');
const path = require('path');

const files = [
  { src: 'C:/Users/prisi/.gemini/antigravity-ide/brain/7f31f85e-9142-4c90-97da-9a962998dd84/product_charcoal_1783774803549.png', dest: './assets/images/product-charcoal.png' },
  { src: 'C:/Users/prisi/.gemini/antigravity-ide/brain/7f31f85e-9142-4c90-97da-9a962998dd84/product_coke_1783774815195.png', dest: './assets/images/product-coke.png' },
  { src: 'C:/Users/prisi/.gemini/antigravity-ide/brain/7f31f85e-9142-4c90-97da-9a962998dd84/product_firewood_1783774827547.png', dest: './assets/images/product-firewood.png' },
  { src: 'C:/Users/prisi/.gemini/antigravity-ide/brain/7f31f85e-9142-4c90-97da-9a962998dd84/product_salt_1783774840536.png', dest: './assets/images/product-salt.png' },
  { src: 'C:/Users/prisi/.gemini/antigravity-ide/brain/7f31f85e-9142-4c90-97da-9a962998dd84/about_coal_1783774854258.png', dest: './assets/images/about-coal.png' }
];

files.forEach(f => {
  try {
    if (!fs.existsSync(f.src)) {
      console.error(`Source file does not exist: ${f.src}`);
      return;
    }
    fs.copyFileSync(f.src, f.dest);
    console.log(`Successfully copied to ${f.dest}`);
  } catch (err) {
    console.error(`Error copying ${f.src} to ${f.dest}:`, err.message);
  }
});
