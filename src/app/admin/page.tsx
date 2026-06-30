'use client'

import React from 'react'
import Link from 'next/link'
import { useApp } from '@/context/AppContext'
import { participants, organisations, participantMap, serviceUserMap, organisationMap } from '@/data/seed'
import { relativeTime } from '@/lib/format'
import { Card, StatCard, SectionHeader, Badge, Avatar } from '@/components/ui/primitives'
import { Donut, BarList } from '@/components/ui/charts'
import type { LawfulBasis, AccessAction } from '@/types'

const BASIS_COLOR: Record<LawfulBasis, string> = {
  'Direct Care': '#16a34a',
  Safeguarding: '#dc2626',
  'Legal Obligation': '#d97706',
  'Statutory Requirement': '#9333ea',
  Consent: '#2563eb',
}

const ACTION_LABEL: Record<AccessAction, string> = {
  viewed_record: 'viewed', updated_record: 'updated', accessed_document: 'accessed document in', changed_permissions: 'changed permissions on', sent_message: 'messaged on',
}

export default function AdminOverview() {
  const { state } = useApp()
  const log = state.accessLog

  // Access by purpose (lawful basis)
  const purposeCounts = log.reduce<Record<string, number>>((acc, e) => { acc[e.lawfulBasis] = (acc[e.lawfulBasis] ?? 0) + 1; return acc }, {})
  const purposeData = (Object.keys(purposeCounts) as LawfulBasis[]).map((b) => ({ label: b, value: purposeCounts[b], color: BASIS_COLOR[b] }))

  // Access by organisation
  const orgCounts = log.reduce<Record<string, number>>((acc, e) => {
    const orgId = participantMap[e.actorParticipantId]?.organisationId
    const key = orgId ? organisationMap[orgId]?.shortName ?? 'Other' : 'Family / citizen'
    acc[key] = (acc[key] ?? 0) + 1
    return acc
  }, {})
  const orgData = Object.entries(orgCounts).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value)

  const elevatedReviews = state.relationships.filter((r) => r.allowedSensitivities.includes('safeguarding')).length

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-5">
        <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--brand-900)' }}>Governance overview</h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Every access to a record is logged and monitored in line with data protection regulations.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-5">
        <StatCard label="Users" value={participants.length} sub="Active participants" />
        <StatCard label="Organisations" value={organisations.length} sub="Connected" />
        <StatCard label="Data accesses" value={log.length} sub="Logged" />
        <StatCard label="Consents / relationships" value={state.relationships.length} sub="Active" />
        <StatCard label="Elevated access" value={elevatedReviews} sub="Periodic review" tone={elevatedReviews > 0 ? 'warn' : 'neutral'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card>
          <SectionHeader title="Access by purpose" />
          <Donut data={purposeData} centerLabel="accesses" />
        </Card>

        <Card className="lg:col-span-2" padded={false}>
          <div className="px-5 pt-5"><SectionHeader title="Recent access activity" action={<Link href="/admin/audit" className="text-xs font-medium" style={{ color: 'var(--brand-700)' }}>View audit log</Link>} /></div>
          <ul className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {log.slice(0, 6).map((e) => {
              const actor = participantMap[e.actorParticipantId]
              return (
                <li key={e.id} className="flex items-center gap-3 px-5 py-3">
                  <Avatar name={actor?.name ?? '?'} color={actor?.avatarColor ?? '#94a3b8'} size={32} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm" style={{ color: '#0f172a' }}>
                      <span className="font-medium">{actor?.name}</span> {ACTION_LABEL[e.action]} <span className="font-medium">{serviceUserMap[e.serviceUserId]?.name}</span>’s record
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-faint)' }}>{e.detail} · {relativeTime(e.timestamp)}</p>
                  </div>
                  <Badge tone="neutral" dot>{e.lawfulBasis}</Badge>
                </li>
              )
            })}
          </ul>
        </Card>

        <Card className="lg:col-span-3">
          <SectionHeader title="Access by organisation" />
          <BarList data={orgData} />
        </Card>
      </div>
    </div>
  )
}
