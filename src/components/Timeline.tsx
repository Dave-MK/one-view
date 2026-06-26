'use client'

import React, { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useApp, canSee } from '@/context/AppContext'
import type { EventCategory } from '@/types'
import { EventCard } from './EventCard'

// ---------------------------------------------------------------------------
// Category filter tabs
// ---------------------------------------------------------------------------
type FilterTab = 'all' | EventCategory

const tabs: { key: FilterTab; label: string; accent: string }[] = [
  { key: 'all',         label: 'All',         accent: '#13294b' },
  { key: 'education',   label: 'Education',   accent: '#3b82f6' },
  { key: 'health',      label: 'Health',      accent: '#22c55e' },
  { key: 'social_care', label: 'Social Care', accent: '#a855f7' },
  { key: 'admin',       label: 'Admin',       accent: '#9ca3af' },
]

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------
function EmptyState({ role }: { role: string }) {
  const roleLabels: Record<string, string> = {
    Parent: 'Parent / Carer',
    SENCO: 'SENCO',
    SocialWorker: 'Social Worker',
    CAMHSClinician: 'CAMHS Clinician',
    OT: 'Occupational Therapist',
    Caseworker: 'Caseworker',
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
        style={{ backgroundColor: '#f1f5f9' }}
        aria-hidden="true"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <p className="font-semibold text-base" style={{ color: '#334155' }}>
        No events visible for this role
      </p>
      <p className="mt-2 text-sm max-w-xs" style={{ color: '#64748b' }}>
        As <strong>{roleLabels[role] ?? role}</strong>, you can only see events in categories
        you have consent to access. The family can grant additional access via the Consent panel.
      </p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Timeline
// ---------------------------------------------------------------------------
export function Timeline() {
  const { state } = useApp()
  const { currentPersona, events, consentRules, serviceUser } = state

  const [activeFilter, setActiveFilter] = useState<FilterTab>('all')

  // Track which event IDs are "new" (added after mount)
  const knownIdsRef = useRef<Set<string>>(new Set(events.map((e) => e.id)))
  const [newEventIds, setNewEventIds] = useState<Set<string>>(new Set())

  // When events array changes, detect genuinely new arrivals
  useEffect(() => {
    const incomingNew = new Set<string>()
    for (const e of events) {
      if (!knownIdsRef.current.has(e.id)) {
        incomingNew.add(e.id)
        knownIdsRef.current.add(e.id)
      }
    }
    if (incomingNew.size > 0) {
      setNewEventIds((prev) => {
        const next = new Set(prev)
        incomingNew.forEach((id) => next.add(id))
        return next
      })
      // Clear "new" highlight after 8 seconds
      const timer = setTimeout(() => {
        setNewEventIds((prev) => {
          const next = new Set(prev)
          incomingNew.forEach((id) => next.delete(id))
          return next
        })
      }, 8000)
      return () => clearTimeout(timer)
    }
  }, [events])

  // ABAC filter
  const visibleEvents = events.filter((e) =>
    canSee(e, currentPersona, consentRules, serviceUser.id)
  )

  // Category filter
  const filteredEvents =
    activeFilter === 'all'
      ? visibleEvents
      : visibleEvents.filter((e) => e.category === activeFilter)

  // Count per tab for badge numbers
  const countByCategory = (cat: EventCategory) =>
    visibleEvents.filter((e) => e.category === cat).length

  return (
    <section className="flex flex-col h-full" aria-label="Event timeline">
      {/* Sticky header */}
      <div
        className="sticky top-0 z-10 bg-white border-b px-4 pt-4 pb-3"
        style={{ borderColor: '#e5e7eb' }}
      >
        <div className="flex items-center justify-between mb-3">
          <h2
            className="text-lg font-semibold"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif', color: '#13294b' }}
          >
            Activity Timeline
          </h2>
          <span className="text-xs font-medium" style={{ color: '#94a3b8' }}>
            {visibleEvents.length} event{visibleEvents.length !== 1 ? 's' : ''} visible
          </span>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap" role="tablist" aria-label="Filter by category">
          {tabs.map((tab) => {
            const isActive = activeFilter === tab.key
            const count = tab.key === 'all' ? visibleEvents.length : countByCategory(tab.key as EventCategory)
            return (
              <button
                key={tab.key}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveFilter(tab.key)}
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-all"
                style={{
                  backgroundColor: isActive ? tab.accent : '#f8fafc',
                  color: isActive ? '#fff' : '#64748b',
                  borderColor: isActive ? tab.accent : '#e2e8f0',
                }}
              >
                {tab.label}
                {count > 0 && (
                  <span
                    className="inline-flex items-center justify-center rounded-full text-xs font-bold"
                    style={{
                      minWidth: '1.15rem',
                      height: '1.15rem',
                      backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : '#e2e8f0',
                      color: isActive ? '#fff' : '#475569',
                      fontSize: '0.65rem',
                      padding: '0 3px',
                    }}
                  >
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Event list */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {filteredEvents.length === 0 ? (
          <EmptyState role={currentPersona.role} />
        ) : (
          <motion.ol layout className="flex flex-col gap-3 list-none" aria-label="Events">
            <AnimatePresence initial={false}>
              {filteredEvents.map((event) => (
                <motion.li key={event.id} layout>
                  <EventCard
                    event={event}
                    isNew={newEventIds.has(event.id)}
                  />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ol>
        )}
      </div>
    </section>
  )
}
