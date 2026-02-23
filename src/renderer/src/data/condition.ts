/**
 * Centralized item condition system — single source of truth for
 * condition tiers, icons, ordering, multipliers, and CSS variable names
 * used across the entire application.
 *
 * Mirrors the architecture of `rarity.ts`: one `CONDITION_DEFS` registry
 * from which every lookup derives.
 *
 * Colours are defined in `theme.css` via `--t-condition-<tier>` custom
 * properties.  JS code references them through `conditionCssVar()`.
 * For canvas / non-CSS contexts that need a raw hex value, use `conditionColor()`.
 *
 * Usage:
 *   import { CONDITION_DEFS, CONDITION_TIERS, conditionCssVar, conditionIcon } from '@renderer/data/condition'
 *
 * CSS variables (defined in theme.css):
 *   --t-condition-damaged … --t-condition-pristine
 */

import type { ItemCondition } from './storage/items'

// ─── Types ──────────────────────────────────────────────────────

/** Full definition for a condition tier. */
export interface ConditionDef {
  /** Numeric order (0 = worst). */
  order: number
  /** MDI icon representing the tier. */
  icon: string
  /** i18n key suffix — use with `t(`condition.${key}`)`. */
  i18nKey: string
  /** Hex fallback colour (used only where CSS vars are not available). */
  hexFallback: string
  /** Value multiplier relative to "good" condition (1.0). */
  valueMult: number
}

// ─── Definitions ────────────────────────────────────────────────

/** Central registry — every condition-related lookup derives from this map. */
export const CONDITION_DEFS: Record<ItemCondition, ConditionDef> = {
  damaged:   { order: 0, icon: 'mdi:hammer-wrench',        i18nKey: 'damaged',   hexFallback: '#ef4444', valueMult: 0.35 },
  poor:      { order: 1, icon: 'mdi:wrench',               i18nKey: 'poor',      hexFallback: '#f97316', valueMult: 0.55 },
  fair:      { order: 2, icon: 'mdi:circle-half-full',     i18nKey: 'fair',      hexFallback: '#eab308', valueMult: 0.80 },
  good:      { order: 3, icon: 'mdi:check-circle-outline', i18nKey: 'good',      hexFallback: '#22c55e', valueMult: 1.0  },
  excellent: { order: 4, icon: 'mdi:star-half-full',       i18nKey: 'excellent', hexFallback: '#3b82f6', valueMult: 1.15 },
  mint:      { order: 5, icon: 'mdi:star',                 i18nKey: 'mint',      hexFallback: '#a855f7', valueMult: 1.35 },
  pristine:  { order: 6, icon: 'mdi:star-shooting',        i18nKey: 'pristine',  hexFallback: '#facc15', valueMult: 1.70 },
}

// ─── Derived helpers ────────────────────────────────────────────

/** Ordered list of all condition tiers (worst → best). */
export const CONDITION_TIERS: ItemCondition[] = [
  'damaged', 'poor', 'fair', 'good', 'excellent', 'mint', 'pristine',
]

/** Numeric ordering for condition tiers. */
export const CONDITION_ORDER: Record<ItemCondition, number> = Object.fromEntries(
  Object.entries(CONDITION_DEFS).map(([k, v]) => [k, v.order]),
) as Record<ItemCondition, number>

/** Ordered array (backward-compat alias used by restoration, event effects, etc.). */
export const CONDITION_ORDER_ARRAY: ItemCondition[] = CONDITION_TIERS

/** Value multiplier map — backward compat for restoration calculations. */
export const CONDITION_MULTIPLIERS: Record<ItemCondition, number> = Object.fromEntries(
  Object.entries(CONDITION_DEFS).map(([k, v]) => [k, v.valueMult]),
) as Record<ItemCondition, number>

/** Hex colour map — for canvas / chart contexts that can't use CSS vars. */
export const CONDITION_COLORS: Record<ItemCondition, string> = Object.fromEntries(
  Object.entries(CONDITION_DEFS).map(([k, v]) => [k, v.hexFallback]),
) as Record<ItemCondition, string>

/** Icon map — backward compat for existing imports. */
export const CONDITION_ICONS: Record<ItemCondition, string> = Object.fromEntries(
  Object.entries(CONDITION_DEFS).map(([k, v]) => [k, v.icon]),
) as Record<ItemCondition, string>

/** Return the hex colour for a given condition string (canvas / chart use). */
export function conditionColor(condition: string): string {
  return CONDITION_DEFS[condition as ItemCondition]?.hexFallback ?? CONDITION_DEFS.good.hexFallback
}

/** Return the CSS custom-property reference: `var(--t-condition-<condition>, <fallback>)`. */
export function conditionCssVar(condition: string): string {
  const fb = CONDITION_DEFS[condition as ItemCondition]?.hexFallback ?? CONDITION_DEFS.good.hexFallback
  return `var(--t-condition-${condition}, ${fb})`
}

/** Return the MDI icon name for a given condition string. */
export function conditionIcon(condition: string): string {
  return CONDITION_DEFS[condition as ItemCondition]?.icon ?? CONDITION_DEFS.good.icon
}
