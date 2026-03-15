const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'README.md');
const data = fs.readFileSync(file, 'utf8');
const startMarker = '<!-- QUESTIONS_START -->';
const endMarker = '<!-- QUESTIONS_END -->';
const start = data.indexOf(startMarker);
const end = data.indexOf(endMarker, start + startMarker.length);
if (start === -1 || end === -1) {
  console.error('Markers not found');
  process.exit(2);
}
const region = data.slice(start + startMarker.length, end);
const lines = region.split(/\r?\n/);
const headingRe = /^\s*(\d+)\.\s+###\s*(.*)$/;
let expected = 1;
let errors = [];
let entries = [];
for (let i = 0; i < lines.length; i++) {
  const m = lines[i].match(headingRe);
  if (m) {
    const num = parseInt(m[1], 10);
    const title = m[2].trim();
    entries.push({num, title, line: i + 1});
    if (num !== expected) {
      errors.push({expected, found: num, title, line: i + 1});
      expected = num + 1;
    } else {
      expected += 1;
    }
  }
}
if (errors.length === 0) {
  console.log('OK: All headings sequential from 1 to', expected - 1);
  process.exit(0);
} else {
  console.log('FOUND mismatches:');
  errors.forEach(e => {
    console.log(`Line ${e.line}: expected ${e.expected} but found ${e.found} — ${e.title}`);
  });
  console.log('\nTotal headings found:', entries.length);
  process.exit(1);
}
