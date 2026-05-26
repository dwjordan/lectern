class DeckItem extends HTMLElement {
  connectedCallback() {
    const href = this.getAttribute('href')
    const label = this.textContent.trim()

    const li = document.createElement('li')
    li.innerHTML = `<a href="${href}" class="text-sky-400 hover:text-sky-300 text-lg">${label}</a>`
    this.replaceWith(li)
  }
}

customElements.define('deck-item', DeckItem)
