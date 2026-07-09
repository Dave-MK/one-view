'use client'

import React from 'react'
import { useApp, relationshipFor } from '@/context/AppContext'
import { serviceUserMap, participantMap, organisationMap } from '@/data/seed'
import { CATEGORY_META } from '@/lib/constants'
import { TASK_STATUS_META, PRIORITY_META } from '@/lib/status'
import { formatDate } from '@/lib/format'
import { Card, Badge, EmptyState } from '@/components/ui/primitives'

export default function ProviderTasksPage() {
  const { state, activeParticipant, dispatch } = useApp()
  const tasks = state.tasks.filter((t) => {
    const rel = relationshipFor(state.relationships, activeParticipant.id, t.serviceUserId)
    return rel && rel.allowedCategories.includes(t.category)
  })

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-5" data-tour="page-intro">
        <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--brand-900)' }}>Coordination actions</h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Cross-agency actions across your caseload — who owes what, by when. These are coordination artifacts; the records they produce stay in each owning service’s system.</p>
      </div>
      {tasks.length === 0 ? <Card><EmptyState title="No tasks" /></Card> : (
        <Card padded={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left" style={{ color: 'var(--text-faint)' }}>
                  <th className="font-medium text-xs uppercase tracking-wide px-5 py-2.5">Task</th>
                  <th className="font-medium text-xs uppercase tracking-wide px-3 py-2.5">Case</th>
                  <th className="font-medium text-xs uppercase tracking-wide px-3 py-2.5">Owner / agency</th>
                  <th className="font-medium text-xs uppercase tracking-wide px-3 py-2.5">Due</th>
                  <th className="font-medium text-xs uppercase tracking-wide px-3 py-2.5">Priority</th>
                  <th className="font-medium text-xs uppercase tracking-wide px-3 py-2.5">Status</th>
                  <th className="px-3 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {tasks.map((t) => (
                  <tr key={t.id} className="border-t" style={{ borderColor: 'var(--border)' }}>
                    <td className="px-5 py-3">
                      <span className="flex items-center gap-2">
                        <span className="w-1.5 h-5 rounded-full" style={{ backgroundColor: CATEGORY_META[t.category].color }} />
                        <span className="font-medium" style={{ color: '#0f172a' }}>{t.title}</span>
                      </span>
                    </td>
                    <td className="px-3 py-3" style={{ color: 'var(--text-muted)' }}>{serviceUserMap[t.serviceUserId]?.name}</td>
                    <td className="px-3 py-3" style={{ color: 'var(--text-muted)' }}>
                      {participantMap[t.assigneeParticipantId]?.name}
                      {(() => { const orgId = participantMap[t.assigneeParticipantId]?.organisationId; return orgId ? <span className="block text-xs" style={{ color: 'var(--text-faint)' }}>{organisationMap[orgId]?.shortName}</span> : null })()}
                    </td>
                    <td className="px-3 py-3" style={{ color: 'var(--text-muted)' }}>{formatDate(t.dueDate)}</td>
                    <td className="px-3 py-3"><Badge tone={PRIORITY_META[t.priority].tone}>{PRIORITY_META[t.priority].label}</Badge></td>
                    <td className="px-3 py-3"><Badge tone={TASK_STATUS_META[t.status].tone}>{TASK_STATUS_META[t.status].label}</Badge></td>
                    <td className="px-3 py-3 text-right">
                      {t.status !== 'closed' && (
                        <button onClick={() => dispatch({ type: 'COMPLETE_TASK', payload: t.id })} className="text-xs font-medium" style={{ color: 'var(--brand-700)' }}>
                          Complete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
