'use client'

import React from 'react'
import { Card } from '@/components/ui/primitives'

const SETTINGS = [
  { title: 'Data residency', value: 'UK (NHS-aligned)', body: 'All data processed within UK data centres.' },
  { title: 'Audit retention', value: '7 years', body: 'Access logs retained per records-management policy.' },
  { title: 'Default lawful basis review', value: 'Every 12 months', body: 'Elevated-access relationships flagged for periodic review.' },
  { title: 'Single sign-on', value: 'NHS Login · Gov · Microsoft', body: 'Federated identity providers enabled for this tenant.' },
]

export default function SettingsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-5">
        <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--brand-900)' }}>Settings</h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Tenant-level configuration and governance defaults.</p>
      </div>
      <Card padded={false}>
        <ul className="divide-y" style={{ borderColor: 'var(--border)' }}>
          {SETTINGS.map((s) => (
            <li key={s.title} className="flex items-center justify-between gap-4 px-5 py-4">
              <div>
                <p className="text-sm font-medium" style={{ color: '#0f172a' }}>{s.title}</p>
                <p className="text-xs" style={{ color: 'var(--text-faint)' }}>{s.body}</p>
              </div>
              <span className="text-sm font-semibold flex-shrink-0" style={{ color: 'var(--brand-700)' }}>{s.value}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
