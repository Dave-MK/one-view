'use client'

import React from 'react'
import Link from 'next/link'
import { useApp, canSee, relationshipFor } from '@/context/AppContext'
import { serviceUsers, serviceUserMap } from '@/data/seed'
import { TASK_STATUS_META, PRIORITY_META } from '@/lib/status'
import { formatDate } from '@/lib/format'
import { Card, StatCard, SectionHeader, Badge, EmptyState } from '@/components/ui/primitives'
import { Donut } from '@/components/ui/charts'
import { CreateTaskButton } from '@/components/CreateTaskButton'
import type { TaskStatus } from '@/types'

const DEMO_NOW = new Date('2026-06-26T12:00:00.000Z').getTime()
const WEEK = 7 * 24 * 3600 * 1000

const STATUS_COLOR: Record<TaskStatus, string> = {
  in_progress: '#2563eb', not_started: '#94a3b8', awaiting_info: '#d97706', on_hold: '#ea580c', closed: '#16a34a',
}

export default function ProviderDashboard() {
  const { state, activeParticipant } = useApp()

  const caseload = serviceUsers.filter((su) => relationshipFor(state.relationships, activeParticipant.id, su.id))
  const inCaseload = new Set(caseload.map((s) => s.id))

  const caseloadTasks = state.tasks.filter((t) => {
    const rel = relationshipFor(state.relationships, activeParticipant.id, t.serviceUserId)
    return rel && rel.allowedCategories.includes(t.category)
  })
  const myTasks = caseloadTasks.filter((t) => t.assigneeParticipantId === activeParticipant.id)
  const tableTasks = (myTasks.length ? myTasks : caseloadTasks).filter((t) => t.status !== 'closed')

  const dueThisWeek = caseloadTasks.filter((t) => {
    const d = new Date(t.dueDate).getTime()
    return t.status !== 'closed' && d >= DEMO_NOW && d <= DEMO_NOW + WEEK
  }).length
  const overdue = caseloadTasks.filter((t) => new Date(t.dueDate).getTime() < DEMO_NOW && t.status !== 'closed').length

  const appts = state.appointments.filter((a) => inCaseload.has(a.serviceUserId) && canSee(a, activeParticipant, state.relationships)).length
  const updates = state.events.filter((e) => inCaseload.has(e.serviceUserId) && canSee(e, activeParticipant, state.relationships) && new Date(e.timestamp).getTime() >= DEMO_NOW - WEEK).length

  // Donut: caseload tasks by status
  const statusCounts = caseloadTasks.reduce<Record<string, number>>((acc, t) => { acc[t.status] = (acc[t.status] ?? 0) + 1; return acc }, {})
  const donut = (Object.keys(statusCounts) as TaskStatus[]).map((s) => ({ label: TASK_STATUS_META[s].label, value: statusCounts[s], color: STATUS_COLOR[s] }))

  if (caseload.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <Card><EmptyState title="No caseload for this participant" body="This participant has no professional relationships. Switch to a provider such as Sean Byrne or Amara Singh from the top bar." /></Card>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-5" data-tour="provider-welcome">
        <div>
          <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--brand-900)' }}>Dashboard</h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Your cross-agency coordination view — {activeParticipant.name}, {activeParticipant.baseRole}. OneView surfaces and connects; the records stay in each service’s system.</p>
        </div>
        <div data-tour="provider-new-action"><CreateTaskButton /></div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-5" data-tour="provider-stats">
        <StatCard label="My caseload" value={caseload.length} sub="People I support" />
        <StatCard label="Tasks due" value={dueThisWeek} sub="This week" />
        <StatCard label="Overdue" value={overdue} sub="Require attention" tone={overdue > 0 ? 'danger' : 'neutral'} />
        <StatCard label="Appointments" value={appts} sub="In caseload" />
        <StatCard label="Updates" value={updates} sub="This week" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Tasks table */}
        <Card className="lg:col-span-2" padded={false} tourId="provider-actions">
          <div className="px-5 pt-5">
            <SectionHeader title="Coordination actions" action={<Link href="/provider/tasks" className="text-xs font-medium" style={{ color: 'var(--brand-700)' }}>View all</Link>} />
            <p className="text-xs -mt-1 mb-2" style={{ color: 'var(--text-faint)' }}>Who owes what across agencies. The underlying records live in each service’s own system.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left" style={{ color: 'var(--text-faint)' }}>
                  <th className="font-medium text-xs uppercase tracking-wide px-5 py-2">Task</th>
                  <th className="font-medium text-xs uppercase tracking-wide px-3 py-2">Case</th>
                  <th className="font-medium text-xs uppercase tracking-wide px-3 py-2">Due</th>
                  <th className="font-medium text-xs uppercase tracking-wide px-3 py-2">Priority</th>
                  <th className="font-medium text-xs uppercase tracking-wide px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {tableTasks.map((t) => (
                  <tr key={t.id} className="border-t" style={{ borderColor: 'var(--border)' }}>
                    <td className="px-5 py-3 font-medium" style={{ color: '#0f172a' }}>{t.title}</td>
                    <td className="px-3 py-3" style={{ color: 'var(--text-muted)' }}>{serviceUserMap[t.serviceUserId]?.name}</td>
                    <td className="px-3 py-3" style={{ color: 'var(--text-muted)' }}>{formatDate(t.dueDate)}</td>
                    <td className="px-3 py-3"><Badge tone={PRIORITY_META[t.priority].tone}>{PRIORITY_META[t.priority].label}</Badge></td>
                    <td className="px-3 py-3"><Badge tone={TASK_STATUS_META[t.status].tone}>{TASK_STATUS_META[t.status].label}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Caseload by status */}
        <Card tourId="provider-caseload-chart">
          <SectionHeader title="Caseload by status" />
          {donut.length === 0 ? <EmptyState title="No tasks" /> : <Donut data={donut} centerLabel="tasks" />}
        </Card>
      </div>
    </div>
  )
}
