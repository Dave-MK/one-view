'use client'

import React from 'react'

export interface Slice {
  label: string
  value: number
  color: string
}

// ---------------------------------------------------------------------------
// Donut — pure SVG, no dependency. Renders a ring with a centred total and a
// legend with values + percentages.
// ---------------------------------------------------------------------------
export function Donut({
  data,
  size = 150,
  thickness = 22,
  centerLabel,
}: {
  data: Slice[]
  size?: number
  thickness?: number
  centerLabel?: string
}) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1
  const r = (size - thickness) / 2
  const cx = size / 2
  const cy = size / 2
  const circumference = 2 * Math.PI * r

  // Cumulative offset for each slice, computed without mutating outer state
  const cumulativeBefore = data.map((_, i) =>
    data.slice(0, i).reduce((sum, d) => sum + (d.value / total) * circumference, 0),
  )
  const segments = data.map((d, i) => {
    const dash = (d.value / total) * circumference
    return (
      <circle
        key={d.label}
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={d.color}
        strokeWidth={thickness}
        strokeDasharray={`${dash} ${circumference - dash}`}
        strokeDashoffset={-cumulativeBefore[i]}
        transform={`rotate(-90 ${cx} ${cy})`}
      />
    )
  })

  return (
    <div className="flex items-center gap-5">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="flex-shrink-0">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#eef2f6" strokeWidth={thickness} />
        {segments}
        <text x={cx} y={cy - 2} textAnchor="middle" fontSize={size * 0.2} fontWeight="700" fill="#16335a">
          {total}
        </text>
        {centerLabel && (
          <text x={cx} y={cy + size * 0.13} textAnchor="middle" fontSize={size * 0.085} fill="#94a3b8">
            {centerLabel}
          </text>
        )}
      </svg>
      <ul className="flex flex-col gap-1.5 text-xs min-w-0">
        {data.map((d) => (
          <li key={d.label} className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: d.color }} />
            <span className="flex-1 truncate" style={{ color: 'var(--text-muted)' }}>{d.label}</span>
            <span className="font-semibold tabular-nums" style={{ color: 'var(--brand-800)' }}>{d.value}</span>
            <span className="tabular-nums w-9 text-right" style={{ color: 'var(--text-faint)' }}>
              {Math.round((d.value / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ---------------------------------------------------------------------------
// BarList — horizontal bars (e.g. access by organisation)
// ---------------------------------------------------------------------------
export function BarList({
  data,
  color = '#2563eb',
}: {
  data: { label: string; value: number }[]
  color?: string
}) {
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <ul className="flex flex-col gap-3">
      {data.map((d) => (
        <li key={d.label} className="text-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="truncate" style={{ color: 'var(--text-muted)' }}>{d.label}</span>
            <span className="font-semibold tabular-nums ml-2" style={{ color: 'var(--brand-800)' }}>
              {d.value.toLocaleString()}
            </span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#eef2f6' }}>
            <div className="h-full rounded-full" style={{ width: `${(d.value / max) * 100}%`, backgroundColor: color }} />
          </div>
        </li>
      ))}
    </ul>
  )
}
