import fs from 'fs';
import path from 'path';

const solve = (inputArg?: string) => {
  let raw: string;
  if (typeof inputArg === 'string') raw = inputArg;
  else if (!process.stdin.isTTY) raw = fs.readFileSync(0, 'utf8');
  else raw = fs.readFileSync(path.join(__dirname, '../inputs/day12.txt'), 'utf8');
  const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) {
    console.log('Day 12 — Part 1: 0');
    return;
  }

  // Find first region line (has format WxH: ...)
  let regionsStart = lines.findIndex(l => /^\d+x\d+:/.test(l));
  if (regionsStart === -1) regionsStart = lines.length;

  // Parse shapes
  const shapes: string[][] = [];
  for (let i = 0; i < regionsStart; i++) {
    const line = lines[i];
    const m = line.match(/^(\d+):$/);
    if (m) {
      // next lines are the shape rows; shapes in input use 3 rows
      const r1 = lines[++i] ?? '';
      const r2 = lines[++i] ?? '';
      const r3 = lines[++i] ?? '';
      shapes.push([r1, r2, r3]);
    }
  }

  const areas = shapes.map(s => s.reduce((acc, r) => acc + (r.match(/#/g) || []).length, 0));

  // Parse regions and count how many can fit by area check
  let fitCount = 0;
  for (let i = regionsStart; i < lines.length; i++) {
    const line = lines[i];
    const m = line.match(/^(\d+)x(\d+):\s*(.*)$/);
    if (!m) continue;
    const w = parseInt(m[1], 10);
    const h = parseInt(m[2], 10);
    const counts = m[3].split(/\s+/).map(x => parseInt(x, 10)).filter(n => !Number.isNaN(n));
    let total = 0;
    for (let j = 0; j < counts.length && j < areas.length; j++) total += counts[j] * areas[j];
    if (total <= w * h) fitCount++;
  }

  console.log(`Day 12 — Part 1: ${fitCount}`);
};

export default { solve };

if (require.main === module) solve();
