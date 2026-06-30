'use client'

import React from 'react'
import Link from 'next/link'
import { useApp, canSee } from '@/context/AppContext'
import { participantMap, organisationMap, journeyStages } from '@/data/seed'
import { CATEGORY_META } from '@/lib/constants'
import { relativeTime, formatDate } from '@/lib/format'
import { Card, SectionHeader, Badge, Avatar } from '@/components/ui/primitives'
import { JourneyStepper } from '@/components/ui/JourneyStepper'
import { OrgPill } from '@/components/ui/OrgPill'
import { SimulatorPanel } from '@/components/SimulatorPanel'

export default function ServiceUserHome() {
  const { state, activeParticipant, activeServiceUser, visibleEvents } = useApp()
  const firstName = activeParticipant.name.split(' ')[0]
  const stages = journeyStages[activeServiceUser.id] ?? []

  const visibleAppointments = state.appointments
    .filter((a) => a.serviceUserId === activeServiceUser.id && canSee(a, activeParticipant, state.relationships))
    .sort((a, b) => a.date.localeCompare(b.date))

  const attention = visibleEvents.filter((e) => e.type === 'review_due' || e.type === 'review_scheduled')
  const recent = visibleEvents.slice(0, 5)

  const team = state.relationships
    .filter((r) => r.serviceUserId === activeServiceUser.id)
    .map((r) => ({ rel: r, p: participantMap[r.participantId] }))
    .filter((t) => t.p && t.p.side === 'service_provider')

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      {/* Welcome */}
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--brand-900)' }}>Welcome back, {firstName}</h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Here’s what’s happening with <strong>{activeServiceUser.name}</strong>’s support — {activeServiceUser.contextLabel}.
        </p>
      </div>

      {/* Journey overview */}
      <Card className="mb-6">
        <SectionHeader title="Journey overview" action={<Link href="/dashboard/journey" className="text-xs font-medium" style={{ color: 'var(--brand-700)' }}>View timeline</Link>} />
        <div className="overflow-x-auto pb-1">
          <div style={{ minWidth: stages.length * 100 }}>
            <JourneyStepper stages={stages} />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left two columns */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          <Card>
            <SectionHeader title="Needs attention" />
            {attention.length === 0 ? (
              <p className="text-sm" style={{ color: 'var(--text-faint)' }}>Nothing needs your attention right now.</p>
            ) : (
              <ul className="flex flex-col gap-2.5">
                {attention.map((e) => (
                  <li key={e.id} className="flex items-center gap-3 rounded-lg border px-3 py-2.5" style={{ borderColor: 'var(--border)' }}>
                    <span className="w-1.5 h-8 rounded-full" style={{ backgroundColor: CATEGORY_META[e.category].color }} />
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-medium" style={{ color: '#0f172a' }}>{e.title}</span>
                      <span className="text-xs" style={{ color: 'var(--text-faint)' }}>{relativeTime(e.timestamp)}</span>
                    </span>
                    <Badge tone="warn">Action</Badge>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card>
            <SectionHeader title="Upcoming appointments" action={<Link href="/dashboard/appointments" className="text-xs font-medium" style={{ color: 'var(--brand-700)' }}>View all</Link>} />
            {visibleAppointments.length === 0 ? (
              <p className="text-sm" style={{ color: 'var(--text-faint)' }}>No upcoming appointments visible to you.</p>
            ) : (
              <ul className="flex flex-col divide-y" style={{ borderColor: 'var(--border)' }}>
                {visibleAppointments.map((a) => (
                  <li key={a.id} className="flex items-center gap-3 py-2.5">
                    <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg flex-shrink-0" style={{ backgroundColor: CATEGORY_META[a.category].bg }}>
                      <span className="text-xs font-bold" style={{ color: CATEGORY_META[a.category].color }}>{new Date(a.date).getDate()}</span>
                      <span className="text-[10px] uppercase" style={{ color: CATEGORY_META[a.category].color }}>{new Date(a.date).toLocaleDateString('en-GB', { month: 'short' })}</span>
                    </div>
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-medium" style={{ color: '#0f172a' }}>{a.title}</span>
                      <span className="text-xs" style={{ color: 'var(--text-faint)' }}>{a.time} · {a.isVirtual ? 'Virtual' : a.location}</span>
                    </span>
                    <OrgPill organisationId={a.sourceOrganisationId} />
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card>
            <SectionHeader title="People involved" action={<Link href="/dashboard/people" className="text-xs font-medium" style={{ color: 'var(--brand-700)' }}>View all</Link>} />
            <div className="flex flex-wrap gap-4">
              {team.map(({ rel, p }) => (
                <div key={rel.id} className="flex items-center gap-2.5">
                  <Avatar name={p.name} color={p.avatarColor} size={36} />
                  <div>
                    <p className="text-sm font-medium leading-tight" style={{ color: '#0f172a' }}>{p.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-faint)' }}>{p.baseRole}{p.organisationId ? ` · ${organisationMap[p.organisationId]?.shortName}` : ''}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">
          <Card>
            <SectionHeader title="Recent updates" action={<Link href="/dashboard/journey" className="text-xs font-medium" style={{ color: 'var(--brand-700)' }}>View all</Link>} />
            <ul className="flex flex-col gap-3">
              {recent.map((e) => (
                <li key={e.id} className="flex gap-2.5">
                  <span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: CATEGORY_META[e.category].color }} />
                  <div className="min-w-0">
                    <p className="text-sm leading-snug" style={{ color: '#0f172a' }}>{e.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-faint)' }}>{formatDate(e.timestamp)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          <Card padded={false} className="p-5" >
            <SectionHeader title="Need help?" />
            <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>Find advice or contact your coordinator.</p>
            <Link href="/dashboard/help" className="inline-block rounded-lg px-4 py-2 text-white text-sm font-semibold" style={{ backgroundColor: 'var(--brand-800)' }}>Get support</Link>
          </Card>

          <SimulatorPanel key={activeServiceUser.id} />
        </div>
      </div>
    </div>
  )
}
