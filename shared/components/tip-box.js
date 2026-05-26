import { renderCallout } from './callout.js'

export class TipBox extends HTMLElement {
  connectedCallback() {
    renderCallout(this, 'tip')
  }
}

customElements.define('tip-box', TipBox)
