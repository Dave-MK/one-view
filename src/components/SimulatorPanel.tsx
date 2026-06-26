'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp, canSee } from '@/context/AppContext'
import { scriptedEvents, sourceSystemMap } from '@/data/seed'
import type { OneViewEvent } from '@/types'
import { SourceSystemPill } from './SourceSystemPill'

// ---------------------------------------------------------------------------
// Button config for the three scripted events
// ---------------------------------------------------------------------------
const simulatorButtons = [
  {
    index: 0,
    label: 'CAMHS therapy confirmed',
    sub: 'Rio · Mersey Care',
    sourceSystemId: 'rio',
    category: 'health',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    index: 1,
    label: 'OT assessment updated',
    sub: 'Alder Hey PAS',
    sourceSystemId: 'alderHey',
    category: 'health',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    index: 2,
    label: 'Annual review reminder',
    sub: 'School MIS',
    sourceSystemId: 'schoolMis',
    category: 'education',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
]

// ---------------------------------------------------------------------------
// Fire toast
// ---------------------------------------------------------------------------
function FiredToast({ label, visible }: { label: string; visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
          className="flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg mt-1"
          style={{ backgroundColor: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Event fired: {label}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ---------------------------------------------------------------------------
// SimulatorPanel
// ---------------------------------------------------------------------------
export function SimulatorPanel() {
  const { state, dispatch } = useApp()
  const { currentPersona, consentRules, serviceUser, events } = state

  const [firedIndices, setFiredIndices] = useState<Set<number>>(new Set())
  const [lastFired, setLastFired] = useState<string | null>(null)
  const [liveMode, setLiveMode] = useState(false)
  const liveModeRef = useRef(false)
  const [liveCountdown, setLiveCountdown] = useState<number | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Track which scripted events have already been added to state (by id)
  const firedEventIds = new Set(
    events.filter((e) => scriptedEvents.some((s) => s.id === e.id)).map((e) => e.id)
  )

  function fireEvent(idx: number) {
    const template = scriptedEvents[idx]
    if (!template) return
    const event: OneViewEvent = {
      ...template,
      id: `${template.id}-${Date.now()}`, // unique so reset+re-fire works
      timestamp: new Date().toISOString(),
    }
    dispatch({ type: 'ADD_EVENT', payload: event })
    setFiredIndices((prev) => new Set(prev).add(idx))
    setLastFired(simulatorButtons[idx]?.label ?? null)
    setTimeout(() => setLastFired(null), 3000)
  }

  // Live mode: fire remaining events one at a time every 3 seconds
  const startLiveMode = useCallback(() => {
    liveModeRef.current = true
    setLiveMode(true)
    let nextIdx = simulatorButtons.findIndex(
      (_, i) => !firedIndices.has(i)
    )

    function fireNext() {
      if (!liveModeRef.current) return
      nextIdx = simulatorButtons.findIndex((_, i) => !firedIndices.has(i))
      if (nextIdx === -1) {
        stopLiveMode()
        return
      }
      fireEvent(nextIdx)
      setFiredIndices((prev) => {
        const next = new Set(prev).add(nextIdx)
        // Check if all fired after update
        if (next.size >= simulatorButtons.length) {
          stopLiveMode()
        }
        return next
      })
      setLiveCountdown(3)
      countdownRef.current = setInterval(() => {
        setLiveCountdown((c) => {
          if (c !== null && c > 1) return c - 1
          return null
        })
      }, 1000)
      timerRef.current = setTimeout(() => {
        if (countdownRef.current) clearInterval(countdownRef.current)
        fireNext()
      }, 3000)
    }

    fireNext()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firedIndices])

  function stopLiveMode() {
    liveModeRef.current = false
    setLiveMode(false)
    setLiveCountdown(null)
    if (timerRef.current) clearTimeout(timerRef.current)
    if (countdownRef.current) clearInterval(countdownRef.current)
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (countdownRef.current) clearInterval(countdownRef.current)
    }
  }, [])

  function handleReset() {
    stopLiveMode()
    setFiredIndices(new Set())
    setLastFired(null)
    dispatch({ type: 'RESET_DEMO' })
  }

  const allFired = firedIndices.size >= simulatorButtons.length

  // Visibility preview: would the current persona see a given event?
  function wouldSee(idx: number): boolean {
    const template = scriptedEvents[idx]
    if (!template) return false
    return canSee(template, currentPersona, consentRules, serviceUser.id)
  }

  return (
    <aside
      className="flex flex-col rounded-2xl border overflow-hidden"
      style={{ backgroundColor: '#fff', borderColor: '#e5e7eb' }}
      aria-label="Event simulator"
    >
      {/* Header */}
      <div
        className="px-5 py-4 border-b"
        style={{ backgroundColor: '#13294b', borderColor: '#1e3f6b' }}
      >
        <div className="flex items-center gap-2 mb-1">
          <span style={{ color: '#5bb45a' }} aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </span>
          <h2 className="text-sm font-bold text-white tracking-wide">
            Demo Simulator
          </h2>
        </div>
        <p className="text-xs" style={{ color: '#7aabcc' }}>
          Fire live events to see OneView receive and display them in real time.
          Events arrive from source systems — never typed in here.
        </p>
      </div>

      {/* Persona visibility note */}
      <div
        className="px-5 py-2.5 text-xs border-b flex items-center gap-2"
        style={{ backgroundColor: '#f8fafc', borderColor: '#e5e7eb', color: '#475569' }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2b6cb0" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        Viewing as <strong className="ml-0.5">{currentPersona.name}</strong>
        <span style={{ color: '#94a3b8' }}>({currentPersona.role})</span>
      </div>

      {/* Scripted event buttons */}
      <div className="px-5 py-4 flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#94a3b8' }}>
          Scripted events
        </p>
        {simulatorButtons.map((btn) => {
          const fired = firedIndices.has(btn.index)
          const visible = wouldSee(btn.index)
          const system = sourceSystemMap[btn.sourceSystemId]

          return (
            <div key={btn.index}>
              <button
                disabled={fired || liveMode}
                onClick={() => fireEvent(btn.index)}
                className="w-full text-left rounded-xl border px-4 py-3 transition-all flex items-start gap-3 group"
                style={{
                  backgroundColor: fired ? '#f8fafc' : '#fff',
                  borderColor: fired ? '#e5e7eb' : '#d1d5db',
                  opacity: fired || liveMode ? 0.65 : 1,
                  cursor: fired || liveMode ? 'not-allowed' : 'pointer',
                  boxShadow: fired ? 'none' : '0 1px 3px rgba(0,0,0,0.05)',
                }}
                aria-pressed={fired}
                aria-label={`Fire event: ${btn.label}`}
              >
                {/* Icon */}
                <span
                  className="flex-shrink-0 mt-0.5 transition-colors"
                  style={{ color: fired ? '#94a3b8' : '#13294b' }}
                >
                  {fired ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : btn.icon}
                </span>

                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-semibold leading-snug"
                    style={{ color: fired ? '#94a3b8' : '#0f172a' }}
                  >
                    {btn.label}
                  </p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <SourceSystemPill sourceSystemId={btn.sourceSystemId} />
                    {/* Visibility badge */}
                    <span
                      className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                      style={
                        visible
                          ? { backgroundColor: '#dcfce7', color: '#15803d' }
                          : { backgroundColor: '#fef2f2', color: '#dc2626' }
                      }
                      title={
                        visible
                          ? `${currentPersona.name} will see this event`
                          : `${currentPersona.name} cannot see this — consent not granted`
                      }
                    >
                      {visible ? `Visible to ${currentPersona.role}` : `Hidden from ${currentPersona.role}`}
                    </span>
                  </div>
                  {system && (
                    <p className="text-xs mt-1" style={{ color: '#94a3b8' }}>
                      {system.org}
                    </p>
                  )}
                </div>

                {/* Arrow */}
                {!fired && (
                  <span
                    className="flex-shrink-0 mt-1 transition-transform group-hover:translate-x-0.5"
                    style={{ color: '#94a3b8' }}
                    aria-hidden="true"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                )}
              </button>
            </div>
          )
        })}

        {/* Toast */}
        <FiredToast label={lastFired ?? ''} visible={!!lastFired} />
      </div>

      {/* Divider */}
      <div className="mx-5 border-t" style={{ borderColor: '#e5e7eb' }} />

      {/* Live mode + reset */}
      <div className="px-5 py-4 flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#94a3b8' }}>
          Automation
        </p>

        {/* Live mode toggle */}
        <button
          onClick={liveMode ? stopLiveMode : startLiveMode}
          disabled={allFired && !liveMode}
          className="flex items-center justify-between w-full rounded-xl px-4 py-3 border font-medium text-sm transition-all"
          style={{
            backgroundColor: liveMode ? '#13294b' : '#fff',
            color: liveMode ? '#fff' : '#13294b',
            borderColor: liveMode ? '#13294b' : '#d1d5db',
            opacity: allFired && !liveMode ? 0.5 : 1,
            cursor: allFired && !liveMode ? 'not-allowed' : 'pointer',
          }}
          aria-pressed={liveMode}
        >
          <span className="flex items-center gap-2">
            {liveMode ? (
              <>
                <span
                  className="inline-block w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: '#5bb45a' }}
                  aria-hidden="true"
                />
                Live — firing events…
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Live mode (3s intervals)
              </>
            )}
          </span>
          {liveMode && liveCountdown !== null && (
            <span
              className="text-xs font-mono opacity-70"
              aria-live="polite"
              aria-label={`Next event in ${liveCountdown} seconds`}
            >
              next in {liveCountdown}s
            </span>
          )}
        </button>

        {/* Reset */}
        <button
          onClick={handleReset}
          className="flex items-center justify-center gap-2 w-full rounded-xl px-4 py-2.5 border text-sm font-medium transition-colors"
          style={{
            backgroundColor: '#fef2f2',
            color: '#dc2626',
            borderColor: '#fecaca',
          }}
          aria-label="Reset demo to initial state"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 .49-3" />
          </svg>
          Reset demo
        </button>

        <p className="text-xs text-center" style={{ color: '#94a3b8' }}>
          Resets all events and notifications to the initial seed state.
        </p>
      </div>

      {/* Provenance note */}
      <div
        className="px-5 py-3 mt-auto border-t text-xs"
        style={{ backgroundColor: '#f8fafc', borderColor: '#e5e7eb', color: '#64748b' }}
      >
        <p>
          <strong className="text-slate-700">Rule 1:</strong> Every event carries its source system.
          OneView reads — it never creates records.
        </p>
      </div>
    </aside>
  )
}
