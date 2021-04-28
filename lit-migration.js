"use strict";
exports.__esModule = true;
function transformer(file, api, options) {
    var j = api.jscodeshift;
    // Decorators have been moved to "lit/decorators"
    // All decorators: property customElement internalProperty query queryAsync queryAll eventOptions queryAssignedNodes
    // Directives have been moved from `lit-html/directives/repeat.js` to `lit/directives/repeat.js`
    // All directives: asyncAppend asyncReplace cache classMap guard ifDefined live repeat style-map template-content unsafe-html unsafe-svg until
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
