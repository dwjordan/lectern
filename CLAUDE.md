# Lectern

Reveal.js presentation decks built with Vite and Tailwind v4.

## Dev server

```
npm run dev
```

Decks are served at `http://localhost:5173/decks/<deck-name>/`.
The landing page at `http://localhost:5173/` lists all decks.

## Adding a new deck

1. Create `decks/<deck-name>/index.html` and `decks/<deck-name>/deck.js`
2. Add a link to the new deck in the root `index.html`

Vite auto-discovers any `decks/*/index.html` as a build entry point — no config changes needed.

Use `decks/example/` as the reference implementation.

`deck.js` is minimal:

```js
import { initDeck } from '../../shared/init.js'

initDeck()
```

Pass a config object to `initDeck()` to override reveal.js defaults for a specific deck.

## Shared files

- `shared/init.js` — Reveal.js initialization, plugins, and CSS imports. Add new plugins here.
- `shared/components/index.js` — Barrel file that imports all slide components.
- `shared/components/<name>.js` — One file per slide component.
- `shared/style.css` — Tailwind v4 entry point, `--deck-*` CSS variable defaults, reveal.js overrides, typography, layout helpers, and all shared component styles.
- `shared/themes/` — Optional theme overrides. Create a CSS file here that scopes `--deck-*` variable overrides under a class (e.g. `.reveal.deck-my-theme { ... }`), import it in `deck.js`, and add the class to the reveal root div.

## Slide components

Slides are authored as custom HTML elements in `index.html`. They replace themselves with rendered HTML before Reveal initializes. All components are registered via `shared/components/index.js` (imported by `shared/init.js`) — no per-deck imports needed.

Components work because `<script type="module">` is deferred: all HTML is parsed before the module runs, so `connectedCallback` sees the full DOM including children.

### Layout

**`<title-slide>`**
```html
<title-slide
  title="My Talk"
  subtitle="Optional subtitle"
  author="Your Name"
  date="May 2026"
></title-slide>
```

**`<bullet-slide>`**
```html
<bullet-slide title="Key Points">
  <li>First point</li>
  <li>Second point with <strong>emphasis</strong></li>
</bullet-slide>
```

**`<slide-eyebrow>`** — small label badge above the h2
```html
<slide-eyebrow>Background</slide-eyebrow>
```

**`.slide-content`** (CSS class, not a component) — constrained left-aligned container
```html
<div class="slide-content slide-content--stack">
  <!-- slide-content--wide: 64rem max (default 48rem) -->
  <!-- slide-content--stack: flex column with gap -->
</div>
```

**`.slide-footer`** (CSS class) — small monospace footer link
```html
<p class="slide-footer"><a href="https://..." target="_blank">link text</a></p>
```

### Data / context cards

**`<metric-grid>` + `<metric-card>`** — auto-fit stat grid (2 or 3 cards)
```html
<metric-grid>
  <metric-card value="Every 3–4 yrs" label="Updated from real-world data"></metric-card>
  <metric-card value="Global standard" label="Used by auditors"></metric-card>
  <metric-card value="Real breaches" label="Every item caused major incidents"></metric-card>
</metric-grid>
```
Columns auto-fit via `repeat(auto-fit, minmax(12rem, 1fr))`.

**`<feature-card>`** — icon + title + body card
```html
<feature-card icon="🛡️" title="Laravel protects you by default">
  But developers accidentally bypass those protections — and so does AI.
</feature-card>
```

### Code panels

**`<code-block>`** — single labeled code panel
```html
<code-block label="Vulnerable — no auth check" variant="danger">
  <code class="language-php" data-trim>
    // code here
  </code>
</code-block>
```
Variants: `danger` · `safe` · `neutral` · `info` · `caution`. Omit `label` for unlabeled.

**`<code-comparison>` + `<code-pane>`** — side-by-side code grid
```html
<code-comparison>
  <code-pane label="Vulnerable" variant="danger">
    <code class="language-php" data-trim>// bad</code>
  </code-pane>
  <code-pane label="Safe" variant="safe">
    <code class="language-php" data-trim>// good</code>
  </code-pane>
</code-comparison>
```
`<code-comparison>` accepts `class` attribute (e.g. `class="max-w-5xl mx-auto"`).
`<code-pane>` is a structural marker consumed by `<code-comparison>`.

### Callout boxes

All callouts: `title`, `size` (`sm`/`default`/`lg`), `title-style` (`heading`/`label`), `class`.
Body: inline HTML or `<li>` children (auto-converted to `<ul>`).

```html
<info-box title="Title">Blue informational box.</info-box>
<warning-block title="Title">Red warning box.</warning-block>
<breach-box title="Real Breach — Company (Year)">
  <p>Description.</p>
  <a href="https://..." target="_blank" rel="noopener">↗ Source</a>
</breach-box>
<tip-box title="Watch for in AI code" title-style="label">Tip text.</tip-box>
<success-box title="Safe default" title-style="label">What the framework does.</success-box>
```

`<warning-block>` stat layout:
```html
<warning-block variant="stat" stat="204" title="Average days to detect a breach">
  <p>Explanation.</p>
</warning-block>
```

### Utility components

**`<checklist-panel>`** — checkbox-style list; takes `<li>` children
```html
<checklist-panel>
  <li>Item with <code>inline code</code> and <span class="text-sky-300">highlights</span></li>
</checklist-panel>
```

**`<external-link-block>`** — inline reference pill
```html
<external-link-block>See: Some Talk · Other Talk</external-link-block>
```

**`<topic-header>`** — numbered badge row, always pinned top-left
```html
<topic-header code="A01" label="#1 Most Common"></topic-header>
<topic-header code="A06" label="Previously Covered" muted></topic-header>
```
Sections containing a topic-header automatically fill the full slide height (so Reveal anchors them at `top: 0`) and re-center body content with `padding-top: 4rem`.

### Adding a new component

1. Create `shared/components/my-slide.js` — extend `HTMLElement`, build the output element in `connectedCallback`, call `this.replaceWith(element)`, register with `customElements.define('my-slide', MySlide)`.
2. Add `import './my-slide.js'` to `shared/components/index.js`.

Use `shared/components/bullet-slide.js` as a minimal reference or `shared/components/code-block.js` for a richer example.

## Adding a plugin

In `shared/init.js`:

```js
import NewPlugin from 'reveal.js/plugin/name/name.esm.js'

// add to the plugins array in initDeck()
plugins: [Highlight, NewPlugin],
```

## PDF export

With the dev server running, export any deck via decktape:

```bash
npm run pdf --deck=<deck-name>
```

## Slide authoring (raw sections)

- Vertical stacks: nest `<section>` inside `<section>`
- Code blocks: `<pre><code class="language-js" data-trim data-line-numbers>`
- Tailwind classes work on any element inside slides
- `data-trim` strips leading/trailing whitespace from multi-line code blocks
