// @ts-ignore
jest.autoMockOff();
const defineTest = require('jscodeshift/dist/testUtils').defineTest;

const tests = ['combination', 'rename-lit-element', 'rename-directive-paths', 'move-decorators'];

tests.forEach(test => {
    defineTest(__dirname, 'lit-migration', null, test, { parser: 'ts' });
})

