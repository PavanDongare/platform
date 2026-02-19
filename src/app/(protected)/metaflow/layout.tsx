'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { MetaflowNav } from './components/metaflow-nav'

export default function MetaflowLayout({
  children
}: {
  children: React.ReactNode
}) {
  const [side, setSide] = useState<'left' | 'right'>(() => {
    if (typeof window === 'undefined') return 'left'
    const saved = window.localStorage.getItem('metaflow.nav.side')
    return saved === 'right' ? 'right' : 'left'
  })

  const handleSideChange = (next: 'left' | 'right') => {
    setSide(next)
    window.localStorage.setItem('metaflow.nav.side', next)
  }

  return (
    <div className="h-full flex min-h-0">
      {side === 'left' && (
        <MetaflowNav
          orientation="vertical"
          side={side}
          onSideChange={handleSideChange}
        />
      )}
      <div className={cn('flex-1 min-w-0 overflow-auto')}>{children}</div>
      {side === 'right' && (
        <MetaflowNav
          orientation="vertical"
          side={side}
          onSideChange={handleSideChange}
        />
      )}
    </div>
  )
}
