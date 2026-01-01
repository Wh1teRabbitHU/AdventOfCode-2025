class Fraction {
  n: bigint;
  d: bigint;
  constructor(n: bigint | number, d: bigint | number = 1) {
    this.n = BigInt(n as any);
    this.d = BigInt(d as any);
    if (this.d < 0n) { this.n = -this.n; this.d = -this.d; }
    this.reduce();
  }
  reduce() {
    const g = Fraction.gcd(this.n < 0n ? -this.n : this.n, this.d);
    if (g > 1n) { this.n /= g; this.d /= g; }
  }
  static gcd(a: bigint, b: bigint): bigint {
    while (b !== 0n) { const t = a % b; a = b; b = t; }
    return a < 0n ? -a : a;
  }
  add(b: Fraction) { return new Fraction(this.n * b.d + b.n * this.d, this.d * b.d); }
  sub(b: Fraction) { return new Fraction(this.n * b.d - b.n * this.d, this.d * b.d); }
  mul(b: Fraction) { return new Fraction(this.n * b.n, this.d * b.d); }
  div(b: Fraction) { return new Fraction(this.n * b.d, this.d * b.n); }
  isZero() { return this.n === 0n; }
  isInteger() { return this.d === 1n; }
  toNumber() { return Number(this.n) / Number(this.d); }
}

function parseLine(line: string) {
  const br = line.match(/\[([^\]]+)\]/);
  if (!br) throw new Error('bad line');
  const diagram = br[1];
  const n = diagram.length;
  const parenRe = /\(([^)]*)\)/g;
  const buttons: number[][] = [];
  let m: RegExpExecArray | null;
  while ((m = parenRe.exec(line))) {
    const inside = m[1].trim();
    if (inside === '') { buttons.push([]); continue; }
    const idxs = inside.split(',').map(s => parseInt(s.trim(), 10));
    buttons.push(idxs);
  }
  const curl = line.match(/\{([^}]+)\}/);
  const targets = curl ? curl[1].split(',').map(s => parseInt(s.trim(), 10)) : [];
  return { n, buttons, targets };
}

// Part 1: GF(2) minimal weight solution
function solveGF2(n: number, buttons: number[][], targetBits: number) {
  const m = buttons.length;
  const rowMasks: number[] = new Array(n).fill(0);
  for (let j = 0; j < m; j++) {
    for (const idx of buttons[j]) {
      if (idx >= 0 && idx < n) rowMasks[idx] |= (1 << j);
    }
  }
  const rhs: number[] = new Array(n).fill(0);
  for (let i = 0; i < n; i++) rhs[i] = ((targetBits >> i) & 1);

  const row = rowMasks.slice();
  const b = rhs.slice();
  const pivotCol: number[] = new Array(m).fill(-1);
  let r = 0;
  for (let c = 0; c < m && r < n; c++) {
    let sel = -1;
    for (let i = r; i < n; i++) if (((row[i] >> c) & 1) === 1) { sel = i; break; }
    if (sel === -1) continue;
    [row[r], row[sel]] = [row[sel], row[r]];
    [b[r], b[sel]] = [b[sel], b[r]];
    for (let i = 0; i < n; i++) {
      if (i !== r && ((row[i] >> c) & 1) === 1) {
        row[i] ^= row[r];
        b[i] ^= b[r];
      }
    }
    pivotCol[c] = r;
    r++;
  }
  for (let i = r; i < n; i++) if (row[i] === 0 && b[i] === 1) return Infinity; // no solution

  // build particular solution with free vars = 0
  const particular = new Array(m).fill(0);
  for (let c = 0; c < m; c++) if (pivotCol[c] !== -1) {
    const prow = pivotCol[c];
    particular[c] = b[prow];
  }
  // nullspace basis for each free var
  const freeCols: number[] = [];
  for (let c = 0; c < m; c++) if (pivotCol[c] === -1) freeCols.push(c);
  const nullBasis: number[] = [];
  for (const fc of freeCols) {
    let vec = 0;
    vec |= (1 << fc);
    for (let c = 0; c < m; c++) if (pivotCol[c] !== -1) {
      const prow = pivotCol[c];
      // in row prow, coefficient in column fc is whether that row has bit fc
      if (((row[prow] >> fc) & 1) === 1) vec |= (1 << c);
    }
    nullBasis.push(vec);
  }

  let best = Infinity;
  const k = nullBasis.length;
  const combos = 1 << k;
  for (let mask = 0; mask < combos; mask++) {
    let solMask = 0;
    for (let i = 0; i < m; i++) if (particular[i]) solMask |= (1 << i);
    for (let j = 0; j < k; j++) if ((mask >> j) & 1) solMask ^= nullBasis[j];
    const weight = solMask.toString(2).split('0').join('').length;
    if (weight < best) best = weight;
  }
  return best;
}

