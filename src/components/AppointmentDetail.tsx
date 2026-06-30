'use client'

import React from 'react'
import type { AppointmentPayload } from '@/types'
import { OrgPill } from './ui/OrgPill'
import { formatLongDate } from '@/lib/format'

interface Props {
  title: string
  payload: AppointmentPayload
  sourceOrganisationId: string
}

export function AppointmentDetail({ title, payload, sourceOrganisationId }: Props) {
  return (
    <>
      <div className="rounded-2xl border p-6 mb-4 bg-white" style={{ borderColor: 'var(--border)', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
        {payload.isVirtual && (
          <div className="inline-flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-full mb-4" style={{ backgroundColor: '#dbeafe', color: '#1d4ed8' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>
            Virtual appointment
          </div>
        )}
        <h1 className="text-2xl font-bold mb-1 leading-snug font-display" style={{ color: 'var(--brand-800)' }}>{title}</h1>

        <div className="mt-4 grid gap-3">
          <Row icon="cal" bg="#eff6ff" stroke="#2563eb" label="Date & Time">
            <p className="text-sm font-medium" style={{ color: '#0f172a' }}>{formatLongDate(payload.date)}</p>
            <p className="text-sm" style={{ color: '#334155' }}>{payload.time}</p>
          </Row>
          <Row icon="pin" bg="#f0fdf4" stroke="#16a34a" label="Location">
            <p className="text-sm font-medium" style={{ color: '#0f172a' }}>{payload.location}</p>
          </Row>
          <Row icon="people" bg="#faf5ff" stroke="#7e22ce" label="Participants">
            <ul className="text-sm space-y-0.5" style={{ color: '#334155' }}>
              {payload.participants.map((name) => <li key={name}>{name}</li>)}
            </ul>
          </Row>
        </div>

        {payload.isVirtual && payload.joinLink && (
          <div className="mt-6 pt-5 border-t" style={{ borderColor: 'var(--border)' }}>
            <a href={payload.joinLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: '#2563eb' }}>
              Join call
            </a>
            <p className="mt-2 text-xs" style={{ color: 'var(--text-faint)' }}>Link opens in the source system. OneView does not host video calls.</p>
          </div>
        )}
      </div>
      <SourceFooter sourceOrganisationId={sourceOrganisationId} kind="appointment record" />
    </>
  )
}

function Row({ icon, bg, stroke, label, children }: { icon: string; bg: string; stroke: string; label: string; children: React.ReactNode }) {
  const icons: Record<string, React.ReactNode> = {
    cal: (<><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>),
    pin: (<><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></>),
    people: (<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></>),
  }
  return (
    <div className="flex items-start gap-3">
      <span className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: bg }} aria-hidden="true">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2">{icons[icon]}</svg>
      </span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide mb-0.5" style={{ color: 'var(--text-muted)' }}>{label}</p>
        {children}
      </div>
    </div>
  )
}

export function SourceFooter({ sourceOrganisationId, kind }: { sourceOrganisationId: string; kind: string }) {
  return (
    <div className="rounded-xl border px-4 py-3 flex items-center gap-3 bg-white" style={{ borderColor: 'var(--border-2)' }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>This {kind} was received from</span>
      <OrgPill organisationId={sourceOrganisationId} />
    </div>
  )
}
