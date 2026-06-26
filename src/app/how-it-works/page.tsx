import React from 'react'
import Link from 'next/link'
import { HowItWorksPipeline } from '@/components/HowItWorksPipeline'
import { PRODUCT_NAME } from '@/lib/constants'

export const metadata = {
  title: `How It Works — ${PRODUCT_NAME}`,
  description:
    'OneView LCR reads events from existing systems — Liquidlogic, Rio, School MIS, Alder Hey PAS, and Graphnet / CIPHA — and assembles a single consent-controlled timeline for the family and their team.',
}

export default function HowItWorksPage() {
  return (
    <div className="flex-1 w-full" role="main" style={{ backgroundColor: '#0a1929' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">

        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm mb-8 transition-colors"
          style={{ color: '#7aabcc' }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="flex-shrink-0"
            aria-hidden="true"
          >
            <path
              d="M10 3L5 8l5 5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to timeline
        </Link>

        {/* Page header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span style={{ color: '#5bb45a', fontSize: '1.4rem' }}>◈</span>
            <span
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: '#5bb45a' }}
            >
              Architecture
            </span>
          </div>
          <h1
            className="text-3xl sm:text-4xl font-bold text-white mb-4"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            How {PRODUCT_NAME} works
          </h1>
          <p
            className="text-base sm:text-lg leading-relaxed max-w-3xl"
            style={{ color: '#a3c4e8' }}
          >
            {PRODUCT_NAME} is a{' '}
            <span className="font-semibold text-white">citizen-controlled coordination layer</span>,
            not a replacement system. It reads events from the systems that professionals
            already use — including the NHS Shared Care Record (Graphnet / CIPHA) — and
            assembles them into a single, consent-filtered timeline. Every event keeps its
            source label so anyone can see exactly where information came from. The family
            decides who sees what.
          </p>
        </div>

        {/* Pipeline */}
        <HowItWorksPipeline />

        {/* Footer note */}
        <div
          className="mt-12 pt-6 border-t text-xs text-center"
          style={{ borderColor: '#1e3f6b', color: '#4a7aaa' }}
        >
          This is a clickable pitch prototype. No real data is stored or transmitted.
          All events are seeded TypeScript/JSON.
        </div>

      </div>
    </div>
  )
}
