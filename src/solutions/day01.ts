
import fs from 'fs';
import path from 'path';

const solve = (inputArg?: string) => {
	let raw: string;
	if (typeof inputArg === 'string') {
		raw = inputArg;
	} else if (!process.stdin.isTTY) {
		raw = fs.readFileSync(0, 'utf8');
	} else {
		const inputPath = path.join(__dirname, '../inputs/day01.txt');
		try {
			raw = fs.readFileSync(inputPath, 'utf8');
		} catch (e) {
			raw = '';
		}
	}
	const input = raw.trim();
	if (!input) {
		console.log('0');
		return;
	}

	const lines = input.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
	let pos = 50;
	let zeros = 0;
	let zerosDuring = 0;

	for (const line of lines) {
		const dir = line[0];
		const dist = parseInt(line.slice(1), 10);
		if (Number.isNaN(dist)) continue;

		if (dir === 'L') {
			// count how many times during the left rotation the dial points at 0
			if (pos === 0) {
				zerosDuring += Math.floor(dist / 100);
			} else if (dist >= pos) {
				zerosDuring += Math.floor((dist - pos) / 100) + 1;
			}
			pos = ((pos - dist) % 100 + 100) % 100;
		} else if (dir === 'R') {
			// count how many times during the right rotation the dial points at 0
			zerosDuring += Math.floor((pos + dist) / 100);
			pos = (pos + dist) % 100;
		} else {
			continue;
		}

		if (pos === 0) zeros++;
	}

	// Output Part 1 (end-of-rotation zeros) then Part 2 (any-click zeros)
	console.log(`Day 01 — Part 1: ${zeros}`);
	console.log(`Day 01 — Part 2: ${zerosDuring}`);
}

export default { solve };

if (require.main === module) {
	solve();
}