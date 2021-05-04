import { LitElement, internalProperty } from 'lit-element';

class Element extends LitElement {
    @internalProperty() number = 5;
}