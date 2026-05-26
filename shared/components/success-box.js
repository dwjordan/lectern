import { renderCallout } from './callout.js'

export class SuccessBox extends HTMLElement {
  connectedCallback() {
    renderCallout(this, 'success')
  }
}

customElements.define('success-box', SuccessBox)
