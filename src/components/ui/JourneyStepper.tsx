'use client'

import React from 'react'
import type { JourneyStage } from '@/types'

const stateColor: Record<JourneyStage['state'], string> = {
  complete: '#16a34a',
  in_progress: '#2563eb',
  upcoming: '#cbd5e1',
}

const stateLabel: Record<JourneyStage['state'], string> = {
  complete: 'Complete',
  in_progress: 'In progress',
  upcoming: 'Upcoming',
}

export function JourneyStepper({ stages }: { stages: JourneyStage[] }) {
  return (
    <div className="flex items-start w-full">
      {stages.map((stage, i) => {
        const color = stateColor[stage.state]
        const isLast = i === stages.length - 1
        return (
          <React.Fragment key={stage.key}>
            <div className="flex flex-col items-center text-center flex-shrink-0" style={{ width: 92 }}>
              <span
                className="flex items-center justify-center rounded-full"
                style={{
                  width: 30,
                  height: 30,
                  backgroundColor: stage.state === 'upcoming' ? '#fff' : color,
                  border: `2px solid ${color}`,
                  color: stage.state === 'upcoming' ? '#94a3b8' : '#fff',
                }}
              >
                {stage.state === 'complete' ? (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <span className="text-xs font-bold">{i + 1}</span>
                )}
              </span>
              <span className="mt-1.5 text-xs font-semibold" style={{ color: 'var(--brand-800)' }}>
                {stage.label}
              </span>
              <span className="text-[11px]" style={{ color: 'var(--text-faint)' }}>
                {stateLabel[stage.state]}
              </span>
            </div>
            {!isLast && (
              <div className="flex-1 h-[2px] mt-[14px]" style={{ backgroundColor: stages[i + 1].state === 'upcoming' && stage.state !== 'complete' ? '#e2e8f0' : stage.state === 'complete' ? '#16a34a' : '#cbd5e1' }} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}
