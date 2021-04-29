"use strict";
exports.__esModule = true;
function transformer(file, api, options) {
    var j = api.jscodeshift;
    var root = j(file.source);
    var decoratorImport = null;
    // Move decorators to separate imports
    // e. g.: import {property} from `lit-element`; -> import {property} from `lit/decorators.js`;
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
        // console.log(e.value.imported.name);
        // console.log(importSpecifier.value.imported.name, typeof importSpecifier.value.imported.name);
        var importSpecifierStr = importSpecifier.value.imported.name;
        if (decorators.some(function (decorator) { return decorator === importSpecifierStr; })) {
            if (!decoratorImport) {
                decoratorImport = addDecoratorImport(root, importSpecifierStr, j);
            }
            else {
                // decoratorImport.
                decoratorImport.specifiers.push(j.importSpecifier(j.identifier(importSpecifierStr)));
            }
            console.log(importSpecifier.parent.value.specifiers.pop(importSpecifier));
        }
    });
    // Rename import import-paths for directives
    // e. g.: 'lit-html/directives/repeat.js' -> 
    var directives = ['asyncAppend', 'asyncReplace', 'cache', 'classMap', 'guard', 'ifDefined', 'live', 'repeat', 'style-map', 'template-content', 'unsafe-html', 'unsafe-svg', 'until'];
    root
        .find(j.ImportDeclaration, {
        source: {
            type: 'StringLiteral'
        }
    })
        .replaceWith(function (nodePath) {
        var node = nodePath.node;
        var currentValue = node.source.value;
        if (currentValue.startsWith('lit-html/') && directives.some(function (directive) { return currentValue.includes(directive); })) {
            var newValue = currentValue.replace(/^lit-html/, 'lit');
            node.source.value = newValue;
        }
        return node;
    });
    // Rename import declarations from 'lit-element' to 'lit'
    root
        .find(j.ImportDeclaration, {
        source: {
            type: 'StringLiteral',
            value: 'lit-element'
        }
    })
        .replaceWith(function (nodePath) {
        var node = nodePath.node;
        node.source.value = 'lit';
        return node;
    });
    return root.toSource({ quote: 'single' });
}
function addDecoratorImport(root, firstNamedImport, j) {
    var newImport = j.importDeclaration([j.importSpecifier(j.identifier(firstNamedImport))], j.literal('lit/decorators.js'));
    root.get().node.program.body.unshift(newImport);
    return newImport;
}
module.exports = transformer;
