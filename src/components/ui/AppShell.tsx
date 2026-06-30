'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Icon, LogoMark } from './Icon'
import { Avatar } from './primitives'
import { PRODUCT_NAME } from '@/lib/constants'
import { useApp, participants, serviceUsers } from '@/context/AppContext'
import { relationshipFor } from '@/context/AppContext'
import { organisationMap } from '@/data/seed'

export interface NavItem {
  label: string
  href: string
  icon: string
  badgeKey?: 'notifications'
}

// Home route for a participant, based on which "world" they belong to.
export function homeRouteFor(participantId: string): string {
  const p = participants.find((x) => x.id === participantId)
  if (!p) return '/dashboard'
  if (p.side === 'service_user') return '/dashboard'
  if (p.baseRole === 'Platform Admin') return '/admin'
  return '/provider'
}

// ---------------------------------------------------------------------------
// Sidebar
// ---------------------------------------------------------------------------
function Sidebar({ nav, sectionLabel }: { nav: NavItem[]; sectionLabel: string }) {
  const pathname = usePathname()
  const { unreadCount } = useApp()

  return (
    <aside
      className="hidden lg:flex flex-col w-60 flex-shrink-0 border-r"
      style={{ backgroundColor: '#fff', borderColor: 'var(--border)' }}
    >
      <div className="h-16 flex items-center gap-2 px-5 border-b" style={{ borderColor: 'var(--border)' }}>
        <LogoMark />
        <span className="font-bold text-lg" style={{ color: 'var(--brand-800)' }}>{PRODUCT_NAME}</span>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-3 scroll-thin" aria-label={sectionLabel}>
        <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>
          {sectionLabel}
        </p>
        <ul className="flex flex-col gap-0.5">
          {nav.map((item) => {
            const active = pathname === item.href
            const badge = item.badgeKey === 'notifications' ? unreadCount : 0
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: active ? '#eff4ff' : 'transparent',
                    color: active ? 'var(--brand-700)' : 'var(--text-muted)',
                  }}
                >
                  <Icon name={item.icon} size={18} />
                  <span className="flex-1">{item.label}</span>
                  {badge > 0 && (
                    <span
                      className="inline-flex items-center justify-center rounded-full text-white text-[10px] font-bold px-1.5"
                      style={{ minWidth: 18, height: 18, backgroundColor: '#3f9c54' }}
                    >
                      {badge > 9 ? '9+' : badge}
                    </span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="border-t px-3 py-3" style={{ borderColor: 'var(--border)' }}>
        <Link
          href="/login"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium"
          style={{ color: 'var(--text-muted)' }}
        >
          <Icon name="logout" size={18} />
          Log out
        </Link>
      </div>
    </aside>
  )
}

// ---------------------------------------------------------------------------
// Persona + Case switchers (the demo control)
// ---------------------------------------------------------------------------
function Switchers() {
  const { state, dispatch, activeParticipant } = useApp()
  const router = useRouter()

  // Service users the active participant has a relationship with (admin sees all)
  const availableServiceUsers =
    activeParticipant.baseRole === 'Platform Admin'
      ? serviceUsers
      : serviceUsers.filter((su) => relationshipFor(state.relationships, activeParticipant.id, su.id))

  function handlePersona(e: React.ChangeEvent<HTMLSelectElement>) {
    const id = e.target.value
    dispatch({ type: 'SET_PARTICIPANT', payload: id })
    // Ensure the active service user is one this participant can access
    const p = participants.find((x) => x.id === id)
    if (p && p.baseRole !== 'Platform Admin') {
      const stillValid = relationshipFor(state.relationships, id, state.activeServiceUserId)
      if (!stillValid) {
        const firstSu = serviceUsers.find((su) => relationshipFor(state.relationships, id, su.id))
        if (firstSu) dispatch({ type: 'SET_SERVICE_USER', payload: firstSu.id })
      }
    }
    router.push(homeRouteFor(id))
  }

  return (
    <div className="flex items-center gap-2">
      {/* Case (service user) switcher */}
      {availableServiceUsers.length > 0 && (
        <label className="relative hidden sm:block">
          <span className="sr-only">Active case</span>
          <select
            value={state.activeServiceUserId}
            onChange={(e) => dispatch({ type: 'SET_SERVICE_USER', payload: e.target.value })}
            className="appearance-none text-xs font-medium rounded-lg border pl-3 pr-7 py-1.5 cursor-pointer"
            style={{ borderColor: 'var(--border-2)', color: 'var(--text)', backgroundColor: '#fff' }}
            title="Switch case (demonstrates the same layer across domains)"
          >
            {availableServiceUsers.map((su) => (
              <option key={su.id} value={su.id}>
                Case: {su.name}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-faint)' }}>
            <Icon name="chevronDown" size={12} />
          </span>
        </label>
      )}

      {/* Persona switcher */}
      <label className="relative">
        <span className="sr-only">View as participant</span>
        <select
          value={activeParticipant.id}
          onChange={handlePersona}
          className="appearance-none text-xs font-medium rounded-lg border pl-3 pr-7 py-1.5 cursor-pointer"
          style={{ borderColor: 'var(--border-2)', color: 'var(--brand-700)', backgroundColor: '#fff' }}
          title="View as a different participant"
        >
          <optgroup label="Service-user side">
            {participants.filter((p) => p.side === 'service_user').map((p) => (
              <option key={p.id} value={p.id}>{p.name} · {p.baseRole}</option>
            ))}
          </optgroup>
          <optgroup label="Service-provider side">
            {participants.filter((p) => p.side === 'service_provider').map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} · {p.baseRole}{p.organisationId ? ` (${organisationMap[p.organisationId]?.shortName})` : ''}
              </option>
            ))}
          </optgroup>
        </select>
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-faint)' }}>
          <Icon name="chevronDown" size={12} />
        </span>
      </label>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Topbar
// ---------------------------------------------------------------------------
function Topbar({ title }: { title: string }) {
  const { activeParticipant, unreadCount } = useApp()

  return (
    <header
      className="h-16 flex-shrink-0 border-b flex items-center justify-between px-4 sm:px-6 gap-3"
      style={{ backgroundColor: '#fff', borderColor: 'var(--border)' }}
    >
      <div className="flex items-center gap-2 min-w-0">
        <span className="lg:hidden"><LogoMark size={20} /></span>
        <h1 className="text-base sm:text-lg font-semibold truncate" style={{ color: 'var(--brand-800)' }}>{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <Switchers />
        <button type="button" className="relative p-2 rounded-full" style={{ color: 'var(--text-muted)' }} aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}>
          <Icon name="bell" size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ backgroundColor: '#3f9c54' }} aria-hidden="true" />
          )}
        </button>
        <Avatar name={activeParticipant.name} color={activeParticipant.avatarColor} size={34} />
      </div>
    </header>
  )
}

// ---------------------------------------------------------------------------
// AppShell — sidebar + topbar + scrollable content
// ---------------------------------------------------------------------------
export function AppShell({
  nav,
  sectionLabel,
  children,
}: {
  nav: NavItem[]
  sectionLabel: string
  children: React.ReactNode
}) {
  const pathname = usePathname()
  // Title = deepest matching nav item's label (falls back to the section label)
  const match = [...nav].sort((a, b) => b.href.length - a.href.length).find((n) => pathname === n.href || pathname.startsWith(n.href + '/'))
  const title = match?.label ?? sectionLabel

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--bg)' }}>
      <Sidebar nav={nav} sectionLabel={sectionLabel} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title={title} />
        <main className="flex-1 overflow-y-auto scroll-thin">{children}</main>
      </div>
    </div>
  )
}
