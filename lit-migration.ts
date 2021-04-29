import type { API, Collection, FileInfo, JSCodeshift, Options } from "jscodeshift";
import { moveDecorators } from "./move-decorators";
import { renameDirectivePaths } from "./rename-directive-paths";
import { renameLitElementPaths } from "./rename-lit-element-paths";
import { renameRenamedApis } from "./rename-renamed-apis";
export interface DefaultOptions {
    j: JSCodeshift,
    root: Collection<any>
}

function transformer(file: FileInfo, api: API, options: Options) {
    const j = api.jscodeshift;
    const root = j(file.source);


    // rename named Imports for renamed Apis
    // e. g.: import { UpdatingElement } from 'lit-element'; -> import { ReactiveElement } from 'lit-element';
    renameRenamedApis({ root, j });

    // Move decorators to separate imports
    // e. g.: import {property} from `lit-element`; -> import {property} from `lit/decorators.js`;
    moveDecorators({ root, j });

    // Rename import import specifiers for directives
    // e. g.: 'lit-html/directives/repeat.js' -> 'lit/directives/repeat.js';
    renameDirectivePaths({ root, j });

    // Rename 'lit-element' import declarations 
    // e. g.: lit-element' -> 'lit'
    renameLitElementPaths({ root, j });

    return root.toSource({ quote: 'single' })
}


module.exports = transformer;