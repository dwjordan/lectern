import { renderCallout } from './callout.js'

export class InfoBox extends HTMLElement {
  connectedCallback() {
    renderCallout(this, 'info')
  }
}

customElements.define('info-box', InfoBox)
