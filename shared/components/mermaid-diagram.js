export class MermaidDiagram extends HTMLElement {
  connectedCallback() {
    const label = this.getAttribute('label') ?? ''
    const source = this.textContent

    const wrapper = document.createElement('div')
    wrapper.className = ['mermaid-diagram', this.getAttribute('class') ?? ''].join(' ').trim()

    if (this.hasAttribute('steps')) {
      wrapper.setAttribute('data-steps', '')
    }

    if (label) {
      wrapper.innerHTML = `<div class="code-panel__label code-panel__label--neutral">${label}</div>`
    }

    const diagram = document.createElement('pre')
    diagram.className = 'mermaid'
    diagram.textContent = source.trim()
    wrapper.appendChild(diagram)

    this.replaceWith(wrapper)
  }
}

customElements.define('mermaid-diagram', MermaidDiagram)
