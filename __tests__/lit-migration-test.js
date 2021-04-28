'use strict';

jest.autoMockOff();
const defineTest = require('jscodeshift/dist/testUtils').defineTest;
const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;
const transform = require('../lit-migration');

defineTest(__dirname, 'lit-migration', null, 'lit-migration', { parser: 'ts' });
