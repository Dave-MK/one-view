'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogoMark, Icon } from '../ui/Icon'
import { PRODUCT_NAME } from '@/lib/constants'
import { useApp } from '@/context/AppContext'
import { useTutorial } from '@/context/TutorialContext'
import { homeRouteFor } from '../ui/AppShell'

const NAV = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'For professionals', href: '#two-worlds' },
  { label: 'Transferable', href: '#domains' },
  { label: 'Security', href: '#security' },
  { label: 'Journeys', href: '#journeys' },
]

export function PublicNav() {
  const { state } = useApp()
  const { start, hasTour } = useTutorial()
  const pathname = usePathname()
  const home = state.loggedIn ? homeRouteFor(state.activeParticipantId) : '/'

  return (
    <header className="sticky top-0 z-30 w-full border-b" style={{ backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', borderColor: 'var(--border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <Link href={home} className="flex items-center gap-2 flex-shrink-0" aria-label={`${PRODUCT_NAME} home`}>
          <LogoMark />
          <span className="font-bold text-lg" style={{ color: 'var(--brand-800)' }}>{PRODUCT_NAME}</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="text-sm font-medium px-3 py-2 rounded-md transition-colors" style={{ color: 'var(--text-muted)' }}>
              {n.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {hasTour(pathname) && (
            <button
              onClick={() => start(pathname)}
              className="hidden sm:inline-flex items-center justify-center w-9 h-9 rounded-full border flex-shrink-0"
              style={{ borderColor: 'var(--border-2)', color: 'var(--brand-700)' }}
              aria-label="Take a tour of this page"
              title="Take a tour of this page"
            >
              <Icon name="help" size={18} />
            </button>
          )}
          {state.loggedIn ? (
            <Link href={home} className="text-sm font-semibold px-4 py-1.5 rounded-lg text-white" style={{ backgroundColor: 'var(--brand-800)' }}>Go to dashboard</Link>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium px-3 py-1.5 rounded-lg" style={{ color: 'var(--brand-700)' }}>Log in</Link>
              <Link href="/login?tab=create" className="text-sm font-semibold px-4 py-1.5 rounded-lg text-white" style={{ backgroundColor: 'var(--brand-800)' }}>Sign up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export function PublicFooter() {
  return (
    <footer className="border-t" style={{ backgroundColor: '#fff', borderColor: 'var(--border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <LogoMark size={18} />
          <span className="font-semibold text-sm" style={{ color: 'var(--brand-800)' }}>{PRODUCT_NAME}</span>
          <span className="text-xs" style={{ color: 'var(--text-faint)' }}>· Prototype — no real data is stored.</span>
        </div>
        <p className="text-xs text-center sm:text-right" style={{ color: 'var(--text-faint)' }}>
          OneView is not an emergency service. If you are in immediate danger, call 999.
        </p>
      </div>
    </footer>
  )
}
