import { LitElement } from 'lit-element';

class Element extends LitElement {
    protected async _getUpdateComplete(): Promise<unknown> {
        return true;
    };
}