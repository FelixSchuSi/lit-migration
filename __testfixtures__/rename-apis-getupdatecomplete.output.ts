import { LitElement } from 'lit';

class Element extends LitElement {
    protected async getUpdateComplete(): Promise<boolean> {
        return true;
    };
}