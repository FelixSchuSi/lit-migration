import { ASTPath, ImportDeclaration, ImportSpecifier } from "jscodeshift";
import { DefaultOptions } from "./lit-migration";

// Move decorators to separate imports
// e. g.: import {property} from `lit-element`; -> import {property} from `lit/decorators.js`;
export function moveDecorators({ root, j }: DefaultOptions) {

    let decoratorImport: ImportDeclaration | null = null;
    
    const decorators = ['property', 'customElement', 'internalProperty', 'query', 'queryAsync', 'queryAll', 'eventOptions', 'queryAssignedNodes'];
    const litElementImports = root
        .find(j.ImportDeclaration, {
            source: {
                type: 'StringLiteral',
                value: 'lit-element',
            },
        })
        .find(j.ImportSpecifier)
        .forEach((importSpecifier: ASTPath<ImportSpecifier>) => {
            const importSpecifierStr: string = importSpecifier.value.imported.name;
            if (decorators.some(decorator => decorator === importSpecifierStr)) {
                if (!decoratorImport) {
                    decoratorImport = addDecoratorImport(importSpecifierStr);
                } else {
                    decoratorImport.specifiers.push(j.importSpecifier(j.identifier(importSpecifierStr)))
                }
                importSpecifier.parent.value.specifiers.pop(importSpecifier);
                // TODO: Remove original import statement if no named imports are left
            }
        })


    function addDecoratorImport(firstNamedImport: string): ImportDeclaration {
        const newImport = j.importDeclaration([j.importSpecifier(j.identifier(firstNamedImport))], j.literal('lit/decorators.js'));
        root.get().node.program.body.unshift(newImport);
        return newImport;
    }

}