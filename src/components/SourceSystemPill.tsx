'use client'

import React from 'react'
import { sourceSystemMap } from '@/data/seed'

// Subtle per-system tints — light enough to not shout, distinctive enough to orient
const systemTints: Record<string, { bg: string; text: string; dot: string }> = {
  liquidlogic: { bg: '#f0f4ff', text: '#3b5a99', dot: '#6b8dd6' },
  rio:         { bg: '#f0faf3', text: '#276b40', dot: '#4d9e65' },
  schoolMis:   { bg: '#fdf6e3', text: '#7a5c1e', dot: '#c4902a' },
  alderHey:    { bg: '#f5f0ff', text: '#5a3b8a', dot: '#8a63c4' },
  graphnet:    { bg: '#f0f8ff', text: '#1e5f8a', dot: '#3d88b8' },
}

const fallbackTint = { bg: '#f4f4f5', text: '#52525b', dot: '#a1a1aa' }

interface Props {
  sourceSystemId: string
  className?: string
}

export function SourceSystemPill({ sourceSystemId, className = '' }: Props) {
  const system = sourceSystemMap[sourceSystemId]
  const tint = systemTints[sourceSystemId] ?? fallbackTint

  if (!system) return null

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium rounded-full px-2 py-0.5 ${className}`}
      style={{ backgroundColor: tint.bg, color: tint.text }}
      title={`Source: ${system.name} — ${system.org}`}
    >
      {/* Coloured dot */}
      <span
        className="inline-block rounded-full flex-shrink-0"
        style={{ width: '5px', height: '5px', backgroundColor: tint.dot }}
        aria-hidden="true"
      />
      via {system.name}
    </span>
  )
}
