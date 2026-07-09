'use client'

import React from 'react'
import { initials } from '@/lib/format'

// ---------------------------------------------------------------------------
// Card
// ---------------------------------------------------------------------------
export function Card({
  children,
  className = '',
  padded = true,
  tourId,
}: {
  children: React.ReactNode
  className?: string
  padded?: boolean
  /** Optional data-tour id, so this card can be a guided-tour target. */
  tourId?: string
}) {
  return (
    <div
      data-tour={tourId}
      className={`rounded-xl border bg-white ${padded ? 'p-5' : ''} ${className}`}
      style={{ borderColor: 'var(--border)', boxShadow: '0 1px 2px rgba(15,23,42,0.04)' }}
    >
      {children}
    </div>
  )
}

// ---------------------------------------------------------------------------
// SectionHeader — title + optional "View all" action
// ---------------------------------------------------------------------------
export function SectionHeader({
  title,
  action,
  className = '',
}: {
  title: string
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div className={`flex items-center justify-between mb-3 ${className}`}>
      <h3 className="text-sm font-semibold" style={{ color: 'var(--brand-800)' }}>
        {title}
      </h3>
      {action}
    </div>
  )
}

// ---------------------------------------------------------------------------
// StatusPill / Badge
// ---------------------------------------------------------------------------
type Tone = 'neutral' | 'ok' | 'warn' | 'danger' | 'info' | 'purple'

const toneStyles: Record<Tone, { bg: string; color: string }> = {
  neutral: { bg: '#f1f5f9', color: '#475569' },
  ok: { bg: 'var(--ok-bg)', color: 'var(--ok)' },
  warn: { bg: 'var(--warn-bg)', color: 'var(--warn)' },
  danger: { bg: 'var(--danger-bg)', color: 'var(--danger)' },
  info: { bg: 'var(--info-bg)', color: 'var(--info)' },
  purple: { bg: '#faf5ff', color: '#7e22ce' },
}

export function Badge({
  children,
  tone = 'neutral',
  dot = false,
  className = '',
}: {
  children: React.ReactNode
  tone?: Tone
  dot?: boolean
  className?: string
}) {
  const s = toneStyles[tone]
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${className}`}
      style={{ backgroundColor: s.bg, color: s.color }}
    >
      {dot && (
        <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color }} aria-hidden="true" />
      )}
      {children}
    </span>
  )
}

// ---------------------------------------------------------------------------
// Avatar + AvatarStack
// ---------------------------------------------------------------------------
export function Avatar({
  name,
  color = '#2563eb',
  size = 36,
  title,
}: {
  name: string
  color?: string
  size?: number
  title?: string
}) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-full font-semibold text-white flex-shrink-0"
      style={{ width: size, height: size, backgroundColor: color, fontSize: size * 0.4 }}
      title={title ?? name}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  )
}

export function AvatarStack({
  people,
  size = 32,
  max = 5,
}: {
  people: { name: string; color: string }[]
  size?: number
  max?: number
}) {
  const shown = people.slice(0, max)
  const extra = people.length - shown.length
  return (
    <div className="flex items-center">
      {shown.map((p, i) => (
        <span key={i} style={{ marginLeft: i === 0 ? 0 : -8, zIndex: shown.length - i }} className="ring-2 ring-white rounded-full">
          <Avatar name={p.name} color={p.color} size={size} />
        </span>
      ))}
      {extra > 0 && (
        <span
          className="inline-flex items-center justify-center rounded-full font-semibold ring-2 ring-white"
          style={{ width: size, height: size, marginLeft: -8, backgroundColor: '#e2e8f0', color: '#475569', fontSize: size * 0.36 }}
        >
          +{extra}
        </span>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// StatCard
// ---------------------------------------------------------------------------
export function StatCard({
  label,
  value,
  sub,
  tone = 'neutral',
}: {
  label: string
  value: React.ReactNode
  sub?: string
  tone?: Tone
}) {
  return (
    <Card className="flex flex-col gap-1">
      <span className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--text-faint)' }}>
        {label}
      </span>
      <span className="text-3xl font-bold leading-none" style={{ color: tone === 'danger' ? 'var(--danger)' : 'var(--brand-800)' }}>
        {value}
      </span>
      {sub && (
        <span className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
          {sub}
        </span>
      )}
    </Card>
  )
}

// ---------------------------------------------------------------------------
// EmptyState
// ---------------------------------------------------------------------------
export function EmptyState({ title, body }: { title: string; body?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
        style={{ backgroundColor: '#f1f5f9' }}
        aria-hidden="true"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <p className="font-semibold text-sm" style={{ color: '#334155' }}>{title}</p>
      {body && <p className="mt-1 text-xs max-w-xs" style={{ color: 'var(--text-muted)' }}>{body}</p>}
    </div>
  )
}
