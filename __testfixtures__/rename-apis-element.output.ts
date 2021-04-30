import { LitElement, html } from 'lit';

import { state } from 'lit/decorators.js';

class Element extends LitElement {
    @state() number = 5;

    render() {
        return html`<div>Here is a number: ${this.number}</div>`;
    }
}