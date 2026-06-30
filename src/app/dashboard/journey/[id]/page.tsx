'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useApp, canSee } from '@/context/AppContext'
import { AppointmentDetail, SourceFooter } from '@/components/AppointmentDetail'
import { DocumentDetail } from '@/components/DocumentDetail'
import { CATEGORY_META } from '@/lib/constants'
import { formatDateTime } from '@/lib/format'
import type { AppointmentPayload, DocumentMetaPayload } from '@/types'
import { Badge } from '@/components/ui/primitives'
import { OrgPill } from '@/components/ui/OrgPill'

function isAppointment(p: unknown): p is AppointmentPayload {
  return typeof p === 'object' && p !== null && 'date' in p && 'time' in p
}
function isDocument(p: unknown): p is DocumentMetaPayload {
  return typeof p === 'object' && p !== null && 'docType' in p && 'sourceLink' in p
}

export default function EventDetailPage() {
  const params = useParams()
  const { state, activeParticipant } = useApp()
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id
  const event = state.events.find((e) => e.id === id)
  const allowed = event && canSee(event, activeParticipant, state.relationships)

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/dashboard/journey" className="inline-flex items-center gap-1.5 text-sm font-medium mb-6" style={{ color: 'var(--brand-700)' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><polyline points="15 18 9 12 15 6" /></svg>
        Back to timeline
      </Link>

      {!event || !allowed ? (
        <div className="rounded-2xl border p-8 text-center bg-white" style={{ borderColor: 'var(--border)' }}>
          <p className="text-lg font-semibold mb-2" style={{ color: 'var(--brand-800)' }}>Event not available</p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            This event may not be visible with your current relationship and lawful basis, or it no longer exists.
          </p>
        </div>
      ) : isAppointment(event.payload) ? (
        <AppointmentDetail title={event.title} payload={event.payload} sourceOrganisationId={event.sourceOrganisationId} />
      ) : isDocument(event.payload) ? (
        <DocumentDetail title={event.title} payload={event.payload} sourceOrganisationId={event.sourceOrganisationId} />
      ) : (
        <>
          <div className="rounded-2xl border p-6 mb-4 bg-white" style={{ borderColor: 'var(--border)', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <Badge tone="neutral"><span style={{ color: CATEGORY_META[event.category].color, fontWeight: 600 }}>{CATEGORY_META[event.category].label}</span></Badge>
              <OrgPill organisationId={event.sourceOrganisationId} />
            </div>
            <h1 className="text-2xl font-bold leading-snug mb-3 font-display" style={{ color: 'var(--brand-800)' }}>{event.title}</h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Recorded: {formatDateTime(event.timestamp)}</p>
            <div className="mt-5 rounded-xl border-l-4 px-4 py-3" style={{ backgroundColor: 'var(--surface-2)', borderLeftColor: '#9ca3af' }}>
              <p className="text-sm" style={{ color: '#475569' }}>This event was received from the source system as a status update — there is no further detail to display.</p>
            </div>
          </div>
          <SourceFooter sourceOrganisationId={event.sourceOrganisationId} kind="event" />
        </>
      )}
    </div>
  )
}
