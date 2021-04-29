import type { API, ASTPath, Collection, FileInfo, ImportDeclaration, ImportSpecifier, JSCodeshift, Options, Statement } from "jscodeshift";
export interface DefaultOptions {
    j: JSCodeshift,
    root: Collection<any>
}
function transformer(file: FileInfo, api: API, options: Options) {
    const j = api.jscodeshift;

    const root = j(file.source);

    let decoratorImport: ImportDeclaration | null = null;
    // Move decorators to separate imports
    // e. g.: import {property} from `lit-element`; -> import {property} from `lit/decorators.js`;
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
                    decoratorImport = addDecoratorImport(root, importSpecifierStr, j);
                }else{
                    decoratorImport.specifiers.push(j.importSpecifier(j.identifier(importSpecifierStr)))
                }
                importSpecifier.parent.value.specifiers.pop(importSpecifier);
                // TODO: Remove original import statement if no named imports are left
            }
        })

    // Rename import import-paths for directives
    // e. g.: 'lit-html/directives/repeat.js' -> 
    const directives = ['asyncAppend', 'asyncReplace', 'cache', 'classMap', 'guard', 'ifDefined', 'live', 'repeat', 'style-map', 'template-content', 'unsafe-html', 'unsafe-svg', 'until'];
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

    return root.toSource({ quote: 'single' })
}


function addDecoratorImport(root: Collection<any>, firstNamedImport: string, j: JSCodeshift): ImportDeclaration {
    const newImport = j.importDeclaration([j.importSpecifier(j.identifier(firstNamedImport))], j.literal('lit/decorators.js'));
    root.get().node.program.body.unshift(newImport);
    return newImport;
}

module.exports = transformer;