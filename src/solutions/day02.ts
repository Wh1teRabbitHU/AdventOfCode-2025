import fs from 'fs';
import path from 'path';

const pow10 = (n: number) => BigInt(10) ** BigInt(n);

const solve = (inputArg?: string) => {
  let raw: string;
  if (typeof inputArg === 'string') {
    raw = inputArg;
  } else if (!process.stdin.isTTY) {
    raw = fs.readFileSync(0, 'utf8');
  } else {
    const inputPath = path.join(__dirname, '../inputs/day02.txt');
    try {
      raw = fs.readFileSync(inputPath, 'utf8');
    } catch (e) {
      raw = '';
    }
  }
  const input = raw.trim();
  if (!input) {
    console.log('Day 02 — Part 1: 0');
    return;
  }

  const ranges = input.split(/[,\n]+/).map(s => s.trim()).filter(Boolean).map(r => {
    const [a, b] = r.split('-');
    return { a: BigInt(a), b: BigInt(b) };
  });

  let total = BigInt(0);

  // Determine maximum length of numbers we need to consider
  let maxDigits = 0;
  for (const { b } of ranges) {
    const len = b.toString().length;
    if (len > maxDigits) maxDigits = len;
  }

  const maxHalf = Math.floor(maxDigits / 2);

  for (const { a, b } of ranges) {
    for (let h = 1; h <= maxHalf; h++) {
      const m = pow10(h) + BigInt(1); // number = first * m
      const minFirst = pow10(h - 1);
      const maxFirst = pow10(h) - BigInt(1);

      // ceil division: (a + m - 1) / m
      const startFirst = a <= BigInt(0) ? minFirst : ((a + m - BigInt(1)) / m) > minFirst ? ((a + m - BigInt(1)) / m) : minFirst;
      const endFirst = (b / m) < maxFirst ? (b / m) : maxFirst;

      if (startFirst > endFirst) continue;

      for (let f = startFirst; f <= endFirst; f++) {
        const num = f * m;
        if (num >= a && num <= b) total += num;
      }
    }
  }

  console.log(`Day 02 — Part 1: ${total.toString()}`);
};

export default { solve };

if (require.main === module) solve();
