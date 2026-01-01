import fs from 'fs';
import path from 'path';

const solve = (inputArg?: string) => {
  let raw: string;
  if (typeof inputArg === 'string') {
    raw = inputArg;
  } else if (!process.stdin.isTTY) {
    raw = fs.readFileSync(0, 'utf8');
  } else {
    const inputPath = path.join(__dirname, '../inputs/day08.txt');
    try {
      raw = fs.readFileSync(inputPath, 'utf8');
    } catch (e) {
      raw = '';
    }
  }

  if (!raw || !raw.trim()) {
    console.log('Day 08 — Part 1: 0');
    console.log('Day 08 — Part 2: 0');
    return;
  }

  const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const pts: number[][] = lines.map(l => l.split(',').map(s => Number(s)));
  const n = pts.length;

  // build all unique pairs with squared distance
  const pairs: {i: number; j: number; d2: number}[] = [];
  for (let i = 0; i < n; i++) {
    const [xi, yi, zi] = pts[i];
    for (let j = i + 1; j < n; j++) {
      const [xj, yj, zj] = pts[j];
      const dx = xi - xj;
      const dy = yi - yj;
      const dz = zi - zj;
      const d2 = dx * dx + dy * dy + dz * dz;
      pairs.push({ i, j, d2 });
    }
  }

  pairs.sort((a, b) => a.d2 - b.d2);

  // Union-find
  const parent = new Array<number>(n);
  const size = new Array<number>(n).fill(1);
  for (let i = 0; i < n; i++) parent[i] = i;

  const find = (a: number): number => {
    if (parent[a] === a) return a;
    parent[a] = find(parent[a]);
    return parent[a];
  };

  const union = (a: number, b: number) => {
    const ra = find(a);
    const rb = find(b);
    if (ra === rb) return false;
    if (size[ra] < size[rb]) {
      parent[ra] = rb;
      size[rb] += size[ra];
    } else {
      parent[rb] = ra;
      size[ra] += size[rb];
    }
    return true;
  };

  // Connect the 1000 closest pairs (attempts), as described in the problem.
  const attempts = Math.min(1000, pairs.length);
  for (let k = 0; k < attempts; k++) {
    const p = pairs[k];
    union(p.i, p.j);
  }

  // compute component sizes
  const comp = new Map<number, number>();
  for (let i = 0; i < n; i++) {
    const r = find(i);
    comp.set(r, (comp.get(r) || 0) + 1);
  }

  const sizes = Array.from(comp.values()).sort((a, b) => b - a);
  const top3 = sizes.slice(0, 3);
  while (top3.length < 3) top3.push(1);
  const product = top3[0] * top3[1] * top3[2];

  console.log(`Day 08 — Part 1: ${product}`);
  console.log(`Day 08 — Part 2: 0`);
};

export default { solve };

if (require.main === module) solve();
