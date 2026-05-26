import { renderCallout } from './callout.js'

export class BreachBox extends HTMLElement {
  connectedCallback() {
    renderCallout(this, 'breach')
  }
}

customElements.define('breach-box', BreachBox)
