'use client'

import React from 'react'
import { useApp, canSee } from '@/context/AppContext'
import { CATEGORY_META } from '@/lib/constants'
import { formatLongDate } from '@/lib/format'
import { Card, Badge, EmptyState } from '@/components/ui/primitives'
import { OrgPill } from '@/components/ui/OrgPill'

export default function AppointmentsPage() {
  const { state, activeParticipant, activeServiceUser } = useApp()
  const appts = state.appointments
    .filter((a) => a.serviceUserId === activeServiceUser.id && canSee(a, activeParticipant, state.relationships))
    .sort((a, b) => a.date.localeCompare(b.date))

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-5">
        <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--brand-900)' }}>Appointments</h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Upcoming appointments visible to you for {activeServiceUser.name}.</p>
      </div>
      {appts.length === 0 ? <Card><EmptyState title="No appointments visible" /></Card> : (
        <div className="flex flex-col gap-3">
          {appts.map((a) => (
            <Card key={a.id} className="flex items-center gap-4">
              <div className="flex flex-col items-center justify-center w-14 h-14 rounded-xl flex-shrink-0" style={{ backgroundColor: CATEGORY_META[a.category].bg }}>
                <span className="text-base font-bold" style={{ color: CATEGORY_META[a.category].color }}>{new Date(a.date).getDate()}</span>
                <span className="text-[10px] uppercase" style={{ color: CATEGORY_META[a.category].color }}>{new Date(a.date).toLocaleDateString('en-GB', { month: 'short' })}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ color: '#0f172a' }}>{a.title}</p>
                <p className="text-xs" style={{ color: 'var(--text-faint)' }}>{formatLongDate(a.date)} · {a.time}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{a.isVirtual ? 'Virtual appointment' : a.location}</p>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                {a.isVirtual && <Badge tone="info">Virtual</Badge>}
                <OrgPill organisationId={a.sourceOrganisationId} />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
