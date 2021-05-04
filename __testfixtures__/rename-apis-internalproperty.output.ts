import { LitElement } from 'lit';

import { state } from 'lit/decorators.js';

class Element extends LitElement {
    @state() number = 5;
}