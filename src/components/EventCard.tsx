'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import type { TimelineEvent } from '@/types'
import { CATEGORY_META } from '@/lib/constants'
import { relativeTime, formatDateTime } from '@/lib/format'
import { OrgPill } from './ui/OrgPill'
import { Badge } from './ui/primitives'

interface EventCardProps {
  event: TimelineEvent
  isNew?: boolean
  href?: string
}

export function EventCard({ event, isNew = false, href }: EventCardProps) {
  const cat = CATEGORY_META[event.category]
  const hasDetail = !!event.payload
  const link = href ?? `/dashboard/journey/${event.id}`

  return (
    <motion.div
      layout
      initial={isNew ? { opacity: 0, y: -16, scale: 0.98 } : false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      className="relative rounded-xl border bg-white"
      style={{
        borderColor: isNew ? cat.color : 'var(--border)',
        boxShadow: isNew ? `0 0 0 2px ${cat.color}33, 0 2px 8px rgba(0,0,0,0.06)` : '0 1px 2px rgba(15,23,42,0.04)',
      }}
    >
      {isNew && (
        <motion.span
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="absolute -top-2.5 left-3 text-xs font-bold px-2 py-0.5 rounded-full text-white"
          style={{ backgroundColor: cat.color }}
        >
          NEW
        </motion.span>
      )}
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl" style={{ backgroundColor: cat.color }} aria-hidden="true" />
      <Link href={link} className="block w-full pl-5 pr-4 py-4 rounded-xl" aria-label={`View details for: ${event.title}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center flex-wrap gap-2 mb-1.5">
              <Badge tone="neutral" className="!bg-transparent !px-0">
                <span style={{ color: cat.color, fontWeight: 600 }}>{cat.label}</span>
              </Badge>
              <OrgPill organisationId={event.sourceOrganisationId} />
            </div>
            <p className="font-semibold text-sm leading-snug" style={{ color: '#0f172a' }}>{event.title}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-faint)' }}>
              {relativeTime(event.timestamp)} · {formatDateTime(event.timestamp)}
            </p>
          </div>
          {hasDetail && (
            <span className="flex-shrink-0 mt-0.5" style={{ color: 'var(--text-faint)' }} aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
            </span>
          )}
        </div>
      </Link>
    </motion.div>
  )
}
