# Lectern

Reveal.js presentation decks built with Vite and Tailwind v4.

## Getting started

```bash
npm install
npm run dev
```

Decks are served at `http://localhost:5173/decks/<deck-name>/`. The landing page at `http://localhost:5173/` lists all decks.

## Adding a deck

1. Create `decks/<deck-name>/index.html` and `decks/<deck-name>/deck.js`
2. Add a link in the root `index.html`

Vite auto-discovers any `decks/*/index.html` as a build entry point — no config changes needed. Use `decks/example/` as the reference implementation.

**Minimal `deck.js`:**
```js
import { initDeck } from '../../shared/init.js'
initDeck()
```

Pass a config object to override Reveal.js defaults for a specific deck.

## Themes

All component colours are driven by `--deck-*` CSS variables defined in `shared/style.css`. To create a custom theme, make a CSS file that overrides those variables under a scoped class:

```css
/* shared/themes/my-theme.css */
.reveal.deck-my-theme {
  --deck-accent:  #60a5fa;
  --deck-surface: #1e2d4a;
}
```

Then import it in `deck.js` and add the class to the reveal root div in `index.html`.

## Slide components

Slides are authored as custom HTML elements that replace themselves with `<section>` elements before Reveal initializes. All components are auto-loaded — no imports needed in `index.html`.

Plain `<section>` elements also work for one-off slides.

---

### Layout components

#### `<title-slide>` — opening slide
```html
<title-slide
  title="My Talk"
  subtitle="Optional subtitle"
  author="Your Name"
  date="May 2026"
></title-slide>
```

#### `<bullet-slide>` — bulleted list slide
```html
<bullet-slide title="Key Points">
  <li>First point</li>
  <li>Second point with <strong>emphasis</strong></li>
</bullet-slide>
```

#### `<slide-eyebrow>` — small label badge above the heading
```html
<slide-eyebrow>Background</slide-eyebrow>
<h2>The industry baseline</h2>
```

#### `.slide-content` — constrained content container (CSS class, not a component)
```html
<div class="slide-content slide-content--stack">
  <!-- slide-content--wide: 64rem max instead of 48rem -->
  <!-- slide-content--stack: flex column with 0.75rem gap -->
</div>
```

#### `.slide-footer` — small footer link line (CSS class)
```html
<p class="slide-footer"><a href="https://..." target="_blank">docs.example.com</a></p>
```

---

### Data / context cards

#### `<metric-grid>` + `<metric-card>` — auto-fit stat grid
```html
<metric-grid>
  <metric-card value="Every 3–4 yrs" label="Updated from real-world breach data"></metric-card>
  <metric-card value="Global standard" label="Used by auditors and pentesters"></metric-card>
  <metric-card value="Real breaches" label="Every item caused major incidents"></metric-card>
</metric-grid>
```
Columns auto-fit — works for 2 or 3 cards without any extra config.

#### `<feature-card>` — icon + title + body card
```html
<feature-card icon="🛡️" title="Framework protects you by default">
  But developers accidentally bypass those protections — and so does AI.
</feature-card>
```
Stack these for a visual alternative to bullet lists.

---

### Code panels

#### `<code-block>` — single labeled code panel
```html
<code-block label="Vulnerable — no auth check" variant="danger">
  <code class="language-php" data-trim>
    public function destroy($id) {
        Model::find($id)->delete(); // no authorize() call
    }
  </code>
</code-block>
```

**Variants:** `danger` · `safe` · `neutral` · `info` · `caution`

Omit `label` for an unlabeled panel.

#### `<code-comparison>` + `<code-pane>` — side-by-side code panels
```html
<code-comparison>
  <code-pane label="Vulnerable" variant="danger">
    <code class="language-php" data-trim>
      $hash = md5($request->password);
    </code>
  </code-pane>
  <code-pane label="Safe" variant="safe">
    <code class="language-php" data-trim>
      $hash = Hash::make($request->password);
    </code>
  </code-pane>
</code-comparison>
```

Add `class="max-w-5xl mx-auto"` to `<code-comparison>` to cap the width. `<code-pane>` accepts the same `label` and `variant` attributes as `<code-block>`.

---

### Callout boxes

All callouts accept: `title`, `size` (`sm` / `default` / `lg`), `title-style` (`heading` / `label`), `class`. The body can be HTML or a list of `<li>` elements.

```html
<info-box title="What to know">Blue informational callout.</info-box>

<warning-block title="Watch out">Red warning callout.</warning-block>

<breach-box title="Real Breach — Company (Year)">
  <p>What happened and how.</p>
  <a href="https://..." target="_blank" rel="noopener">↗ Source</a>
</breach-box>

<tip-box title="Watch for in AI code" title-style="label">Tip text.</tip-box>

<success-box title="Safe default" title-style="label">What the framework does for you.</success-box>
```

**Stat layout** (warning-block only):
```html
<warning-block variant="stat" stat="204" title="Average days to detect a breach (IBM, 2023)">
  <p class="text-slate-400 text-sm">Most of that gap is poor logging.</p>
</warning-block>
```

**List body:**
```html
<info-box title="What to look for" size="lg">
  <li class="flex gap-2"><span class="text-sky-400">→</span> First item</li>
  <li class="flex gap-2"><span class="text-sky-400">→</span> Second item</li>
</info-box>
```

---

### Utility components

#### `<checklist-panel>` — checkbox-style review list
```html
<checklist-panel>
  <li>Does every endpoint call <code>$this->authorize()</code>?</li>
  <li>Are raw queries using bindings, not concatenation?</li>
</checklist-panel>
```

#### `<external-link-block>` — inline reference pill
```html
<external-link-block>See: Authorization talk · Email Enumeration talk</external-link-block>
```
Optional `icon` attribute (default `📎`).

#### `<topic-header>` — numbered badge row, always pinned top-left
```html
<topic-header code="A01" label="#1 Most Common"></topic-header>
<topic-header code="A06" label="Previously Covered" muted></topic-header>
```
Always pinned to the top-left of the slide regardless of content height.

---

## Adding a component

1. Create `shared/components/my-component.js`:
   - Extend `HTMLElement`
   - Implement `connectedCallback()` — build a DOM element, call `this.replaceWith(element)`
   - Register with `customElements.define('my-component', MyComponent)`
2. Add `import './my-component.js'` to `shared/components/index.js`

Use `shared/components/bullet-slide.js` as a minimal reference or `shared/components/code-block.js` for a more complete example.

## Adding a plugin

In `shared/init.js`:

```js
import NewPlugin from 'reveal.js/plugin/name/name.esm.js'

// add to the plugins array in initDeck()
plugins: [Highlight, NewPlugin],
```

## Syntax highlighting

Reveal.js uses Highlight.js. Common language classes: `language-php`, `language-js`, `language-ts`, `language-bash`, `language-sql`, `language-vue`.

Always add `data-trim` to `<code>` to strip leading/trailing whitespace from multi-line blocks.

Line numbers: `<code data-line-numbers>` or `<code data-line-numbers="1-3,7">` to highlight specific lines.

## PDF export

PDF export uses [decktape](https://github.com/astefanutti/decktape), fetched automatically via `npx` — no separate install needed. With the dev server running:

```bash
npm run pdf --deck=<deck-name>
```

The deck name matches the folder under `decks/`. Output is saved to `<deck-name>.pdf` in the project root.

## Build

```bash
npm run build
```

Output goes to `dist/`.
