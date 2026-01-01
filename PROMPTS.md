# PROMPTS and Assistant Summaries

This file documents the user's prompts and a concise summary of the assistant's responses for later reference.

---

## Prompt 1
User prompt:

> using the following description, solve the task in the src/solutions/day01.ts file, using the solve typescript function (See <attachments> above for file contents. You may not need to search or read the file again.)

Assistant summary:

- Implemented the `solve` function in `src/solutions/day01.ts` to parse the Day 1 puzzle, simulate the dial starting at 50, count how many times it points to 0 after each rotation, and print the count.

---

## Prompt 2
User prompt:

> I added the input files, update the code to start using it

Assistant summary:

- Updated `src/solutions/day01.ts` to accept an optional input string, read from stdin when piped, and otherwise fall back to `src/inputs/day01.txt`. Verified by running the solver.

---

## Prompt 3
User prompt:

> you can use `npm run start` to execute the code!

Assistant summary:

- Ran `npm run start` which executes the project entry and printed the solver output (1031). Confirmed behavior and asked whether to commit changes.

---

## Prompt 4
User prompt:

> create a markdown file in the root called PROMPTS.md, where you should copy my prompts and a summary of each of your answers, so it gets documented for later usage

Assistant summary:

- Created this `PROMPTS.md` at the project root and added a todo entry tracking the change. Asked if the user wants the changes committed and pushed.

---

If you'd like a different format (e.g., CSV, more verbose logs, timestamps, or including full assistant messages instead of summaries), tell me and I'll update `PROMPTS.md`.

---

## Prompt 5
User prompt:

> summarize your context I defined for you in the instructions file! (See <attachments> above for file contents. You may not need to search or read the file again.)

Assistant summary:

- **Language:** Always use TypeScript for any new code.
- **Documentation:** Record every user prompt and a concise summary of the assistant response in `PROMPTS.md`.
- **Style:** Follow the repository's existing code style and conventions.
- **Verify:** Before finalizing any code, run `npm run start` and confirm the code runs and output is correct.
- **Dependencies:** If you change dependencies, update `package.json`.
- **Day solutions:** Add new puzzle solutions in `src/solutions/dayXX.ts` (zero-padded) and wire them into `./index.ts`.
- **Scope:** Keep changes minimal, self-contained, and consistent with the project.

