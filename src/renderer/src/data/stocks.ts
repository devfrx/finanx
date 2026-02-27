import type { AssetConfig } from '@renderer/core/MarketSim'

/**
 * Dividend yield is annual yield as a fraction (e.g. 0.035 = 3.5%).
 * Paid out proportionally each dividend tick as: shares × price × yield / ticksPerYear.
 * Growth stocks have 0 yield; value/defensive stocks have higher yields.
 */
export const STOCKS: AssetConfig[] = [
  {
    id: 'TCORP',
    name: 'TechCorp',
    ticker: 'TCORP',
    sector: 'tech',
    basePrice: 150,
    drift: 0.08,
    volatility: 0.25,
    minPrice: 1,
    maxHistory: 2000,
    dividendYield: 0.005 // 0.5% — growth stock, reinvests most profits
  },
  {
    id: 'GRAINX',
    name: 'GrainX Industries',
    ticker: 'GRAINX',
    sector: 'commodities',
    basePrice: 45,
    drift: 0.06,
    volatility: 0.2,
    minPrice: 1,
    maxHistory: 2000,
    dividendYield: 0.028 // 2.8% — commodity producer, moderate yield
  },
  {
    id: 'SOLARW',
    name: 'SolarWave Energy',
    ticker: 'SOLARW',
    sector: 'energy',
    basePrice: 80,
    drift: 0.1,
    volatility: 0.3,
    minPrice: 1,
    maxHistory: 2000,
    dividendYield: 0.022 // 2.2% — growing energy sector
  },
  {
    id: 'MEDVX',
    name: 'MedVax Pharma',
    ticker: 'MEDVX',
    sector: 'healthcare',
    basePrice: 200,
    drift: 0.07,
    volatility: 0.28,
    minPrice: 1,
    maxHistory: 2000,
    dividendYield: 0.018 // 1.8% — pharma, moderate yield
  },
  {
    id: 'RETLX',
    name: 'RetailMax',
    ticker: 'RETLX',
    sector: 'retail',
    basePrice: 30,
    drift: 0.04,
    volatility: 0.18,
    minPrice: 1,
    maxHistory: 2000,
    dividendYield: 0.032 // 3.2% — mature retail, solid yield
  },
  {
    id: 'FINBK',
    name: 'FinBank Holdings',
    ticker: 'FINBK',
    sector: 'finance',
    basePrice: 120,
    drift: 0.03,
    volatility: 0.15,
    minPrice: 1,
    maxHistory: 2000,
    dividendYield: 0.038 // 3.8% — bank, highest yield (value stock)
  },
  {
    id: 'AEROX',
    name: 'AeroX Defense',
    ticker: 'AEROX',
    sector: 'defense',
    basePrice: 300,
    drift: 0.07,
    volatility: 0.22,
    minPrice: 1,
    maxHistory: 2000,
    dividendYield: 0.025 // 2.5% — defense contractor, stable income
  },
  {
    id: 'GAMEV',
    name: 'GameVerse',
    ticker: 'GAMEV',
    sector: 'entertainment',
    basePrice: 60,
    drift: 0.12,
    volatility: 0.35,
    minPrice: 1,
    maxHistory: 2000,
    dividendYield: 0 // 0% — high-growth entertainment, no dividends
  },
  {
    id: 'CLOUDX',
    name: 'CloudNexus',
    ticker: 'CLOUDX',
    sector: 'tech',
    basePrice: 220,
    drift: 0.13,
    volatility: 0.3,
    minPrice: 1,
    maxHistory: 2000,
    dividendYield: 0 // 0% — high-growth cloud, reinvests profits
  },
  {
    id: 'EVDRIVE',
    name: 'EV Drive Motors',
    ticker: 'EVDRIVE',
    sector: 'automotive',
    basePrice: 180,
    drift: 0.14,
    volatility: 0.38,
    minPrice: 1,
    maxHistory: 2000,
    dividendYield: 0 // 0% — disruptive EV growth stock
  },
  {
    id: 'REALTY',
    name: 'Realty Trust REIT',
    ticker: 'REALTY',
    sector: 'realestate',
    basePrice: 55,
    drift: 0.05,
    volatility: 0.14,
    minPrice: 1,
    maxHistory: 2000,
    dividendYield: 0.055 // 5.5% — REIT, legally required high distribution
  },
  {
    id: 'FOODCO',
    name: 'FoodCo Staples',
    ticker: 'FOODCO',
    sector: 'consumer',
    basePrice: 90,
    drift: 0.04,
    volatility: 0.12,
    minPrice: 1,
    maxHistory: 2000,
    dividendYield: 0.03 // 3% — consumer staples, defensive dividend
  },
  {
    id: 'OILMX',
    name: 'OilMax Energy',
    ticker: 'OILMX',
    sector: 'energy',
    basePrice: 65,
    drift: 0.05,
    volatility: 0.28,
    minPrice: 1,
    maxHistory: 2000,
    dividendYield: 0.042 // 4.2% — oil major, high yield
  },
  {
    id: 'BIOLAB',
    name: 'BioLab Sciences',
    ticker: 'BIOLAB',
    sector: 'healthcare',
    basePrice: 110,
    drift: 0.15,
    volatility: 0.45,
    minPrice: 1,
    maxHistory: 2000,
    dividendYield: 0 // 0% — speculative biotech, binary outcomes
  },
  {
    id: 'LOGIX',
    name: 'LogiX Supply',
    ticker: 'LOGIX',
    sector: 'logistics',
    basePrice: 75,
    drift: 0.06,
    volatility: 0.18,
    minPrice: 1,
    maxHistory: 2000,
    dividendYield: 0.02 // 2% — logistics, steady moderate yield
  },
  {
    id: 'CRYPTEX',
    name: 'CryptoEx Exchange',
    ticker: 'CRYPTEX',
    sector: 'finance',
    basePrice: 250,
    drift: 0.16,
    volatility: 0.5,
    minPrice: 1,
    maxHistory: 2000,
    dividendYield: 0.005 // 0.5% — crypto exchange, high volatility
  }
]
