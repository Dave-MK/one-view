'use client'

import React from 'react'
import { organisationMap } from '@/data/seed'
import type { OrgType } from '@/types'

// Subtle per-org-type tints
const typeTint: Record<OrgType, { bg: string; text: string; dot: string }> = {
  LocalAuthority: { bg: '#f0f4ff', text: '#3b5a99', dot: '#6b8dd6' },
  NHS: { bg: '#f0faf3', text: '#276b40', dot: '#4d9e65' },
  School: { bg: '#fdf6e3', text: '#7a5c1e', dot: '#c4902a' },
  Police: { bg: '#eef2ff', text: '#3730a3', dot: '#6366f1' },
  Housing: { bg: '#fff7ed', text: '#9a3412', dot: '#ea580c' },
  VCSE: { bg: '#f5f0ff', text: '#5a3b8a', dot: '#8a63c4' },
  Private: { bg: '#f4f4f5', text: '#52525b', dot: '#a1a1aa' },
}

export function OrgPill({ organisationId, className = '' }: { organisationId: string; className?: string }) {
  const org = organisationMap[organisationId]
  if (!org) return null
  const tint = typeTint[org.type]
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium rounded-full px-2 py-0.5 ${className}`}
      style={{ backgroundColor: tint.bg, color: tint.text }}
      title={`Source: ${org.name}`}
    >
      <span className="inline-block rounded-full flex-shrink-0" style={{ width: 5, height: 5, backgroundColor: tint.dot }} aria-hidden="true" />
      via {org.shortName}
    </span>
  )
}
