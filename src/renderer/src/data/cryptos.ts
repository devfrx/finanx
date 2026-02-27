import type { AssetConfig } from '@renderer/core/MarketSim'

/**
 * Drift values are set so log-drift (μ − σ²/2) is positive for every asset.
 * This ensures the median price trajectory trends upward over time,
 * while meme coins have higher risk AND higher expected reward.
 *
 * stakingYield is annual yield (like dividendYield for stocks).
 * Tokens without proof-of-stake / staking have 0 yield.
 */
export const CRYPTOS: AssetConfig[] = [
  {
    id: 'BTC',
    name: 'BitCoin',
    ticker: 'BTC',
    sector: 'crypto',
    basePrice: 42000,
    drift: 0.25, // log-drift ≈ +7% (σ²/2 = 0.18)
    volatility: 0.6,
    minPrice: 0.01,
    maxHistory: 2000,
    stakingYield: 0.01 // 1% — PoW, minimal staking
  },
  {
    id: 'ETH',
    name: 'EtherBlock',
    ticker: 'ETH',
    sector: 'crypto',
    basePrice: 2200,
    drift: 0.22, // log-drift ≈ +6.9% (σ²/2 = 0.151)
    volatility: 0.55,
    minPrice: 0.01,
    maxHistory: 2000,
    stakingYield: 0.04 // 4% — PoS
  },
  {
    id: 'DOGE',
    name: 'DogeToken',
    ticker: 'DOGE',
    sector: 'meme',
    basePrice: 0.08,
    drift: 0.35, // log-drift ≈ +3% (σ²/2 = 0.32)
    volatility: 0.8,
    minPrice: 0.0001,
    maxHistory: 2000,
    stakingYield: 0 // meme — no staking
  },
  {
    id: 'SOL',
    name: 'Solarium',
    ticker: 'SOL',
    sector: 'crypto',
    basePrice: 95,
    drift: 0.28, // log-drift ≈ +6.9% (σ²/2 = 0.211)
    volatility: 0.65,
    minPrice: 0.01,
    maxHistory: 2000,
    stakingYield: 0.055 // 5.5% — PoS, higher yield
  },
  {
    id: 'PEPE',
    name: 'PepeCoin',
    ticker: 'PEPE',
    sector: 'meme',
    basePrice: 0.001,
    drift: 0.42, // log-drift ≈ +1.5% (σ²/2 = 0.405)
    volatility: 0.9,
    minPrice: 0.000001,
    maxHistory: 2000,
    stakingYield: 0 // meme — no staking
  },
  {
    id: 'LINK',
    name: 'ChainLink',
    ticker: 'LINK',
    sector: 'defi',
    basePrice: 14,
    drift: 0.2, // log-drift ≈ +7.5% (σ²/2 = 0.125)
    volatility: 0.5,
    minPrice: 0.01,
    maxHistory: 2000,
    stakingYield: 0.03 // 3% — protocol staking
  },
  {
    id: 'AVAX',
    name: 'Avalanche',
    ticker: 'AVAX',
    sector: 'crypto',
    basePrice: 35,
    drift: 0.22, // log-drift ≈ +6.9% (σ²/2 = 0.151)
    volatility: 0.55,
    minPrice: 0.01,
    maxHistory: 2000,
    stakingYield: 0.06 // 6% — PoS, high yield
  },
  {
    id: 'SHIB',
    name: 'ShibaSwap',
    ticker: 'SHIB',
    sector: 'meme',
    basePrice: 0.00001,
    drift: 0.46, // log-drift ≈ +0.9% (σ²/2 = 0.451)
    volatility: 0.95,
    minPrice: 0.0000001,
    maxHistory: 2000,
    stakingYield: 0 // meme — no staking
  },
  {
    id: 'ADA',
    name: 'CardaNode',
    ticker: 'ADA',
    sector: 'crypto',
    basePrice: 0.45,
    drift: 0.2, // log-drift ≈ +7.5% (σ²/2 = 0.125)
    volatility: 0.5,
    minPrice: 0.001,
    maxHistory: 2000,
    stakingYield: 0.045 // 4.5% — PoS, solid staking rewards
  },
  {
    id: 'DOT',
    name: 'PolyDot',
    ticker: 'DOT',
    sector: 'crypto',
    basePrice: 7.5,
    drift: 0.22, // log-drift ≈ +6.9% (σ²/2 = 0.151)
    volatility: 0.55,
    minPrice: 0.01,
    maxHistory: 2000,
    stakingYield: 0.12 // 12% — NPoS, very high staking yield
  },
  {
    id: 'MATIC',
    name: 'MaticLayer',
    ticker: 'MATIC',
    sector: 'defi',
    basePrice: 0.8,
    drift: 0.25, // log-drift ≈ +7% (σ²/2 = 0.18)
    volatility: 0.6,
    minPrice: 0.001,
    maxHistory: 2000,
    stakingYield: 0.05 // 5% — Layer 2 staking
  },
  {
    id: 'UNI',
    name: 'UniSwapX',
    ticker: 'UNI',
    sector: 'defi',
    basePrice: 6.0,
    drift: 0.18, // log-drift ≈ +8.2% (σ²/2 = 0.1)
    volatility: 0.45,
    minPrice: 0.01,
    maxHistory: 2000,
    stakingYield: 0.025 // 2.5% — governance token, partial yield
  },
  {
    id: 'XRP',
    name: 'RippleNet',
    ticker: 'XRP',
    sector: 'crypto',
    basePrice: 0.55,
    drift: 0.15, // log-drift ≈ +9.3% (σ²/2 = 0.056)
    volatility: 0.45,
    minPrice: 0.001,
    maxHistory: 2000,
    stakingYield: 0 // no staking — pre-mined
  },
  {
    id: 'LTC',
    name: 'LiteCoin',
    ticker: 'LTC',
    sector: 'crypto',
    basePrice: 70,
    drift: 0.18, // log-drift ≈ +9.5% (σ²/2 = 0.083)
    volatility: 0.41,
    minPrice: 0.01,
    maxHistory: 2000,
    stakingYield: 0.008 // 0.8% — PoW, minimal yield via pools
  },
  {
    id: 'WIF',
    name: 'WifHat',
    ticker: 'WIF',
    sector: 'meme',
    basePrice: 0.003,
    drift: 0.44, // log-drift ≈ +1.1% (σ²/2 = 0.432)
    volatility: 0.93,
    minPrice: 0.000001,
    maxHistory: 2000,
    stakingYield: 0 // meme — no staking
  },
  {
    id: 'MOON',
    name: 'MoonShot',
    ticker: 'MOON',
    sector: 'meme',
    basePrice: 0.000005,
    drift: 0.5, // log-drift ≈ +0.5% (σ²/2 = 0.495)
    volatility: 0.99,
    minPrice: 0.0000000001,
    maxHistory: 2000,
    stakingYield: 0 // meme — no staking
  }
]
