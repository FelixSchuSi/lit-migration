### input
import { LitElement, html, internalProperty, customElement, query, UpdatingElement } from 'lit-element';
import { NodePart } from 'lit-html';

@customElement('my-element')
class Element extends LitElement {
    @internalProperty() number = 5;

    @query('.foo') updatingElementUsedAstype!: UpdatingElement;

    updatingElementUsedAsValue = class extends UpdatingElement { }

    render() {
        return html`<div>Here is a number: ${this.number}</div>`;
    }

    isChildPart(part: any) {
        return part instanceof NodePart;
    }
}

### output

import { LitElement, html } from 'lit';
import { state, customElement } from 'lit/decorators.js';
import { ReactiveElement } from 'lit';
import { ChildPart } from 'lit';
import { query } from 'lit-element';

@customElement('my-element')
class Element extends LitElement {
    @state() number = 5;

    @query('.foo') someReactiveElement!: ReactiveElement;

    render() {
        return html`<div>Here is a number: ${this.number}</div>`;
    }

    isChildPart(part: any) {
        return part instanceof ChildPart;
    }
}