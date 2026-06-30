'use client'

import React from 'react'
import { AppShell } from '@/components/ui/AppShell'
import { ADMIN_NAV } from '@/lib/nav'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell nav={ADMIN_NAV} sectionLabel="Governance">
      {children}
    </AppShell>
  )
}
