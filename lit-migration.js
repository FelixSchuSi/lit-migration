"use strict";
exports.__esModule = true;
function transformer(file, api, options) {
    var j = api.jscodeshift;
    return j(file.source)
        // .find(j.ImportSpecifier) // this gets LitElement and html
        .find(j.ImportDeclaration, {
        source: {
            type: 'StringLiteral',
            value: 'lit-element'
        }
    })
        .replaceWith(function (nodePath) {
        var node = nodePath.node;
        console.log(node);
        node.source.value = 'lit';
        return node;
    })
        .toSource({ quote: 'single' });
}
module.exports = transformer;
