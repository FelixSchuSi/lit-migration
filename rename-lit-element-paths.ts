import { DefaultOptions } from "./index";

export function renameLitElementPaths({ root, j }: DefaultOptions) {
    // Rename import declarations from 'lit-element' to 'lit'
    root
        .find(j.ImportDeclaration, {
            source: {
                type: 'StringLiteral',
                value: 'lit-element',
            },
        })
        .replaceWith(nodePath => {
            const { node } = nodePath;
            node.source.value = 'lit';
            return node;
        });
}