'use client'

import React from 'react'
import type { DocumentMetaPayload } from '@/types'
import { SourceFooter } from './AppointmentDetail'

interface Props {
  title: string
  payload: DocumentMetaPayload
  sourceOrganisationId: string
}

export function DocumentDetail({ title, payload, sourceOrganisationId }: Props) {
  const isAvailable = payload.status === 'available'
  return (
    <>
      <div className="rounded-2xl border p-6 mb-4 bg-white" style={{ borderColor: 'var(--border)', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
        <div className="flex items-start gap-4 mb-5">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#eff6ff' }} aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold leading-snug mb-1 font-display" style={{ color: 'var(--brand-800)' }}>{title}</h1>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-medium px-2 py-0.5 rounded-full border" style={{ backgroundColor: '#f1f5f9', color: '#475569', borderColor: 'var(--border-2)' }}>{payload.docType}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: isAvailable ? 'var(--ok-bg)' : 'var(--warn-bg)', color: isAvailable ? 'var(--ok)' : 'var(--warn)' }}>
                {isAvailable ? 'Available' : 'Being prepared'}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border-l-4 px-4 py-3.5 mb-5" style={{ backgroundColor: '#f0f9ff', borderLeftColor: '#2563eb' }}>
          <p className="text-sm font-semibold mb-0.5" style={{ color: '#1e3a5f' }}>How OneView handles documents</p>
          <p className="text-sm leading-relaxed" style={{ color: '#334155' }}>
            OneView shows you this document exists and where to find it. The document itself stays securely in the source system — it is never copied into OneView.
          </p>
        </div>

        <div className="rounded-xl border divide-y mb-5" style={{ borderColor: 'var(--border)' }}>
          <Meta label="Document title" value={payload.title} />
          <Meta label="Document type" value={payload.docType} />
          <Meta label="Held in" value={payload.sourceSystem} />
        </div>

        {isAvailable ? (
          <a href={payload.sourceLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: 'var(--brand-800)' }}>
            View in source system
          </a>
        ) : (
          <button disabled className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold cursor-not-allowed" style={{ backgroundColor: '#f1f5f9', color: 'var(--text-faint)' }}>
            View in source system
          </button>
        )}
      </div>
      <SourceFooter sourceOrganisationId={sourceOrganisationId} kind="document record" />
    </>
  )
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <span className="text-xs font-semibold w-28 flex-shrink-0" style={{ color: 'var(--text-muted)' }}>{label}</span>
      <span className="text-sm" style={{ color: '#0f172a' }}>{value}</span>
    </div>
  )
}
