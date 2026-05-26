import { renderCallout } from './callout.js'

export class WarningBlock extends HTMLElement {
  connectedCallback() {
    renderCallout(this, 'warning')
  }
}

customElements.define('warning-block', WarningBlock)
