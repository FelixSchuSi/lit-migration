import { ASTPath, ImportSpecifier } from "jscodeshift";
import { DefaultOptions } from "./index";

export function renameCssResult({ root, j }: DefaultOptions) {
    // Rename CssResult to CssResultGroup
    // e. g.: 'public static styles: CssResult = css``' -> 'public static styles: CssResultGroup = css``';

    // Step 1: Rename CSSResult to CSSResultGroup when used as an import specifier
    root
        .find(j.ImportDeclaration)
        .filter(path => (
            (path.value.source.type === 'Literal' || path.value.source.type === 'StringLiteral') &&
            (path.value.source.value === 'lit-element' || path.value.source.value === 'lit-html'))
        ).find(j.ImportSpecifier)
        .filter((path: ASTPath<ImportSpecifier>) => {
            const importSpecifierStr: string = path.value.imported.name;
            return importSpecifierStr === 'CSSResult';
        }).replaceWith(nodePath => {
            const { node } = nodePath;
            const newImportSpecifier = 'CSSResultGroup';
            node.imported.name = newImportSpecifier;
            return node;
        });

    // Step 2: Rename CSSResult to CSSResultGroup when used as a typescript type annotation
    // @ts-ignore
    root.find(j.TSType).filter(type => type.value.typeName.name === 'CSSResult')
        .replaceWith(nodePath => {
            const { node } = nodePath;
            // @ts-ignore
            node.typeName.name = 'CSSResultGroup';
            return node;
        })
}