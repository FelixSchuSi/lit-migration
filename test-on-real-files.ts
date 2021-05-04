const { readdir, readFile } = require('fs').promises;
import * as Diff from 'diff';

// Note: Run this before running this test!
// npx jscodeshift -t index.js __testfixtures__/ --extensions=ts --parser=ts
(async () => {
    const files = await readdir('./__testfixtures__');
    const testCases = Array.from(new Set(files.map((f: string) => f.split('.')[0])));
    let failed = false;
    for (const file of testCases) {
        const received = await readFile(`./__testfixtures__/${file}.input.ts`);
        const expected = await readFile(`./__testfixtures__/${file}.output.ts`);

        if (!received.equals(expected)) {
            failed = true;
            const diff = Diff.createTwoFilesPatch(`${file}.input.ts`, `${file}.output.ts`, received.toString(), expected.toString());
            console.log(diff)
        }
    };
    if (failed) process.exit(-1)
})()
