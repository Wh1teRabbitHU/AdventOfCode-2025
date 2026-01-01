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

  // Part 2: count total unique IDs covered by the ranges
  if (ranges.length === 0) {
    console.log('Day 05 — Part 2: 0');
    return;
  }

  const sorted = ranges.slice().sort((a, b) => a[0] - b[0]);
  let totalUnique = 0;
  let curLo = sorted[0][0];
  let curHi = sorted[0][1];
  for (let i = 1; i < sorted.length; i++) {
    const [lo, hi] = sorted[i];
    if (lo <= curHi) {
      // overlapping or touching at same endpoint
      if (hi > curHi) curHi = hi;
    } else {
      totalUnique += curHi - curLo + 1;
      curLo = lo;
      curHi = hi;
    }
  }
  totalUnique += curHi - curLo + 1;

  console.log(`Day 05 — Part 2: ${totalUnique}`);
};

export default { solve };

if (require.main === module) solve();
