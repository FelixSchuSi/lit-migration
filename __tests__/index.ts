// @ts-ignore
jest.autoMockOff();
const defineTest = require('jscodeshift/dist/testUtils').defineTest;

// const tests = ['combination', 'rename-lit-element', 'rename-directive-paths', 'move-decorators'];
const tests = ['move-decorators'];

tests.forEach(test => {
    defineTest(__dirname, 'index', null, test, { parser: 'ts' });
})

