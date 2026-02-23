<script setup lang="ts">
/**
 * RarityBadge — Universal rarity / certification tier badge.
 *
 * Renders the tier icon + localised label, coloured via the
 * `--t-rarity-*` CSS custom properties defined in theme.css.
 *
 * Sizes: 'xs' | 'sm' | 'md' (default 'sm').
 * Setting `iconOnly` hides the label text.
 *
 * Usage:
 *   <RarityBadge rarity="licensed" />
 *   <RarityBadge rarity="prestige" size="xs" icon-only />
 */
import AppIcon from '@renderer/components/AppIcon.vue'
import { rarityIcon } from '@renderer/data/rarity'
import { useI18n } from 'vue-i18n'

const props = withDefaults(defineProps<{
    rarity: string
    /** Display size variant */
    size?: 'xs' | 'sm' | 'md'
    /** Show only the icon, no label text */
    iconOnly?: boolean
}>(), {
    size: 'sm',
    iconOnly: false,
})

const { t } = useI18n()
</script>

<template>
    <span class="rarity-badge" :class="`rarity-badge--${size}`">
        <AppIcon :icon="rarityIcon(rarity)" class="rarity-badge__icon" />
        <span v-if="!iconOnly" class="rarity-badge__label">
            {{ t(`rarity.${rarity}`, rarity) }}
        </span>
    </span>
</template>

<style scoped>
.rarity-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.25em;
    color: var(--t-text-muted);
    font-weight: var(--t-font-bold);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    line-height: 1;
    vertical-align: middle;
}

/* ── Size variants ──────────────────────────────────────────── */
.rarity-badge--xs {
    font-size: 0.55rem;
    gap: 0.2em;
}

.rarity-badge--xs .rarity-badge__icon {
    font-size: 0.7rem;
}

.rarity-badge--sm {
    font-size: 0.65rem;
}

.rarity-badge--sm .rarity-badge__icon {
    font-size: 0.85rem;
}

.rarity-badge--md {
    font-size: 0.8rem;
}

.rarity-badge--md .rarity-badge__icon {
    font-size: 1rem;
}
</style>
