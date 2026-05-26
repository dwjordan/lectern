export class ChecklistPanel extends HTMLElement {
  connectedCallback() {
    const items = [...this.querySelectorAll('li')]

    const div = document.createElement('div')
    div.className = 'checklist-panel'
    div.innerHTML = items
      .map(
        item =>
          `<div class="checklist-panel__item"><span class="checklist-panel__box">□</span><span>${item.innerHTML}</span></div>`,
      )
      .join('')

    this.replaceWith(div)
  }
}

customElements.define('checklist-panel', ChecklistPanel)
