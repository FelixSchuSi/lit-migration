import { assert } from 'console';
import { readdir, readFile } from 'fs/promises';

(async () => {

    const passedTests = [];
    const failedTests = [];
    const files = await readdir('./__testfixtures__');
    const testCases = Array.from(new Set(files.map(f => f.split('.')[0])));
    for (const file of testCases) {
        const received = await readFile(`./__testfixtures__/${file}.input.ts`);
        const expected = await readFile(`./__testfixtures__/${file}.output.ts`);
        if (received.equals(expected)) {
            passedTests.push(file);
        } else {
            failedTests.push(file);
        }
    };

    if (failedTests.length !== 0) {
        console.error(`
            ${failedTests.length} tests failed.
            These tests failed:
            ${failedTests.join(', ')}
        `);
        process.exit(-1);
    } else {
        console.log(`${passedTests.length} tests passed ✔`);
    }


})()