import { TradeEnvironmentProvider } from '@/lib/contexts/trade-environment-context'
import CongoLayoutClient from './CongoLayoutClient'

export default function CongoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <TradeEnvironmentProvider environment="congo">
      <CongoLayoutClient>
        {children}
      </CongoLayoutClient>
    </TradeEnvironmentProvider>
  )
}
