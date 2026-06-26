'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useApp } from '@/context/AppContext'
import { AppointmentDetail } from '@/components/AppointmentDetail'
import { DocumentDetail } from '@/components/DocumentDetail'
import { SourceSystemPill } from '@/components/SourceSystemPill'
import type { AppointmentPayload, DocumentMetaPayload } from '@/types'

function isAppointmentPayload(p: unknown): p is AppointmentPayload {
  return typeof p === 'object' && p !== null && 'date' in p && 'time' in p
}

function isDocumentPayload(p: unknown): p is DocumentMetaPayload {
  return typeof p === 'object' && p !== null && 'docType' in p && 'sourceLink' in p
}

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const categoryConfig: Record<string, { label: string; bg: string; text: string; border: string }> = {
  education: { label: 'Education', bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
  health: { label: 'Health', bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' },
  social_care: { label: 'Social Care', bg: '#faf5ff', text: '#7e22ce', border: '#e9d5ff' },
  admin: { label: 'Admin', bg: '#f9fafb', text: '#374151', border: '#e5e7eb' },
}

export default function EventDetailPage() {
  const params = useParams()
  const { state } = useApp()
  const eventId = Array.isArray(params?.id) ? params.id[0] : params?.id

  const event = state.events.find((e) => e.id === eventId)

  if (!event) {
    return (
      <main className="min-h-screen px-4 py-8" style={{ backgroundColor: '#f8fafc' }}>
        <div className="max-w-2xl mx-auto">
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
          <div
            className="rounded-2xl border p-8 text-center"
            style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb' }}
          >
            <p className="text-lg font-semibold mb-2" style={{ color: '#13294b' }}>Event not found</p>
            <p className="text-sm" style={{ color: '#64748b' }}>
              This event may not be visible with your current permissions, or it no longer exists.
            </p>
          </div>
        </div>
      </main>
    )
  }

  const cat = categoryConfig[event.category] ?? categoryConfig.admin

  return (
    <main className="min-h-screen px-4 py-8" style={{ backgroundColor: '#f8fafc' }}>
      {isAppointmentPayload(event.payload) ? (
        <AppointmentDetail
          title={event.title}
          payload={event.payload}
          sourceSystemId={event.sourceSystemId}
        />
      ) : isDocumentPayload(event.payload) ? (
        <DocumentDetail
          title={event.title}
          payload={event.payload}
          sourceSystemId={event.sourceSystemId}
        />
      ) : (
        // Fallback: basic event info for events with no payload
        <div className="max-w-2xl mx-auto">
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

          <div
            className="rounded-2xl border p-6 mb-4"
            style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
          >
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span
                className="inline-flex text-xs font-semibold px-2 py-0.5 rounded-full border"
                style={{ backgroundColor: cat.bg, color: cat.text, borderColor: cat.border }}
              >
                {cat.label}
              </span>
              <SourceSystemPill sourceSystemId={event.sourceSystemId} />
            </div>

            <h1
              className="text-2xl font-bold leading-snug mb-3"
              style={{ fontFamily: 'Georgia, serif', color: '#13294b' }}
            >
              {event.title}
            </h1>

            <p className="text-sm" style={{ color: '#64748b' }}>
              Recorded: {formatDate(event.timestamp)}
            </p>

            <div
              className="mt-5 rounded-xl border-l-4 px-4 py-3"
              style={{ backgroundColor: '#f8fafc', borderLeftColor: '#9ca3af' }}
            >
              <p className="text-sm" style={{ color: '#475569' }}>
                This event has no additional detail to display. It was received from the source system as a status update.
              </p>
            </div>
          </div>

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
              This event was received from{' '}
            </span>
            <SourceSystemPill sourceSystemId={event.sourceSystemId} />
          </div>
        </div>
      )}
    </main>
  )
}
