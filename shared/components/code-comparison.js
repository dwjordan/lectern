export class CodeComparison extends HTMLElement {
  connectedCallback() {
    const panes = [...this.querySelectorAll('code-pane')]
    const extraClass = this.getAttribute('class') ?? ''

    const wrapper = document.createElement('div')
    wrapper.className = ['code-comparison', extraClass].filter(Boolean).join(' ')

    wrapper.innerHTML = panes
      .map(pane => {
        const label = pane.getAttribute('label') ?? ''
        const variant = pane.getAttribute('variant') ?? 'neutral'
        const codeEl = pane.querySelector('code')
        const codeHtml = codeEl ? codeEl.outerHTML : pane.innerHTML.trim()

        return [
          '<div class="code-pair">',
          label ? `<div class="code-panel__label code-panel__label--${variant}">${label}</div>` : '',
          `<pre>${codeHtml}</pre>`,
          '</div>',
        ].join('')
      })
      .join('')

    this.replaceWith(wrapper)
  }
}

// code-pane is a structural marker — consumed by code-comparison
class CodePane extends HTMLElement {}

customElements.define('code-comparison', CodeComparison)
customElements.define('code-pane', CodePane)
