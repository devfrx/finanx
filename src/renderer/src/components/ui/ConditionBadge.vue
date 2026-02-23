<script setup lang="ts">
/**
 * ConditionBadge — Universal item condition badge.
 *
 * Renders the condition icon + localised label, coloured via the
 * `--t-condition-*` CSS custom properties defined in theme.css.
 *
 * Sizes: 'xs' | 'sm' | 'md' (default 'sm').
 * Setting `iconOnly` hides the label text.
 *
 * Usage:
 *   <ConditionBadge condition="mint" />
 *   <ConditionBadge condition="damaged" size="xs" icon-only />
 */
import AppIcon from '@renderer/components/AppIcon.vue'
import { conditionIcon } from '@renderer/data/condition'
import { useI18n } from 'vue-i18n'

const props = withDefaults(defineProps<{
    condition: string
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
    <span class="condition-badge" :class="`condition-badge--${size}`">
        <AppIcon :icon="conditionIcon(condition)" class="condition-badge__icon" />
        <span v-if="!iconOnly" class="condition-badge__label">
            {{ t(`condition.${condition}`, condition) }}
        </span>
    </span>
</template>

<style scoped>
.condition-badge {
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
.condition-badge--xs {
    font-size: 0.55rem;
    gap: 0.2em;
}

.condition-badge--xs .condition-badge__icon {
    font-size: 0.7rem;
}

.condition-badge--sm {
    font-size: 0.65rem;
}

.condition-badge--sm .condition-badge__icon {
    font-size: 0.85rem;
}

.condition-badge--md {
    font-size: 0.8rem;
}

.condition-badge--md .condition-badge__icon {
    font-size: 1rem;
}
</style>
