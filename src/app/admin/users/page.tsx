'use client'

import React from 'react'
import { participants, organisationMap } from '@/data/seed'
import { Card, Avatar, Badge } from '@/components/ui/primitives'

export default function UsersPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-5" data-tour="page-intro">
        <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--brand-900)' }}>Users</h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Everyone with an account on the platform, across both worlds.</p>
      </div>
      <Card padded={false}>
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left" style={{ color: 'var(--text-faint)' }}>
              <th className="font-medium text-xs uppercase tracking-wide px-5 py-2.5">Name</th>
              <th className="font-medium text-xs uppercase tracking-wide px-3 py-2.5">Side</th>
              <th className="font-medium text-xs uppercase tracking-wide px-3 py-2.5">Role</th>
              <th className="font-medium text-xs uppercase tracking-wide px-3 py-2.5">Organisation</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((p) => (
              <tr key={p.id} className="border-t" style={{ borderColor: 'var(--border)' }}>
                <td className="px-5 py-3">
                  <span className="flex items-center gap-2">
                    <Avatar name={p.name} color={p.avatarColor} size={28} />
                    <span className="font-medium" style={{ color: '#0f172a' }}>{p.name}</span>
                  </span>
                </td>
                <td className="px-3 py-3"><Badge tone={p.side === 'service_user' ? 'purple' : 'info'}>{p.side === 'service_user' ? 'Service user' : 'Provider'}</Badge></td>
                <td className="px-3 py-3" style={{ color: 'var(--text-muted)' }}>{p.baseRole}</td>
                <td className="px-3 py-3" style={{ color: 'var(--text-muted)' }}>{p.organisationId ? organisationMap[p.organisationId]?.name : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </Card>
    </div>
  )
}
