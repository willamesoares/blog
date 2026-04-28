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
