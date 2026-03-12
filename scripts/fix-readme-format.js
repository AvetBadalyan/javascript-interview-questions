const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "..", "README.md");
let src = fs.readFileSync(file, "utf8");
let changes = 0;

// 1) Move numeric prefix before '###' to after the hashes: "123.  ### Title" -> "### 123. Title"
src = src.replace(
	/^([ \t]*)(\d+)\.\s+###\s*(.*)$/gm,
	(m, indent, num, rest) => {
		changes++;
		return `${indent}### ${num}. ${rest}`;
	},
);

// 2) Convert numbered list items that look like short descriptive items into bullets.
// e.g. "1.  **push:** ..."  -> "- **push:** ..."
src = src.replace(/^([ \t]*)\d+\.\s{2,}\*\*(.*)$/gm, (m, indent, rest) => {
	changes++;
	return `${indent}- **${rest}`;
});

// 3) Convert short numbered items beginning with capital letter into bullets.
// e.g. "5.  Mutating methods: ..." -> "- Mutating methods: ..."
src = src.replace(/^([ \t]*)\d+\.\s{2,}([A-Z][^\n]*)$/gm, (m, indent, rest) => {
	changes++;
	return `${indent}- ${rest}`;
});

fs.writeFileSync(file, src, "utf8");
console.log("fix-readme-format: applied", changes, "transformations");
