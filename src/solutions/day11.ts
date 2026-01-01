import fs from 'fs';
import path from 'path';

const solve = (inputArg?: string) => {
  let raw: string;
  if (typeof inputArg === 'string') raw = inputArg;
  else if (!process.stdin.isTTY) raw = fs.readFileSync(0, 'utf8');
  else raw = fs.readFileSync(path.join(__dirname, '../inputs/day11.txt'), 'utf8');
  const input = raw.trim();
  if (!input) {
    console.log('Day 11 — Part 1: 0');
    return;
  }

  const lines = input.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const graph = new Map<string, string[]>();
  for (const line of lines) {
    const parts = line.split(':');
    if (parts.length < 1) continue;
    const key = parts[0].trim();
    const rhs = parts[1] ? parts[1].trim() : '';
    const outs = rhs === '' ? [] : rhs.split(/\s+/).filter(Boolean);
    graph.set(key, outs);
  }

  const start = 'you';
  const target = 'out';

  // Detect if subgraph reachable from start contains a cycle.
  const visiting = new Set<string>();
  const visited = new Set<string>();
  let hasCycle = false;
  function dfsCycle(u: string) {
    if (hasCycle) return;
    visiting.add(u);
    const nbrs = graph.get(u) || [];
    for (const v of nbrs) {
      if (v === target) continue;
      if (!visiting.has(v) && !visited.has(v)) {
        dfsCycle(v);
      } else if (visiting.has(v)) {
        hasCycle = true;
        return;
      }
    }
    visiting.delete(u);
    visited.add(u);
  }
  dfsCycle(start);

  // Use BigInt for counts
  if (!hasCycle) {
    const memo = new Map<string, bigint>();
    function count(u: string): bigint {
      if (u === target) return 1n;
      if (memo.has(u)) return memo.get(u)!;
      let sum = 0n;
      const nbrs = graph.get(u) || [];
      for (const v of nbrs) {
        sum += count(v);
      }
      memo.set(u, sum);
      return sum;
    }
    const result = count(start);
    console.log(`Day 11 — Part 1: ${result.toString()}`);
  }

  // If there are cycles reachable, count simple paths with visited set (no revisits).
  if (hasCycle) {
    let total = 0n;
    const seen = new Set<string>();
    function dfs(u: string) {
      if (u === target) {
        total += 1n;
        return;
      }
      seen.add(u);
      const nbrs = graph.get(u) || [];
      for (const v of nbrs) {
        if (seen.has(v)) continue;
        dfs(v);
      }
      seen.delete(u);
    }
    dfs(start);
    console.log(`Day 11 — Part 1: ${total.toString()}`);
  }
  // --- Part Two ---
  const p2Start = 'svr';
  const reqs = ['dac', 'fft'];

  // detect cycles reachable from p2Start (excluding target)
  const vis2 = new Set<string>();
  const onStack2 = new Set<string>();
  let p2HasCycle = false;
  function dfsCycle2(u: string) {
    if (p2HasCycle) return;
    onStack2.add(u);
    const nbrs = graph.get(u) || [];
    for (const v of nbrs) {
      if (v === target) continue;
      if (!onStack2.has(v) && !vis2.has(v)) dfsCycle2(v);
      else if (onStack2.has(v)) { p2HasCycle = true; return; }
    }
    onStack2.delete(u);
    vis2.add(u);
  }
  if (graph.has(p2Start)) dfsCycle2(p2Start);

  // helper: map required nodes to bits
  const reqIndex = new Map<string, number>();
  for (let i = 0; i < reqs.length; i++) reqIndex.set(reqs[i], i);
  const allMask = (1 << reqs.length) - 1;

  let part2 = 0n;
  if (!p2HasCycle) {
    const memo2 = new Map<string, bigint>();
    function dfs2(u: string, mask: number): bigint {
      const key = u + '|' + mask;
      if (memo2.has(key)) return memo2.get(key)!;
      if (u === target) {
        const res = (mask === allMask) ? 1n : 0n;
        memo2.set(key, res);
        return res;
      }
      let m = mask;
      if (reqIndex.has(u)) m = mask | (1 << reqIndex.get(u)!);
      let sum = 0n;
      const nbrs = graph.get(u) || [];
      for (const v of nbrs) {
        sum += dfs2(v, m);
      }
      memo2.set(key, sum);
      return sum;
    }
    const startMask = reqIndex.has(p2Start) ? (1 << reqIndex.get(p2Start)!) : 0;
    part2 = dfs2(p2Start, startMask);
  } else {
    // cycles: count simple paths with visited set and mask
    const seen2 = new Set<string>();
    function dfs2simple(u: string, mask: number) {
      if (u === target) {
        if (mask === allMask) part2 += 1n;
        return;
      }
      seen2.add(u);
      let m = mask;
      if (reqIndex.has(u)) m = mask | (1 << reqIndex.get(u)!);
      const nbrs = graph.get(u) || [];
      for (const v of nbrs) {
        if (seen2.has(v)) continue;
        dfs2simple(v, m);
      }
      seen2.delete(u);
    }
    const startMask = reqIndex.has(p2Start) ? (1 << reqIndex.get(p2Start)!) : 0;
    if (graph.has(p2Start)) dfs2simple(p2Start, startMask);
  }

  console.log(`Day 11 — Part 2: ${part2.toString()}`);
};

export default { solve };

if (require.main === module) solve();
