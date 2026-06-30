'use client'

import React from 'react'
import { AppShell } from '@/components/ui/AppShell'
import { PROVIDER_NAV } from '@/lib/nav'

export default function ProviderLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell nav={PROVIDER_NAV} sectionLabel="Professional">
      {children}
    </AppShell>
  )
}
