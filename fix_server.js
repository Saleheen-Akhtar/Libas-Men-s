import fs from 'fs';
let content = fs.readFileSync('server.js', 'utf8');
content = content.replace('```json', '\\`\\`\\`json');
content = content.replace('```\n`;', '\\`\\`\\`\n`;');
fs.writeFileSync('server.js', content);
console.log('fixed');
