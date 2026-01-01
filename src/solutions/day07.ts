import fs from 'fs';
import path from 'path';

const solve = (inputArg?: string) => {
  let raw: string;
  if (typeof inputArg === 'string') {
    raw = inputArg;
  } else if (!process.stdin.isTTY) {
    raw = fs.readFileSync(0, 'utf8');
  } else {
    const inputPath = path.join(__dirname, '../inputs/day07.txt');
    try {
      raw = fs.readFileSync(inputPath, 'utf8');
    } catch (e) {
      raw = '';
    }
  }

  if (!raw || !raw.trim()) {
    console.log('Day 07 — Part 1: 0');
    return;
  }

  const lines = raw.split(/\r?\n/).filter(l => l.length > 0);
  const rows = lines.length;
  const cols = Math.max(...lines.map(l => l.length));
  const grid: string[][] = lines.map(l => l.split('').concat(Array(cols - l.length).fill('.')));

  // find S
  let startR = -1;
  let startC = -1;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 'S') {
        startR = r;
        startC = c;
        break;
      }
    }
    if (startR !== -1) break;
  }

  if (startR === -1) {
    console.log('Day 07 — Part 1: 0');
    return;
  }

  let splitCount = 0;
  let current = new Set<string>();
  current.add(`${startR},${startC}`);

  while (current.size > 0) {
    const next = new Set<string>();
    for (const key of current) {
      const [rStr, cStr] = key.split(',');
      const r = Number(rStr);
      const c = Number(cStr);
      const tr = r + 1;
      if (tr >= rows) continue; // beam exits
      const cell = grid[tr][c] || '.';
      if (cell === '^') {
        splitCount += 1;
        const lc = c - 1;
        const rc = c + 1;
        if (lc >= 0) next.add(`${tr},${lc}`);
        if (rc < cols) next.add(`${tr},${rc}`);
      } else {
        next.add(`${tr},${c}`);
      }
    }
    current = next;
  }

  console.log(`Day 07 — Part 1: ${splitCount}`);
};

export default { solve };

if (require.main === module) solve();
