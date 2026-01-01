import fs from 'fs';
import path from 'path';

const solve = (inputArg?: string) => {
  // debug entry
  // console.log('Day 09 solver invoked');
  let raw: string;
  if (typeof inputArg === 'string') {
    raw = inputArg;
  } else if (!process.stdin.isTTY) {
    raw = fs.readFileSync(0, 'utf8');
  } else {
    const inputPath = path.join(__dirname, '../inputs/day09.txt');
    try {
      raw = fs.readFileSync(inputPath, 'utf8');
    } catch (e) {
      raw = '';
    }
  }

  if (!raw || !raw.trim()) {
    console.log('Day 09 — Part 1: 0');
    console.log('Day 09 — Part 2: 0');
    return;
  }

  const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const pts: number[][] = lines.map(l => l.split(',').map(s => Number(s)));
  const n = pts.length;
  // Part 1: largest rectangle using any two red tiles as opposite corners
  let maxArea = 0;
  for (let i = 0; i < n; i++) {
    const [xi, yi] = pts[i];
    for (let j = i + 1; j < n; j++) {
      const [xj, yj] = pts[j];
      if (xi === xj || yi === yj) continue; // need diagonal corners
      const w = Math.abs(xi - xj) + 1;
      const h = Math.abs(yi - yj) + 1;
      const area = w * h;
      if (area > maxArea) maxArea = area;
    }
  }

  console.log(`Day 09 — Part 1: ${maxArea}`);
  // Part 1: largest rectangle using any two red tiles as opposite corners
  // Build vertical and horizontal edges lists (for sampling / coverage checks)
  const verticalEdges: { x: number; y0: number; y1: number }[] = [];
  const horizontalMap = new Map<number, Array<[number, number]>>();
  const redRows = new Map<number, number[]>();
  for (let i = 0; i < n; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[(i + 1) % n];
    if (x1 === x2) {
      const a = Math.min(y1, y2);
      const b = Math.max(y1, y2);
      verticalEdges.push({ x: x1, y0: a, y1: b });
    } else if (y1 === y2) {
      const a = Math.min(x1, x2);
      const b = Math.max(x1, x2);
      const arr = horizontalMap.get(y1) || [];
      arr.push([a, b]);
      horizontalMap.set(y1, arr);
    }
    const rarr = redRows.get(y1) || [];
    rarr.push(x1);
    redRows.set(y1, rarr);
  }

  // cache merged coverage intervals per row (inclusive integer x intervals)
  const rowCache = new Map<number, Array<[number, number]>>();
  const getCoverageForRow = (y: number) => {
    if (rowCache.has(y)) return rowCache.get(y)!;
    const intervals: Array<[number, number]> = [];
    const sampleY = y + 0.5;
    // interior intervals from vertical edge intersections
    const xs: number[] = [];
    for (const e of verticalEdges) {
      if (e.y0 <= sampleY && sampleY < e.y1) xs.push(e.x);
    }
    xs.sort((a, b) => a - b);
    for (let k = 0; k + 1 < xs.length; k += 2) {
      const left = xs[k];
      const right = xs[k + 1];
      if (right - 1 >= left) intervals.push([left, right - 1]);
    }
    // horizontal edges at this row
    const h = horizontalMap.get(y);
    if (h) {
      for (const [a, b] of h) intervals.push([a, b]);
    }
    // red points on this row
    const rr = redRows.get(y);
    if (rr) {
      for (const x of rr) intervals.push([x, x]);
    }

    if (intervals.length === 0) {
      rowCache.set(y, []);
      return [] as Array<[number, number]>;
    }

    intervals.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const merged: Array<[number, number]> = [];
    let [curL, curR] = intervals[0];
    for (let i = 1; i < intervals.length; i++) {
      const [l, r] = intervals[i];
      if (l <= curR + 1) {
        if (r > curR) curR = r;
      } else {
        merged.push([curL, curR]);
        curL = l;
        curR = r;
      }
    }
    merged.push([curL, curR]);
    rowCache.set(y, merged);
    return merged;
  };

  const coversRange = (intervals: Array<[number, number]>, a: number, b: number) => {
    // check if union of intervals covers [a,b] inclusive
    for (const [l, r] of intervals) {
      if (l <= a && r >= b) return true;
      if (l > a) break;
    }
    // if no single interval covers, check merged coverage sequentially
    let cur = a;
    for (const [l, r] of intervals) {
      if (l > cur) return false;
      if (r >= cur) cur = r + 1;
      if (cur > b) return true;
    }
    return cur > b;
  };

  let maxArea2 = 0;
  for (let i = 0; i < n; i++) {
    const [xi, yi] = pts[i];
    for (let j = i + 1; j < n; j++) {
      const [xj, yj] = pts[j];
      if (xi === xj || yi === yj) continue;
      const x0 = Math.min(xi, xj);
      const x1 = Math.max(xi, xj);
      const y0 = Math.min(yi, yj);
      const y1 = Math.max(yi, yj);
      const area = (x1 - x0 + 1) * (y1 - y0 + 1);
      if (area <= maxArea2) continue;
      let ok = true;
      for (let y = y0; y <= y1; y++) {
        const cov = getCoverageForRow(y);
        if (!coversRange(cov, x0, x1)) {
          ok = false;
          break;
        }
      }
      if (ok) maxArea2 = area;
    }
  }

  console.log(`Day 09 — Part 2: ${maxArea2}`);
  
};

export default { solve };

if (require.main === module) solve();
