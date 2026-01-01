import fs from 'fs';
import path from 'path';

const solve = (inputArg?: string) => {
  let raw: string;
  if (typeof inputArg === 'string') {
    raw = inputArg;
  } else if (!process.stdin.isTTY) {
    raw = fs.readFileSync(0, 'utf8');
  } else {
    const inputPath = path.join(__dirname, '../inputs/day09.txt');
    try {
      raw = fs.readFileSync(inputPath, 'utf8');
    } catch (e) {
      raw = '';
    }
  }

  if (!raw || !raw.trim()) {
    console.log('Day 09 — Part 1: 0');
    console.log('Day 09 — Part 2: 0');
    return;
  }

  const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const pts: number[][] = lines.map(l => l.split(',').map(s => Number(s)));
  const n = pts.length;

  let maxArea = 0;
  for (let i = 0; i < n; i++) {
    const [xi, yi] = pts[i];
    for (let j = i + 1; j < n; j++) {
      const [xj, yj] = pts[j];
      if (xi === xj || yi === yj) continue; // need diagonal corners
      const w = Math.abs(xi - xj) + 1;
      const h = Math.abs(yi - yj) + 1;
      const area = w * h;
      if (area > maxArea) maxArea = area;
    }
  }

  console.log(`Day 09 — Part 1: ${maxArea}`);
  console.log(`Day 09 — Part 2: 0`);
};

export default { solve };

if (require.main === module) solve();
