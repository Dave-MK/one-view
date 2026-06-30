'use client'

import React from 'react'
import { AppShell } from '@/components/ui/AppShell'
import { SERVICE_USER_NAV } from '@/lib/nav'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell nav={SERVICE_USER_NAV} sectionLabel="My OneView">
      {children}
    </AppShell>
  )
}
