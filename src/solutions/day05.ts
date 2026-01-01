import fs from 'fs';
import path from 'path';

const solve = (inputArg?: string) => {
  let raw: string;
  if (typeof inputArg === 'string') {
    raw = inputArg;
  } else if (!process.stdin.isTTY) {
    raw = fs.readFileSync(0, 'utf8');
  } else {
    const inputPath = path.join(__dirname, '../inputs/day05.txt');
    try {
      raw = fs.readFileSync(inputPath, 'utf8');
    } catch (e) {
      raw = '';
    }
  }

  const input = raw;
  if (!input.trim()) {
    console.log('Day 05 — Part 1: 0');
    return;
  }

  const lines = input.split(/\r?\n/);
  const blankIdx = lines.findIndex(l => l.trim() === '');
  const rangeLines = blankIdx === -1 ? lines : lines.slice(0, blankIdx);
  const idLines = blankIdx === -1 ? [] : lines.slice(blankIdx + 1);

  const ranges: Array<[number, number]> = rangeLines
    .map(l => l.trim())
    .filter(Boolean)
    .map(l => {
      const [a, b] = l.split('-').map(s => Number(s.trim()));
      return [a, b] as [number, number];
    });

  let freshCount = 0;
  for (const line of idLines) {
    const s = line.trim();
    if (!s) continue;
    const id = Number(s);
    let isFresh = false;
    for (const [lo, hi] of ranges) {
      if (id >= lo && id <= hi) {
        isFresh = true;
        break;
      }
    }
    if (isFresh) freshCount++;
  }

  console.log(`Day 05 — Part 1: ${freshCount}`);
};

export default { solve };

if (require.main === module) solve();
