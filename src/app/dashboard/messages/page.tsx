'use client'

import React from 'react'
import { useApp } from '@/context/AppContext'
import { MessageThreadView } from '@/components/MessageThreadView'
import { Card, EmptyState } from '@/components/ui/primitives'

export default function MessagesPage() {
  const { state, activeParticipant, activeServiceUser } = useApp()
  const lastTs = (t: { messages: { timestamp: string }[] }) => t.messages.length ? t.messages[t.messages.length - 1].timestamp : ''
  const threads = state.threads
    .filter((t) => t.serviceUserId === activeServiceUser.id && t.participantIds.includes(activeParticipant.id))
    .sort((a, b) => lastTs(b).localeCompare(lastTs(a)))

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-5" data-tour="messages-intro">
        <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--brand-900)' }}>Messages</h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Secure conversations with the team around {activeServiceUser.name}.</p>
      </div>
      {threads.length === 0 ? <Card><EmptyState title="No message threads" body="You are not a participant in any conversations for this case." /></Card> : (
        <div className="flex flex-col gap-4">
          {threads.map((t, i) => <MessageThreadView key={t.id} thread={t} defaultOpen={i === 0} />)}
        </div>
      )}
    </div>
  )
}
