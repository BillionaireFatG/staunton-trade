'use client'

import React, { createContext, useContext, ReactNode, useMemo } from 'react'

export type TradeEnvironment = 'staunton' | 'congo'

interface TradeEnvironmentContextType {
  environment: TradeEnvironment
  environmentName: string
}

const DEFAULT_VALUE: TradeEnvironmentContextType = {
  environment: 'staunton',
  environmentName: 'Staunton Trade',
}

const TradeEnvironmentContext = createContext<TradeEnvironmentContextType>(DEFAULT_VALUE)

export function TradeEnvironmentProvider({ 
  children, 
  environment = 'staunton' 
}: { 
  children: ReactNode
  environment?: TradeEnvironment 
}) {
  const value = useMemo<TradeEnvironmentContextType>(() => ({
    environment,
    environmentName: environment === 'staunton' ? 'Staunton Trade' : 'Congo Trade',
  }), [environment])

  return (
    <TradeEnvironmentContext.Provider value={value}>
      {children}
    </TradeEnvironmentContext.Provider>
  )
}

export function useTradeEnvironment(): TradeEnvironmentContextType {
  return useContext(TradeEnvironmentContext)
}
