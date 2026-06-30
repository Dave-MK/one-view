'use client'

import React from 'react'
import Link from 'next/link'
import { useApp, relationshipFor, canSee } from '@/context/AppContext'
import { serviceUsers } from '@/data/seed'
import { Card, Avatar, Badge, EmptyState } from '@/components/ui/primitives'

export default function CaseloadPage() {
  const { state, activeParticipant, dispatch } = useApp()
  const caseload = serviceUsers
    .map((su) => ({ su, rel: relationshipFor(state.relationships, activeParticipant.id, su.id) }))
    .filter((x) => x.rel)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-5">
        <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--brand-900)' }}>My caseload</h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>People you are working with, and your relationship to each.</p>
      </div>
      {caseload.length === 0 ? <Card><EmptyState title="No one in your caseload" /></Card> : (
        <div className="flex flex-col gap-3">
          {caseload.map(({ su, rel }) => {
            const visibleEvents = state.events.filter((e) => e.serviceUserId === su.id && canSee(e, activeParticipant, state.relationships)).length
            return (
              <Card key={su.id} className="flex items-center gap-4">
                <Avatar name={su.name} color={su.avatarColor} size={48} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold" style={{ color: 'var(--brand-800)' }}>{su.name}</p>
                    <Badge tone="neutral">{su.age} yrs</Badge>
                    <Badge tone="ok">{su.status}</Badge>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{su.contextLabel}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-faint)' }}>Your role: {rel!.relationshipType} · {visibleEvents} events visible to you</p>
                </div>
                <Link
                  href="/provider/tasks"
                  onClick={() => dispatch({ type: 'SET_SERVICE_USER', payload: su.id })}
                  className="text-sm font-medium px-3 py-1.5 rounded-lg border flex-shrink-0"
                  style={{ borderColor: 'var(--border-2)', color: 'var(--brand-700)' }}
                >
                  Open
                </Link>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