// Part 2: rational gaussian elimination + enumeration of free vars
function solveIntegerMin(n: number, buttons: number[][], targets: number[]): number {
  const m = buttons.length;
  // build matrix rows n, cols m
  const A: number[][] = Array.from({ length: n }, () => new Array(m).fill(0));
  for (let j = 0; j < m; j++) for (const idx of buttons[j]) if (idx >= 0 && idx < n) A[idx][j] = 1;

  // build augmented matrix of Fractions
  const M: Fraction[][] = [];
  for (let i = 0; i < n; i++) {
    const row: Fraction[] = [];
    for (let j = 0; j < m; j++) row.push(new Fraction(A[i][j], 1));
    row.push(new Fraction(targets[i], 1));
    M.push(row);
  }

  // gaussian elimination (RREF)
  const pivotCol = new Array(m).fill(-1);
  let r = 0;
  for (let c = 0; c < m && r < n; c++) {
    // find pivot
    let sel = -1;
    for (let i = r; i < n; i++) if (!M[i][c].isZero()) { sel = i; break; }
    if (sel === -1) continue;
    [M[r], M[sel]] = [M[sel], M[r]];
    // normalize pivot to 1
    const piv = M[r][c];
    for (let j = c; j <= m; j++) M[r][j] = M[r][j].div(piv);
    // eliminate others
    for (let i = 0; i < n; i++) if (i !== r && !M[i][c].isZero()) {
      const factor = M[i][c];
      for (let j = c; j <= m; j++) M[i][j] = M[i][j].sub(M[r][j].mul(factor));
    }
    pivotCol[c] = r;
    r++;
  }
  // check inconsistency
  for (let i = r; i < n; i++) {
    let allZero = true;
    for (let j = 0; j < m; j++) if (!M[i][j].isZero()) { allZero = false; break; }
    if (allZero && !M[i][m].isZero()) return Infinity; // no solution
  }

  // identify free vars
  const freeCols: number[] = [];
  for (let j = 0; j < m; j++) if (pivotCol[j] === -1) freeCols.push(j);

  // express pivot vars in terms of free vars: x_p = M[pivotRow][m] - sum_{f} M[pivotRow][f]*x_f
  const pivotOrder: number[] = [];
  for (let j = 0; j < m; j++) if (pivotCol[j] !== -1) pivotOrder.push(j);

  // If no free vars, check integerness and nonnegativity
  if (freeCols.length === 0) {
    let sum = 0;
    for (const pc of pivotOrder) {
      const val = M[pivotCol[pc]][m];
      if (!val.isInteger()) return Infinity;
      const iv = Number(val.n / val.d);
      if (iv < 0) return Infinity;
      sum += iv;
    }
    return sum;
  }

  // bounds for free vars: for each free var f, upperBound = min targets[j] where A[j][f]==1, or 0 if none -> treat as 0..maxTarget
  const bounds: number[] = freeCols.map(f => {
    let ub = Number.MAX_SAFE_INTEGER;
    let any = false;
    for (let j = 0; j < n; j++) if (A[j][f] === 1) { any = true; ub = Math.min(ub, targets[j]); }
    if (!any) return 0; // free var affects no counters: pressing it is useless, set to 0
    return ub;
  });

  const k = freeCols.length;
  if (k >= 16) return Infinity; // avoid huge enumeration

  let best = Infinity;
  // enumerate free var assignments (simple nested loops via recursion)
  const assignment: number[] = new Array(k).fill(0);
  function dfs(idx: number) {
    if (idx === k) {
      // compute pivots
      let total = 0;
      for (const fi of assignment) if (fi < 0) return; // guard
      for (const pc of pivotOrder) {
        const prow = pivotCol[pc];
        let val = M[prow][m];
        for (let t = 0; t < k; t++) {
          const fcol = freeCols[t];
          const coeff = M[prow][fcol];
          if (!coeff.isZero()) {
            val = val.sub(coeff.mul(new Fraction(BigInt(assignment[t]), 1)));
          }
        }
        if (!val.isInteger()) return;
        const iv = Number(val.n / val.d);
        if (iv < 0) return;
        total += iv;
        if (total >= best) return;
      }
      // add free vars presses
      for (const v of assignment) total += v;
      if (total < best) best = total;
      return;
    }
    const ub = Math.min(bounds[idx], best); // prune
    for (let v = 0; v <= ub; v++) {
      assignment[idx] = v;
      dfs(idx + 1);
    }
  }
  dfs(0);
  return best === Infinity ? Infinity : best;
}

export default {
  solve() {
    const fs = require('fs');
    const path = require('path');
    const input = fs.readFileSync(path.join(__dirname, '../inputs/day10.txt'), 'utf8').trim().split('\n').map((l: string) => l.trim()).filter(Boolean);
    let part1 = 0;
    let part2 = 0;
    for (const line of input) {
      const { n, buttons, targets } = parseLine(line);
      // part1: target bits from diagram? For lights, diagram has # or . target.
      // The diagram is not directly available here; re-parse from line to get bracket content
      const diag = line.match(/\[([^\]]+)\]/)![1];
      let tmask = 0;
      for (let i = 0; i < diag.length; i++) if (diag[i] === '#') tmask |= (1 << i);
      const p1 = solveGF2(n, buttons, tmask);
      if (!Number.isFinite(p1)) throw new Error('No solution part1');
      part1 += p1;

      const p2 = solveIntegerMin(n, buttons, targets);
      if (!Number.isFinite(p2)) throw new Error('No solution part2');
      part2 += p2;
    }
    console.log('Day 10 — Part 1:', part1);
    console.log('Day 10 — Part 2:', part2);
  }
};
