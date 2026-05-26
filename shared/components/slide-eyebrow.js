export class SlideEyebrow extends HTMLElement {
  connectedCallback() {
    const label = this.textContent.trim()
    const el = document.createElement('p')
    el.className = 'slide-eyebrow'
    el.textContent = label
    this.replaceWith(el)
  }
}

customElements.define('slide-eyebrow', SlideEyebrow)
