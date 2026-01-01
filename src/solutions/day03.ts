import fs from 'fs';
import path from 'path';

const solve = (inputArg?: string) => {
  let raw: string;
  if (typeof inputArg === 'string') {
    raw = inputArg;
  } else if (!process.stdin.isTTY) {
    raw = fs.readFileSync(0, 'utf8');
  } else {
    const inputPath = path.join(__dirname, '../inputs/day03.txt');
    try {
      raw = fs.readFileSync(inputPath, 'utf8');
    } catch (e) {
      raw = '';
    }
  }

  const input = raw.trim();
  if (!input) {
    console.log('Day 03 — Part 1: 0');
    return;
  }

  const lines = input.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  let total = 0;

  for (const line of lines) {
    let best = 0;
    for (let i = 0; i < line.length; i++) {
      const di = parseInt(line[i], 10);
      if (Number.isNaN(di)) continue;
      for (let j = i + 1; j < line.length; j++) {
        const dj = parseInt(line[j], 10);
        if (Number.isNaN(dj)) continue;
        const val = di * 10 + dj;
        if (val > best) best = val;
      }
    }
    total += best;
  }

  console.log(`Day 03 — Part 1: ${total}`);
};

export default { solve };

if (require.main === module) solve();
