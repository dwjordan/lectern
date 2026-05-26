export class TitleSlide extends HTMLElement {
  connectedCallback() {
    const title = this.getAttribute('title') ?? ''
    const subtitle = this.getAttribute('subtitle') ?? ''
    const author = this.getAttribute('author') ?? ''
    const date = this.getAttribute('date') ?? ''

    const section = document.createElement('section')
    section.innerHTML = `
      <h1 class="!text-5xl font-bold mb-4">${title}</h1>
      ${subtitle ? `<p class="title-slide__subtitle text-2xl mb-8">${subtitle}</p>` : ''}
      <div class="title-slide__meta text-lg space-y-1">
        ${author ? `<p>${author}</p>` : ''}
        ${date ? `<p>${date}</p>` : ''}
      </div>
    `
    this.replaceWith(section)
  }
}

customElements.define('title-slide', TitleSlide)
