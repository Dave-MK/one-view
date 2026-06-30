'use client'

import React from 'react'
import { useApp } from '@/context/AppContext'
import { Timeline } from '@/components/Timeline'
import { Card } from '@/components/ui/primitives'

export default function JourneyPage() {
  const { activeServiceUser } = useApp()
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-4">
        <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--brand-900)' }}>My journey</h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          A single, consent-filtered timeline of {activeServiceUser.name}’s support — every event labelled with the source system it came from.
        </p>
      </div>
      <Card padded={false} className="overflow-hidden" >
        <div style={{ height: '70vh' }}>
          <Timeline />
        </div>
      </Card>
    </div>
  )
}
