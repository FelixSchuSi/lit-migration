import { ASTPath, ImportDeclaration, ImportSpecifier } from "jscodeshift";
import { DefaultOptions } from "./index";

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
        .filter((importSpecifier: ASTPath<ImportSpecifier>) => {
            const importSpecifierStr: string = importSpecifier.value.imported.name;
            if (decorators.some(decorator => decorator === importSpecifierStr)) {
                if (!decoratorImport) {
                    decoratorImport = addDecoratorImport(importSpecifierStr);
                } else {
                    decoratorImport.specifiers.push(j.importSpecifier(j.identifier(importSpecifierStr)))
                }
                importSpecifier.parent.value.specifiers.pop(importSpecifier);

                return importSpecifier.parent.value.specifiers.length === 0
            }
        }).forEach((importSpecifier: ASTPath<ImportSpecifier>)=>{
            j(importSpecifier.parent).remove()
        })

    function addDecoratorImport(firstNamedImport: string): ImportDeclaration {
        const newImport = j.importDeclaration([j.importSpecifier(j.identifier(firstNamedImport))], j.literal('lit/decorators.js'));
        root.get().node.program.body.unshift(newImport);
        return newImport;
    }
}