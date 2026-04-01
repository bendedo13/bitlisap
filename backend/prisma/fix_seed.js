const fs = require('fs');
const path = require('path');
const seedPath = path.join(__dirname, 'seed.ts');
const lines = fs.readFileSync(seedPath, 'utf8').split('\n');
console.log('Total lines:', lines.length);
const truncated = lines.slice(0, 780).join('\n');
fs.writeFileSync(seedPath, truncated, 'utf8');
console.log('Truncated to 780 lines successfully.');
