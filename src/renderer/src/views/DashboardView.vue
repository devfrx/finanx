<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { usePlayerStore } from '@renderer/stores/usePlayerStore'
import { useJobStore } from '@renderer/stores/useJobStore'
import AppIcon from '@renderer/components/AppIcon.vue'
import { UAccordion, UButton } from '@renderer/components/ui'
import MultiplierStats from '@renderer/components/dashboard/MultiplierStats.vue'
import BankCard from '@renderer/components/dashboard/BankCard.vue'
import TransactionList from '@renderer/components/dashboard/TransactionList.vue'
import AccountSummary from '@renderer/components/dashboard/AccountSummary.vue'
import AtmTerminal from '@renderer/components/dashboard/AtmTerminal.vue'
import { JOBS } from '@renderer/data/jobs'
import { EventImpactBanner } from '@renderer/components/events'

const player = usePlayerStore()
const jobStore = useJobStore()

const scrollContainer = ref<HTMLElement | null>(null)
const parallaxY = ref(0)
let scrollParent: HTMLElement | null = null

function onScroll(): void {
    if (!scrollParent) return
    parallaxY.value = scrollParent.scrollTop
}

onMounted(() => {
    scrollParent = document.querySelector('.app-content') as HTMLElement | null
    if (scrollParent) {
        scrollParent.addEventListener('scroll', onScroll, { passive: true })
        onScroll()
    }
})

onBeforeUnmount(() => {
    if (scrollParent) {
        scrollParent.removeEventListener('scroll', onScroll)
        scrollParent = null
    }
})

/** Jobs the player hasn't unlocked yet but qualifies for */
const availableJobs = computed(() =>
    JOBS.filter(j => !jobStore.unlockedJobs.find(uj => uj.defId === j.id))
)

function toggleJob(defId: string): void {
    const job = jobStore.unlockedJobs.find(j => j.defId === defId)
    if (!job) return
    if (job.active) {
        jobStore.stopJob(defId)
    } else {
        jobStore.startJob(defId)
    }
}
</script>

