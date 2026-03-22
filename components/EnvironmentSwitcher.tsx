'use client'

import { useTradeEnvironment } from '@/lib/contexts/trade-environment-context'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Globe, Check } from 'lucide-react'

export function EnvironmentSwitcher() {
  const { environment, setEnvironment, environmentName } = useTradeEnvironment()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{environmentName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>Trade Environment</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => setEnvironment('staunton')}
          className="flex items-center justify-between cursor-pointer"
        >
          <span>Staunton Trade</span>
          {environment === 'staunton' && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setEnvironment('congo')}
          className="flex items-center justify-between cursor-pointer"
        >
          <span>Congo Trade</span>
          {environment === 'congo' && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
