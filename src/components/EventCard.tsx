'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import type { OneViewEvent } from '@/types'
import { SourceSystemPill } from './SourceSystemPill'

// ---------------------------------------------------------------------------
// Category styles
// ---------------------------------------------------------------------------
const categoryConfig: Record<
  string,
  { label: string; bg: string; text: string; border: string; accent: string }
> = {
  education: {
    label: 'Education',
    bg: '#eff6ff',
    text: '#1d4ed8',
    border: '#bfdbfe',
    accent: '#3b82f6',
  },
  health: {
    label: 'Health',
    bg: '#f0fdf4',
    text: '#15803d',
    border: '#bbf7d0',
    accent: '#22c55e',
  },
  social_care: {
    label: 'Social Care',
    bg: '#faf5ff',
    text: '#7e22ce',
    border: '#e9d5ff',
    accent: '#a855f7',
  },
  admin: {
    label: 'Admin',
    bg: '#f9fafb',
    text: '#374151',
    border: '#e5e7eb',
    accent: '#9ca3af',
  },
}

const fallbackCat = {
  label: 'Other',
  bg: '#f9fafb',
  text: '#374151',
  border: '#e5e7eb',
  accent: '#9ca3af',
}

// ---------------------------------------------------------------------------
// Relative time helper
// ---------------------------------------------------------------------------
function relativeTime(isoString: string): string {
  const now = new Date('2026-06-26T12:00:00.000Z')
  const then = new Date(isoString)
  const diff = now.getTime() - then.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)

  if (seconds < 60) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days} days ago`
  if (weeks === 1) return '1 week ago'
  if (weeks < 5) return `${weeks} weeks ago`
  if (months === 1) return '1 month ago'
  return `${months} months ago`
}

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// ---------------------------------------------------------------------------
// EventCard
// ---------------------------------------------------------------------------
interface EventCardProps {
  event: OneViewEvent
  isNew?: boolean
  onClick?: () => void
}

export function EventCard({ event, isNew = false, onClick }: EventCardProps) {
  const cat = categoryConfig[event.category] ?? fallbackCat
  const hasDetail = !!event.payload

  return (
    <motion.div
      layout
      initial={isNew ? { opacity: 0, y: -20, scale: 0.98 } : false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      className="relative rounded-xl border bg-white shadow-sm transition-shadow"
      style={{
        borderColor: isNew ? cat.accent : '#e5e7eb',
        boxShadow: isNew
          ? `0 0 0 2px ${cat.accent}33, 0 2px 8px rgba(0,0,0,0.06)`
          : '0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      {/* NEW badge */}
      {isNew && (
        <motion.span
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="absolute -top-2.5 left-3 text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: cat.accent, color: '#fff' }}
        >
          NEW
        </motion.span>
      )}

      {/* Left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
        style={{ backgroundColor: cat.accent }}
        aria-hidden="true"
      />

      <Link
        href={`/event/${event.id}`}
        onClick={onClick}
        className="block w-full pl-5 pr-4 py-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 rounded-xl"
        style={{ '--tw-ring-color': cat.accent } as React.CSSProperties}
        aria-label={`View details for: ${event.title}`}
      >
        <div className="flex items-start justify-between gap-3">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center flex-wrap gap-2 mb-1">
              {/* Category badge */}
              <span
                className="inline-flex text-xs font-semibold px-2 py-0.5 rounded-full border"
                style={{ backgroundColor: cat.bg, color: cat.text, borderColor: cat.border }}
              >
                {cat.label}
              </span>
              {/* Source system pill */}
              <SourceSystemPill sourceSystemId={event.sourceSystemId} />
            </div>

            <p className="font-semibold text-sm leading-snug" style={{ color: '#0f172a' }}>
              {event.title}
            </p>

            <p className="text-xs mt-1" style={{ color: '#94a3b8' }}>
              {relativeTime(event.timestamp)}
              {' · '}
              <span title={formatDate(event.timestamp)}>
                {formatDate(event.timestamp)}
              </span>
            </p>
          </div>

          {/* Chevron — indicates navigable detail */}
          {hasDetail && (
            <span
              className="flex-shrink-0 mt-0.5"
              style={{ color: '#94a3b8' }}
              aria-hidden="true"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </span>
          )}
        </div>
      </Link>
    </motion.div>
  )
}
