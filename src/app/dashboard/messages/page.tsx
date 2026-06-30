'use client'

import React from 'react'
import { useApp } from '@/context/AppContext'
import { participantMap } from '@/data/seed'
import { relativeTime } from '@/lib/format'
import { Card, Avatar, EmptyState } from '@/components/ui/primitives'

export default function MessagesPage() {
  const { state, activeParticipant, activeServiceUser } = useApp()
  const threads = state.threads.filter(
    (t) => t.serviceUserId === activeServiceUser.id && t.participantIds.includes(activeParticipant.id),
  )

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-5">
        <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--brand-900)' }}>Messages</h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Secure conversations with the team around {activeServiceUser.name}.</p>
      </div>
      {threads.length === 0 ? <Card><EmptyState title="No message threads" body="You are not a participant in any conversations for this case." /></Card> : (
        <div className="flex flex-col gap-4">
          {threads.map((t) => {
            const last = t.messages[t.messages.length - 1]
            return (
              <Card key={t.id}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold" style={{ color: 'var(--brand-800)' }}>{t.subject}</p>
                  <span className="text-xs" style={{ color: 'var(--text-faint)' }}>{last ? relativeTime(last.timestamp) : ''}</span>
                </div>
                <div className="flex flex-col gap-3">
                  {t.messages.map((m) => {
                    const from = participantMap[m.fromParticipantId]
                    const mine = m.fromParticipantId === activeParticipant.id
                    return (
                      <div key={m.id} className={`flex gap-2.5 ${mine ? 'flex-row-reverse' : ''}`}>
                        <Avatar name={from?.name ?? '?'} color={from?.avatarColor ?? '#94a3b8'} size={30} />
                        <div className={`max-w-[75%] rounded-xl px-3 py-2 ${mine ? 'text-white' : ''}`} style={{ backgroundColor: mine ? 'var(--brand-700)' : 'var(--surface-2)' }}>
                          <p className="text-xs font-medium mb-0.5" style={{ color: mine ? 'rgba(255,255,255,0.8)' : 'var(--text-faint)' }}>{from?.name}</p>
                          <p className="text-sm" style={{ color: mine ? '#fff' : '#334155' }}>{m.body}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
