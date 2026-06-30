'use client'

import React from 'react'
import { Avatar } from '../ui/primitives'

type StepKind = 'action' | 'system' | 'outcome'

interface Flow {
  name: string
  role: string
  sub: string
  color: string
  steps: { label: string; kind: StepKind }[]
}

const FLOWS: Flow[] = [
  {
    name: 'Priya', role: 'Service User', sub: 'Parent acting for her child', color: '#7c3aed',
    steps: [
      { label: 'Referral received', kind: 'system' },
      { label: 'Account created', kind: 'action' },
      { label: 'Sees the journey', kind: 'action' },
      { label: 'Shares information', kind: 'action' },
      { label: 'Receives updates', kind: 'system' },
      { label: 'Sees outcomes', kind: 'outcome' },
    ],
  },
  {
    name: 'Liam', role: 'CAMHS Worker', sub: 'Mental health professional', color: '#16a34a',
    steps: [
      { label: 'Added to case', kind: 'system' },
      { label: 'Reviews background', kind: 'action' },
      { label: 'Provides support', kind: 'action' },
      { label: 'Updates records', kind: 'action' },
      { label: 'Works with team', kind: 'action' },
      { label: 'Better outcomes', kind: 'outcome' },
    ],
  },
  {
    name: 'John', role: 'Parent / Carer', sub: 'Authorised representative', color: '#2563eb',
    steps: [
      { label: 'Accepts invitation', kind: 'action' },
      { label: 'Manages permissions', kind: 'action' },
      { label: 'Stays informed', kind: 'system' },
      { label: 'Communicates', kind: 'action' },
      { label: 'Supports attendance', kind: 'action' },
      { label: 'Confident & reassured', kind: 'outcome' },
    ],
  },
  {
    name: 'Amy', role: 'Social Worker', sub: 'Local Authority', color: '#9333ea',
    steps: [
      { label: 'Receives referral', kind: 'system' },
      { label: 'Assesses needs', kind: 'action' },
      { label: 'Creates plan', kind: 'action' },
      { label: 'Shares & assigns', kind: 'action' },
      { label: 'Monitors & reviews', kind: 'action' },
      { label: 'Safe & supported', kind: 'outcome' },
    ],
  },
  {
    name: 'Sally', role: 'SENCO', sub: 'School professional', color: '#0891b2',
    steps: [
      { label: 'Added to case', kind: 'system' },
      { label: 'Reviews information', kind: 'action' },
      { label: 'Creates plan', kind: 'action' },
      { label: 'Coordinates meeting', kind: 'action' },
      { label: 'Assigns tasks', kind: 'action' },
      { label: 'Tracks progress', kind: 'outcome' },
    ],
  },
  {
    name: 'System Admin', role: 'Platform Administrator', sub: 'Governance & assurance', color: '#16335a',
    steps: [
      { label: 'Manages users', kind: 'action' },
      { label: 'Configures access', kind: 'action' },
      { label: 'Monitors activity', kind: 'system' },
      { label: 'Manages consents', kind: 'action' },
      { label: 'Ensures compliance', kind: 'action' },
      { label: 'Secure & compliant', kind: 'outcome' },
    ],
  },
]

const kindStyle: Record<StepKind, { bg: string; color: string }> = {
  action: { bg: '#eff6ff', color: '#1d4ed8' },
  system: { bg: '#f1f5f9', color: '#475569' },
  outcome: { bg: '#dcfce7', color: '#15803d' },
}

export function JourneyFlows() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {FLOWS.map((flow) => (
        <div key={flow.name} className="rounded-xl border bg-white p-4" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3 mb-3">
            <Avatar name={flow.name} color={flow.color} size={40} />
            <div>
              <p className="font-semibold text-sm" style={{ color: 'var(--brand-800)' }}>{flow.name}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{flow.role} · {flow.sub}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {flow.steps.map((step, i) => {
              const s = kindStyle[step.kind]
              return (
                <React.Fragment key={i}>
                  <span className="text-xs font-medium px-2 py-1 rounded-md" style={{ backgroundColor: s.bg, color: s.color }}>
                    {step.label}
                  </span>
                  {i < flow.steps.length - 1 && (
                    <span style={{ color: 'var(--text-faint)' }} aria-hidden="true">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                    </span>
                  )}
                </React.Fragment>
              )
            })}
          </div>
        </div>
      ))}
      <div className="lg:col-span-2 flex items-center justify-center gap-5 text-xs pt-1" style={{ color: 'var(--text-muted)' }}>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded" style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe' }} /> Action</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded" style={{ backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0' }} /> System</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded" style={{ backgroundColor: '#dcfce7', border: '1px solid #bbf7d0' }} /> Outcome</span>
      </div>
    </div>
  )
}
