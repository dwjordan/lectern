export class MetricGrid extends HTMLElement {
  connectedCallback() {
    const cards = [...this.querySelectorAll('metric-card')]

    const wrapper = document.createElement('div')
    wrapper.className = 'metric-grid'
    // data-count drives the auto column CSS
    wrapper.dataset.count = cards.length

    wrapper.innerHTML = cards
      .map(card => {
        const value = card.getAttribute('value') ?? ''
        const label = card.getAttribute('label') ?? ''
        return [
          '<div class="metric-card">',
          `<p class="metric-card__value">${value}</p>`,
          `<p class="metric-card__label">${label}</p>`,
          '</div>',
        ].join('')
      })
      .join('')

    this.replaceWith(wrapper)
  }
}

// metric-card is a structural marker — consumed by metric-grid
class MetricCard extends HTMLElement {}

customElements.define('metric-grid', MetricGrid)
customElements.define('metric-card', MetricCard)