<template>
    <div ref="scrollContainer" class="dashboard">
        <EventImpactBanner route-name="dashboard" />

        <!-- ═══ Hero: BankCard + ATM side-by-side ═══ -->
        <section class="hero">
            <div class="hero-bg">
                <div class="hero-bg-grid" :style="{ transform: `translateY(${parallaxY * 0.35}px)` }" />
                <div class="hero-bg-glow hero-bg-glow--1"
                    :style="{ transform: `translate(${parallaxY * 0.18}px, ${parallaxY * 0.25}px)` }" />
                <div class="hero-bg-glow hero-bg-glow--2"
                    :style="{ transform: `translate(${parallaxY * -0.12}px, ${parallaxY * 0.2}px)` }" />
                <div class="hero-bg-glow hero-bg-glow--3"
                    :style="{ transform: `translate(${parallaxY * 0.08}px, ${parallaxY * -0.15}px)` }" />
                <div class="hero-bg-dots" :style="{ transform: `translateY(${parallaxY * 0.12}px)` }" />
            </div>

            <div class="hero-body">
                <div class="hero-card-wrap">
                    <BankCard />
                </div>
                <div class="hero-atm-wrap">
                    <AtmTerminal />
                </div>
            </div>

            <div class="hero-fade" />
        </section>

        <!-- ═══ Main Content ═══ -->
        <div class="dash-content">
            <AccountSummary />

            <div class="dash-grid">
                <!-- Transactions (primary column) -->
                <div class="dash-primary">
                    <TransactionList />
                </div>

                <!-- Sidebar -->
                <div class="dash-side">
                    <MultiplierStats />

                    <!-- Jobs Panel -->
                    <div class="jobs-panel">
                        <h2 class="panel-heading">
                            <div class="panel-heading-icon-wrap">
                                <AppIcon icon="mdi:briefcase-outline" class="panel-heading-icon" />
                            </div>
                            <span class="panel-heading-text">{{ $t('dashboard.jobs_heading') }}</span>
                            <span class="panel-badge">{{ jobStore.activeJobCount }}/{{ jobStore.maxActiveJobs }}</span>
                        </h2>

                        <div v-if="jobStore.unlockedJobs.length > 0" class="jobs-list">
                            <div v-for="uj in jobStore.unlockedJobs" :key="uj.id" class="job-row"
                                :class="{ active: uj.active }">
                                <div class="job-icon-wrap" :class="{ 'job-icon-wrap--active': uj.active }">
                                    <AppIcon :icon="JOBS.find(j => j.id === uj.defId)?.icon || 'mdi:briefcase'"
                                        class="job-icon" />
                                </div>
                                <div class="job-info">
                                    <span class="job-name">{{JOBS.find(j => j.id === uj.defId)?.name}}</span>
                                    <span class="job-meta">{{ $t('dashboard.exp_level', { n: uj.experienceLevel })
                                        }}</span>
                                </div>
                                <UButton size="sm" :variant="uj.active ? 'danger' : 'success'"
                                    @click="toggleJob(uj.defId)">
                                    {{ uj.active ? $t('common.stop') : $t('common.start') }}
                                </UButton>
                            </div>
                        </div>

                        <UAccordion v-if="availableJobs.length > 0" :title="$t('dashboard.available_unlock')"
                            icon="mdi:lock-open-outline" :badge="availableJobs.length" variant="muted" compact>
                            <div class="jobs-list">
                                <div v-for="job in availableJobs" :key="job.id" class="job-row job-row--locked">
                                    <div class="job-icon-wrap">
                                        <AppIcon :icon="job.icon" class="job-icon" />
                                    </div>
                                    <div class="job-info">
                                        <span class="job-name">{{ job.name }}</span>
                                        <span class="job-meta">{{ job.description }}</span>
                                    </div>
                                    <UButton variant="primary" size="sm" :disabled="player.level < job.requiredLevel"
                                        @click="jobStore.unlockJob(job.id)">
                                        {{ job.requiredLevel > 0 && player.level < job.requiredLevel ?
                                            $t('dashboard.requires_level', { n: job.requiredLevel }) :
                                            $t('dashboard.apply') }} </UButton>
                                </div>
                            </div>
                        </UAccordion>

                        <div v-if="jobStore.unlockedJobs.length === 0 && availableJobs.length === 0"
                            class="empty-state">
                            <AppIcon icon="mdi:briefcase-off-outline" class="empty-icon" />
                            <span>{{ $t('banking.no_jobs') }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* ═══════════════════════════════════════════
   Dashboard — Premium Banking App Layout
   ═══════════════════════════════════════════ */
.dashboard {
    padding: 0;
    min-height: 100%;
    display: flex;
    flex-direction: column;
}

/* ─── Hero Section ─── */
.hero {
    position: relative;
    overflow: hidden;
    background: linear-gradient(165deg, var(--t-bg-sidebar) 0%, var(--t-bg-elevated) 50%, var(--t-bg-base) 100%);
    border-bottom: 1px solid color-mix(in srgb, var(--t-accent) 8%, transparent);
}

.hero-bg {
    position: absolute;
    inset: -60px;
    pointer-events: none;
    z-index: 0;
}

.hero-bg-grid {
    position: absolute;
    inset: 0;
    background-image:
        linear-gradient(color-mix(in srgb, var(--t-accent) 4%, transparent) 1px, transparent 1px),
        linear-gradient(90deg, color-mix(in srgb, var(--t-accent) 4%, transparent) 1px, transparent 1px);
    background-size: 48px 48px;
    will-change: transform;
}

.hero-bg-glow {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    will-change: transform;
}

.hero-bg-glow--1 {
    width: 400px;
    height: 400px;
    top: -120px;
    right: -60px;
    background: radial-gradient(circle, color-mix(in srgb, var(--t-accent) 14%, transparent) 0%, transparent 70%);
}

.hero-bg-glow--2 {
    width: 300px;
    height: 300px;
    bottom: -80px;
    left: -40px;
    background: radial-gradient(circle, color-mix(in srgb, var(--t-purple) 10%, transparent) 0%, transparent 70%);
}

.hero-bg-glow--3 {
    width: 200px;
    height: 200px;
    top: 40%;
    left: 55%;
    background: radial-gradient(circle, color-mix(in srgb, var(--t-accent) 8%, transparent) 0%, transparent 70%);
}

.hero-bg-dots {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(circle, color-mix(in srgb, var(--t-text) 3%, transparent) 1px, transparent 1px);
    background-size: 24px 24px;
    background-position: 12px 12px;
    will-change: transform;
}

.hero-body {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: stretch;
    gap: var(--t-space-5);
    padding: var(--t-space-8) var(--t-space-6) var(--t-space-8);
    max-width: 1100px;
    margin: 0 auto;
    width: 100%;
}

.hero-card-wrap {
    flex: 1 1 55%;
    min-width: 0;
}

.hero-atm-wrap {
    flex: 1 1 40%;
    min-width: 0;
    display: flex;
    align-items: center;
}

.hero-fade {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 80px;
    background: linear-gradient(to bottom, transparent, var(--t-bg-base));
    z-index: 1;
    pointer-events: none;
}



/* ─── Main Content Area ─── */
.dash-content {
    display: flex;
    flex-direction: column;
    gap: var(--t-space-6);
    padding: var(--t-space-6);
    position: relative;
}

/* Subtle background continuation from hero */
.dash-content::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 200px;
    background: linear-gradient(to bottom, color-mix(in srgb, var(--t-bg-elevated) 40%, var(--t-bg-base)), var(--t-bg-base));
    pointer-events: none;
    z-index: 0;
}

