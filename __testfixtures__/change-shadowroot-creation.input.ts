import { LitElement } from 'lit-element';

class MyComponent extends LitElement {
    protected createRenderRoot(): Element | ShadowRoot {
        return this.attachShadow({ mode: 'open', delegatesFocus: true });
    }
}
