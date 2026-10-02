const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const js = fs.readFileSync('src/main.js', 'utf8');

// 1. Check getElementById in JS
const getElemMatches = [...js.matchAll(/getElementById\s*\(\s*["']([^"']+)["']\s*\)/g)].map(m => m[1]);
const uniqueGetElem = [...new Set(getElemMatches)];
const missingInHtml = uniqueGetElem.filter(id => !html.includes(`id="${id}"`) && !html.includes(`id='${id}'`));
console.log('=== Missing IDs in HTML that JS accesses ===');
console.log(missingInHtml);

// 2. Check all href="#..." in HTML
const hrefs = [...html.matchAll(/href=["']#([^"']+)["']/g)].map(m => m[1]);
const uniqueHrefs = [...new Set(hrefs)];
const missingAnchors = uniqueHrefs.filter(h => !html.includes(`id="${h}"`) && !html.includes(`id='${h}'`));
console.log('\n=== Hrefs with no matching id in HTML ===');
console.log(missingAnchors);

// 3. Check for buttons or links in HTML that might do nothing
// (e.g. <button> without onclick, without type="submit" inside a form, without id attached in JS)
const buttonMatches = [...html.matchAll(/<button\b([^>]*)>(.*?)<\/button>/gis)];
console.log(`\n=== Total buttons: ${buttonMatches.length} ===`);
const unhandledButtons = [];
buttonMatches.forEach(b => {
  const attrs = b[1];
  const content = b[2].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ');
  const hasOnclick = /onclick\s*=/i.test(attrs);
  const isSubmit = /type\s*=\s*["']submit["']/i.test(attrs);
  const idMatch = attrs.match(/id\s*=\s*["']([^"']+)["']/i);
  const id = idMatch ? idMatch[1] : null;
  const isHandledInJs = id && (js.includes(`'${id}'`) || js.includes(`"${id}"`));
  const hasClass = attrs.match(/class\s*=\s*["']([^"']+)["']/i);
  const classes = hasClass ? hasClass[1] : '';

  if (!hasOnclick && !isSubmit && !isHandledInJs) {
    unhandledButtons.push({ id, classes, content, full: b[0].slice(0, 120) });
  }
});
console.log('Unhandled Buttons (no onclick, not submit, no ID referenced in JS):', unhandledButtons.length);
unhandledButtons.forEach(b => console.log(`- [${b.id || 'NO_ID'}] class="${b.classes}" : "${b.content}"`));

// 4. Check all portal navs and sections
console.log('\n=== Nav items across portals ===');
const navLanding = [...html.matchAll(/<nav id="navLanding"[\s\S]*?<\/nav>/g)][0];
const navUpstream = [...html.matchAll(/<nav id="navUpstream"[\s\S]*?<\/nav>/g)][0];
const navDownstream = [...html.matchAll(/<nav id="navDownstream"[\s\S]*?<\/nav>/g)][0];
const navBiohub = [...html.matchAll(/<nav id="navBiohub"[\s\S]*?<\/nav>/g)][0];

console.log('Nav Landing links:', navLanding ? [...navLanding[0].matchAll(/href=["']([^"']+)["'][^>]*>(.*?)<\/a>/g)].map(m => `${m[1]} -> ${m[2].trim()}`) : 'none');
console.log('Nav Upstream links:', navUpstream ? [...navUpstream[0].matchAll(/href=["']([^"']+)["'][^>]*>(.*?)<\/a>/g)].map(m => `${m[1]} -> ${m[2].trim()}`) : 'none');
console.log('Nav Downstream links:', navDownstream ? [...navDownstream[0].matchAll(/href=["']([^"']+)["'][^>]*>(.*?)<\/a>/g)].map(m => `${m[1]} -> ${m[2].trim()}`) : 'none');
console.log('Nav Biohub links:', navBiohub ? [...navBiohub[0].matchAll(/href=["']([^"']+)["'][^>]*>(.*?)<\/a>/g)].map(m => `${m[1]} -> ${m[2].trim()}`) : 'none');
