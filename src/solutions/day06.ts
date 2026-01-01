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

  let grandTotal = 0n;

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

    grandTotal += res;
  }

  console.log(`Day 06 — Part 1: ${grandTotal.toString()}`);
};

export default { solve };

if (require.main === module) solve();
