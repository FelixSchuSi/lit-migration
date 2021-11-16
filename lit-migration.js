function createCommonjsModule(fn) {
  var module = { exports: {} };
	return fn(module, module.exports), module.exports;
}

var moveDecorators_1 = createCommonjsModule(function (module, exports) {
exports.__esModule = true;
exports.moveDecorators = void 0;
// Move decorators to separate imports
// e. g.: import {property} from `lit-element`; -> import {property} from `lit/decorators.js`;
function moveDecorators(_a) {
    var root = _a.root, j = _a.j;
    var decoratorImport = null;
    var decorators = ['state', 'property', 'customElement', 'internalProperty', 'query', 'queryAsync', 'queryAll', 'eventOptions', 'queryAssignedNodes'];
    var imports = root
        .find(j.ImportDeclaration, {
        source: {
            value: 'lit-element'
        }
    });
    imports.filter(function (path) { return path.value.source.type === 'Literal' || path.value.source.type === 'StringLiteral'; })
        .find(j.ImportSpecifier)
        .filter(function (importSpecifier) {
        var _a;
        var importSpecifierStr = importSpecifier.value.imported.name;
        if (decorators.some(function (decorator) { return decorator === importSpecifierStr; })) {
            if (!decoratorImport) {
                decoratorImport = addDecoratorImport(importSpecifier);
            }
            else {
                // TODO: When the importSpecifier is taken from a 'import type' declaration
                // The import should also be added to a 'import type' declaration
                (_a = decoratorImport.specifiers) === null || _a === void 0 ? void 0 : _a.push(j.importSpecifier(j.identifier(importSpecifierStr)));
            }
            importSpecifier.parent.value.specifiers = importSpecifier.parent.value.specifiers.filter(function (e) {
                var _a;
                return ((_a = e.imported) === null || _a === void 0 ? void 0 : _a.name) !== importSpecifier.value.imported.name;
            });
            return importSpecifier.parent.value.specifiers.length === 0;
        }
        return false;
    }).forEach(function (importSpecifier) {
        j(importSpecifier.parent).remove();
    });
    function addDecoratorImport(importSpecifier) {
        var firstNamedImport = importSpecifier.value.imported.name;
        // TODO: When the importSpecifier is taken from a 'import type' declaration
        // a 'import type' declaration should be created here
        var newImport = j.importDeclaration([j.importSpecifier(j.identifier(firstNamedImport))], j.literal('lit/decorators'));
        var lastLitElementImport = imports.at(imports.length - 1).get();
        lastLitElementImport.insertAfter(newImport);
        return newImport;
    }
}
exports.moveDecorators = moveDecorators;
});

var renameDirectivePaths_1 = createCommonjsModule(function (module, exports) {
exports.__esModule = true;
exports.renameDirectivePaths = void 0;
function renameDirectivePaths(_a) {
    var root = _a.root, j = _a.j;
    // Rename import import-paths for directives
    // e. g.: 'lit-html/directives/repeat.js' -> 'lit/directives/repeat.js';
    var directives = ['async-append', 'async-replace', 'cache', 'class-map', 'guard', 'if-defined', 'live', 'repeat', 'style-map', 'template-content', 'unsafe-html', 'unsafe-svg', 'until'];
    root
        .find(j.ImportDeclaration)
        .filter(function (path) { return path.value.source.type === 'Literal' || path.value.source.type === 'StringLiteral'; })
        .replaceWith(function (nodePath) {
        var node = nodePath.node;
        var currentValue = node.source.value;
        if (currentValue.startsWith('lit-html/directives/') && directives.some(function (directive) { return currentValue.includes(directive); })) {
            var newValue = currentValue.replace(/^lit-html/, 'lit');
            node.source.value = newValue;
        }
        return node;
    });
}
exports.renameDirectivePaths = renameDirectivePaths;
});

var renameToLit_1 = createCommonjsModule(function (module, exports) {
exports.__esModule = true;
exports.renameToLit = void 0;
function renameToLit(_a) {
    var root = _a.root, j = _a.j;
    // Rename import declarations from 'lit-element' to 'lit'
    root
        .find(j.ImportDeclaration)
        .filter(function (path) { return ((path.value.source.type === 'Literal' || path.value.source.type === 'StringLiteral') &&
        (path.value.source.value === 'lit-element' || path.value.source.value === 'lit-html')); })
        .replaceWith(function (nodePath) {
        var node = nodePath.node;
        node.source.value = 'lit';
        return node;
    });
}
exports.renameToLit = renameToLit;
});

