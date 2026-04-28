import { createContext, useContext, ReactNode } from 'react'

// Replaces Remix's useLoaderData. During SSG, the prerender script injects data
// via this provider. On client-side navigation, components fall back to fetching
// from static JSON files in /data/*.json.

const PageDataContext = createContext<unknown>(null)

export function PageDataProvider({
  data,
  children,
}: {
  data: unknown
  children: ReactNode
}) {
  return (
    <PageDataContext.Provider value={data}>{children}</PageDataContext.Provider>
  )
}

export function usePageData<T>(): T | null {
  return useContext(PageDataContext) as T | null
}

// `window.__INITIAL_DATA__` only matches the URL the page was prerendered for.
// Once the user navigates anywhere else, that data is stale forever — but it
// stays in PageDataContext for the life of the app. This module-level flag
// lets the first page mount consume the boot data exactly once, so any later
// remount (e.g. /posts/non-tech → /post/:slug → /) refetches instead of
// re-using the original payload that no longer matches the URL.
let bootConsumed = false

export function isBootConsumed() {
  return bootConsumed
}

export function consumeBootData() {
  bootConsumed = true
}
