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
    return;
  }

  // If there are cycles reachable, count simple paths with visited set (no revisits).
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
};

export default { solve };

if (require.main === module) solve();
