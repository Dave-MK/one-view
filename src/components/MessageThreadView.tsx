'use client'

import React, { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { participantMap, serviceUserMap } from '@/data/seed'
import { relativeTime } from '@/lib/format'
import { Card, Avatar } from './ui/primitives'
import { Icon } from './ui/Icon'
import type { MessageThread } from '@/types'

export function MessageThreadView({ thread, showCase = false }: { thread: MessageThread; showCase?: boolean }) {
  const { dispatch, activeParticipant, logAccess } = useApp()
  const [draft, setDraft] = useState('')
  const last = thread.messages[thread.messages.length - 1]

  function send(e: React.FormEvent) {
    e.preventDefault()
    const body = draft.trim()
    if (!body) return
    dispatch({ type: 'ADD_MESSAGE', payload: { threadId: thread.id, fromParticipantId: activeParticipant.id, body } })
    logAccess('sent_message', `Message in “${thread.subject}”`)
    setDraft('')
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm font-semibold" style={{ color: 'var(--brand-800)' }}>{thread.subject}</p>
          {showCase && <p className="text-xs" style={{ color: 'var(--text-faint)' }}>Re: {serviceUserMap[thread.serviceUserId]?.name}</p>}
        </div>
        <span className="text-xs" style={{ color: 'var(--text-faint)' }}>{last ? relativeTime(last.timestamp) : ''}</span>
      </div>

      <div className="flex flex-col gap-3 mb-3">
        {thread.messages.map((m) => {
          const from = participantMap[m.fromParticipantId]
          const mine = m.fromParticipantId === activeParticipant.id
          return (
            <div key={m.id} className={`flex gap-2.5 ${mine ? 'flex-row-reverse' : ''}`}>
              <Avatar name={from?.name ?? '?'} color={from?.avatarColor ?? '#94a3b8'} size={30} />
              <div className={`max-w-[75%] rounded-xl px-3 py-2`} style={{ backgroundColor: mine ? 'var(--brand-700)' : 'var(--surface-2)' }}>
                <p className="text-xs font-medium mb-0.5" style={{ color: mine ? 'rgba(255,255,255,0.8)' : 'var(--text-faint)' }}>{from?.name ?? 'Unknown'}</p>
                <p className="text-sm" style={{ color: mine ? '#fff' : '#334155' }}>{m.body}</p>
              </div>
            </div>
          )
        })}
      </div>

      <form onSubmit={send} className="flex items-center gap-2 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Write a secure message…"
          className="flex-1 rounded-lg border px-3 py-2 text-sm"
          style={{ borderColor: 'var(--border-2)' }}
          aria-label={`Message in ${thread.subject}`}
        />
        <button type="submit" disabled={!draft.trim()} className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-white text-sm font-semibold" style={{ backgroundColor: 'var(--brand-800)', opacity: draft.trim() ? 1 : 0.5 }}>
          <Icon name="arrowRight" size={14} /> Send
        </button>
      </form>
    </Card>
  )
}
