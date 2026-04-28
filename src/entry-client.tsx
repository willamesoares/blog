import { hydrateRoot, createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { PageDataProvider } from '~/context/PageData'
import App from '~/App'
import '~/styles/index.css'

declare global {
  interface Window {
    __INITIAL_DATA__: unknown
  }
}

const initialData = window.__INITIAL_DATA__ ?? null
const rootEl = document.getElementById('root')!

const tree = (
  <PageDataProvider data={initialData}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </PageDataProvider>
)

// In dev there's no SSR content — only the `<!--app-html-->` placeholder
// comment from index.html, which still makes innerHTML truthy. Hydrating
// against a mismatched tree causes React 18 to silently drop effects/state
// updates, breaking client-side navigation. Always createRoot in dev.
if (import.meta.env.DEV) {
  createRoot(rootEl).render(tree)
} else {
  hydrateRoot(rootEl, tree)
}
