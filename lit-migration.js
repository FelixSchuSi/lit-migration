"use strict";
exports.__esModule = true;
function transformer(file, api, options) {
    var j = api.jscodeshift;
    // Migration guide: https://github.com/lit/lit/wiki/Lit-2.0-Upgrade-Guide
    // Decorators have been moved to "lit/decorators"
    // All decorators: property customElement internalProperty query queryAsync queryAll eventOptions queryAssignedNodes
    // Directives have been moved from `lit-html/directives/repeat.js` to `lit/directives/repeat.js`
    // All directives: asyncAppend asyncReplace cache classMap guard ifDefined live repeat style-map template-content unsafe-html unsafe-svg until
    var root = j(file.source);
    // .find(j.ImportSpecifier) // this gets LitElement and html
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
            var re = /^lit-html/;
            var newValue = currentValue.replace(re, 'lit');
            node.source.value = newValue;
        }
        return node;
    });
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
    return root.toSource({ quote: 'single' });
}
module.exports = transformer;
