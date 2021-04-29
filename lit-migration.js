"use strict";
exports.__esModule = true;
var move_decorators_1 = require("./move-decorators");
var rename_directive_paths_1 = require("./rename-directive-paths");
var rename_lit_element_paths_1 = require("./rename-lit-element-paths");
var rename_renamed_apis_1 = require("./rename-renamed-apis");
function transformer(file, api, options) {
    var j = api.jscodeshift;
    var root = j(file.source);
    // rename named Imports for renamed Apis
    // e. g.: import { UpdatingElement } from 'lit-element'; -> import { ReactiveElement } from 'lit-element';
    rename_renamed_apis_1.renameRenamedApis({ root: root, j: j });
    // Move decorators to separate imports
    // e. g.: import {property} from `lit-element`; -> import {property} from `lit/decorators.js`;
    move_decorators_1.moveDecorators({ root: root, j: j });
    // Rename import import specifiers for directives
    // e. g.: 'lit-html/directives/repeat.js' -> 'lit/directives/repeat.js';
    rename_directive_paths_1.renameDirectivePaths({ root: root, j: j });
    // Rename 'lit-element' import declarations 
    // e. g.: lit-element' -> 'lit'
    rename_lit_element_paths_1.renameLitElementPaths({ root: root, j: j });
    return root.toSource({ quote: 'single' });
}
module.exports = transformer;