.dash-content>* {
    position: relative;
    z-index: 1;
}

/* ─── Two-Column Grid ─── */
.dash-grid {
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: var(--t-space-5);
    min-height: 0;
}

.dash-primary {
    min-height: 0;
}

.dash-side {
    display: flex;
    flex-direction: column;
    gap: var(--t-space-5);
    min-height: 0;
}

/* ─── Jobs Panel ─── */
.jobs-panel {
    display: flex;
    flex-direction: column;
    gap: var(--t-space-3);
    padding: var(--t-space-4);
    background: var(--t-bg-card);
    border: 1px solid var(--t-border);
    border-radius: var(--t-radius-lg);
}

.panel-heading {
    display: flex;
    align-items: center;
    gap: var(--t-space-2);
    font-size: var(--t-font-size-base);
    font-weight: var(--t-font-bold);
    color: var(--t-text);
    margin: 0;
}

.panel-heading-icon-wrap {
    width: 32px;
    height: 32px;
    border-radius: var(--t-radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background: color-mix(in srgb, var(--t-accent) 10%, var(--t-bg-muted));
}

.panel-heading-icon {
    font-size: 1rem;
    color: var(--t-accent);
}

.panel-heading-text {
    flex: 1;
}

.panel-badge {
    font-size: var(--t-font-size-xs);
    font-weight: var(--t-font-semibold);
    color: var(--t-text-muted);
    background: var(--t-bg-muted);
    padding: 0.15rem 0.5rem;
    border-radius: var(--t-radius-full);
    font-family: var(--t-font-mono);
}

.jobs-list {
    display: flex;
    flex-direction: column;
    gap: var(--t-space-2);
}

.job-row {
    display: flex;
    align-items: center;
    gap: var(--t-space-3);
    padding: var(--t-space-2) var(--t-space-3);
    background: var(--t-bg-elevated);
    border: 1px solid var(--t-border);
    border-radius: var(--t-radius-md);
    transition: all var(--t-transition-normal);
}

.job-row:hover {
    border-color: var(--t-border-hover);
    background: var(--t-bg-card-hover);
}

.job-row.active {
    border-color: color-mix(in srgb, var(--t-success) 25%, var(--t-border));
    background: color-mix(in srgb, var(--t-success) 3%, var(--t-bg-elevated));
}

.job-row--locked {
    opacity: 0.55;
}

.job-icon-wrap {
    width: 32px;
    height: 32px;
    border-radius: var(--t-radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background: var(--t-bg-muted);
    transition: all var(--t-transition-fast);
}

.job-icon-wrap--active {
    background: color-mix(in srgb, var(--t-success) 12%, var(--t-bg-muted));
}

.job-icon {
    font-size: 0.95rem;
    color: var(--t-text-secondary);
}

.job-icon-wrap--active .job-icon {
    color: var(--t-success);
}

.job-info {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
}

.job-name {
    font-size: var(--t-font-size-sm);
    font-weight: var(--t-font-semibold);
    color: var(--t-text);
}

.job-meta {
    font-size: var(--t-font-size-xs);
    color: var(--t-text-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* ─── Empty State ─── */
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--t-space-8) var(--t-space-4);
    color: var(--t-text-muted);
    font-size: var(--t-font-size-sm);
    gap: var(--t-space-2);
}

.empty-icon {
    font-size: 2rem;
    opacity: 0.4;
}

/* ─── Responsive ─── */
@media (max-width: 960px) {
    .hero-body {
        flex-direction: column;
        align-items: center;
        padding: var(--t-space-6) var(--t-space-4) var(--t-space-6);
    }

    .hero-card-wrap,
    .hero-atm-wrap {
        flex: none;
        width: 100%;
        max-width: 520px;
    }

    .dash-content {
        padding: var(--t-space-4);
    }

    .dash-grid {
        grid-template-columns: 1fr;
    }
}
</style>
