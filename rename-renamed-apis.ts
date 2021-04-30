import { ASTPath, CallExpression, ClassProperty, Collection, Declaration, Decorator, Expression, ImportSpecifier, VariableDeclaration } from "jscodeshift";
import { DefaultOptions } from "./index";

export function renameRenamedApis({ root, j }: DefaultOptions) {
    const renamedImports = {
        UpdatingElement: 'ReactiveElement',
        internalProperty: 'state',
        NodePart: 'ChildPart'
    }
    const renamedLitFunctions = {
        getStyles: 'finalizeStyles', // was moved from Litelement to ReactiveElement
        _getUpdateComplete: 'getUpdateComplete'
    }

    const changedImports: Collection<ImportSpecifier> = root
        .find(j.ImportDeclaration)
        .filter(path => (
            (path.value.source.type === 'Literal' || path.value.source.type === 'StringLiteral') &&
            (path.value.source.value === 'lit-element' || path.value.source.value === 'lit-html'))
        ).find(j.ImportSpecifier)
        .filter((path: ASTPath<ImportSpecifier>) => {
            const importSpecifierStr: string = path.value.imported.name;
            return renamedImports.hasOwnProperty(importSpecifierStr);
        }).replaceWith(nodePath => {
            const { node } = nodePath;
            const importSpecifierStr: string = nodePath.value.imported.name;
            const newImportSpecifier = renamedImports[<keyof typeof renamedImports>importSpecifierStr];
            node.imported.name = newImportSpecifier;
            return node;
        });

    // rename @internalProperty usages to @state
    root.find(j.ClassProperty)
        .filter((path: ASTPath<ClassProperty>) => {
            // @ts-ignore
            return path.value.decorators && path.value.decorators.length > 0 // property has decorators attached to it
        }).replaceWith((path: ASTPath<ClassProperty>) => {
            const { node } = path;
            //@ts-ignore
            const decorators: Decorator[] = node.decorators!;

            decorators.forEach((decorator: Decorator) => {
                //@ts-ignore
                if (decorator?.expression?.callee?.name === 'internalProperty') {
                    //@ts-ignore
                    decorator.expression.callee.name = renamedImports.internalProperty;
                }
            })
            return node;
        })
}