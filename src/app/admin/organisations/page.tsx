'use client'

import React from 'react'
import { organisations, participants } from '@/data/seed'
import { ORG_TYPE_LABEL } from '@/lib/constants'
import { Card, Badge } from '@/components/ui/primitives'

const typeTone: Record<string, 'ok' | 'info' | 'warn' | 'danger' | 'purple' | 'neutral'> = {
  NHS: 'ok', LocalAuthority: 'info', School: 'warn', Police: 'purple', Housing: 'warn', VCSE: 'purple', Private: 'neutral',
}

export default function OrganisationsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-5">
        <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--brand-900)' }}>Organisations</h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Connected organisations across health, care, education, housing, policing and the voluntary sector.</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {organisations.map((o) => {
          const count = participants.filter((p) => p.organisationId === o.id).length
          return (
            <Card key={o.id} className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold" style={{ color: 'var(--brand-800)' }}>{o.name}</p>
                <p className="text-xs" style={{ color: 'var(--text-faint)' }}>{count} connected user{count !== 1 ? 's' : ''}</p>
              </div>
              <Badge tone={typeTone[o.type] ?? 'neutral'}>{ORG_TYPE_LABEL[o.type]}</Badge>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
