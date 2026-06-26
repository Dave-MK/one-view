'use client'

import React from 'react'
import Link from 'next/link'
import type { AppointmentPayload } from '@/types'
import { SourceSystemPill } from './SourceSystemPill'

interface Props {
  title: string
  payload: AppointmentPayload
  sourceSystemId: string
}

function formatAppointmentDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function AppointmentDetail({ title, payload, sourceSystemId }: Props) {
  return (
    <div className="max-w-2xl mx-auto">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium mb-6 transition-colors"
        style={{ color: '#2b6cb0' }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back to timeline
      </Link>

      {/* Header */}
      <div
        className="rounded-2xl border p-6 mb-4"
        style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
      >
        {/* Virtual badge */}
        {payload.isVirtual && (
          <div
            className="inline-flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-full mb-4"
            style={{ backgroundColor: '#dbeafe', color: '#1d4ed8' }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <polygon points="23 7 16 12 23 17 23 7" />
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
            Virtual appointment
          </div>
        )}

        <h1
          className="text-2xl font-bold mb-1 leading-snug"
          style={{ fontFamily: 'Georgia, serif', color: '#13294b' }}
        >
          {title}
        </h1>

        <div className="mt-4 grid gap-3">
          {/* Date */}
          <div className="flex items-start gap-3">
            <span
              className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#eff6ff' }}
              aria-hidden="true"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2b6cb0" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide mb-0.5" style={{ color: '#64748b' }}>Date &amp; Time</p>
              <p className="text-sm font-medium" style={{ color: '#0f172a' }}>
                {formatAppointmentDate(payload.date)}
              </p>
              <p className="text-sm" style={{ color: '#334155' }}>{payload.time}</p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-3">
            <span
              className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#f0fdf4' }}
              aria-hidden="true"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3f9c54" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide mb-0.5" style={{ color: '#64748b' }}>Location</p>
              <p className="text-sm font-medium" style={{ color: '#0f172a' }}>{payload.location}</p>
            </div>
          </div>

          {/* Participants */}
          <div className="flex items-start gap-3">
            <span
              className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#faf5ff' }}
              aria-hidden="true"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7e22ce" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide mb-0.5" style={{ color: '#64748b' }}>Participants</p>
              <ul className="text-sm space-y-0.5" style={{ color: '#334155' }}>
                {payload.participants.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Join call button — only if virtual */}
        {payload.isVirtual && payload.joinLink && (
          <div className="mt-6 pt-5 border-t" style={{ borderColor: '#e5e7eb' }}>
            <a
              href={payload.joinLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#2b6cb0', color: '#ffffff' }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
              Join call
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
            <p className="mt-2 text-xs" style={{ color: '#94a3b8' }}>
              Link opens in the source system. OneView does not host video calls.
            </p>
          </div>
        )}
      </div>

      {/* Source system attribution */}
      <div
        className="rounded-xl border px-4 py-3 flex items-center gap-3"
        style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span className="text-xs" style={{ color: '#64748b' }}>
          This appointment record was received from{' '}
        </span>
        <SourceSystemPill sourceSystemId={sourceSystemId} />
      </div>
    </div>
  )
}
