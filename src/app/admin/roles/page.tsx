'use client'

import React from 'react'
import { Card, Badge } from '@/components/ui/primitives'

const ROLES = [
  { role: 'Citizen / Parent / Carer / Guardian / Advocate', basis: 'Consent', body: 'The person or those acting for them. Can see permitted categories, upload evidence, message and view appointments. Never sees safeguarding or police-sensitivity items by default.' },
  { role: 'Health professional', basis: 'Direct Care', body: 'Clinical categories for people in their direct care. Can upload reports and update appointments.' },
  { role: 'Social worker', basis: 'Safeguarding', body: 'Social care and safeguarding categories. Can create assessments, assign tasks and coordinate meetings.' },
  { role: 'Education professional', basis: 'Statutory Requirement', body: 'Education and admin categories for pupils they support. Cannot see clinical or safeguarding-sensitive detail.' },
  { role: 'Housing officer', basis: 'Legal Obligation', body: 'Housing and admin categories only, for the duration of a housing duty.' },
  { role: 'Platform administrator', basis: 'Statutory Requirement', body: 'Governs users, organisations, relationships and consent. Sees metadata and the audit trail — not the underlying records.' },
]

const tone: Record<string, 'ok' | 'info' | 'warn' | 'danger' | 'purple'> = {
  Consent: 'info', 'Direct Care': 'ok', Safeguarding: 'danger', 'Legal Obligation': 'warn', 'Statutory Requirement': 'purple',
}

export default function RolesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-5">
        <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--brand-900)' }}>Roles & permissions</h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Default access patterns by role. Actual access always resolves through the individual relationship to the person.</p>
      </div>
      <div className="flex flex-col gap-3">
        {ROLES.map((r) => (
          <Card key={r.role} className="flex items-start gap-3">
            <div className="flex-1">
              <p className="text-sm font-semibold mb-0.5" style={{ color: 'var(--brand-800)' }}>{r.role}</p>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{r.body}</p>
            </div>
            <Badge tone={tone[r.basis] ?? 'neutral'}>{r.basis}</Badge>
          </Card>
        ))}
      </div>
    </div>
  )
}
