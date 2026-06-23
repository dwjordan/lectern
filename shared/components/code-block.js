export class CodeBlock extends HTMLElement {
  connectedCallback() {
    const label = this.getAttribute('label') ?? ''
    const variant = this.getAttribute('variant') ?? 'neutral'
    const codeEl = this.querySelector('code')

    const wrapper = document.createElement('div')
    wrapper.className = ['code-block', this.getAttribute('class') ?? ''].join(' ').trim()

    if (label) {
      wrapper.innerHTML = `<div class="code-panel__label code-panel__label--${variant}">${label}</div><pre>${codeEl ? codeEl.outerHTML : this.innerHTML}</pre>`
    } else {
      wrapper.innerHTML = `<pre>${codeEl ? codeEl.outerHTML : this.innerHTML}</pre>`
    }

    this.replaceWith(wrapper)
  }
}

customElements.define('code-block', CodeBlock)
