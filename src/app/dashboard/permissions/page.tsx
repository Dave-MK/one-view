'use client'

import React from 'react'
import { useApp } from '@/context/AppContext'
import { PermissionMatrix } from '@/components/PermissionMatrix'
import { Card } from '@/components/ui/primitives'

export default function MyPermissionsPage() {
  const { activeParticipant, activeServiceUser } = useApp()
  const isOwnerSide = activeParticipant.side === 'service_user'

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-5" data-tour="permissions-intro">
        <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--brand-900)' }}>My permissions</h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Who can see which categories of {activeServiceUser.name}’s information — and the lawful basis for each professional’s access. {isOwnerSide ? 'You are in control: changes take effect immediately across every professional view.' : 'Consent is managed by the family.'}
        </p>
      </div>

      <Card className="mb-5 flex items-start gap-3" tourId="permissions-banner">
        <span className="flex-shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full" style={{ backgroundColor: '#f0f7f1' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
        </span>
        <div>
          <p className="text-sm font-semibold" style={{ color: '#1e5c2a' }}>{isOwnerSide ? 'You are in control' : 'Family-controlled consent'}</p>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            OneView never stores the underlying records — it only shows professionals that events exist, within the categories you permit. Removing access withdraws visibility immediately; nothing is deleted.
          </p>
        </div>
      </Card>

      <PermissionMatrix editable={isOwnerSide} />
    </div>
  )
}
