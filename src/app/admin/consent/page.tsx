'use client'

import React from 'react'
import { useApp } from '@/context/AppContext'
import { serviceUsers } from '@/data/seed'
import { PermissionMatrix } from '@/components/PermissionMatrix'
import { Avatar } from '@/components/ui/primitives'

export default function ConsentManagementPage() {
  const { dispatch, activeServiceUser } = useApp()

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-5" data-tour="consent-intro">
        <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--brand-900)' }}>Consent management</h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Govern which categories each relationship may access. Changes are logged to the audit trail immediately.</p>
      </div>

      {/* Case selector */}
      <div className="flex items-center gap-2 mb-4 flex-wrap" data-tour="consent-case-selector">
        {serviceUsers.map((su) => {
          const active = su.id === activeServiceUser.id
          return (
            <button
              key={su.id}
              onClick={() => dispatch({ type: 'SET_SERVICE_USER', payload: su.id })}
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium"
              style={{ borderColor: active ? 'var(--brand-700)' : 'var(--border-2)', backgroundColor: active ? '#eff4ff' : '#fff', color: active ? 'var(--brand-700)' : 'var(--text-muted)' }}
            >
              <Avatar name={su.name} color={su.avatarColor} size={22} /> {su.name}
            </button>
          )
        })}
      </div>

      <PermissionMatrix editable />
    </div>
  )
}
