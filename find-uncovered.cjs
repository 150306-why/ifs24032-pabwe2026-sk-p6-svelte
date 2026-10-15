// Jalankan setelah: npx vitest run --coverage
// Perintah: node find-uncovered.cjs
const fs = require("fs");
const data = JSON.parse(fs.readFileSync("coverage/coverage-final.json", "utf8"));
let found = false;
for (const [file, cov] of Object.entries(data)) {
  for (const [id, count] of Object.entries(cov.s)) {
    if (count === 0) {
      const { start, end } = cov.statementMap[id];
      console.log(`${file}  baris ${start.line}:${start.column} -> ${end.line}:${end.column}`);
      found = true;
    }
  }
}
if (!found) console.log("Semua statement tercover.");
