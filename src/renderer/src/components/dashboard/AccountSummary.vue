<script setup lang="ts">
import { computed } from 'vue'
import { usePlayerStore } from '@renderer/stores/usePlayerStore'
import { useBusinessStore } from '@renderer/stores/useBusinessStore'
import { useJobStore } from '@renderer/stores/useJobStore'
import { useRealEstateStore } from '@renderer/stores/useRealEstateStore'
import { useDepositStore } from '@renderer/stores/useDepositStore'
import { useLoanStore } from '@renderer/stores/useLoanStore'
import { useBankingStore } from '@renderer/stores/useBankingStore'
import { useFormat } from '@renderer/composables/useFormat'
import { ZERO, add, sub } from '@renderer/core/BigNum'
import AppIcon from '@renderer/components/AppIcon.vue'

const player = usePlayerStore()
const business = useBusinessStore()
const jobStore = useJobStore()
const realEstate = useRealEstateStore()
const deposits = useDepositStore()
const loans = useLoanStore()
const banking = useBankingStore()
const { formatCash } = useFormat()

const totalIncomePerSecond = computed(() => {
    let total = ZERO
    total = add(total, business.profitPerSecond)
    total = add(total, jobStore.jobIncomePerSecond)
    total = add(total, realEstate.rentPerSecond)
    total = add(total, deposits.interestPerSecond)
    return total
})

const totalExpensePerSecond = computed(() => {
    return loans.totalInterestPerSecond
})

const netFlowPerSecond = computed(() => {
    return sub(totalIncomePerSecond.value, totalExpensePerSecond.value)
})

const summaryItems = computed(() => [
    {
        icon: 'mdi:scale-balance',
        label: 'banking.net_worth',
        value: formatCash(player.netWorth),
        color: 'var(--t-text)',
    },
    {
        icon: 'mdi:arrow-down-bold-circle',
        label: 'banking.total_income',
        value: formatCash(banking.totalIncome),
        color: 'var(--t-success)',
    },
    {
        icon: 'mdi:arrow-up-bold-circle',
        label: 'banking.total_expenses',
        value: formatCash(banking.totalExpenses),
        color: 'var(--t-danger)',
    },
    {
        icon: 'mdi:bank-transfer-out',
        label: 'banking.total_debt',
        value: formatCash(loans.totalDebt),
        color: loans.totalDebt.gt(0) ? 'var(--t-warning)' : 'var(--t-text-muted)',
    },
])

const incomeBreakdown = computed(() => [
    { label: 'banking.income_business', value: business.profitPerSecond, icon: 'mdi:store', color: 'var(--t-info)' },
    { label: 'banking.income_jobs', value: jobStore.jobIncomePerSecond, icon: 'mdi:briefcase', color: 'var(--t-success)' },
    { label: 'banking.income_realestate', value: realEstate.rentPerSecond, icon: 'mdi:home-city', color: 'var(--t-purple)' },
    { label: 'banking.income_deposits', value: deposits.interestPerSecond, icon: 'mdi:piggy-bank', color: 'var(--t-cyan)' },
].filter(item => item.value.gt(0)))
</script>

