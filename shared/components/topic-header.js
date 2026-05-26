export class TopicHeader extends HTMLElement {
  connectedCallback() {
    const code = this.getAttribute('code') ?? ''
    const label = this.getAttribute('label') ?? ''
    const muted = this.hasAttribute('muted')

    const header = document.createElement('div')
    header.className = 'topic-header'
    header.innerHTML = `
      <span class="topic-header__code${muted ? ' topic-header__code--muted' : ''}">${code}</span>
      ${label ? `<span class="topic-header__label">${label}</span>` : ''}
    `
    this.replaceWith(header)
  }
}

customElements.define('topic-header', TopicHeader)
