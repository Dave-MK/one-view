'use client'

import React from 'react'
import { useApp, relationshipFor } from '@/context/AppContext'
import { CATEGORY_META } from '@/lib/constants'
import { Card, SectionHeader, StatCard } from '@/components/ui/primitives'
import { BarList } from '@/components/ui/charts'
import type { Category } from '@/types'

export default function ProviderReportsPage() {
  const { state, activeParticipant } = useApp()
  const tasks = state.tasks.filter((t) => relationshipFor(state.relationships, activeParticipant.id, t.serviceUserId))
  const events = state.events.filter((e) => relationshipFor(state.relationships, activeParticipant.id, e.serviceUserId))

  const byCat = tasks.reduce<Record<string, number>>((acc, t) => { acc[t.category] = (acc[t.category] ?? 0) + 1; return acc }, {})
  const barData = (Object.keys(byCat) as Category[]).map((c) => ({ label: CATEGORY_META[c].label, value: byCat[c] }))

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-5" data-tour="page-intro">
        <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--brand-900)' }}>Reports</h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>A snapshot of activity across your caseload.</p>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-5">
        <StatCard label="Open tasks" value={tasks.filter((t) => t.status !== 'closed').length} />
        <StatCard label="Events" value={events.length} />
        <StatCard label="Completed" value={tasks.filter((t) => t.status === 'closed').length} />
      </div>
      <Card>
        <SectionHeader title="Tasks by category" />
        {barData.length === 0 ? <p className="text-sm" style={{ color: 'var(--text-faint)' }}>No data.</p> : <BarList data={barData} />}
      </Card>
    </div>
  )
}
