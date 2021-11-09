import { LitElement } from 'lit';

class MyComponent extends LitElement {
    public static shadowRootOptions: ShadowRootInit = { mode: 'open', delegatesFocus: true };
}
