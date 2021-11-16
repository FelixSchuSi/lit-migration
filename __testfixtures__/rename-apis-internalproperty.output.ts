import { LitElement } from 'lit';

import { state } from 'lit/decorators';

class Element extends LitElement {
    @state() number = 5;
}