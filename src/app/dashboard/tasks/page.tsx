'use client'

import React from 'react'
import { useApp } from '@/context/AppContext'
import { participantMap } from '@/data/seed'
import { CATEGORY_META } from '@/lib/constants'
import { TASK_STATUS_META, PRIORITY_META } from '@/lib/status'
import { formatDate } from '@/lib/format'
import { Card, Badge, EmptyState } from '@/components/ui/primitives'

export default function TasksPage() {
  const { state, activeParticipant, activeServiceUser } = useApp()
  const rel = state.relationships.find((r) => r.participantId === activeParticipant.id && r.serviceUserId === activeServiceUser.id)
  const allowed = rel?.allowedCategories ?? []

  const tasks = state.tasks
    .filter((t) => t.serviceUserId === activeServiceUser.id && allowed.includes(t.category))

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-5" data-tour="page-intro">
        <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--brand-900)' }}>Actions</h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Coordination actions across {activeServiceUser.name}’s support — who is doing what, within the categories you can see. The records these produce stay in each service’s own system.</p>
      </div>
      <Card padded={false}>
        {tasks.length === 0 ? <EmptyState title="No tasks visible" /> : (
          <ul className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {tasks.map((t) => {
              const s = TASK_STATUS_META[t.status]
              const p = PRIORITY_META[t.priority]
              return (
                <li key={t.id} className="flex items-center gap-3 px-5 py-3.5">
                  <span className="w-1.5 h-9 rounded-full flex-shrink-0" style={{ backgroundColor: CATEGORY_META[t.category].color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium" style={{ color: '#0f172a' }}>{t.title}</p>
                    <p className="text-xs" style={{ color: 'var(--text-faint)' }}>
                      {participantMap[t.assigneeParticipantId]?.name ?? 'Unassigned'} · due {formatDate(t.dueDate)}
                    </p>
                  </div>
                  <Badge tone={p.tone}>{p.label}</Badge>
                  <Badge tone={s.tone}>{s.label}</Badge>
                </li>
              )
            })}
          </ul>
        )}
      </Card>
    </div>
  )
}
