// @ts-ignore
jest.autoMockOff();
const defineTest = require('jscodeshift/dist/testUtils').defineTest;

const tests = ['combination'];

tests.forEach(test => {
    defineTest(__dirname, 'lit-migration', null, test, { parser: 'ts' });
})

