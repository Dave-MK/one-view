'use client'

import React from 'react'
import { NotificationsList } from '@/components/NotificationsList'
import { Card } from '@/components/ui/primitives'

const HELP = [
  { q: 'Who can see my information?', a: 'Only people with a relationship to the person you care for, within the categories you permit. You can review and change this any time under My permissions.' },
  { q: 'Does OneView store my records?', a: 'No. OneView shows that events and documents exist and links back to the source system. The records themselves never leave those systems.' },
  { q: 'How do I contact my coordinator?', a: 'Use the Messages area to start a secure conversation with any professional on your team.' },
]

export default function HelpPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-5">
        <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--brand-900)' }}>Notifications & help</h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Recent activity and answers to common questions.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card><NotificationsList /></Card>
        <Card>
          <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--brand-800)' }}>Frequently asked</h3>
          <div className="flex flex-col divide-y" style={{ borderColor: 'var(--border)' }}>
            {HELP.map((h) => (
              <div key={h.q} className="py-3 first:pt-0">
                <p className="text-sm font-medium mb-1" style={{ color: '#0f172a' }}>{h.q}</p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{h.a}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
