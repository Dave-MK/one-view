'use client'

import React, { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useApp } from '@/context/AppContext'
import type { Category } from '@/types'
import { CATEGORY_META } from '@/lib/constants'
import { EventCard } from './EventCard'
import { EmptyState } from './ui/primitives'

type FilterTab = 'all' | Category

const TABS: { key: FilterTab; label: string; color: string }[] = [
  { key: 'all', label: 'All', color: 'var(--brand-800)' },
  { key: 'education', label: 'Education', color: CATEGORY_META.education.color },
  { key: 'health', label: 'Health', color: CATEGORY_META.health.color },
  { key: 'social_care', label: 'Social Care', color: CATEGORY_META.social_care.color },
  { key: 'safeguarding', label: 'Safeguarding', color: CATEGORY_META.safeguarding.color },
  { key: 'housing', label: 'Housing', color: CATEGORY_META.housing.color },
  { key: 'admin', label: 'Admin', color: CATEGORY_META.admin.color },
]

export function Timeline() {
  const { visibleEvents, activeServiceUser } = useApp()
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all')

  // Track genuinely new arrivals for the highlight + NEW badge
  const knownIdsRef = useRef<Set<string>>(new Set(visibleEvents.map((e) => e.id)))
  const [newEventIds, setNewEventIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    const incoming = new Set<string>()
    for (const e of visibleEvents) {
      if (!knownIdsRef.current.has(e.id)) {
        incoming.add(e.id)
        knownIdsRef.current.add(e.id)
      }
    }
    if (incoming.size > 0) {
      // Detecting freshly-arrived events genuinely requires comparing across
      // renders, so a state update here is intentional.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNewEventIds((prev) => new Set([...prev, ...incoming]))
      const timer = setTimeout(() => {
        setNewEventIds((prev) => {
          const next = new Set(prev)
          incoming.forEach((id) => next.delete(id))
          return next
        })
      }, 8000)
      return () => clearTimeout(timer)
    }
  }, [visibleEvents])

  // Only show category tabs that have at least one visible event (keeps the
  // tab bar relevant per-domain — SEND won't show Housing, etc.)
  const presentCategories = new Set(visibleEvents.map((e) => e.category))
  const tabs = TABS.filter((t) => t.key === 'all' || presentCategories.has(t.key as Category))

  const filtered = activeFilter === 'all' ? visibleEvents : visibleEvents.filter((e) => e.category === activeFilter)
  const countFor = (cat: Category) => visibleEvents.filter((e) => e.category === cat).length

  return (
    <section className="flex flex-col h-full" aria-label="Activity timeline">
      <div className="sticky top-0 z-10 bg-white border-b px-4 pt-4 pb-3" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold" style={{ color: 'var(--brand-800)' }}>Activity Timeline</h2>
          <span className="text-xs font-medium" style={{ color: 'var(--text-faint)' }}>
            {visibleEvents.length} event{visibleEvents.length !== 1 ? 's' : ''} visible
          </span>
        </div>
        <div className="flex gap-2 flex-wrap" role="tablist" aria-label="Filter by category">
          {tabs.map((tab) => {
            const active = activeFilter === tab.key
            const count = tab.key === 'all' ? visibleEvents.length : countFor(tab.key as Category)
            return (
              <button
                key={tab.key}
                role="tab"
                aria-selected={active}
                onClick={() => setActiveFilter(tab.key)}
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-all"
                style={{
                  backgroundColor: active ? tab.color : '#f8fafc',
                  color: active ? '#fff' : 'var(--text-muted)',
                  borderColor: active ? tab.color : 'var(--border-2)',
                }}
              >
                {tab.label}
                <span
                  className="inline-flex items-center justify-center rounded-full text-[10px] font-bold px-1"
                  style={{ minWidth: 16, height: 16, backgroundColor: active ? 'rgba(255,255,255,0.25)' : '#e2e8f0', color: active ? '#fff' : '#475569' }}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 scroll-thin">
        {filtered.length === 0 ? (
          <EmptyState
            title="No events visible"
            body={`As ${activeServiceUser.name}'s record stands, there are no events in this view for your relationship and lawful basis.`}
          />
        ) : (
          <motion.ol layout className="flex flex-col gap-3 list-none" aria-label="Events">
            <AnimatePresence initial={false}>
              {filtered.map((event) => (
                <motion.li key={event.id} layout>
                  <EventCard event={event} isNew={newEventIds.has(event.id)} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ol>
        )}
      </div>
    </section>
  )
}
