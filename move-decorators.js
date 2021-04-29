"use strict";
exports.__esModule = true;
exports.moveDecorators = void 0;
// Move decorators to separate imports
// e. g.: import {property} from `lit-element`; -> import {property} from `lit/decorators.js`;
function moveDecorators(_a) {
    var root = _a.root, j = _a.j;
    var decoratorImport = null;
    var decorators = ['property', 'customElement', 'internalProperty', 'query', 'queryAsync', 'queryAll', 'eventOptions', 'queryAssignedNodes'];
    var litElementImports = root
        .find(j.ImportDeclaration, {
        source: {
            type: 'StringLiteral',
            value: 'lit-element'
        }
    })
        .find(j.ImportSpecifier)
        .forEach(function (importSpecifier) {
        var importSpecifierStr = importSpecifier.value.imported.name;
        if (decorators.some(function (decorator) { return decorator === importSpecifierStr; })) {
            if (!decoratorImport) {
                decoratorImport = addDecoratorImport(importSpecifierStr);
            }
            else {
                decoratorImport.specifiers.push(j.importSpecifier(j.identifier(importSpecifierStr)));
            }
            importSpecifier.parent.value.specifiers.pop(importSpecifier);
            // TODO: Remove original import statement if no named imports are left
        }
    });
    function addDecoratorImport(firstNamedImport) {
        var newImport = j.importDeclaration([j.importSpecifier(j.identifier(firstNamedImport))], j.literal('lit/decorators.js'));
        root.get().node.program.body.unshift(newImport);
        return newImport;
    }
}
exports.moveDecorators = moveDecorators;