<template>
    <div class="account-summary">
        <!-- ═══ Flow Overview (glass-style cards) ═══ -->
        <div class="flow-strip">
            <div class="flow-card">
                <div class="flow-icon-wrap flow-icon-wrap--income">
                    <AppIcon icon="mdi:trending-up" class="flow-icon" />
                </div>
                <div class="flow-body">
                    <span class="flow-label">{{ $t('banking.income_per_sec') }}</span>
                    <span class="flow-value positive">
                        +{{ formatCash(totalIncomePerSecond) }}/s
                    </span>
                </div>
            </div>
            <div class="flow-card">
                <div class="flow-icon-wrap flow-icon-wrap--expense">
                    <AppIcon icon="mdi:trending-down" class="flow-icon" />
                </div>
                <div class="flow-body">
                    <span class="flow-label">{{ $t('banking.expenses_per_sec') }}</span>
                    <span class="flow-value negative">
                        -{{ formatCash(totalExpensePerSecond) }}/s
                    </span>
                </div>
            </div>
            <div class="flow-card flow-card--accent">
                <div class="flow-icon-wrap flow-icon-wrap--net">
                    <AppIcon icon="mdi:chart-timeline-variant" class="flow-icon" />
                </div>
                <div class="flow-body">
                    <span class="flow-label">{{ $t('banking.net_flow') }}</span>
                    <span class="flow-value"
                        :class="{ positive: netFlowPerSecond.gte(0), negative: netFlowPerSecond.lt(0) }">
                        {{ netFlowPerSecond.gte(0) ? '+' : '' }}{{ formatCash(netFlowPerSecond) }}/s
                    </span>
                </div>
            </div>
        </div>

        <!-- ═══ Summary Grid ═══ -->
        <div class="summary-grid">
            <div v-for="item in summaryItems" :key="item.label" class="summary-card">
                <div class="summary-icon-wrap"
                    :style="{ background: `color-mix(in srgb, ${item.color} 10%, var(--t-bg-muted))` }">
                    <AppIcon :icon="item.icon" class="summary-icon" :style="{ color: item.color }" />
                </div>
                <div class="summary-info">
                    <span class="summary-value" :style="{ color: item.color }">{{ item.value }}</span>
                    <span class="summary-label">{{ $t(item.label) }}</span>
                </div>
            </div>
        </div>

        <!-- ═══ Income Breakdown ═══ -->
        <div v-if="incomeBreakdown.length > 0" class="breakdown-panel">
            <div class="breakdown-header">
                <div class="breakdown-header-icon-wrap">
                    <AppIcon icon="mdi:chart-pie" class="breakdown-header-icon" />
                </div>
                <span class="breakdown-title">{{ $t('banking.income_sources') }}</span>
            </div>
            <div class="breakdown-list">
                <div v-for="item in incomeBreakdown" :key="item.label" class="breakdown-row">
                    <div class="breakdown-dot" :style="{ background: item.color }" />
                    <AppIcon :icon="item.icon" class="breakdown-row-icon" :style="{ color: item.color }" />
                    <span class="breakdown-label">{{ $t(item.label) }}</span>
                    <span class="breakdown-value">{{ formatCash(item.value) }}/s</span>
                </div>
            </div>
        </div>

        <!-- ═══ Lifetime Stats ═══ -->
        <div class="stats-strip">
            <div class="stat-chip">
                <span class="stat-chip-value">{{ formatCash(player.totalCashEarned) }}</span>
                <span class="stat-chip-label">{{ $t('banking.lifetime_earnings') }}</span>
            </div>
            <div class="stat-chip">
                <span class="stat-chip-value">{{ banking.lifetimeTransactions }}</span>
                <span class="stat-chip-label">{{ $t('banking.total_transactions') }}</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* ═══════════════════════════════════════════
   Account Summary — Premium Banking Style
   ═══════════════════════════════════════════ */
.account-summary {
    display: flex;
    flex-direction: column;
    gap: var(--t-space-4);
}

/* ─── Flow Strip ─── */
.flow-strip {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: var(--t-space-3);
}

.flow-card {
    display: flex;
    align-items: center;
    gap: var(--t-space-3);
    padding: var(--t-space-3) var(--t-space-4);
    background: var(--t-bg-card);
    border: 1px solid var(--t-border);
    border-radius: var(--t-radius-lg);
    transition: border-color var(--t-transition-normal), box-shadow var(--t-transition-normal);
}

.flow-card:hover {
    border-color: var(--t-border-hover);
}

.flow-card--accent {
    border-color: color-mix(in srgb, var(--t-accent) 15%, var(--t-border));
}

