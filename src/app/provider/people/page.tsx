'use client'

import React from 'react'
import { useApp, relationshipFor } from '@/context/AppContext'
import { serviceUsers, participantMap, organisationMap } from '@/data/seed'
import { Card, Avatar, Badge, EmptyState } from '@/components/ui/primitives'

export default function ProviderPeoplePage() {
  const { state, activeParticipant } = useApp()
  const caseload = serviceUsers.filter((su) => relationshipFor(state.relationships, activeParticipant.id, su.id))

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-5" data-tour="page-intro">
        <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--brand-900)' }}>People</h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>The multi-agency team around each person in your caseload.</p>
      </div>
      {caseload.length === 0 ? <Card><EmptyState title="No caseload" /></Card> : (
        <div className="flex flex-col gap-5">
          {caseload.map((su) => {
            const team = state.relationships
              .filter((r) => r.serviceUserId === su.id)
              .map((r) => ({ rel: r, p: participantMap[r.participantId] }))
              .filter((t) => t.p)
            return (
              <Card key={su.id}>
                <div className="flex items-center gap-2 mb-3">
                  <Avatar name={su.name} color={su.avatarColor} size={32} />
                  <p className="text-sm font-semibold" style={{ color: 'var(--brand-800)' }}>{su.name}</p>
                  <Badge tone="neutral">{team.length} people</Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {team.map(({ rel, p }) => (
                    <div key={rel.id} className="flex items-center gap-2.5">
                      <Avatar name={p.name} color={p.avatarColor} size={34} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium leading-tight truncate" style={{ color: '#0f172a' }}>{p.name}</p>
                        <p className="text-xs truncate" style={{ color: 'var(--text-faint)' }}>{rel.relationshipType}{p.organisationId ? ` · ${organisationMap[p.organisationId]?.shortName}` : ''}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
