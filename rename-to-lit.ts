import { DefaultOptions } from "./index";

export function renameToLit({ root, j }: DefaultOptions) {
    // Rename import declarations from 'lit-element' to 'lit'
    root
        .find(j.ImportDeclaration)
        .filter(path => (
            (path.value.source.type === 'Literal' || path.value.source.type === 'StringLiteral') &&
            (path.value.source.value === 'lit-element' || path.value.source.value === 'lit-html'))
        )
        .replaceWith(nodePath => {
            const { node } = nodePath;
            node.source.value = 'lit';
            return node;
        });
}