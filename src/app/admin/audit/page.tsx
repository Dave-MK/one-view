'use client'

import React from 'react'
import { useApp } from '@/context/AppContext'
import { participantMap, serviceUserMap, organisationMap } from '@/data/seed'
import { formatDateTime } from '@/lib/format'
import { Card, Badge, Avatar } from '@/components/ui/primitives'
import type { AccessAction } from '@/types'

const ACTION_LABEL: Record<AccessAction, string> = {
  viewed_record: 'Viewed record', updated_record: 'Updated record', accessed_document: 'Accessed document', changed_permissions: 'Changed permissions', sent_message: 'Sent message',
}

export default function AuditLogPage() {
  const { state } = useApp()
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-5">
        <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--brand-900)' }}>Audit log</h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Immutable record of every access and change. Firing demo events or changing permissions adds new entries here in real time.</p>
      </div>
      <Card padded={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left" style={{ color: 'var(--text-faint)' }}>
                <th className="font-medium text-xs uppercase tracking-wide px-5 py-2.5">Actor</th>
                <th className="font-medium text-xs uppercase tracking-wide px-3 py-2.5">Organisation</th>
                <th className="font-medium text-xs uppercase tracking-wide px-3 py-2.5">Action</th>
                <th className="font-medium text-xs uppercase tracking-wide px-3 py-2.5">Subject</th>
                <th className="font-medium text-xs uppercase tracking-wide px-3 py-2.5">Lawful basis</th>
                <th className="font-medium text-xs uppercase tracking-wide px-3 py-2.5">When</th>
              </tr>
            </thead>
            <tbody>
              {state.accessLog.map((e) => {
                const actor = participantMap[e.actorParticipantId]
                const org = actor?.organisationId ? organisationMap[actor.organisationId]?.shortName : 'Family / citizen'
                return (
                  <tr key={e.id} className="border-t" style={{ borderColor: 'var(--border)' }}>
                    <td className="px-5 py-3">
                      <span className="flex items-center gap-2">
                        <Avatar name={actor?.name ?? '?'} color={actor?.avatarColor ?? '#94a3b8'} size={26} />
                        <span className="font-medium" style={{ color: '#0f172a' }}>{actor?.name}</span>
                      </span>
                    </td>
                    <td className="px-3 py-3" style={{ color: 'var(--text-muted)' }}>{org}</td>
                    <td className="px-3 py-3" style={{ color: 'var(--text-muted)' }}>{ACTION_LABEL[e.action]}<span className="block text-xs" style={{ color: 'var(--text-faint)' }}>{e.detail}</span></td>
                    <td className="px-3 py-3" style={{ color: 'var(--text-muted)' }}>{serviceUserMap[e.serviceUserId]?.name}</td>
                    <td className="px-3 py-3"><Badge tone="neutral" dot>{e.lawfulBasis}</Badge></td>
                    <td className="px-3 py-3 whitespace-nowrap" style={{ color: 'var(--text-faint)' }}>{formatDateTime(e.timestamp)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
