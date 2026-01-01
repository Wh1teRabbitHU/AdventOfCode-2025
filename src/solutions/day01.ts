
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

	for (const line of lines) {
		const dir = line[0];
		const dist = parseInt(line.slice(1), 10);
		if (Number.isNaN(dist)) continue;

		if (dir === 'L') {
			pos = ((pos - dist) % 100 + 100) % 100;
		} else if (dir === 'R') {
			pos = (pos + dist) % 100;
		} else {
			continue;
		}

		if (pos === 0) zeros++;
	}

	console.log(zeros);
}

export default { solve };

if (require.main === module) {
	solve();
}