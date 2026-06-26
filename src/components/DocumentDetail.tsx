'use client'

import React from 'react'
import Link from 'next/link'
import type { DocumentMetaPayload } from '@/types'
import { SourceSystemPill } from './SourceSystemPill'

interface Props {
  title: string
  payload: DocumentMetaPayload
  sourceSystemId: string
}

export function DocumentDetail({ title, payload, sourceSystemId }: Props) {
  const isAvailable = payload.status === 'available'

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

      {/* Main card */}
      <div
        className="rounded-2xl border p-6 mb-4"
        style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
      >
        {/* Document icon + title */}
        <div className="flex items-start gap-4 mb-5">
          <div
            className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: '#eff6ff' }}
            aria-hidden="true"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2b6cb0" strokeWidth="1.8">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h1
              className="text-2xl font-bold leading-snug mb-1"
              style={{ fontFamily: 'Georgia, serif', color: '#13294b' }}
            >
              {title}
            </h1>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full border"
                style={{ backgroundColor: '#f1f5f9', color: '#475569', borderColor: '#e2e8f0' }}
              >
                {payload.docType}
              </span>
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: isAvailable ? '#dcfce7' : '#fef9c3',
                  color: isAvailable ? '#15803d' : '#a16207',
                }}
              >
                {isAvailable ? 'Available' : 'Being prepared'}
              </span>
            </div>
          </div>
        </div>

        {/* Metadata-first principle — prominent callout */}
        <div
          className="rounded-xl border-l-4 px-4 py-3.5 mb-5"
          style={{ backgroundColor: '#f0f9ff', borderLeftColor: '#2b6cb0' }}
        >
          <p className="text-sm font-semibold mb-0.5" style={{ color: '#1e3a5f' }}>
            How OneView handles documents
          </p>
          <p className="text-sm leading-relaxed" style={{ color: '#334155' }}>
            OneView shows you this document exists and where to find it. The document itself stays securely in the source system — it is never copied into OneView.
          </p>
        </div>

        {/* Document metadata grid */}
        <div
          className="rounded-xl border divide-y mb-5"
          style={{ borderColor: '#e5e7eb' }}
        >
          <div className="flex items-center gap-3 px-4 py-3">
            <span className="text-xs font-semibold w-28 flex-shrink-0" style={{ color: '#64748b' }}>Document title</span>
            <span className="text-sm" style={{ color: '#0f172a' }}>{payload.title}</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3">
            <span className="text-xs font-semibold w-28 flex-shrink-0" style={{ color: '#64748b' }}>Document type</span>
            <span className="text-sm" style={{ color: '#0f172a' }}>{payload.docType}</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3">
            <span className="text-xs font-semibold w-28 flex-shrink-0" style={{ color: '#64748b' }}>Held in</span>
            <span className="text-sm" style={{ color: '#0f172a' }}>{payload.sourceSystem}</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3">
            <span className="text-xs font-semibold w-28 flex-shrink-0" style={{ color: '#64748b' }}>Status</span>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: isAvailable ? '#dcfce7' : '#fef9c3',
                color: isAvailable ? '#15803d' : '#a16207',
              }}
            >
              {isAvailable ? 'Available' : 'Pending'}
            </span>
          </div>
        </div>

        {/* Pending state message */}
        {!isAvailable && (
          <div
            className="rounded-xl border px-4 py-3.5 mb-5 flex items-start gap-3"
            style={{ backgroundColor: '#fffbeb', borderColor: '#fde68a' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" className="flex-shrink-0 mt-0.5" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p className="text-sm" style={{ color: '#92400e' }}>
              This document is being prepared. You will be notified when it is available.
            </p>
          </div>
        )}

        {/* View in source system CTA */}
        {isAvailable ? (
          <div>
            <a
              href={payload.sourceLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#13294b', color: '#ffffff' }}
            >
              View in source system
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
            <p className="mt-2 text-xs" style={{ color: '#94a3b8' }}>
              Opens {payload.sourceSystem} in a new tab. Your login credentials for that system are required.
            </p>
          </div>
        ) : (
          <button
            disabled
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold cursor-not-allowed"
            style={{ backgroundColor: '#f1f5f9', color: '#94a3b8' }}
            aria-label="Document not yet available"
          >
            View in source system
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </button>
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
          This document record was received from{' '}
        </span>
        <SourceSystemPill sourceSystemId={sourceSystemId} />
      </div>
    </div>
  )
}
