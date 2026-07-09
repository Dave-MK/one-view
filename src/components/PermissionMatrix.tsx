'use client'

import React from 'react'
import { useApp } from '@/context/AppContext'
import { participantMap, organisationMap } from '@/data/seed'
import { CATEGORY_META } from '@/lib/constants'
import type { Category } from '@/types'
import { Badge } from './ui/primitives'

const CATEGORIES: Category[] = ['education', 'health', 'social_care', 'safeguarding', 'housing', 'admin']

const basisTone: Record<string, 'ok' | 'info' | 'warn' | 'danger' | 'purple'> = {
  Consent: 'info',
  'Direct Care': 'ok',
  Safeguarding: 'danger',
  'Legal Obligation': 'warn',
  'Statutory Requirement': 'purple',
}

/**
 * Relationship-based access matrix. Each row is a professional's RELATIONSHIP to
 * the active service user; columns are coordination categories. The point: the
 * service user is the centre, and access flows from the relationship + lawful
 * basis — not from the user's job title.
 */
export function PermissionMatrix({ editable = false }: { editable?: boolean }) {
  const { state, dispatch, activeServiceUser, logAccess } = useApp()

  const rows = state.relationships
    .filter((r) => r.serviceUserId === activeServiceUser.id)
    .map((r) => ({ rel: r, participant: participantMap[r.participantId] }))
    .filter((row) => row.participant && row.participant.side === 'service_provider')

  // Only show columns relevant to this case (categories any relationship can touch)
  const presentCats = CATEGORIES.filter((c) =>
    rows.some((row) => row.rel.allowedCategories.includes(c)) || editable,
  )

  function toggle(relId: string, cat: Category) {
    if (!editable) return
    const rel = state.relationships.find((r) => r.id === relId)
    if (!rel) return
    const next = rel.allowedCategories.includes(cat)
      ? rel.allowedCategories.filter((c) => c !== cat)
      : [...rel.allowedCategories, cat]
    dispatch({ type: 'UPDATE_RELATIONSHIP', payload: { id: relId, allowedCategories: next } })
    logAccess('changed_permissions', `${rel.allowedCategories.includes(cat) ? 'Revoked' : 'Granted'} ${CATEGORY_META[cat].label} for ${participantMap[rel.participantId]?.name}`)
  }

  return (
    <div className="overflow-x-auto rounded-xl border bg-white" style={{ borderColor: 'var(--border-2)' }} data-tour="permission-matrix">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr style={{ backgroundColor: '#f0f4fa' }}>
            <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide border-b" style={{ color: 'var(--text-muted)', borderColor: 'var(--border-2)', minWidth: 230 }}>
              Relationship to {activeServiceUser.name}
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide border-b border-l" style={{ color: 'var(--text-muted)', borderColor: 'var(--border-2)' }}>Lawful basis</th>
            {presentCats.map((c) => (
              <th key={c} className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide border-b border-l" style={{ color: CATEGORY_META[c].color, borderColor: 'var(--border-2)' }}>
                {CATEGORY_META[c].label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(({ rel, participant }, idx) => (
            <tr key={rel.id} style={{ backgroundColor: idx % 2 ? '#f8fafc' : '#fff' }}>
              <td className="px-4 py-3 border-b" style={{ borderColor: '#e8eef5' }}>
                <span className="block font-semibold" style={{ color: 'var(--brand-800)' }}>{participant.name}</span>
                <span className="block text-xs" style={{ color: 'var(--text-faint)' }}>
                  {rel.relationshipType}{participant.organisationId ? ` · ${organisationMap[participant.organisationId]?.shortName}` : ''}
                </span>
              </td>
              <td className="px-3 py-3 border-b border-l" style={{ borderColor: '#e8eef5' }}>
                <Badge tone={basisTone[rel.lawfulBasis] ?? 'neutral'}>{rel.lawfulBasis}</Badge>
              </td>
              {presentCats.map((c) => {
                const allowed = rel.allowedCategories.includes(c)
                return (
                  <td key={c} className="px-3 py-3 text-center border-b border-l" style={{ borderColor: '#e8eef5' }}>
                    <button
                      onClick={() => toggle(rel.id, c)}
                      disabled={!editable}
                      aria-label={`${allowed ? 'Revoke' : 'Grant'} ${CATEGORY_META[c].label} for ${participant.name}`}
                      className="inline-flex items-center justify-center w-7 h-7 rounded-md border-2 transition-all"
                      style={{
                        backgroundColor: allowed ? CATEGORY_META[c].color : 'transparent',
                        borderColor: allowed ? CATEGORY_META[c].color : '#c8d6e5',
                        cursor: editable ? 'pointer' : 'default',
                      }}
                    >
                      {allowed && (
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      )}
                    </button>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
