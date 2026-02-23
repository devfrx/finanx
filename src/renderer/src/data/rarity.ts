/**
 * Centralized certification / rarity system — single source of truth for
 * certification tiers, icons, ordering, and CSS variable names used across
 * the entire application.
 *
 * Colours are **only** defined in `theme.css` via `--t-rarity-<tier>` custom
 * properties.  JS code references them through `rarityCssVar()`.
 * For canvas / non-CSS contexts that need a raw hex value, use `rarityColor()`.
 *
 * Each tier is fully described by a `RarityDef` entry in `RARITY_DEFS`.
 *
 * Usage:
 *   import { RARITY_DEFS, RARITY_TIERS, RARITY_ORDER, rarityCssVar, rarityIcon } from '@renderer/data/rarity'
 *
 * CSS variables (defined in theme.css):
 *   --t-rarity-unverified … --t-rarity-prestige
 */

// ─── Types ──────────────────────────────────────────────────────

export type Rarity = 'unverified' | 'certified' | 'graded' | 'authenticated' | 'licensed' | 'exclusive' | 'prestige'

/** Full definition for a rarity tier. */
export interface RarityDef {
  /** Numeric order (0 = lowest). */
  order: number
  /** MDI icon representing the tier. */
  icon: string
  /** i18n key suffix — use with `t(`rarity.${key}`)`. */
  i18nKey: string
  /** Hex fallback colour (used only where CSS vars are not available). */
  hexFallback: string
}

// ─── Definitions ────────────────────────────────────────────────

/** Central registry — every rarity-related lookup derives from this map. */
export const RARITY_DEFS: Record<Rarity, RarityDef> = {
  unverified:    { order: 0, icon: 'mdi:file-remove-outline',       i18nKey: 'unverified',    hexFallback: '#a1a1aa' },
  certified:     { order: 1, icon: 'mdi:certificate-outline',       i18nKey: 'certified',     hexFallback: '#22c55e' },
  graded:        { order: 2, icon: 'mdi:seal',                      i18nKey: 'graded',        hexFallback: '#3b82f6' },
  authenticated: { order: 3, icon: 'mdi:stamper',                   i18nKey: 'authenticated', hexFallback: '#a855f7' },
  licensed:      { order: 4, icon: 'mdi:ribbon',                    i18nKey: 'licensed',      hexFallback: '#f59e0b' },
  exclusive:     { order: 5, icon: 'mdi:seal-variant',              i18nKey: 'exclusive',     hexFallback: '#ef4444' },
  prestige:      { order: 6, icon: 'mdi:medal-outline',             i18nKey: 'prestige',      hexFallback: '#facc15' },
}

// ─── Derived helpers (kept for backward compat & convenience) ───

/** Ordered list of all rarity tiers (lowest → highest). */
export const RARITY_TIERS: Rarity[] = [
  'unverified', 'certified', 'graded', 'authenticated', 'licensed', 'exclusive', 'prestige',
]

/** Numeric ordering for rarity tiers — single source of truth. */
export const RARITY_ORDER: Record<Rarity, number> = Object.fromEntries(
  Object.entries(RARITY_DEFS).map(([k, v]) => [k, v.order]),
) as Record<Rarity, number>

/**
 * Hex colour map — kept for canvas / chart contexts that can't use CSS vars.
 * Values intentionally match the `--t-rarity-*` vars defined in `theme.css`.
 */
export const RARITY_COLORS: Record<string, string> = Object.fromEntries(
  Object.entries(RARITY_DEFS).map(([k, v]) => [k, v.hexFallback]),
)

/** Return the hex colour for a given rarity string (canvas / chart use). */
export function rarityColor(rarity: string): string {
  return RARITY_DEFS[rarity as Rarity]?.hexFallback ?? RARITY_DEFS.unverified.hexFallback
}

/** Return the CSS custom-property reference: `var(--t-rarity-<rarity>, <fallback>)`. */
export function rarityCssVar(rarity: string): string {
  const fb = RARITY_DEFS[rarity as Rarity]?.hexFallback ?? RARITY_DEFS.unverified.hexFallback
  return `var(--t-rarity-${rarity}, ${fb})`
}

/** Return the MDI icon name for a given rarity string. */
export function rarityIcon(rarity: string): string {
  return RARITY_DEFS[rarity as Rarity]?.icon ?? RARITY_DEFS.unverified.icon
}

// ─── Save Migration ─────────────────────────────────────────────

/** Map old rarity names → new certification tier names (for save migration). */
const LEGACY_RARITY_MAP: Record<string, Rarity> = {
  common:    'unverified',
  uncommon:  'certified',
  rare:      'graded',
  epic:      'authenticated',
  legendary: 'licensed',
  jackpot:   'exclusive',
  mythic:    'prestige',
}

/** Migrate a rarity string from the old system to the new one. Already-new values pass through. */
export function migrateRarity(rarity: string): Rarity {
  return LEGACY_RARITY_MAP[rarity] ?? (RARITY_ORDER[rarity as Rarity] !== undefined ? rarity as Rarity : 'unverified')
}

/**
 * Walk an array of item-like objects and migrate their `.rarity` property in-place.
 * Safe to call on already-migrated data (idempotent).
 */
export function migrateItemRarities<T extends { rarity: string }>(items: T[]): T[] {
  for (const item of items) {
    item.rarity = migrateRarity(item.rarity)
  }
  return items
}
