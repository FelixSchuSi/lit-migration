import { state } from 'lit/decorators.js';
import { LitElement, html } from 'lit';

class Element extends LitElement {
    @state() number = 5;

    render() {
        return html`<div>Here is a number: ${this.number}</div>`;
    }
}