var renameRenamedApis_1 = createCommonjsModule(function (module, exports) {
exports.__esModule = true;
exports.renameRenamedApis = void 0;
function renameRenamedApis(_a) {
    var root = _a.root, j = _a.j;
    var renamedImports = {
        UpdatingElement: 'ReactiveElement',
        internalProperty: 'state',
        NodePart: 'ChildPart'
    };
    var renamedLitFunctions = {
        getStyles: 'finalizeStyles',
        _getUpdateComplete: 'getUpdateComplete'
    };
    root
        .find(j.ImportDeclaration)
        .filter(function (path) { return ((path.value.source.type === 'Literal' || path.value.source.type === 'StringLiteral') &&
        (path.value.source.value === 'lit-element' || path.value.source.value === 'lit-html')); }).find(j.ImportSpecifier)
        .filter(function (path) {
        var importSpecifierStr = path.value.imported.name;
        return renamedImports.hasOwnProperty(importSpecifierStr);
    }).replaceWith(function (nodePath) {
        var node = nodePath.node;
        var importSpecifierStr = nodePath.value.imported.name;
        var newImportSpecifier = renamedImports[importSpecifierStr];
        node.imported.name = newImportSpecifier;
        return node;
    });
    // rename @internalProperty usages to @state
    root.find(j.ClassProperty)
        .filter(function (path) {
        // @ts-ignore
        return path.value.decorators && path.value.decorators.length > 0; // property has decorators attached to it
    }).replaceWith(function (path) {
        var node = path.node;
        //@ts-ignore
        var decorators = node.decorators;
        decorators.forEach(function (decorator) {
            var _a, _b;
            //@ts-ignore
            if (((_b = (_a = decorator === null || decorator === void 0 ? void 0 : decorator.expression) === null || _a === void 0 ? void 0 : _a.callee) === null || _b === void 0 ? void 0 : _b.name) === 'internalProperty') {
                //@ts-ignore
                decorator.expression.callee.name = renamedImports.internalProperty;
            }
        });
        return node;
    });
    root
        .find(j.ClassMethod)
        .filter(function (path) {
        var node = path.node;
        //@ts-ignore
        var functionName = node.key.name;
        return renamedLitFunctions.hasOwnProperty(functionName);
    })
        .forEach(function (path) {
        var node = path.node;
        //@ts-ignore
        var oldFunctionName = node.key.name;
        var newFunctionName = renamedLitFunctions[oldFunctionName];
        //@ts-ignore
        node.key.name = newFunctionName;
    }).filter(function (path) {
        var _a;
        // Change the return type of getUpdateComplete to boolean
        var node = path.node;
        //@ts-ignore
        var isGetUpdateComplete = node.key.name === 'getUpdateComplete';
        var hasReturnType = !!((_a = node.returnType) === null || _a === void 0 ? void 0 : _a.typeAnnotation);
        return isGetUpdateComplete && hasReturnType;
    }).forEach(function (path) {
        var _a;
        var node = path.node;
        if ((_a = node.returnType) === null || _a === void 0 ? void 0 : _a.typeAnnotation) {
            // Instantiate "Promise<boolean>""
            var promiseBoolean = j.genericTypeAnnotation(j.identifier('Promise'), j.typeParameterInstantiation([j.booleanTypeAnnotation()]));
            node.returnType.typeAnnotation = promiseBoolean;
        }
    });
}
exports.renameRenamedApis = renameRenamedApis;
});

var renameCssResult_1 = createCommonjsModule(function (module, exports) {
exports.__esModule = true;
exports.renameCssResult = void 0;
function renameCssResult(_a) {
    // Rename CssResult to CssResultGroup
    // e. g.: 'public static styles: CssResult = css``' -> 'public static styles: CssResultGroup = css``';
    var root = _a.root, j = _a.j;
    // Step 1: Rename CSSResult to CSSResultGroup when used as an import specifier
    root
        .find(j.ImportDeclaration)
        .filter(function (path) { return ((path.value.source.type === 'Literal' || path.value.source.type === 'StringLiteral') &&
        (path.value.source.value === 'lit-element' || path.value.source.value === 'lit-html')); }).find(j.ImportSpecifier)
        .filter(function (path) {
        var _a, _b;
        var importSpecifierStr = (_b = (_a = path.value) === null || _a === void 0 ? void 0 : _a.imported) === null || _b === void 0 ? void 0 : _b.name;
        return importSpecifierStr === 'CSSResult';
    }).replaceWith(function (nodePath) {
        var node = nodePath.node;
        var newImportSpecifier = 'CSSResultGroup';
        node.imported.name = newImportSpecifier;
        return node;
    });
    // Step 2: Rename CSSResult to CSSResultGroup when used as a typescript type annotation
    // @ts-ignore
    root.find(j.TSType).filter(function (type) { var _a, _b; return ((_b = (_a = type === null || type === void 0 ? void 0 : type.value) === null || _a === void 0 ? void 0 : _a.typeName) === null || _b === void 0 ? void 0 : _b.name) === 'CSSResult'; })
        .replaceWith(function (nodePath) {
        var node = nodePath.node;
        // @ts-ignore
        node.typeName.name = 'CSSResultGroup';
        return node;
    });
}
exports.renameCssResult = renameCssResult;
});

