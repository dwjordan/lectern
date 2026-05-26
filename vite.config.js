import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import { readdirSync, existsSync } from 'fs'

function getDeckEntries() {
  const decksDir = resolve(__dirname, 'decks')
  return Object.fromEntries(
    readdirSync(decksDir, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => [d.name, resolve(decksDir, d.name, 'index.html')])
      .filter(([, p]) => existsSync(p))
  )
}

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        ...getDeckEntries(),
      },
    },
  },
})
