'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useApp, relationshipFor, nextSeq } from '@/context/AppContext'
import { participantMap, organisationMap, serviceUserMap } from '@/data/seed'
import { relativeTime } from '@/lib/format'
import { Card, Avatar } from './ui/primitives'
import { Icon } from './ui/Icon'
import type { MessageThread, Message } from '@/types'

// Label for the system a participant works in (where their messages originate /
// where messages to them are delivered).
function systemLabel(participantId: string): string | null {
  const p = participantMap[participantId]
  if (!p?.organisationId) return null
  const org = organisationMap[p.organisationId]
  if (!org) return null
  return org.system ? `${org.shortName} · ${org.system}` : org.shortName
}

export function MessageThreadView({ thread, showCase = false, defaultOpen = false }: { thread: MessageThread; showCase?: boolean; defaultOpen?: boolean }) {
  const { state, dispatch, activeParticipant, logAccess } = useApp()
  const [draft, setDraft] = useState('')
  const [open, setOpen] = useState(defaultOpen)
  const [pending, setPending] = useState<string | null>(null)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => () => { timers.current.forEach(clearTimeout) }, [])

  // Professionals on the other side of this thread, and the systems they work in.
  const professionals = thread.participantIds
    .map((id) => participantMap[id])
    .filter((p) => p && p.side === 'service_provider')
  const counterpartSystems = professionals
    .map((p) => systemLabel(p.id))
    .filter((s): s is string => !!s)

  // What each message's routing line should say.
  function routing(m: Message): string | null {
    const sender = participantMap[m.fromParticipantId]
    if (!sender) return null
    if (sender.side === 'service_provider') {
      const sys = systemLabel(sender.id)
      return sys ? `Received via ${sys}` : null
    }
    // Citizen-side message → delivered into the professional's own system(s)
    return counterpartSystems.length ? `Routed to ${counterpartSystems.join(', ')}` : null
  }

  function send(e: React.FormEvent) {
    e.preventDefault()
    const body = draft.trim()
    if (!body) return
    dispatch({ type: 'ADD_MESSAGE', payload: { threadId: thread.id, fromParticipantId: activeParticipant.id, body } })
    logAccess('sent_message', counterpartSystems.length ? `Message routed to ${counterpartSystems.join(', ')}` : `Message in “${thread.subject}”`)
    setDraft('')

    // If a citizen is messaging a professional, simulate the message arriving in
    // the professional's source system and a reply routing back into OneView.
    const replier = activeParticipant.side === 'service_user' ? professionals[0] : null
    if (replier) {
      const sys = systemLabel(replier.id)
      setPending(sys ? `Delivered to ${sys} · awaiting reply…` : 'Delivered · awaiting reply…')
      const t = setTimeout(() => {
        dispatch({
          type: 'ADD_MESSAGE',
          payload: {
            threadId: thread.id,
            fromParticipantId: replier.id,
            body: `Thanks — I’ve picked this up in ${organisationMap[replier.organisationId!]?.system ?? 'our system'} and will follow up. Reply sent back to you via OneView.`,
          },
        })
        const rel = relationshipFor(state.relationships, replier.id, thread.serviceUserId)
        dispatch({
          type: 'LOG_ACCESS',
          payload: {
            id: `log-reply-${nextSeq()}`,
            actorParticipantId: replier.id,
            serviceUserId: thread.serviceUserId,
            action: 'sent_message',
            lawfulBasis: rel?.lawfulBasis ?? 'Direct Care',
            detail: `Replied via ${systemLabel(replier.id) ?? 'source system'}`,
            timestamp: new Date().toISOString(),
          },
        })
        setPending(null)
      }, 2600)
      timers.current.push(t)
    }
  }

  const last = thread.messages[thread.messages.length - 1]
  const lastFrom = last ? participantMap[last.fromParticipantId] : undefined

  return (
    <Card padded={false}>
      {/* Collapsible header */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 px-5 py-3.5 text-left"
        aria-expanded={open}
      >
        <span className="flex-1 min-w-0">
          <span className="flex items-center gap-2">
            <span className="text-sm font-semibold truncate" style={{ color: 'var(--brand-800)' }}>{thread.subject}</span>
            {showCase && <span className="text-xs flex-shrink-0" style={{ color: 'var(--text-faint)' }}>· {serviceUserMap[thread.serviceUserId]?.name}</span>}
            <span className="text-xs flex-shrink-0 rounded-full px-1.5" style={{ backgroundColor: 'var(--surface-2)', color: 'var(--text-faint)' }}>{thread.messages.length}</span>
          </span>
          {!open && last && (
            <span className="block text-xs truncate mt-0.5" style={{ color: 'var(--text-faint)' }}>
              {lastFrom?.name?.split(' ')[0]}: {last.body}
            </span>
          )}
        </span>
        <span className="text-xs flex-shrink-0" style={{ color: 'var(--text-faint)' }}>{last ? relativeTime(last.timestamp) : ''}</span>
        <span className="flex-shrink-0" style={{ color: 'var(--text-faint)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }}>
          <Icon name="chevronDown" size={16} />
        </span>
      </button>

      {!open ? null : (
      <div className="px-5 pb-5 border-t pt-3" style={{ borderColor: 'var(--border)' }}>
      {counterpartSystems.length > 0 && (
        <p className="text-xs mb-3 flex items-center gap-1" style={{ color: 'var(--text-faint)' }}>
          <Icon name="relationships" size={12} /> Messages route to each professional’s own system ({counterpartSystems.join(', ')}); replies return here.
        </p>
      )}

      <div className="flex flex-col gap-3 mb-3">
        {thread.messages.map((m) => {
          const from = participantMap[m.fromParticipantId]
          const mine = m.fromParticipantId === activeParticipant.id
          const route = routing(m)
          return (
            <div key={m.id} className={`flex gap-2.5 ${mine ? 'flex-row-reverse' : ''}`}>
              <Avatar name={from?.name ?? '?'} color={from?.avatarColor ?? '#94a3b8'} size={30} />
              <div className={`max-w-[78%] flex flex-col ${mine ? 'items-end' : 'items-start'}`}>
                <div className="rounded-xl px-3 py-2" style={{ backgroundColor: mine ? 'var(--brand-700)' : 'var(--surface-2)' }}>
                  <p className="text-xs font-medium mb-0.5" style={{ color: mine ? 'rgba(255,255,255,0.8)' : 'var(--text-faint)' }}>{from?.name ?? 'Unknown'}</p>
                  <p className="text-sm" style={{ color: mine ? '#fff' : '#334155' }}>{m.body}</p>
                </div>
                {route && (
                  <span className="text-[11px] mt-0.5 flex items-center gap-1" style={{ color: 'var(--text-faint)' }}>
                    <Icon name="arrowRight" size={10} /> {route}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {pending && (
        <div className="flex items-center gap-2 text-xs mb-3 px-3 py-2 rounded-lg" style={{ backgroundColor: 'var(--info-bg)', color: 'var(--info)' }}>
          <span className="inline-block w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--info)' }} />
          {pending}
        </div>
      )}

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
      </div>
      )}
    </Card>
  )
}
