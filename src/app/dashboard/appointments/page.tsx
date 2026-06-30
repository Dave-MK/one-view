'use client'

import React, { useState } from 'react'
import { useApp, canSee } from '@/context/AppContext'
import { meetingScripts } from '@/data/seed'
import { CATEGORY_META } from '@/lib/constants'
import { formatLongDate } from '@/lib/format'
import { Card, Badge, EmptyState } from '@/components/ui/primitives'
import { OrgPill } from '@/components/ui/OrgPill'
import { MeetingRoom } from '@/components/MeetingRoom'

export default function AppointmentsPage() {
  const { state, activeParticipant, activeServiceUser } = useApp()
  const [openId, setOpenId] = useState<string | null>(null)

  const appts = state.appointments
    .filter((a) => a.serviceUserId === activeServiceUser.id && canSee(a, activeParticipant, state.relationships))
    .sort((a, b) => a.date.localeCompare(b.date))

  const openAppt = appts.find((a) => a.id === openId)
  const openOutcome = state.meetingOutcomes.find((o) => o.appointmentId === openId) ?? null

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-5">
        <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--brand-900)' }}>Appointments</h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Upcoming appointments visible to you for {activeServiceUser.name}. Meetings are hosted in OneView — join, and the discussion is turned into a shared summary and actions.</p>
      </div>
      {appts.length === 0 ? <Card><EmptyState title="No appointments visible" /></Card> : (
        <div className="flex flex-col gap-3">
          {appts.map((a) => {
            const joinable = !!meetingScripts[a.id]
            const done = state.meetingOutcomes.some((o) => o.appointmentId === a.id)
            return (
              <Card key={a.id} className="flex items-center gap-4">
                <div className="flex flex-col items-center justify-center w-14 h-14 rounded-xl flex-shrink-0" style={{ backgroundColor: CATEGORY_META[a.category].bg }}>
                  <span className="text-base font-bold" style={{ color: CATEGORY_META[a.category].color }}>{new Date(a.date).getDate()}</span>
                  <span className="text-[10px] uppercase" style={{ color: CATEGORY_META[a.category].color }}>{new Date(a.date).toLocaleDateString('en-GB', { month: 'short' })}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: '#0f172a' }}>{a.title}</p>
                  <p className="text-xs" style={{ color: 'var(--text-faint)' }}>{formatLongDate(a.date)} · {a.time}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {a.isVirtual && <Badge tone="info">Virtual</Badge>}
                    <OrgPill organisationId={a.sourceOrganisationId} />
                  </div>
                </div>
                {joinable && (
                  done ? (
                    <button onClick={() => setOpenId(a.id)} className="text-sm font-medium px-3 py-1.5 rounded-lg border flex-shrink-0" style={{ borderColor: 'var(--border-2)', color: 'var(--brand-700)' }}>View summary</button>
                  ) : (
                    <button onClick={() => setOpenId(a.id)} className="text-sm font-semibold px-3.5 py-1.5 rounded-lg text-white flex-shrink-0" style={{ backgroundColor: 'var(--brand-800)' }}>Join meeting</button>
                  )
                )}
              </Card>
            )
          })}
        </div>
      )}

      {openAppt && <MeetingRoom appointment={openAppt} outcome={openOutcome} onClose={() => setOpenId(null)} />}
    </div>
  )
}
