'use client'

import React from 'react'
import { useApp, canSee, relationshipFor } from '@/context/AppContext'
import { serviceUserMap } from '@/data/seed'
import { CATEGORY_META } from '@/lib/constants'
import { formatLongDate } from '@/lib/format'
import { Card, EmptyState } from '@/components/ui/primitives'
import { OrgPill } from '@/components/ui/OrgPill'

export default function ProviderCalendarPage() {
  const { state, activeParticipant } = useApp()
  const appts = state.appointments
    .filter((a) => relationshipFor(state.relationships, activeParticipant.id, a.serviceUserId) && canSee(a, activeParticipant, state.relationships))
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))

  const byDate = appts.reduce<Record<string, typeof appts>>((acc, a) => { (acc[a.date] ??= []).push(a); return acc }, {})

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-5">
        <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--brand-900)' }}>Calendar</h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Upcoming appointments across your caseload.</p>
      </div>
      {appts.length === 0 ? <Card><EmptyState title="No appointments" /></Card> : (
        <div className="flex flex-col gap-5">
          {Object.entries(byDate).map(([date, items]) => (
            <div key={date}>
              <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--text-faint)' }}>{formatLongDate(date)}</p>
              <div className="flex flex-col gap-2">
                {items.map((a) => (
                  <Card key={a.id} className="flex items-center gap-3">
                    <span className="text-sm font-bold tabular-nums w-12 flex-shrink-0" style={{ color: 'var(--brand-700)' }}>{a.time}</span>
                    <span className="w-1.5 h-9 rounded-full" style={{ backgroundColor: CATEGORY_META[a.category].color }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium" style={{ color: '#0f172a' }}>{a.title}</p>
                      <p className="text-xs" style={{ color: 'var(--text-faint)' }}>{serviceUserMap[a.serviceUserId]?.name} · {a.isVirtual ? 'Virtual' : a.location}</p>
                    </div>
                    <OrgPill organisationId={a.sourceOrganisationId} />
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
