const VARIANTS = new Set(['info', 'warning', 'breach', 'tip', 'success'])

export function renderCallout(element, variant) {
  if (!VARIANTS.has(variant)) {
    throw new Error(`Unknown callout variant: ${variant}`)
  }

  const title = element.getAttribute('title') ?? ''
  const size = element.getAttribute('size') ?? 'default'
  const titleStyle = element.getAttribute('title-style') ?? 'heading'
  const layout = element.getAttribute('variant') ?? 'default'
  const stat = element.getAttribute('stat') ?? ''
  const extraClass = element.getAttribute('class') ?? ''

  const items = [...element.querySelectorAll(':scope > li')]
  const bodyHtml =
    items.length > 0
      ? `<ul class="callout__list callout__list--${size}">${items.map(li => li.outerHTML).join('')}</ul>`
      : element.innerHTML.trim()

  const titleTag = titleStyle === 'label' ? 'h6' : 'p'
  const titleHtml = title
    ? `<${titleTag} class="callout__title callout__title--${titleStyle} callout__title--${size}">${title}</${titleTag}>`
    : ''

  const box = document.createElement('div')
  box.className = [
    'callout-box',
    `callout-box--${variant}`,
    `callout-box--${size}`,
    layout === 'stat' ? 'callout-box--stat' : '',
    extraClass,
  ]
    .filter(Boolean)
    .join(' ')

  for (const attr of element.attributes) {
    if (attr.name.startsWith('data-')) box.setAttribute(attr.name, attr.value)
  }

  if (layout === 'stat' && variant === 'warning') {
    box.innerHTML = `
      <span class="callout__stat">${stat}</span>
      <div class="callout-body">
        ${title ? `<p class="callout__title callout__title--stat">${title}</p>` : ''}
        ${bodyHtml}
      </div>
    `
  } else {
    box.innerHTML = `${titleHtml}${bodyHtml}`
  }

  element.replaceWith(box)
}
