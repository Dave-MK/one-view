'use client'

import React from 'react'
import { useApp } from '@/context/AppContext'
import { participantMap, serviceUserMap } from '@/data/seed'
import { relativeTime } from '@/lib/format'
import { Card, Avatar, EmptyState } from '@/components/ui/primitives'

export default function ProviderMessagesPage() {
  const { state, activeParticipant } = useApp()
  const threads = state.threads.filter((t) => t.participantIds.includes(activeParticipant.id))

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-5">
        <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--brand-900)' }}>Messages</h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Multi-agency conversations you are part of.</p>
      </div>
      {threads.length === 0 ? <Card><EmptyState title="No conversations" body="You are not a participant in any message threads." /></Card> : (
        <div className="flex flex-col gap-3">
          {threads.map((t) => {
            const last = t.messages[t.messages.length - 1]
            const from = last ? participantMap[last.fromParticipantId] : undefined
            return (
              <Card key={t.id} className="flex items-center gap-3.5">
                <Avatar name={from?.name ?? '?'} color={from?.avatarColor ?? '#94a3b8'} size={40} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: 'var(--brand-800)' }}>{t.subject}</p>
                  <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                    {serviceUserMap[t.serviceUserId]?.name} · {from?.name}: {last?.body}
                  </p>
                </div>
                <span className="text-xs flex-shrink-0" style={{ color: 'var(--text-faint)' }}>{last ? relativeTime(last.timestamp) : ''}</span>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
