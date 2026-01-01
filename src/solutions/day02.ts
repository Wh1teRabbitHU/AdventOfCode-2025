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

  // Determine maximum length of numbers we need to consider
  let maxDigits = 0;
  for (const { b } of ranges) {
    const len = b.toString().length;
    if (len > maxDigits) maxDigits = len;
  }

  const maxHalf = Math.floor(maxDigits / 2);

  const sumRange = (lo: bigint, hi: bigint) => {
    if (lo > hi) return BigInt(0);
    const cnt = hi - lo + BigInt(1);
    return (cnt * (lo + hi)) / BigInt(2);
  };

  // Part 1: sequence repeated exactly twice
  let part1 = BigInt(0);
  for (let p = 1; p <= maxHalf; p++) {
    const M = pow10(p) + BigInt(1); // multiplier for two repeats
    const firstMin = pow10(p - 1);
    const firstMax = pow10(p) - BigInt(1);

    for (const { a, b } of ranges) {
      const startFirst = ((a + M - BigInt(1)) / M) > firstMin ? ((a + M - BigInt(1)) / M) : firstMin;
      const endFirst = (b / M) < firstMax ? (b / M) : firstMax;
      if (startFirst > endFirst) continue;
      const sumF = sumRange(startFirst, endFirst);
      part1 += M * sumF;
    }
  }

  // Part 2: sequence repeated at least twice (count each invalid ID once)
  let part2 = BigInt(0);

  const isPrimitive = (s: string) => {
    const n = s.length;
    for (let d = 1; d <= Math.floor(n / 2); d++) {
      if (n % d !== 0) continue;
      const sub = s.slice(0, d);
      if (sub.repeat(n / d) === s) return false;
    }
    return true;
  };

  for (let p = 1; p <= maxHalf; p++) {
    const firstMin = pow10(p - 1);
    const firstMax = pow10(p) - BigInt(1);

    // iterate possible k (repetitions)
    const maxK = Math.floor(maxDigits / p);
    for (let k = 2; k <= maxK; k++) {
      const totalLen = p * k;
      const tenL = pow10(totalLen);
      const denom = pow10(p) - BigInt(1);
      const M = (tenL - BigInt(1)) / denom; // multiplier

      for (const { a, b } of ranges) {
        // find f range such that f * M in [a,b]
        const startFirst = ((a + M - BigInt(1)) / M) > firstMin ? ((a + M - BigInt(1)) / M) : firstMin;
        const endFirst = (b / M) < firstMax ? (b / M) : firstMax;
        if (startFirst > endFirst) continue;

        // iterate f in this (usually small) window and only count primitive blocks
        // p is small (<= maxHalf) so this is efficient
        let lo = startFirst;
        let hi = endFirst;
        for (let f = lo; f <= hi; f++) {
          const fStr = f.toString();
          if (!isPrimitive(fStr)) continue;
          const num = f * M;
          if (num >= a && num <= b) part2 += num;
        }
      }
    }
  }

  console.log(`Day 02 — Part 1: ${part1.toString()}`);
  console.log(`Day 02 — Part 2: ${part2.toString()}`);
};

export default { solve };

if (require.main === module) solve();
