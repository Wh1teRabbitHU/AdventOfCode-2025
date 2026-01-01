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
    // Part 1: choose 2 digits subsequence maximizing value
    let best2 = 0;
    for (let i = 0; i < line.length; i++) {
      const di = parseInt(line[i], 10);
      if (Number.isNaN(di)) continue;
      for (let j = i + 1; j < line.length; j++) {
        const dj = parseInt(line[j], 10);
        if (Number.isNaN(dj)) continue;
        const val = di * 10 + dj;
        if (val > best2) best2 = val;
      }
    }
    total += best2;
  }

  // Part 2: choose 12 digits subsequence maximizing value
  const k = 12;
  let total2 = 0n;
  for (const line of lines) {
    const n = line.length;
    if (n < k) {
      total2 += BigInt(0);
      continue;
    }

    let start = 0;
    let chosen = '';
    for (let pick = 0; pick < k; pick++) {
      // we must choose a digit from [start, n - (k - pick)] inclusive
      const maxIndex = n - (k - pick);
      let bestDigit = -1;
      let bestPos = start;
      for (let p = start; p <= maxIndex; p++) {
        const d = line.charCodeAt(p) - 48;
        if (d > bestDigit) {
          bestDigit = d;
          bestPos = p;
          if (bestDigit === 9) break;
        }
      }
      chosen += String.fromCharCode(48 + bestDigit);
      start = bestPos + 1;
    }

    // convert chosen 12-digit string to bigint and add
    total2 += BigInt(chosen);
  }

  console.log(`Day 03 — Part 1: ${total}`);
  console.log(`Day 03 — Part 2: ${total2.toString()}`);
};

export default { solve };

if (require.main === module) solve();