var changeShadowrootCreation = createCommonjsModule(function (module, exports) {
exports.__esModule = true;
exports.changeShadowRootCreation = void 0;
function changeShadowRootCreation(_a) {
    // Transform from:
    var root = _a.root, j = _a.j;
    // protected createRenderRoot(): Element | ShadowRoot {
    //   return this.attachShadow({ mode: 'open', delegatesFocus: true });
    // }
    // to:
    // protected static shadowRootOptions: ShadowRootInit = {
    //   delegatesFocus: true,
    //   mode: 'open',
    // };
    var shadowRootOptionsFromRemovedNode = null;
    root
        .find(j.ClassMethod)
        .filter(function (path) {
        var _a;
        // Only inspect `createRenderRoot` calls
        var node = path.node;
        // @ts-ignore
        return ((_a = node === null || node === void 0 ? void 0 : node.key) === null || _a === void 0 ? void 0 : _a.name) === 'createRenderRoot';
    })
        .filter(function (path) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        // Only inspect if `this.attachShadow` is called inside the `createRenderRoot` function
        var node = path.node;
        //@ts-ignore
        var isThisExpression = ((_e = (_d = (_c = (_b = (_a = node === null || node === void 0 ? void 0 : node.body) === null || _a === void 0 ? void 0 : _a.body[0]) === null || _b === void 0 ? void 0 : _b.argument) === null || _c === void 0 ? void 0 : _c.callee) === null || _d === void 0 ? void 0 : _d.object) === null || _e === void 0 ? void 0 : _e.type) === 'ThisExpression';
        //@ts-ignore
        var isAttachShadowCall = ((_l = (_k = (_j = (_h = (_g = (_f = node === null || node === void 0 ? void 0 : node.body) === null || _f === void 0 ? void 0 : _f.body[0]) === null || _g === void 0 ? void 0 : _g.argument) === null || _h === void 0 ? void 0 : _h.callee) === null || _j === void 0 ? void 0 : _j.property) === null || _k === void 0 ? void 0 : _k.loc) === null || _l === void 0 ? void 0 : _l.identifierName) === 'attachShadow';
        return isThisExpression && isAttachShadowCall;
    })
        .replaceWith(function (path) {
        var _a, _b, _c;
        var node = path.node;
        //@ts-ignore
        shadowRootOptionsFromRemovedNode = (_c = (_b = (_a = node === null || node === void 0 ? void 0 : node.body) === null || _a === void 0 ? void 0 : _a.body[0]) === null || _b === void 0 ? void 0 : _b.argument) === null || _c === void 0 ? void 0 : _c.arguments[0];
        // Completely remove the old function
        //@ts-ignore
        node = null;
        return node;
    });
    if (shadowRootOptionsFromRemovedNode !== null) {
        root
            .find(j.ClassDeclaration)
            .replaceWith(function (path) {
            var node = path.node;
            var newElement = j.classProperty.from({
                access: "public",
                key: j.identifier("shadowRootOptions"),
                static: true,
                value: shadowRootOptionsFromRemovedNode,
                typeAnnotation: j.tsTypeAnnotation(j.tsTypeReference(j.identifier("ShadowRootInit")))
            });
            node.body.body.push(newElement);
            return node;
        });
    }
    // TODO: Add Test where this transform should not be applied
}
exports.changeShadowRootCreation = changeShadowRootCreation;
});

function transformer(file, api, options) {
    var j = api.jscodeshift;
    var root = j(file.source);
    // rename named Imports for renamed Apis
    // e. g.: import { UpdatingElement } from 'lit-element'; -> import { ReactiveElement } from 'lit-element';
    renameRenamedApis_1.renameRenamedApis({ root: root, j: j });
    // Move decorators to separate imports
    // e. g.: import { property } from 'lit-element'; -> import { property } from 'lit/decorators.js';
    moveDecorators_1.moveDecorators({ root: root, j: j });
    // Change how shadow Roots are created
    // This was not covered by Lit's migration guide
    // Turns following code:
    // protected createRenderRoot(): Element | ShadowRoot {
    //   return this.attachShadow({ mode: 'open', delegatesFocus: true });
    // }
    // into:
    // protected static shadowRootOptions: ShadowRootInit = {
    //   delegatesFocus: true,
    //   mode: 'open',
    // };
    changeShadowrootCreation.changeShadowRootCreation({ root: root, j: j });
    // Rename import import specifiers for directives
    // e. g.: 'lit-html/directives/repeat.js' -> 'lit/directives/repeat.js';
    renameDirectivePaths_1.renameDirectivePaths({ root: root, j: j });
    // Rename CssResult to CssResultGroup
    // e. g.: 'public static styles: CssResult = css``' -> 'public static styles: CssResultGroup = css``';
    renameCssResult_1.renameCssResult({ root: root, j: j });
    // Rename 'lit-element' and 'lit-html' import declarations 
    // e. g.: lit-element' -> 'lit'
    renameToLit_1.renameToLit({ root: root, j: j });
    return root.toSource({ quote: 'single', lineTerminator: '\n' });
}
module.exports = transformer;
module.exports.parser = 'ts';
