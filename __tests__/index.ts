// @ts-ignore
jest.autoMockOff();
const defineTest = require('jscodeshift/dist/testUtils').defineTest;

const tests = ['combination', 'rename-to-lit', 'rename-directive-paths', 'move-decorators', 'rename-renamed-imports', 'rename-apis-element'];

tests.forEach(test => {
    defineTest(__dirname, 'index', null, test, { parser: 'ts' });
})

