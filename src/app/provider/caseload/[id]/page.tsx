'use client'

import React, { useEffect, useRef } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useApp, relationshipFor } from '@/context/AppContext'
import { serviceUserMap } from '@/data/seed'
import { journeyStages } from '@/data/seed'
import { Timeline } from '@/components/Timeline'
import { JourneyStepper } from '@/components/ui/JourneyStepper'
import { Card, Avatar, Badge, EmptyState } from '@/components/ui/primitives'

export default function ProviderRecordPage() {
  const params = useParams()
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id
  const { state, dispatch, activeParticipant, logAccess } = useApp()
  const su = id ? serviceUserMap[id] : undefined
  const rel = id ? relationshipFor(state.relationships, activeParticipant.id, id) : undefined
  const loggedRef = useRef<string | null>(null)

  // Make this the active case + record the access (once per record opened)
  useEffect(() => {
    if (!su || !rel) return
    if (state.activeServiceUserId !== su.id) dispatch({ type: 'SET_SERVICE_USER', payload: su.id })
    if (loggedRef.current !== su.id) {
      loggedRef.current = su.id
      logAccess('viewed_record', `Opened ${su.name}'s record`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [su?.id, rel?.id])

  if (!su || !rel) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        <Link href="/provider/caseload" className="inline-flex items-center gap-1.5 text-sm font-medium mb-6" style={{ color: 'var(--brand-700)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
          Back to caseload
        </Link>
        <Card><EmptyState title="No access to this record" body="You do not have a relationship to this person, so their record is not available to you." /></Card>
      </div>
    )
  }

  const stages = journeyStages[su.id] ?? []

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <Link href="/provider/caseload" className="inline-flex items-center gap-1.5 text-sm font-medium mb-5" style={{ color: 'var(--brand-700)' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
        Back to caseload
      </Link>

      <Card className="mb-5 flex items-center gap-4">
        <Avatar name={su.name} color={su.avatarColor} size={52} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-display text-xl font-bold" style={{ color: 'var(--brand-900)' }}>{su.name}</h2>
            <Badge tone="neutral">{su.age} yrs</Badge>
            <Badge tone="ok">{su.status}</Badge>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{su.contextLabel}</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-faint)' }}>Your relationship: {rel.relationshipType} · lawful basis: {rel.lawfulBasis}</p>
        </div>
      </Card>

      <Card className="mb-5">
        <div className="overflow-x-auto pb-1"><div style={{ minWidth: stages.length * 100 }}><JourneyStepper stages={stages} /></div></div>
      </Card>

      <Card padded={false} className="overflow-hidden">
        <div style={{ height: '60vh' }}>
          <Timeline linkable={false} />
        </div>
      </Card>
      <p className="text-xs mt-3 text-center" style={{ color: 'var(--text-faint)' }}>
        You are viewing the parts of {su.name}’s record permitted by your relationship and lawful basis. This access has been logged.
      </p>
    </div>
  )
}
