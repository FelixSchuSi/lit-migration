'use strict';

jest.autoMockOff();
const defineTest = require('jscodeshift/dist/testUtils').defineTest;
const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;
const transform = require('../reverse-identifiers');

defineTest(__dirname, 'reverse-identifiers', null, 'reverse-identifiers', { parser: 'ts' });

// defineTest(__dirname, 'reverse-identifiers', null, 'typescript/reverse-identifiers', { parser: 'ts' });

// describe('reverse-identifiers', () => {
//   defineInlineTest(transform, {}, `
// var firstWord = 'Hello ';
// var secondWord = 'world';
// var message = firstWord + secondWord;`,`
// var droWtsrif = 'Hello ';
// var droWdnoces = 'world';
// var egassem = droWtsrif + droWdnoces;
//   `);
//   defineInlineTest(transform, {},
//     'function aFunction() {};',
//     'function noitcnuFa() {};',
//     'Reverses function names'
//   );
// });