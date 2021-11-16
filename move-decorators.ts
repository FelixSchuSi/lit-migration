import { ASTPath, ImportDeclaration, ImportSpecifier } from "jscodeshift";
import { DefaultOptions } from "./index";

// Move decorators to separate imports
// e. g.: import {property} from `lit-element`; -> import {property} from `lit/decorators.js`;
export function moveDecorators({ root, j }: DefaultOptions) {
    let decoratorImport: ImportDeclaration | null = null;

    const decorators = ['state', 'property', 'customElement', 'internalProperty', 'query', 'queryAsync', 'queryAll', 'eventOptions', 'queryAssignedNodes'];
    const imports = root
        .find(j.ImportDeclaration, {
            source: {
                value: 'lit-element',
            },
        });

    imports.filter(path => path.value.source.type === 'Literal' || path.value.source.type === 'StringLiteral')
        .find(j.ImportSpecifier)
        .filter((importSpecifier: ASTPath<ImportSpecifier>) => {
            const importSpecifierStr: string = importSpecifier.value.imported.name;
            if (decorators.some(decorator => decorator === importSpecifierStr)) {
                if (!decoratorImport) {
                    decoratorImport = addDecoratorImport(importSpecifier);
                } else {
                    // TODO: When the importSpecifier is taken from a 'import type' declaration
                    // The import should also be added to a 'import type' declaration
                    decoratorImport.specifiers?.push(j.importSpecifier(j.identifier(importSpecifierStr)))
                }
                importSpecifier.parent.value.specifiers = importSpecifier.parent.value.specifiers.filter((e: ImportSpecifier) => {
                    return e.imported?.name !== importSpecifier.value.imported.name;
                });

                return importSpecifier.parent.value.specifiers.length === 0
            }
            return false;
        }).forEach((importSpecifier: ASTPath<ImportSpecifier>) => {
            j(importSpecifier.parent).remove()
        })

    function addDecoratorImport(importSpecifier: ASTPath<ImportSpecifier>): ImportDeclaration {
        const firstNamedImport: string = importSpecifier.value.imported.name;
        // TODO: When the importSpecifier is taken from a 'import type' declaration
        // a 'import type' declaration should be created here

        const newImport = j.importDeclaration([j.importSpecifier(j.identifier(firstNamedImport))], j.literal('lit/decorators'));
        const lastLitElementImport = imports.at(imports.length - 1).get();
        lastLitElementImport.insertAfter(newImport);
        return newImport;
    }
}