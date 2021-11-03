import { LitElement } from 'lit-element';

class Element extends LitElement {
    protected async getUpdateComplete(): Promise<boolean> {
        return true;
    };
}