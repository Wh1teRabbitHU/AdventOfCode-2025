Your task in this project to help to solve programming puzzles using TypeScript. The source files can be found under the `src` folder. The challenges folder contains the problem descriptions, while the solutions folder is where the TypeScript code should be written. The inputs for the puzzles are located in the inputs folder.

You should follow the following instructions when generating code for this project:

- Always use TypeScript for any new code.
- Document every prompt and assistant response in the PROMPTS.md file at the project root.
- When documenting in PROMPTS.md, include the full user prompt and a concise summary of the assistant's response.
- Ensure that any new code adheres to the existing code style and conventions used in the project.
- Before finalizing any code, verify that it runs correctly with `npm run start` and produces the expected output.
- If you make changes to dependencies, ensure that the package.json file is updated accordingly.
- When you add a new day solution, create a new TypeScript file in the src/solutions folder named dayXX.ts, where XX is the day number with leading zeros (e.g., day01.ts for Day 1). Then add the call to the solution in `./index.ts` file.