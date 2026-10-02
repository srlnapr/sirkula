const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const js = fs.readFileSync('src/main.js', 'utf8');

// 1. Extract all element IDs in index.html
const idRegex = /id=["']([^"']+)["']/g;
const allIds = new Set();
let match;
while ((match = idRegex.exec(html)) !== null) {
  allIds.add(match[1]);
}

// 2. Extract all href="#..."
const hrefRegex = /href=["']#([a-zA-Z0-9_-]+)["']/g;
const missingHref = [];
while ((match = hrefRegex.exec(html)) !== null) {
  const target = match[1];
  if (target && !allIds.has(target)) {
    missingHref.push(target);
  }
}

// 3. Extract all navigateToSection('...') and scrollToElement('...')
const navRegex = /(?:navigateToSection|scrollToElement)\(['"]([^'"]+)['"]\)/g;
const missingNav = [];
while ((match = navRegex.exec(html)) !== null) {
  const target = match[1];
  if (!allIds.has(target)) {
    missingNav.push(target);
  }
}
while ((match = navRegex.exec(js)) !== null) {
  const target = match[1];
  if (!allIds.has(target)) {
    missingNav.push(target);
  }
}

// 4. Extract all onclick/onsubmit functions
const fnRegex = /(?:onclick|onsubmit)=["']([a-zA-Z0-9_]+)\(/g;
const calledFns = new Set();
while ((match = fnRegex.exec(html)) !== null) {
  calledFns.add(match[1]);
}

// Check if these functions exist in js
const missingFns = [];
for (const fn of calledFns) {
  if (!js.includes('window.' + fn) && !js.includes('function ' + fn)) {
    missingFns.push(fn);
  }
}

// 5. Check linksByRole in src/main.js
const linksByRoleMatch = js.match(/const linksByRole = \{([\s\S]*?)\n  \};/);
let missingDrawerTargets = [];
if (linksByRoleMatch) {
  const code = linksByRoleMatch[1];
  const idMatches = code.matchAll(/id:\s*['"]([^'"]+)['"]/g);
  for (const m of idMatches) {
    if (!allIds.has(m[1])) {
      missingDrawerTargets.push(m[1]);
    }
  }
  const scrollMatches = code.matchAll(/scroll:\s*['"]([^'"]+)['"]/g);
  for (const m of scrollMatches) {
    if (!allIds.has(m[1])) {
      missingDrawerTargets.push(m[1]);
    }
  }
}

console.log('=== AUDIT REPORT ===');
console.log('1. Missing href targets (#...):', [...new Set(missingHref)]);
console.log('2. Missing navigateToSection/scrollToElement targets:', [...new Set(missingNav)]);
console.log('3. Missing mobile drawer target IDs:', [...new Set(missingDrawerTargets)]);
console.log('4. Missing functions called in onclick/onsubmit:', missingFns);
