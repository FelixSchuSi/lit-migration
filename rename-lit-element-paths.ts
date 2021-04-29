import { DefaultOptions } from "./index";

export function renameLitElementPaths({ root, j }: DefaultOptions) {
    // Rename import declarations from 'lit-element' to 'lit'
    root
        .find(j.ImportDeclaration, {
            source: {
                value: 'lit-element',
            },
        })
        .filter(path => path.value.source.type === 'Literal' || path.value.source.type === 'StringLiteral')
        .replaceWith(nodePath => {
            const { node } = nodePath;
            node.source.value = 'lit';
            return node;
        });
}