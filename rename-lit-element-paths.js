"use strict";
exports.__esModule = true;
exports.renameLitElementPaths = void 0;
function renameLitElementPaths(_a) {
    var root = _a.root, j = _a.j;
    // Rename import declarations from 'lit-element' to 'lit'
    root
        .find(j.ImportDeclaration, {
        source: {
            type: 'StringLiteral',
            value: 'lit-element'
        }
    })
        .replaceWith(function (nodePath) {
        var node = nodePath.node;
        node.source.value = 'lit';
        return node;
    });
}
exports.renameLitElementPaths = renameLitElementPaths;
