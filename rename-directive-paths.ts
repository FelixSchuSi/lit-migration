import { DefaultOptions } from "./lit-migration";

export function renameDirectivePaths({ root, j }: DefaultOptions) {
    // Rename import import-paths for directives
    // e. g.: 'lit-html/directives/repeat.js' -> 'lit/directives/repeat.js';
    const directives = ['async-append', 'async-replace', 'cache', 'class-map', 'guard', 'if-defined', 'live', 'repeat', 'style-map', 'template-content', 'unsafe-html', 'unsafe-svg', 'until'];
    root
        .find(j.ImportDeclaration, {
            source: {
                type: 'StringLiteral'
            },
        })
        .replaceWith(nodePath => {
            const { node } = nodePath;
            const currentValue = <string>node.source.value;

            if (currentValue.startsWith('lit-html/') && directives.some(directive => currentValue.includes(directive))) {
                const newValue = currentValue.replace(/^lit-html/, 'lit');
                node.source.value = newValue;
            }

            return node;
        });
}