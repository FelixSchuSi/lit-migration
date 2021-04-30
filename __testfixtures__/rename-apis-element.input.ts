import { LitElement, html, internalProperty } from 'lit-element';

class Element extends LitElement {
    @internalProperty() number = 5;

    render() {
        return html`<div>Here is a number: ${this.number}</div>`;
    }
}