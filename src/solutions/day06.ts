import fs from 'fs';
import path from 'path';

const solve = (inputArg?: string) => {
  let raw: string;
  if (typeof inputArg === 'string') {
    raw = inputArg;
  } else if (!process.stdin.isTTY) {
    raw = fs.readFileSync(0, 'utf8');
  } else {
    const inputPath = path.join(__dirname, '../inputs/day06.txt');
    try {
      raw = fs.readFileSync(inputPath, 'utf8');
    } catch (e) {
      raw = '';
    }
  }

  if (!raw || !raw.trim()) {
    console.log('Day 06 — Part 1: 0');
    return;
  }

  const rawLines = raw.split(/\r?\n/);
  let lastNonEmpty = rawLines.length - 1;
  while (lastNonEmpty >= 0 && rawLines[lastNonEmpty].trim() === '') lastNonEmpty--;
  if (lastNonEmpty < 0) {
    console.log('Day 06 — Part 1: 0');
    return;
  }

  const lines = rawLines.slice(0, lastNonEmpty + 1);
  const opLine = lines[lines.length - 1];
  const numberLines = lines.slice(0, -1);

  const maxLen = Math.max(...lines.map(l => l.length));
  const pad = (s: string) => s + ' '.repeat(maxLen - s.length);
  for (let i = 0; i < lines.length; i++) lines[i] = pad(lines[i]);

  const colBlank: boolean[] = new Array(maxLen).fill(false);
  for (let j = 0; j < maxLen; j++) {
    let allSpace = true;
    for (let i = 0; i < lines.length; i++) {
      const ch = lines[i][j] || ' ';
      if (ch !== ' ') {
        allSpace = false;
        break;
      }
    }
    colBlank[j] = allSpace;
  }

  const segments: Array<[number, number]> = [];
  let j = 0;
  while (j < maxLen) {
    while (j < maxLen && colBlank[j]) j++;
    if (j >= maxLen) break;
    const start = j;
    while (j < maxLen && !colBlank[j]) j++;
    const end = j - 1;
    segments.push([start, end]);
  }

  // Part 1: numbers are arranged vertically in each problem block (as before)
  let part1Total = 0n;
  for (const [s, e] of segments) {
    const nums: bigint[] = [];
    for (const ln of numberLines) {
      const sub = ln.slice(s, e + 1);
      const matches = sub.match(/\d+/g);
      if (matches) {
        for (const m of matches) nums.push(BigInt(m));
      }
    }

    const opSub = opLine.slice(s, e + 1);
    const opMatch = opSub.match(/[+*]/);
    if (!opMatch) continue;
    const op = opMatch[0];
    if (nums.length === 0) continue;

    let res = op === '+' ? 0n : 1n;
    if (op === '+') {
      for (const n of nums) res += n;
    } else {
      for (const n of nums) res *= n;
    }

    part1Total += res;
  }

  console.log(`Day 06 — Part 1: ${part1Total.toString()}`);

  // Part 2: cephalopod math is right-to-left in columns; each column is one number
  let part2Total = 0n;
  for (const [s, e] of segments) {
    // find operator for this block
    const opSub = opLine.slice(s, e + 1);
    const opMatch = opSub.match(/[+*]/);
    if (!opMatch) continue;
    const op = opMatch[0];

    const colNums: bigint[] = [];
    // read columns right-to-left
    for (let col = e; col >= s; col--) {
      let digits = '';
      for (let r = 0; r < numberLines.length; r++) {
        const ch = numberLines[r][col] || ' ';
        digits += ch;
      }
      const m = digits.match(/\d+/g);
      if (!m) continue;
      // join all digit groups in column (should usually be one group)
      const numStr = m.join('');
      colNums.push(BigInt(numStr));
    }

    if (colNums.length === 0) continue;

    let res2 = op === '+' ? 0n : 1n;
    if (op === '+') {
      for (const n of colNums) res2 += n;
    } else {
      for (const n of colNums) res2 *= n;
    }

    part2Total += res2;
  }

  console.log(`Day 06 — Part 2: ${part2Total.toString()}`);
};

export default { solve };

if (require.main === module) solve();
