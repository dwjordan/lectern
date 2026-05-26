export class ExternalLinkBlock extends HTMLElement {
  connectedCallback() {
    const icon = this.getAttribute('icon') ?? '📎'
    const extraClass = this.getAttribute('class') ?? ''
    const content = this.innerHTML.trim() || (this.getAttribute('text') ?? '')

    const block = document.createElement('span')
    block.className = ['external-link-block', extraClass].filter(Boolean).join(' ')
    block.innerHTML = `<span aria-hidden="true">${icon}</span><span>${content}</span>`

    this.replaceWith(block)
  }
}

customElements.define('external-link-block', ExternalLinkBlock)
