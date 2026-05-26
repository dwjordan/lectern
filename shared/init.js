import Reveal from 'reveal.js'
import Highlight from 'reveal.js/plugin/highlight/highlight.esm.js'
import 'reveal.js/dist/reveal.css'
import 'reveal.js/dist/theme/black.css'
import 'highlight.js/styles/github-dark.css'
import './style.css'
import './components/index.js'

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
    deck.on('slidechanged', e => syncTopicHeader(e.currentSlide))
    deck.on('resize', () => syncTopicHeader(deck.getCurrentSlide()))
  })
  window.Reveal = deck
  return deck
}
