'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useApp } from '@/context/AppContext'
import { meetingScripts, participantMap } from '@/data/seed'
import { CATEGORY_META } from '@/lib/constants'
import { PRIORITY_META } from '@/lib/status'
import { initials } from '@/lib/format'
import { Icon } from './ui/Icon'
import { Badge } from './ui/primitives'
import type { Appointment, MeetingOutcome } from '@/types'

type Phase = 'prejoin' | 'live' | 'processing' | 'results'
const TILE_COLORS = ['#2563eb', '#16a34a', '#9333ea', '#ea580c', '#0891b2', '#db2777']

const PROCESSING_STEPS = [
  'Securing the recording…',
  'Transcribing the conversation…',
  'Summarising the discussion…',
  'Extracting action items…',
]

function mmss(secs: number) {
  const m = Math.floor(secs / 60).toString().padStart(2, '0')
  const s = (secs % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export function MeetingRoom({ appointment, outcome, onClose }: { appointment: Appointment; outcome?: MeetingOutcome | null; onClose: () => void }) {
  const { dispatch } = useApp()
  const script = meetingScripts[appointment.id]
  const [phase, setPhase] = useState<Phase>(outcome ? 'results' : 'prejoin')
  const [consent, setConsent] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [captionIdx, setCaptionIdx] = useState(0)
  const [stepIdx, setStepIdx] = useState(0)
  const timers = useRef<ReturnType<typeof setInterval | typeof setTimeout>[]>([])

  useEffect(() => () => { timers.current.forEach((t) => { clearInterval(t); clearTimeout(t) }) }, [])

  function startMeeting() {
    setPhase('live')
    const tick = setInterval(() => setElapsed((e) => e + 1), 1000)
    const caps = setInterval(() => setCaptionIdx((i) => Math.min(i + 1, (script?.captions.length ?? 1) - 1)), 2600)
    timers.current.push(tick, caps)
  }

  function endMeeting() {
    timers.current.forEach((t) => { clearInterval(t); clearTimeout(t) })
    timers.current = []
    setPhase('processing')
    setStepIdx(0)
    const step = setInterval(() => setStepIdx((i) => Math.min(i + 1, PROCESSING_STEPS.length - 1)), 900)
    const done = setTimeout(() => { clearInterval(step); setPhase('results') }, PROCESSING_STEPS.length * 900 + 400)
    timers.current.push(step, done)
  }

  function save() {
    dispatch({ type: 'COMPLETE_MEETING', payload: { appointmentId: appointment.id } })
    onClose()
  }

  const summary = outcome?.summary ?? script?.summary ?? 'No summary available.'
  const decisions = outcome?.decisions ?? script?.decisions ?? []

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(15,23,42,0.6)' }}>
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white scroll-thin" style={{ boxShadow: '0 24px 60px rgba(15,23,42,0.3)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--brand-900)' }}>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{appointment.title}</p>
            <p className="text-xs" style={{ color: '#7aabcc' }}>{appointment.date} · {appointment.time} · OneView meeting</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="p-1.5 rounded-md text-white" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
            <Icon name="close" size={18} />
          </button>
        </div>

        {/* PRE-JOIN */}
        {phase === 'prejoin' && (
          <div className="p-6">
            <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>You’re about to join a secure OneView meeting with:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
              {appointment.participantNames.map((n, i) => (
                <div key={n} className="rounded-xl flex flex-col items-center justify-center py-4" style={{ backgroundColor: 'var(--surface-2)' }}>
                  <span className="inline-flex items-center justify-center rounded-full text-white font-semibold mb-1.5" style={{ width: 40, height: 40, backgroundColor: TILE_COLORS[i % TILE_COLORS.length] }}>{initials(n)}</span>
                  <span className="text-xs text-center px-1" style={{ color: 'var(--text)' }}>{n}</span>
                </div>
              ))}
            </div>
            <label className="flex items-start gap-2.5 rounded-lg border p-3 mb-5 cursor-pointer" style={{ borderColor: consent ? 'var(--brand-700)' : 'var(--border-2)', backgroundColor: consent ? '#eff4ff' : '#fff' }}>
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5" />
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                All participants consent to this meeting being recorded <strong>solely to generate shared notes and actions</strong>. The recording is retained under your organisation’s policy; only the summary and actions are saved to OneView.
              </span>
            </label>
            <button onClick={startMeeting} disabled={!consent} className="w-full rounded-lg py-3 text-white font-semibold" style={{ backgroundColor: 'var(--brand-800)', opacity: consent ? 1 : 0.5, cursor: consent ? 'pointer' : 'not-allowed' }}>
              Join meeting
            </button>
          </div>
        )}

        {/* LIVE */}
        {phase === 'live' && (
          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: 'var(--danger-bg)', color: 'var(--danger)' }}>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--danger)' }} /> Recording
              </span>
              <span className="text-sm font-mono" style={{ color: 'var(--text-muted)' }}>{mmss(elapsed)}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
              {appointment.participantNames.map((n, i) => (
                <div key={n} className="rounded-xl aspect-video flex flex-col items-center justify-center relative" style={{ backgroundColor: '#0f2748' }}>
                  <span className="inline-flex items-center justify-center rounded-full text-white font-semibold" style={{ width: 44, height: 44, backgroundColor: TILE_COLORS[i % TILE_COLORS.length] }}>{initials(n)}</span>
                  <span className="absolute bottom-1.5 left-2 text-[11px] text-white/90">{n.split(' ')[0]}</span>
                </div>
              ))}
            </div>
            {script && (
              <div className="rounded-lg px-3 py-2.5 mb-4 min-h-[48px]" style={{ backgroundColor: 'var(--surface-2)' }}>
                <p className="text-[11px] font-semibold uppercase tracking-wide mb-0.5" style={{ color: 'var(--text-faint)' }}>Live captions</p>
                <p className="text-sm" style={{ color: 'var(--text)' }}>{script.captions[captionIdx]}</p>
              </div>
            )}
            <button onClick={endMeeting} className="w-full rounded-lg py-3 text-white font-semibold" style={{ backgroundColor: 'var(--danger)' }}>
              End meeting & generate notes
            </button>
          </div>
        )}

        {/* PROCESSING */}
        {phase === 'processing' && (
          <div className="p-10 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full border-4 mb-5 animate-spin" style={{ borderColor: '#e2e8f0', borderTopColor: 'var(--brand-700)' }} />
            <p className="font-semibold mb-1" style={{ color: 'var(--brand-800)' }}>OneView AI is processing the meeting</p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{PROCESSING_STEPS[stepIdx]}</p>
          </div>
        )}

        {/* RESULTS */}
        {phase === 'results' && (
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg" style={{ backgroundColor: '#eff4ff', color: 'var(--brand-700)' }}><Icon name="check" size={16} /></span>
              <p className="font-semibold" style={{ color: 'var(--brand-800)' }}>{outcome ? 'Meeting summary' : 'AI summary & suggested actions'}</p>
            </div>

            <div className="rounded-xl border-l-4 px-4 py-3 mb-4" style={{ backgroundColor: '#f0f9ff', borderLeftColor: 'var(--brand-700)' }}>
              <p className="text-sm leading-relaxed" style={{ color: '#334155' }}>{summary}</p>
            </div>

            {decisions.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--text-faint)' }}>Decisions</p>
                <ul className="flex flex-col gap-1">
                  {decisions.map((d) => (
                    <li key={d} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text)' }}>
                      <span style={{ color: 'var(--ok)' }}><Icon name="check" size={14} /></span> {d}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {script && (
              <div className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--text-faint)' }}>
                  {outcome ? 'Actions created' : `Suggested coordination actions (${script.actions.length})`}
                </p>
                <ul className="flex flex-col gap-2">
                  {script.actions.map((a) => (
                    <li key={a.title} className="flex items-center gap-2.5 rounded-lg border px-3 py-2" style={{ borderColor: 'var(--border)' }}>
                      <span className="w-1.5 h-7 rounded-full flex-shrink-0" style={{ backgroundColor: CATEGORY_META[a.category].color }} />
                      <span className="flex-1 min-w-0">
                        <span className="block text-sm font-medium" style={{ color: 'var(--text)' }}>{a.title}</span>
                        <span className="text-xs" style={{ color: 'var(--text-faint)' }}>Owner: {participantMap[a.assigneeParticipantId]?.name ?? '—'}</span>
                      </span>
                      <Badge tone={PRIORITY_META[a.priority].tone}>{PRIORITY_META[a.priority].label}</Badge>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {outcome ? (
              <button onClick={onClose} className="w-full rounded-lg py-2.5 font-semibold border" style={{ borderColor: 'var(--border-2)', color: 'var(--brand-700)' }}>Close</button>
            ) : (
              <>
                <button onClick={save} className="w-full rounded-lg py-3 text-white font-semibold mb-2" style={{ backgroundColor: 'var(--brand-800)' }}>
                  Save summary & create {script?.actions.length ?? 0} actions
                </button>
                <p className="text-xs text-center" style={{ color: 'var(--text-faint)' }}>
                  The summary is added to the timeline and the actions to the coordination list. The recording is retained under your organisation’s policy; records of care stay in source systems.
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
