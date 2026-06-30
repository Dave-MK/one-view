'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp, canSee } from '@/context/AppContext'
import { scriptedEvents } from '@/data/seed'
import type { TimelineEvent } from '@/types'
import { OrgPill } from './ui/OrgPill'
import { Badge } from './ui/primitives'
import { Icon } from './ui/Icon'

let fireSeq = 0

export function SimulatorPanel() {
  const { state, dispatch, activeParticipant, activeServiceUser, logAccess } = useApp()
  const templates = scriptedEvents[activeServiceUser.id] ?? []

  const [open, setOpen] = useState(true)
  const [firedIndices, setFiredIndices] = useState<Set<number>>(new Set())
  const [lastFired, setLastFired] = useState<string | null>(null)
  const [liveMode, setLiveMode] = useState(false)
  const liveModeRef = useRef(false)
  const [liveCountdown, setLiveCountdown] = useState<number | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Note: this panel is given a `key={activeServiceUser.id}` by its parent, so
  // it remounts (and all local state resets) when the active case changes.

  function fireEvent(idx: number) {
    const template = templates[idx]
    if (!template) return
    fireSeq += 1
    const event: TimelineEvent = { ...template, id: `${template.id}-${fireSeq}`, timestamp: new Date().toISOString() }
    dispatch({ type: 'ADD_EVENT', payload: event })
    logAccess('updated_record', `Event received: ${template.title}`)
    setFiredIndices((prev) => new Set(prev).add(idx))
    setLastFired(template.title)
    setTimeout(() => setLastFired(null), 3000)
  }

  // Live mode: capture a queue once at start (no stale-closure re-firing)
  const startLiveMode = useCallback(() => {
    liveModeRef.current = true
    setLiveMode(true)
    const queue = templates.map((_, i) => i).filter((i) => !firedIndices.has(i))
    let pos = 0

    function fireNext() {
      if (!liveModeRef.current) return
      if (pos >= queue.length) { stopLiveMode(); return }
      const idx = queue[pos]
      pos += 1
      fireEvent(idx)
      if (pos >= queue.length) {
        setLiveCountdown(null)
        timerRef.current = setTimeout(() => stopLiveMode(), 600)
        return
      }
      setLiveCountdown(3)
      countdownRef.current = setInterval(() => {
        setLiveCountdown((c) => (c !== null && c > 1 ? c - 1 : null))
      }, 1000)
      timerRef.current = setTimeout(() => {
        if (countdownRef.current) clearInterval(countdownRef.current)
        fireNext()
      }, 3000)
    }
    fireNext()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firedIndices, templates])

  function stopLiveMode() {
    liveModeRef.current = false
    setLiveMode(false)
    setLiveCountdown(null)
    if (timerRef.current) clearTimeout(timerRef.current)
    if (countdownRef.current) clearInterval(countdownRef.current)
  }

  useEffect(() => () => stopLiveMode(), [])

  function handleReset() {
    stopLiveMode()
    setFiredIndices(new Set())
    setLastFired(null)
    dispatch({ type: 'RESET_DEMO' })
  }

  const allFired = firedIndices.size >= templates.length
  const wouldSee = (idx: number) => {
    const t = templates[idx]
    return t ? canSee(t, activeParticipant, state.relationships) : false
  }

  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)', backgroundColor: '#fff' }}>
      {/* Header */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full px-4 py-3 flex items-center justify-between text-left"
        style={{ backgroundColor: 'var(--brand-800)' }}
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          <span style={{ color: '#5bb45a' }}><Icon name="dashboard" size={16} /></span>
          <span className="text-sm font-bold text-white">Demo Simulator</span>
        </span>
        <span className="text-white" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>
          <Icon name="chevronDown" size={16} />
        </span>
      </button>

      {open && (
        <div>
          <p className="px-4 py-2.5 text-xs border-b" style={{ color: 'var(--text-muted)', backgroundColor: 'var(--surface-2)', borderColor: 'var(--border)' }}>
            Fire live events for <strong>{activeServiceUser.name}</strong> to watch OneView receive them in real time — events arrive from source systems, never typed in here.
          </p>

          <div className="px-4 py-3 flex flex-col gap-2.5">
            {templates.map((t, idx) => {
              const fired = firedIndices.has(idx)
              const visible = wouldSee(idx)
              return (
                <button
                  key={t.id}
                  disabled={fired || liveMode}
                  onClick={() => fireEvent(idx)}
                  className="w-full text-left rounded-lg border px-3 py-2.5 flex items-start gap-2.5 transition-all"
                  style={{
                    backgroundColor: fired ? 'var(--surface-2)' : '#fff',
                    borderColor: fired ? 'var(--border)' : '#d1d5db',
                    opacity: fired || liveMode ? 0.65 : 1,
                    cursor: fired || liveMode ? 'not-allowed' : 'pointer',
                  }}
                  aria-pressed={fired}
                >
                  <span className="flex-shrink-0 mt-0.5" style={{ color: fired ? '#22c55e' : 'var(--brand-700)' }}>
                    <Icon name={fired ? 'check' : 'arrowRight'} size={16} />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-semibold" style={{ color: fired ? 'var(--text-faint)' : '#0f172a' }}>{t.title}</span>
                    <span className="flex items-center gap-1.5 mt-1 flex-wrap">
                      <OrgPill organisationId={t.sourceOrganisationId} />
                      <Badge tone={visible ? 'ok' : 'danger'}>
                        {visible ? `Visible to ${activeParticipant.baseRole}` : `Hidden from ${activeParticipant.baseRole}`}
                      </Badge>
                    </span>
                  </span>
                </button>
              )
            })}

            <AnimatePresence>
              {lastFired && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  className="flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg"
                  style={{ backgroundColor: 'var(--ok-bg)', color: 'var(--ok)' }}
                >
                  <Icon name="check" size={13} /> Event fired: {lastFired}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="px-4 pb-4 flex flex-col gap-2 border-t pt-3" style={{ borderColor: 'var(--border)' }}>
            <button
              onClick={liveMode ? stopLiveMode : startLiveMode}
              disabled={allFired && !liveMode}
              className="flex items-center justify-between w-full rounded-lg px-3 py-2.5 border text-sm font-medium"
              style={{
                backgroundColor: liveMode ? 'var(--brand-800)' : '#fff',
                color: liveMode ? '#fff' : 'var(--brand-800)',
                borderColor: liveMode ? 'var(--brand-800)' : '#d1d5db',
                opacity: allFired && !liveMode ? 0.5 : 1,
                cursor: allFired && !liveMode ? 'not-allowed' : 'pointer',
              }}
              aria-pressed={liveMode}
            >
              <span className="flex items-center gap-2">
                {liveMode ? (
                  <><span className="inline-block w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#5bb45a' }} /> Live — firing events…</>
                ) : (
                  <><Icon name="arrowRight" size={14} /> Live mode (3s intervals)</>
                )}
              </span>
              {liveMode && liveCountdown !== null && (
                <span className="text-xs font-mono opacity-70" aria-live="polite">next in {liveCountdown}s</span>
              )}
            </button>
            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-2 w-full rounded-lg px-3 py-2 border text-sm font-medium"
              style={{ backgroundColor: 'var(--danger-bg)', color: 'var(--danger)', borderColor: '#fecaca' }}
            >
              Reset demo
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
