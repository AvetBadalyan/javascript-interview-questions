const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "..", "README.md");
const src = fs.readFileSync(file, "utf8");
const endIdx = src.indexOf("<!-- QUESTIONS_END -->");
const scan = endIdx === -1 ? src : src.slice(0, endIdx);
const lines = scan.split(/\r?\n/);

const headingRe = /^\s*###\s*(\d+)\.\s*(.*)$/;
let expected = 1;
let mismatches = [];
let count = 0;

for (let i = 0; i < lines.length; i++) {
	const m = lines[i].match(headingRe);
	if (m) {
		const num = Number(m[1]);
		count++;
		if (num !== expected) {
			mismatches.push({ line: i + 1, found: num, expected });
			expected = num + 1;
		} else {
			expected++;
		}
	}
}

if (mismatches.length === 0) {
	console.log(`OK: ${count} headings sequential from 1 to ${count}.`);
	process.exit(0);
} else {
	console.log(`FOUND ${mismatches.length} mismatches:`);
	mismatches
		.slice(0, 20)
		.forEach(m =>
			console.log(`line ${m.line}: found ${m.found}, expected ${m.expected}`),
		);
	process.exit(2);
}
