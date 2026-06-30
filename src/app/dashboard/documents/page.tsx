'use client'

import React from 'react'
import { useApp, canSee } from '@/context/AppContext'
import { formatDate } from '@/lib/format'
import { Card, Badge, EmptyState } from '@/components/ui/primitives'
import { OrgPill } from '@/components/ui/OrgPill'

export default function DocumentsPage() {
  const { state, activeParticipant, activeServiceUser } = useApp()
  const docs = state.documents
    .filter((d) => d.serviceUserId === activeServiceUser.id && canSee(d, activeParticipant, state.relationships))
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-5">
        <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--brand-900)' }}>Documents</h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          OneView shows documents <strong>exist</strong> and where to find them — the files stay in their source systems and are never copied here.
        </p>
      </div>
      {docs.length === 0 ? <Card><EmptyState title="No documents visible" /></Card> : (
        <Card padded={false}>
          <ul className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {docs.map((d) => (
              <li key={d.id} className="flex items-center gap-3 px-5 py-3.5">
                <span className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#eff6ff' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ color: '#0f172a' }}>{d.title}</p>
                  <p className="text-xs" style={{ color: 'var(--text-faint)' }}>{d.docType} · {formatDate(d.timestamp)}</p>
                </div>
                <OrgPill organisationId={d.sourceOrganisationId} />
                <Badge tone={d.status === 'available' ? 'ok' : 'warn'}>{d.status === 'available' ? 'Available' : 'Pending'}</Badge>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}
