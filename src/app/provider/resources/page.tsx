'use client'

import React from 'react'
import { Card } from '@/components/ui/primitives'

const RESOURCES = [
  { title: 'Information sharing agreement', body: 'The multi-agency data sharing agreement governing this coordination layer.' },
  { title: 'Lawful basis quick guide', body: 'When to rely on Consent, Direct Care, Safeguarding, Legal Obligation or Statutory Requirement.' },
  { title: 'Recording standards', body: 'How to write events and update records so they are clear to families and colleagues.' },
  { title: 'Escalation & safeguarding', body: 'Routes for raising a safeguarding concern and who to contact.' },
]

export default function ProviderResourcesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-5">
        <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--brand-900)' }}>Resources</h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Guidance and reference material for working in OneView.</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {RESOURCES.map((r) => (
          <Card key={r.title} className="flex gap-3">
            <span className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#eff6ff', color: 'var(--brand-700)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
            </span>
            <div>
              <p className="text-sm font-semibold mb-0.5" style={{ color: 'var(--brand-800)' }}>{r.title}</p>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{r.body}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
