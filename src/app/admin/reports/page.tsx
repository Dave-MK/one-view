'use client'

import React from 'react'
import { useApp } from '@/context/AppContext'
import { participants, organisations } from '@/data/seed'
import { Card, StatCard, SectionHeader } from '@/components/ui/primitives'
import { BarList } from '@/components/ui/charts'

export default function AdminReportsPage() {
  const { state } = useApp()
  const providerCount = participants.filter((p) => p.side === 'service_provider').length
  const userSideCount = participants.filter((p) => p.side === 'service_user').length

  const byBasis = state.relationships.reduce<Record<string, number>>((acc, r) => { acc[r.lawfulBasis] = (acc[r.lawfulBasis] ?? 0) + 1; return acc }, {})

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-5">
        <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--brand-900)' }}>Reports</h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Governance and assurance reporting across the platform.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Providers" value={providerCount} />
        <StatCard label="Service-user accounts" value={userSideCount} />
        <StatCard label="Organisations" value={organisations.length} />
        <StatCard label="Access events" value={state.accessLog.length} />
      </div>
      <Card>
        <SectionHeader title="Relationships by lawful basis" />
        <BarList data={Object.entries(byBasis).map(([label, value]) => ({ label, value }))} color="#16a34a" />
      </Card>
    </div>
  )
}
