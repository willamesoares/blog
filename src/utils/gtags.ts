import { GAEvent } from '~/types/ga-events.type'

declare global {
  interface Window {
    gtag: (
      option: string,
      gaTrackingId: string,
      options: Record<string, unknown>
    ) => void
  }
}

export const pageview = (url: string, trackingId: string) => {
  if (!window.gtag) return
  window.gtag('config', trackingId, { page_path: url })
}

export const event = ({ action, category, label, value }: GAEvent) => {
  if (!window.gtag) return
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
  })
}
