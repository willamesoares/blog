type HSL = { h: number; s: number; l: number }

// Hue/saturation/lightness of the site's green brand palette, extracted from
// the hex values in src/styles/index.css. Shifting hue only (keeping each
// token's own saturation/lightness) preserves the palette's existing
// light/dark relationships (hover, soft background, visited) under rotation.
const BRAND_HSL: Record<string, HSL> = {
  "--color-brand": { h: 141, s: 35, l: 27 },
  "--color-brand-hover": { h: 140, s: 41, l: 21 },
  "--color-brand-soft": { h: 135, s: 4, l: 92 },
  "--color-visited": { h: 139, s: 15, l: 42 },
}

const ANCHOR_HUE = BRAND_HSL["--color-brand"].h

// Caps how far a tag's color can rotate the palette. Wide enough that tags
// hashing to nearby hues still land on visibly distinct colors, but capped
// short of 180° so the palette can never rotate into green's near-opposite
// (magenta/pink).
const MAX_HUE_SHIFT = 120

function hashTagHue(name: string): number {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash) % 360
}

function circularMeanHue(hues: number[]): number {
  const radians = hues.map((h) => (h * Math.PI) / 180)
  const x = radians.reduce((sum, r) => sum + Math.cos(r), 0) / radians.length
  const y = radians.reduce((sum, r) => sum + Math.sin(r), 0) / radians.length
  const degrees = (Math.atan2(y, x) * 180) / Math.PI
  return degrees < 0 ? degrees + 360 : degrees
}

function circularDelta(from: number, to: number): number {
  return ((to - from + 540) % 360) - 180
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

/**
 * Blends the site's green brand palette toward the colors of the selected
 * tags. Each tag name hashes to a stable hue (no color field needed in the
 * CMS), multiple tags are averaged circularly, and the resulting shift is
 * capped so green always stays dominant. Returns null when no tags are
 * selected, meaning "use the default palette".
 */
export function getTagThemeColors(
  selectedTags: string[],
): Record<string, string> | null {
  if (!selectedTags.length) return null

  const avgTagHue = circularMeanHue(selectedTags.map(hashTagHue))
  const delta = clamp(
    circularDelta(ANCHOR_HUE, avgTagHue),
    -MAX_HUE_SHIFT,
    MAX_HUE_SHIFT,
  )

  return Object.fromEntries(
    Object.entries(BRAND_HSL).map(([variable, { h, s, l }]) => [
      variable,
      `hsl(${(h + delta + 360) % 360} ${s}% ${l}%)`,
    ]),
  )
}
