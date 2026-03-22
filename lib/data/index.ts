import { TradeEnvironment } from '../contexts/trade-environment-context'

// Staunton imports
import { stauntonMarketData } from './staunton/market'
import { stauntonContracts } from './staunton/contracts'
import { stauntonShipments } from './staunton/tracking'
import { stauntonAnalytics } from './staunton/analytics'
import { stauntonCounterparties } from './staunton/counterparties'
import { stauntonReports } from './staunton/reports'

// Congo imports
import { congoMarketData } from './congo/market'
import { congoContracts } from './congo/contracts'
import { congoShipments } from './congo/tracking'
import { congoAnalytics } from './congo/analytics'
import { congoCounterparties } from './congo/counterparties'
import { congoReports } from './congo/reports'
import { congoDeals } from './congo/deals'

export function getMarketData(environment: TradeEnvironment) {
  return environment === 'congo' ? congoMarketData : stauntonMarketData
}

export function getContracts(environment: TradeEnvironment) {
  return environment === 'congo' ? congoContracts : stauntonContracts
}

export function getShipments(environment: TradeEnvironment) {
  return environment === 'congo' ? congoShipments : stauntonShipments
}

export function getAnalytics(environment: TradeEnvironment) {
  return environment === 'congo' ? congoAnalytics : stauntonAnalytics
}

export function getCounterparties(environment: TradeEnvironment) {
  return environment === 'congo' ? congoCounterparties : stauntonCounterparties
}

export function getReports(environment: TradeEnvironment) {
  return environment === 'congo' ? congoReports : stauntonReports
}

export function getDeals(environment: TradeEnvironment) {
  // Congo has specific deals, Staunton uses Supabase real deals
  // For demo purposes, return Congo deals when in Congo environment
  if (environment === 'congo') {
    return congoDeals
  }
  // For Staunton, return null to indicate should use Supabase
  return null
}

// Re-export types and data for direct imports
export { stauntonMarketData, stauntonContracts, stauntonShipments, stauntonAnalytics, stauntonCounterparties, stauntonReports }
export { congoMarketData, congoContracts, congoShipments, congoAnalytics, congoCounterparties, congoReports, congoDeals }