.flow-icon-wrap {
    width: 34px;
    height: 34px;
    border-radius: var(--t-radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background: var(--t-bg-muted);
}

.flow-icon-wrap--income {
    background: color-mix(in srgb, var(--t-success) 10%, var(--t-bg-muted));
}

.flow-icon-wrap--expense {
    background: color-mix(in srgb, var(--t-danger) 10%, var(--t-bg-muted));
}

.flow-icon-wrap--net {
    background: color-mix(in srgb, var(--t-accent) 10%, var(--t-bg-muted));
}

.flow-icon {
    font-size: 1rem;
    color: var(--t-text-muted);
}

.flow-icon-wrap--income .flow-icon {
    color: var(--t-success);
}

.flow-icon-wrap--expense .flow-icon {
    color: var(--t-danger);
}

.flow-icon-wrap--net .flow-icon {
    color: var(--t-accent);
}

.flow-body {
    display: flex;
    flex-direction: column;
    min-width: 0;
}

.flow-label {
    font-size: var(--t-font-size-2xs);
    color: var(--t-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    font-weight: var(--t-font-medium);
    white-space: nowrap;
}

.flow-value {
    font-family: var(--t-font-mono);
    font-size: var(--t-font-size-base);
    font-weight: var(--t-font-bold);
    color: var(--t-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.flow-value.positive {
    color: var(--t-success);
}

.flow-value.negative {
    color: var(--t-danger);
}

/* ─── Summary Grid ─── */
.summary-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: var(--t-space-3);
}

.summary-card {
    display: flex;
    align-items: center;
    gap: var(--t-space-3);
    padding: var(--t-space-3) var(--t-space-4);
    background: var(--t-bg-card);
    border: 1px solid var(--t-border);
    border-radius: var(--t-radius-lg);
    transition: border-color var(--t-transition-normal);
}

.summary-card:hover {
    border-color: var(--t-border-hover);
}

.summary-icon-wrap {
    width: 34px;
    height: 34px;
    border-radius: var(--t-radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.summary-icon {
    font-size: 1.1rem;
}

.summary-info {
    display: flex;
    flex-direction: column;
    min-width: 0;
}

.summary-value {
    font-family: var(--t-font-mono);
    font-size: var(--t-font-size-base);
    font-weight: var(--t-font-bold);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.summary-label {
    font-size: var(--t-font-size-2xs);
    color: var(--t-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    font-weight: var(--t-font-medium);
}

/* ─── Income Breakdown ─── */
.breakdown-panel {
    padding: var(--t-space-4);
    background: var(--t-bg-card);
    border: 1px solid var(--t-border);
    border-radius: var(--t-radius-lg);
}

.breakdown-header {
    display: flex;
    align-items: center;
    gap: var(--t-space-2);
    margin-bottom: var(--t-space-3);
}

.breakdown-header-icon-wrap {
    width: 28px;
    height: 28px;
    border-radius: var(--t-radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background: color-mix(in srgb, var(--t-accent) 10%, var(--t-bg-muted));
}

.breakdown-header-icon {
    font-size: 0.85rem;
    color: var(--t-accent);
}

.breakdown-title {
    font-size: var(--t-font-size-sm);
    font-weight: var(--t-font-semibold);
    color: var(--t-text);
    margin: 0;
}

.breakdown-list {
    display: flex;
    flex-direction: column;
    gap: var(--t-space-2);
}

.breakdown-row {
    display: flex;
    align-items: center;
    gap: var(--t-space-2);
    padding: var(--t-space-1) var(--t-space-2);
    border-radius: var(--t-radius-sm);
    transition: background var(--t-transition-fast);
}

.breakdown-row:hover {
    background: var(--t-bg-muted);
}

.breakdown-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
}

.breakdown-row-icon {
    font-size: 0.9rem;
    flex-shrink: 0;
}

.breakdown-label {
    font-size: var(--t-font-size-sm);
    color: var(--t-text-secondary);
    flex: 1;
}

.breakdown-value {
    font-family: var(--t-font-mono);
    font-size: var(--t-font-size-sm);
    font-weight: var(--t-font-semibold);
    color: var(--t-text);
}

/* ─── Stats Strip ─── */
.stats-strip {
    display: flex;
    gap: var(--t-space-3);
}

.stat-chip {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.1rem;
    padding: var(--t-space-3);
    background: var(--t-bg-card);
    border: 1px solid var(--t-border);
    border-radius: var(--t-radius-lg);
    transition: border-color var(--t-transition-normal);
}

.stat-chip:hover {
    border-color: var(--t-border-hover);
}

.stat-chip-value {
    font-family: var(--t-font-mono);
    font-size: var(--t-font-size-base);
    font-weight: var(--t-font-bold);
    color: var(--t-text);
}

.stat-chip-label {
    font-size: var(--t-font-size-2xs);
    color: var(--t-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    font-weight: var(--t-font-medium);
    text-align: center;
    white-space: nowrap;
}

/* ─── Responsive ─── */
@media (max-width: 700px) {
    .flow-strip {
        grid-template-columns: 1fr;
    }

    .stats-strip {
        flex-direction: column;
    }
}
</style>
