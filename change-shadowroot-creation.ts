

import { ASTPath, ClassMethod } from "jscodeshift";
import { DefaultOptions } from "./index";

export function changeShadowRootCreation({ root, j }: DefaultOptions) {
    // Transform from:

    // protected createRenderRoot(): Element | ShadowRoot {
    //   return this.attachShadow({ mode: 'open', delegatesFocus: true });
    // }
    // to:
    // protected static shadowRootOptions: ShadowRootInit = {
    //   delegatesFocus: true,
    //   mode: 'open',
    // };

    let shadowRootOptionsFromRemovedNode: any = null;

    root
        .find(j.ClassMethod)
        .filter((path) => {
            // Only inspect `createRenderRoot` calls
            const { node } = path;
            // @ts-ignore
            return node?.key?.name === 'createRenderRoot';
        })
        .filter((path) => {
            // Only inspect if `this.attachShadow` is called inside the `createRenderRoot` function
            const { node } = path;
            //@ts-ignore
            const isThisExpression: boolean = node?.body?.body[0]?.argument?.callee?.object?.type === 'ThisExpression';
            //@ts-ignore
            const isAttachShadowCall: boolean = node?.body?.body[0]?.argument?.callee?.property?.loc?.identifierName === 'attachShadow';
            return isThisExpression && isAttachShadowCall;
        })
        .replaceWith((path: ASTPath<ClassMethod>) => {
            const { node } = path;
            //@ts-ignore
            shadowRootOptionsFromRemovedNode = node?.body?.body[0]?.argument?.arguments[0];

            // Completely remove the old function
            //@ts-ignore
            node = null;
            return node;
        });

    if (shadowRootOptionsFromRemovedNode !== null) {
        root
            .find(j.ClassDeclaration)
            .replaceWith((path: ASTPath<any>) => {
                const { node } = path;
                const newElement = j.classProperty.from({
                    access: "public",
                    key: j.identifier("shadowRootOptions"),
                    static: true,
                    value: shadowRootOptionsFromRemovedNode,
                    typeAnnotation: j.tsTypeAnnotation(j.tsTypeReference(j.identifier("ShadowRootInit")))
                })
                node.body.body.push(newElement);
                return node;
            });
    }
    // TODO: Add Test where this transform should not be applied
}
