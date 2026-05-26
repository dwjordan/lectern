export class BulletSlide extends HTMLElement {
  connectedCallback() {
    const title = this.getAttribute('title') ?? ''
    const items = [...this.querySelectorAll('li')]

    const section = document.createElement('section')
    section.innerHTML = `
      <h2>${title}</h2>
      <ul class="text-left space-y-3 text-xl mt-6">
        ${items.map(li => `<li>${li.innerHTML}</li>`).join('\n        ')}
      </ul>
    `
    this.replaceWith(section)
  }
}

customElements.define('bullet-slide', BulletSlide)
