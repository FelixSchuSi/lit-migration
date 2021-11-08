import type { API, Collection, FileInfo, JSCodeshift, Options } from "jscodeshift";
import { moveDecorators } from "./move-decorators";
import { renameDirectivePaths } from "./rename-directive-paths";
import { renameToLit } from "./rename-to-lit";
import { renameRenamedApis } from "./rename-renamed-apis";
import { renameCssResult } from "./rename-css-result";
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
    // e. g.: import { property } from 'lit-element'; -> import { property } from 'lit/decorators.js';
    moveDecorators({ root, j });

    // Rename import import specifiers for directives
    // e. g.: 'lit-html/directives/repeat.js' -> 'lit/directives/repeat.js';
    renameDirectivePaths({ root, j });

    // Rename CssResult to CssResultGroup
    // e. g.: 'public static styles: CssResult = css``' -> 'public static styles: CssResultGroup = css``';
    renameCssResult({ root, j });

    // Rename 'lit-element' and 'lit-html' import declarations 
    // e. g.: lit-element' -> 'lit'
    renameToLit({ root, j });

    return root.toSource({ quote: 'single', lineTerminator : '\n' });
}


module.exports = transformer;
module.exports.parser = 'ts';
