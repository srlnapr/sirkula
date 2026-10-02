const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

// Find all buttons or links that use showToast with 'belum', 'segera', 'fitur', 'dalam pengembangan', etc.
const toastRegex = /showToast\(['"]([^'"]+)['"]/g;
let m;
const toasts = [];
while ((m = toastRegex.exec(html)) !== null) {
  toasts.push(m[1]);
}

console.log('--- ALL TOASTS IN HTML ---');
toasts.forEach(t => console.log('•', t));

// Find all buttons without onclick
const btnRegex = /<button([^>]*?)>/g;
const deadButtons = [];
while ((m = btnRegex.exec(html)) !== null) {
  const attrs = m[1];
  if (!attrs.includes('onclick') && !attrs.includes('type="submit"') && !attrs.includes('type="button" data-') && !attrs.includes('class="modal-close')) {
    deadButtons.push(m[0]);
  }
}
console.log('\n--- BUTTONS WITHOUT ONCLICK/SUBMIT ---');
console.log(deadButtons.length ? deadButtons : 'None! All buttons have actions.');

// Search for any "belum", "coming soon", "segera hadir", "fitur ini", "placeholder"
const textMatches = [];
const lines = html.split('\n');
lines.forEach((line, idx) => {
  if (/coming soon|segera hadir|tahap pengembangan|dalam pengembangan|fitur ini belum|placeholder/i.test(line)) {
    textMatches.push({ line: idx + 1, text: line.trim() });
  }
});

console.log('\n--- COMING SOON / IN DEVELOPMENT / PLACEHOLDER TEXTS ---');
textMatches.forEach(t => console.log(`Line ${t.line}: ${t.text}`));
