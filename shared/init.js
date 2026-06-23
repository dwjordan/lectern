import Reveal from 'reveal.js'
import Highlight from 'reveal.js/plugin/highlight/highlight.esm.js'
import mermaid from 'mermaid'
import 'reveal.js/dist/reveal.css'
import 'reveal.js/dist/theme/black.css'
import 'highlight.js/styles/github-dark.css'
import './style.css'
import './components/index.js'

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: {
    darkMode: true,
    background: '#111827',
    primaryColor: '#1a2332',
    primaryTextColor: '#e2e8f0',
    primaryBorderColor: 'rgba(148, 163, 184, 0.4)',
    lineColor: 'rgba(148, 163, 184, 0.6)',
    secondaryColor: '#1a2332',
    tertiaryColor: '#111827',
    fontFamily: "'DM Sans', ui-sans-serif, system-ui, sans-serif",
  },
})

/**
 * Keep a topic-header badge visually pinned to 1.25rem from the slide
 * top, regardless of how Reveal.js vertically centres the section.
 *
 * Reveal positions sections by setting `section.style.top` in px.
 * Since the badge is `position: absolute` inside the section, its top
 * is relative to the section — so we subtract the section offset to
 * keep the badge at a fixed visual position on every slide.
 */
function syncTopicHeader(slide) {
  if (!slide) return
  const badge = slide.querySelector('.topic-header')
  if (!badge) return
  const sectionTop = parseFloat(slide.style.top) || 0
  badge.style.top = (20 - sectionTop) + 'px' // 20px = 1.25rem at 16px base
}

/**
 * Mermaid measures text against the DOM at render time, so a diagram
 * processed while its slide is `display: none` (Reveal hides slides
 * outside `viewDistance`) bakes in zero-width measurements permanently
 * — re-running mermaid later won't fix an already-processed node. Only
 * render diagrams on the slide that's actually visible right now.
 */
/**
 * Mermaid's label foreignObjects consistently measure a couple of
 * pixels narrower than the text actually needs (true across flowchart,
 * sequence, and state diagrams, regardless of label length) — normally
 * imperceptible, but our forced width:100% scale-up magnifies it enough
 * to clip the trailing character. Pad every label box slightly to give
 * the text breathing room.
 */
function padMermaidLabels(svg) {
  svg.querySelectorAll('foreignObject').forEach(fo => {
    const width = parseFloat(fo.getAttribute('width'))
    if (!width) return
    fo.setAttribute('width', width + 6)
  })
}

function renderMermaidIn(slide, deck) {
  if (!slide) return
  const nodes = Array.from(slide.querySelectorAll('.mermaid:not([data-processed="true"])'))
  if (nodes.length === 0) return
  mermaid.run({ nodes }).then(() => {
    nodes.forEach(node => {
      const svg = node.querySelector('svg')
      if (svg) padMermaidLabels(svg)
    })
    deck.layout()
  })
}

/**
 * Sequence-diagram messages render in source order as a
 * (messageText, messageLine) pair per message. Pairing them by DOM
 * order lets a fragment's `data-step` index map directly onto "the
 * Nth message in the diagram" with no per-diagram wiring needed.
 */
function getMermaidMessageGroups(svg) {
  const lines = Array.from(svg.querySelectorAll('.messageLine0, .messageLine1'))
  return lines.map(line => {
    let text = line.previousElementSibling
    while (text && !text.classList.contains('messageText')) text = text.previousElementSibling
    // Stash the original marker-end once, before we ever swap it out for
    // the highlighted clone below — otherwise re-running this on a later
    // fragment event would "remember" the swapped-in value as default.
    if (line.getAttribute('marker-end') && !line.dataset.markerEndOriginal) {
      line.dataset.markerEndOriginal = line.getAttribute('marker-end')
    }
    return { line, text }
  })
}

/**
 * Arrowhead markers are shared <marker> defs referenced by every message
 * line via marker-end="url(#id)" — recoloring the def would recolor every
 * arrowhead at once. To highlight just one, clone the def under a new id
 * with the accent color baked in, and point only the active line's
 * marker-end at the clone.
 */
function getActiveMarkerId(svg, markerEndValue) {
  const match = /url\(#([^)]+)\)/.exec(markerEndValue || '')
  if (!match) return null
  const baseId = match[1]
  const activeId = `${baseId}-active`
  if (!svg.querySelector(`#${activeId}`)) {
    const original = svg.querySelector(`#${baseId}`)
    if (!original) return null
    const clone = original.cloneNode(true)
    clone.id = activeId
    clone.querySelectorAll('path, circle, polygon').forEach(shape => {
      shape.style.fill = 'var(--deck-accent)'
      shape.style.stroke = 'var(--deck-accent)'
    })
    original.parentNode.appendChild(clone)
  }
  return activeId
}

/**
 * Step-highlight a mermaid sequence diagram in lockstep with Reveal
 * fragments. Reveal gives exactly one fragment the `current-fragment`
 * class at a time (that's literally what its `fade-in-then-out` style
 * keys off), so re-deriving "which step is active" from the DOM on
 * every shown/hidden event — rather than reacting to direction —
 * sidesteps any ordering race between the outgoing and incoming
 * fragment's events.
 */
function syncMermaidStepFragment(fragment) {
  if (!fragment.hasAttribute('data-step')) return
  const slide = fragment.closest('section')
  const svg = slide?.querySelector('.mermaid-diagram[data-steps] svg')
  if (!svg) return

  const current = slide.querySelector('.fragment.current-fragment[data-step]')
  getMermaidMessageGroups(svg).forEach((m, i) => {
    const active = !!current && Number(current.dataset.step) === i
    const dimmed = !!current && !active
    m.line.classList.toggle('step-active', active)
    m.line.classList.toggle('step-dimmed', dimmed)
    if (m.text) {
      m.text.classList.toggle('step-active', active)
      m.text.classList.toggle('step-dimmed', dimmed)
    }
    if (m.line.dataset.markerEndOriginal) {
      if (active) {
        const activeId = getActiveMarkerId(svg, m.line.dataset.markerEndOriginal)
        if (activeId) m.line.setAttribute('marker-end', `url(#${activeId})`)
      } else {
        m.line.setAttribute('marker-end', m.line.dataset.markerEndOriginal)
      }
    }
  })
}

/**
 * Initialize a reveal.js deck with shared defaults.
 * Pass per-deck overrides as needed.
 */
export function initDeck(config = {}) {
  const deck = new Reveal({
    plugins: [Highlight],
    hash: true,
    ...config,
  })
  deck.initialize().then(() => {
    syncTopicHeader(deck.getCurrentSlide())
    deck.on('slidechanged', e => {
      syncTopicHeader(e.currentSlide)
      renderMermaidIn(e.currentSlide, deck)
    })
    deck.on('resize', () => syncTopicHeader(deck.getCurrentSlide()))
    deck.on('fragmentshown', e => syncMermaidStepFragment(e.fragment))
    deck.on('fragmenthidden', e => syncMermaidStepFragment(e.fragment))
    document.fonts.ready.then(() => renderMermaidIn(deck.getCurrentSlide(), deck))
  })
  window.Reveal = deck
  return deck
}
