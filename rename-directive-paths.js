"use strict";
exports.__esModule = true;
exports.renameDirectivePaths = void 0;
function renameDirectivePaths(_a) {
    var root = _a.root, j = _a.j;
    // Rename import import-paths for directives
    // e. g.: 'lit-html/directives/repeat.js' -> 
    var directives = ['asyncAppend', 'asyncReplace', 'cache', 'classMap', 'guard', 'ifDefined', 'live', 'repeat', 'style-map', 'template-content', 'unsafe-html', 'unsafe-svg', 'until'];
    root
        .find(j.ImportDeclaration, {
        source: {
            type: 'StringLiteral'
        }
    })
        .replaceWith(function (nodePath) {
        var node = nodePath.node;
        var currentValue = node.source.value;
        if (currentValue.startsWith('lit-html/') && directives.some(function (directive) { return currentValue.includes(directive); })) {
            var newValue = currentValue.replace(/^lit-html/, 'lit');
            node.source.value = newValue;
        }
        return node;
    });
}
exports.renameDirectivePaths = renameDirectivePaths;
