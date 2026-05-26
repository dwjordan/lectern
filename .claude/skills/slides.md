# Slides — authoring guide for Lectern

Use this skill when asked to create a new deck, add slides, or work with slide components.

Invoke as `/slides outline.md` to generate a full deck from an outline file, optionally with a codebase path to draw real examples from.

---

## Working from an outline

When given a markdown outline file:

1. **Read the outline** — headings map to slides, bullets map to content points, code blocks suggest what to demonstrate.
2. **Read the codebase** (if provided) — find real files, classes, and methods that illustrate each point. **Always prefer actual code from the codebase over invented examples.** Pull real file paths, method names, and line numbers.
3. **Add external links** — wherever a GitHub file/line permalink, official docs page, or detailed article would support a claim, add it as a `<slide-footer>` or `<external-link-block>`. Specific links beat vague "see docs" references.
4. **Generate the deck** — produce a complete `decks/<name>/index.html` and `decks/<name>/deck.js` using the components below.

### Code references
- Link to specific GitHub lines: `https://github.com/org/repo/blob/main/path/to/File.php#L42`
- Prefer showing the actual code in a `<code-block>` and linking to the file in a `<slide-footer>`
- Use real class/method names, not `MyClass` or `doSomething`

### External links
- Add as `<slide-footer>` for primary sources
- Use `<external-link-block>` for supplementary references at the bottom of a content slide
- Prefer links to specific sections or line anchors over homepage links

---

## Project quick-reference

- Dev server: `npm run dev` → `http://localhost:5173/decks/<deck-name>/`
- New deck: create `decks/<name>/index.html` + `decks/<name>/deck.js`; add link in root `index.html`
- Minimal `deck.js`:
  ```js
  import { initDeck } from '../../shared/init.js'
  initDeck()
  ```
- PDF export: `npm run pdf --deck=<name>` (dev server must be running; uses decktape via npx)

---

## Full component catalogue

All components self-replace before Reveal.js initialises. They live in `shared/components/` and are auto-loaded by `shared/init.js`.

### Layout

**`<title-slide>`** — opening slide
```html
<title-slide
  title="My Talk"
  subtitle="Optional subtitle"
  author="Your Name"
  date="May 2026"
></title-slide>
```

**`<bullet-slide>`** — simple bulleted list
```html
<bullet-slide title="Key Points">
  <li>First point</li>
  <li>Second point with <strong>emphasis</strong></li>
</bullet-slide>
```

**`.slide-content`** — max-width left-aligned container (use as a class on a `<div>`)
```html
<div class="slide-content slide-content--stack">
  <!-- slide-content--wide: 64rem max instead of 48rem -->
  <!-- slide-content--stack: flex column with gap -->
</div>
```

**`.slide-footer`** — small footer link line (class on a `<p>`)
```html
<p class="slide-footer"><a href="https://..." target="_blank">link text</a></p>
```

**`<slide-eyebrow>`** — small label badge above the h2
```html
<slide-eyebrow>Background</slide-eyebrow>
```

---

### Data / context cards

**`<metric-grid>` + `<metric-card>`** — auto-fit stat grid (2 or 3 cards)
```html
<metric-grid>
  <metric-card value="Every 3–4 yrs" label="Updated from real-world data"></metric-card>
  <metric-card value="Global standard" label="Used by auditors"></metric-card>
  <metric-card value="Real breaches" label="Every item caused major incidents"></metric-card>
</metric-grid>
```
Columns auto-fit — works for 2 or 3 cards without any extra config.

**`<feature-card>`** — icon + title + body (stack these for a bullet-alternative layout)
```html
<feature-card icon="🛡️" title="Title here">
  Body text explaining the point.
</feature-card>
```

---

### Code panels

**`<code-block>`** — single labeled code panel
```html
<code-block label="app/Models/Order.php — vulnerable" variant="danger">
  <code class="language-php" data-trim>
    // real code from codebase
  </code>
</code-block>
```
Variants: `danger` · `safe` · `neutral` · `info` · `caution`
Omit `label` for an unlabeled panel.

**`<code-comparison>`** — side-by-side code panels (auto 2-column grid)
```html
<code-comparison>
  <code-pane label="Before" variant="danger">
    <code class="language-php" data-trim>// old</code>
  </code-pane>
  <code-pane label="After" variant="safe">
    <code class="language-php" data-trim>// new</code>
  </code-pane>
</code-comparison>
```
Add `class="max-w-5xl mx-auto"` to `<code-comparison>` if you need a width cap.
`<code-pane>` accepts the same `label` and `variant` attributes as `<code-block>`.

---

### Callout boxes

All callouts accept: `title`, `size` (`sm`/`default`/`lg`), `title-style` (`heading`/`label`), `class`.
Body can be HTML or `<li>` items.

