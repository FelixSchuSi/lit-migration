import type { API, FileInfo, Options } from "jscodeshift";

function transformer(file: FileInfo, api: API, options: Options) {
    const j = api.jscodeshift;

    // Migration guide: https://github.com/lit/lit/wiki/Lit-2.0-Upgrade-Guide
    // Decorators have been moved to "lit/decorators"
    // All decorators: property customElement internalProperty query queryAsync queryAll eventOptions queryAssignedNodes

    // Directives have been moved from `lit-html/directives/repeat.js` to `lit/directives/repeat.js`
    // All directives: asyncAppend asyncReplace cache classMap guard ifDefined live repeat style-map template-content unsafe-html unsafe-svg until
    return j(file.source)
        // .find(j.ImportSpecifier) // this gets LitElement and html
        .find(j.ImportDeclaration, {
            source: {
                type: 'StringLiteral',
                value: 'lit-element',
            },
        })
        .replaceWith(nodePath => {
            const { node } = nodePath;

            console.log(node)
            node.source.value = 'lit';
            return node;
        })
        .toSource({ quote: 'single' });
}

module.exports = transformer;