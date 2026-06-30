'use client'

import React from 'react'
import { useApp } from '@/context/AppContext'
import { serviceUsers, participantMap, organisationMap } from '@/data/seed'
import { CATEGORY_META } from '@/lib/constants'
import { Card, Avatar, Badge } from '@/components/ui/primitives'

const basisTone: Record<string, 'ok' | 'info' | 'warn' | 'danger' | 'purple'> = {
  Consent: 'info', 'Direct Care': 'ok', Safeguarding: 'danger', 'Legal Obligation': 'warn', 'Statutory Requirement': 'purple',
}

export default function RelationshipsPage() {
  const { state } = useApp()
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-5">
        <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--brand-900)' }}>Relationships</h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Access flows from relationships to the person at the centre — not from job titles. Each row shows who is connected to whom, on what lawful basis, and what they may see.
        </p>
      </div>
      <div className="flex flex-col gap-5">
        {serviceUsers.map((su) => {
          const rels = state.relationships.filter((r) => r.serviceUserId === su.id)
          return (
            <Card key={su.id} padded={false}>
              <div className="flex items-center gap-2 px-5 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                <Avatar name={su.name} color={su.avatarColor} size={30} />
                <p className="text-sm font-semibold" style={{ color: 'var(--brand-800)' }}>{su.name}</p>
                <span className="text-xs" style={{ color: 'var(--text-faint)' }}>· the person at the centre</span>
              </div>
              <ul className="divide-y" style={{ borderColor: 'var(--border)' }}>
                {rels.map((r) => {
                  const p = participantMap[r.participantId]
                  return (
                    <li key={r.id} className="flex items-center gap-3 px-5 py-3 flex-wrap">
                      <Avatar name={p?.name ?? '?'} color={p?.avatarColor ?? '#94a3b8'} size={32} />
                      <div className="flex-1 min-w-0" style={{ minWidth: 180 }}>
                        <p className="text-sm font-medium" style={{ color: '#0f172a' }}>{p?.name}</p>
                        <p className="text-xs" style={{ color: 'var(--text-faint)' }}>{r.relationshipType}{p?.organisationId ? ` · ${organisationMap[p.organisationId]?.shortName}` : ''}</p>
                      </div>
                      <Badge tone={basisTone[r.lawfulBasis] ?? 'neutral'}>{r.lawfulBasis}</Badge>
                      <div className="flex items-center gap-1 flex-wrap">
                        {r.allowedCategories.map((c) => (
                          <span key={c} className="text-[11px] px-1.5 py-0.5 rounded" style={{ backgroundColor: CATEGORY_META[c].bg, color: CATEGORY_META[c].color }}>{CATEGORY_META[c].label}</span>
                        ))}
                      </div>
                    </li>
                  )
                })}
              </ul>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
