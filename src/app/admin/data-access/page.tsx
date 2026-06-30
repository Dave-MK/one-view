'use client'

import React from 'react'
import Link from 'next/link'
import { useApp } from '@/context/AppContext'
import { serviceUserMap } from '@/data/seed'
import { Card, SectionHeader } from '@/components/ui/primitives'
import { BarList } from '@/components/ui/charts'
import type { AccessAction } from '@/types'

const ACTION_LABEL: Record<AccessAction, string> = {
  viewed_record: 'Record views', updated_record: 'Record updates', accessed_document: 'Document access', changed_permissions: 'Permission changes', sent_message: 'Messages',
}

export default function DataAccessPage() {
  const { state } = useApp()
  const log = state.accessLog

  const bySubject = log.reduce<Record<string, number>>((acc, e) => { const n = serviceUserMap[e.serviceUserId]?.name ?? e.serviceUserId; acc[n] = (acc[n] ?? 0) + 1; return acc }, {})
  const byAction = log.reduce<Record<string, number>>((acc, e) => { acc[ACTION_LABEL[e.action]] = (acc[ACTION_LABEL[e.action]] ?? 0) + 1; return acc }, {})

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-5">
        <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--brand-900)' }}>Data access</h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Where access is concentrated. For the full chronological record, see the <Link href="/admin/audit" className="font-medium" style={{ color: 'var(--brand-700)' }}>audit log</Link>.</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <Card><SectionHeader title="Access by subject" /><BarList data={Object.entries(bySubject).map(([label, value]) => ({ label, value }))} color="#7c3aed" /></Card>
        <Card><SectionHeader title="Access by action" /><BarList data={Object.entries(byAction).map(([label, value]) => ({ label, value }))} color="#2563eb" /></Card>
      </div>
    </div>
  )
}
