export class FeatureCard extends HTMLElement {
  connectedCallback() {
    const icon = this.getAttribute('icon') ?? ''
    const title = this.getAttribute('title') ?? ''
    const body = this.innerHTML.trim()

    const div = document.createElement('div')
    div.className = 'feature-card'
    div.innerHTML = [
      icon ? `<span class="feature-card__icon">${icon}</span>` : '',
      '<div>',
      `<p class="feature-card__title">${title}</p>`,
      `<p class="feature-card__body">${body}</p>`,
      '</div>',
    ].join('')

    this.replaceWith(div)
  }
}

customElements.define('feature-card', FeatureCard)
