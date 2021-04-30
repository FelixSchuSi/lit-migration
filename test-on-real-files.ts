import { assert } from 'console';
import { readdir, readFile } from 'fs/promises';

(async () => {
    try {
        const files = await readdir('./__testfixtures__');
        const testCases = Array.from(new Set(files.map(f => f.split('.')[0])));
        for (const file of testCases) {
            console.log(file)
            const received = await readFile(`./__testfixtures__/${file}.input.ts`);
            const expected = await readFile(`./__testfixtures__/${file}.output.ts`);
            assert(received.equals(expected));
        };


    } catch (err) {
        console.error(err);
    }
})()