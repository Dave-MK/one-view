'use client'

import React from 'react'
import { useApp } from '@/context/AppContext'
import { participantMap, organisationMap } from '@/data/seed'
import { Card, Avatar, Badge, EmptyState } from '@/components/ui/primitives'

const basisTone: Record<string, 'ok' | 'info' | 'warn' | 'danger' | 'purple'> = {
  Consent: 'info', 'Direct Care': 'ok', Safeguarding: 'danger', 'Legal Obligation': 'warn', 'Statutory Requirement': 'purple',
}

export default function PeoplePage() {
  const { state, activeServiceUser } = useApp()
  const team = state.relationships
    .filter((r) => r.serviceUserId === activeServiceUser.id)
    .map((r) => ({ rel: r, p: participantMap[r.participantId] }))
    .filter((t) => t.p)

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-5">
        <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--brand-900)' }}>People involved</h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Everyone with a relationship to {activeServiceUser.name}, and the lawful basis for their involvement.</p>
      </div>
      {team.length === 0 ? <Card><EmptyState title="No one is connected yet" /></Card> : (
        <div className="flex flex-col gap-3">
          {team.map(({ rel, p }) => (
            <Card key={rel.id} className="flex items-center gap-3.5">
              <Avatar name={p.name} color={p.avatarColor} size={44} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ color: 'var(--brand-800)' }}>{p.name}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{rel.relationshipType}</p>
                {p.organisationId && <p className="text-xs" style={{ color: 'var(--text-faint)' }}>{organisationMap[p.organisationId]?.name}</p>}
              </div>
              <Badge tone={basisTone[rel.lawfulBasis] ?? 'neutral'}>{rel.lawfulBasis}</Badge>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
