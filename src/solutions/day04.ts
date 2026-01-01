import fs from 'fs';
import path from 'path';

const solve = (inputArg?: string) => {
  let raw: string;
  if (typeof inputArg === 'string') {
    raw = inputArg;
  } else if (!process.stdin.isTTY) {
    raw = fs.readFileSync(0, 'utf8');
  } else {
    const inputPath = path.join(__dirname, '../inputs/day04.txt');
    try {
      raw = fs.readFileSync(inputPath, 'utf8');
    } catch (e) {
      raw = '';
    }
  }

  const input = raw.trim();
  if (!input) {
    console.log('Day 04 — Part 1: 0');
    return;
  }

  const lines = input.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const grid = lines.map(l => l.split(''));
  const rows = grid.length;
  const cols = rows > 0 ? grid[0].length : 0;

  const neigh = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], /*self*/ [0, 1],
    [1, -1], [1, 0], [1, 1],
  ];

  let accessible = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] !== '@') continue;
      let cnt = 0;
      for (const [dr, dc] of neigh) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
        if (grid[nr][nc] === '@') cnt++;
      }
      if (cnt < 4) accessible++;
    }
  }

  console.log(`Day 04 — Part 1: ${accessible}`);
};

export default { solve };

if (require.main === module) solve();