```html
<info-box title="What to know">Blue informational box.</info-box>

<warning-block title="Watch out">Red warning box.</warning-block>

<breach-box title="Real Breach — Company (Year)">
  <p>What happened.</p>
  <a href="..." target="_blank" rel="noopener">↗ Source</a>
</breach-box>

<tip-box title="Watch for in code review" title-style="label">Tip text.</tip-box>

<success-box title="Safe pattern" title-style="label">What the framework does for you.</success-box>
```

**`<warning-block>` stat layout** — big number + label
```html
<warning-block variant="stat" stat="204" title="Average days to detect a breach (IBM, 2023)">
  <p class="text-slate-400 text-sm">Explanation text.</p>
</warning-block>
```

**`<info-box>` with list items**
```html
<info-box title="What to look for" size="lg">
  <li class="flex gap-2"><span class="text-sky-400">→</span> First item</li>
  <li class="flex gap-2"><span class="text-sky-400">→</span> Second item</li>
</info-box>
```

---

### Navigation / utility

**`<checklist-panel>`** — checkbox-style review list
```html
<checklist-panel>
  <li>Does every endpoint call <code>$this->authorize()</code>?</li>
  <li>Are raw queries using bindings, not concatenation?</li>
</checklist-panel>
```

**`<external-link-block>`** — inline pill badge for references
```html
<external-link-block>See: Authorization talk · Email Enumeration talk</external-link-block>
```
Optional `icon` attribute (default `📎`).

**`<topic-header>`** — numbered badge row, always pinned to top-left
```html
<topic-header code="A01" label="#1 Most Common"></topic-header>
<topic-header code="A06" label="Previously Covered" muted></topic-header>
```
The badge stays visually fixed as you navigate — useful for multi-slide sections within a topic.

---

## Common patterns

### Problem → solution slide
```html
<section>
  <slide-eyebrow>The Problem</slide-eyebrow>
  <h2>Slide title</h2>
  <div class="slide-content slide-content--stack">
    <p class="text-slate-300 text-lg">Explanation...</p>
    <code-block label="app/Http/Controllers/OrderController.php:42 — vulnerable" variant="danger">
      <code class="language-php" data-trim>// real code from codebase</code>
    </code-block>
    <info-box title="Key rule">What to remember.</info-box>
  </div>
  <p class="slide-footer"><a href="https://github.com/org/repo/blob/main/app/Http/Controllers/OrderController.php#L42" target="_blank">↗ OrderController.php:42</a></p>
</section>
```

### Before / after comparison
```html
<section>
  <slide-eyebrow>The Fix</slide-eyebrow>
  <h2>How to do it safely</h2>
  <div class="slide-content slide-content--wide slide-content--stack">
    <code-comparison>
      <code-pane label="Before" variant="danger">
        <code class="language-php" data-trim>// old pattern</code>
      </code-pane>
      <code-pane label="After" variant="safe">
        <code class="language-php" data-trim>// safe pattern</code>
      </code-pane>
    </code-comparison>
    <div class="grid grid-cols-2 gap-4">
      <breach-box title="Real Breach">What it caused.</breach-box>
      <tip-box title="Watch for in code review" title-style="label">What to check.</tip-box>
    </div>
  </div>
</section>
```

### Context / why-it-matters slide
```html
<section>
  <slide-eyebrow>Background</slide-eyebrow>
  <h2>The industry baseline</h2>
  <div class="slide-content slide-content--stack slide-prose">
    <p class="text-lg text-slate-300">Opening paragraph...</p>
    <metric-grid>
      <metric-card value="95%" label="Of breaches involve a Top 10 category"></metric-card>
      <metric-card value="Every 3–4 yrs" label="Updated from real-world data"></metric-card>
    </metric-grid>
    <p class="text-lg text-slate-300">Closing thought...</p>
  </div>
  <p class="slide-footer"><a href="https://example.com/report" target="_blank">↗ Source report</a></p>
</section>
```

### Feature-list slide (alternative to bullet-slide)
```html
<section>
  <slide-eyebrow>Why It Matters</slide-eyebrow>
  <h2>The stakes</h2>
  <div class="slide-content slide-content--stack">
    <feature-card icon="🛡️" title="Framework protects you by default">
      But you have to know when you're opting out.
    </feature-card>
    <feature-card icon="🔍" title="Real code has real patterns">
      Pull actual examples from the codebase — not toy examples.
    </feature-card>
  </div>
  <external-link-block>See: relevant-article.com · github.com/org/repo</external-link-block>
</section>
```

---

## Syntax highlighting languages

Reveal.js uses Highlight.js. Common classes: `language-php`, `language-bash`, `language-js`, `language-ts`, `language-vue`, `language-sql`.

Always add `data-trim` to `<code>` to strip leading/trailing whitespace from multi-line blocks.

Line numbers: add `data-line-numbers` to `<code>` (e.g. `data-line-numbers="1-3,7"`).
