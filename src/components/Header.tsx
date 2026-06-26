'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useApp, people } from '@/context/AppContext'
import { PRODUCT_NAME } from '@/lib/constants'
import type { Person } from '@/types'

const roleLabels: Record<string, string> = {
  Parent: 'Parent / Carer',
  SENCO: 'SENCO',
  SocialWorker: 'Social Worker',
  CAMHSClinician: 'CAMHS Clinician',
  OT: 'Occupational Therapist',
  Caseworker: 'Caseworker',
}

export function Header() {
  const { state, dispatch, unreadCount } = useApp()
  const { currentPersona } = state
  const pathname = usePathname()
  const isParent = currentPersona.role === 'Parent'
  const onConsentPage = pathname === '/consent'

  function handlePersonaChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const selected = people.find((p: Person) => p.id === e.target.value)
    if (selected) {
      dispatch({ type: 'SET_PERSONA', payload: selected })
    }
  }

  return (
    <header
      style={{ backgroundColor: '#13294b' }}
      className="w-full shadow-md"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Product name */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <span
              style={{ color: '#5bb45a' }}
              className="text-xl font-bold tracking-wide"
              aria-label="Product logo mark"
            >
              ◈
            </span>
            <h1
              className="text-white text-xl tracking-tight"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontWeight: 600 }}
            >
              {PRODUCT_NAME}
            </h1>
            <span
              className="hidden sm:inline-block text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: '#2b6cb0', color: '#e2f0ff' }}
            >
              Prototype
            </span>
          </div>

          {/* Top nav links */}
          <nav className="hidden md:flex items-center gap-1 flex-1 ml-2" aria-label="Main navigation">
            <Link
              href="/"
              className="text-xs font-medium px-3 py-1.5 rounded-md transition-colors"
              style={{
                color: pathname === '/' ? '#5bb45a' : '#a3c4e8',
                backgroundColor: pathname === '/' ? 'rgba(91,180,90,0.12)' : 'transparent',
              }}
              aria-current={pathname === '/' ? 'page' : undefined}
            >
              Timeline
            </Link>
            <Link
              href="/how-it-works"
              className="text-xs font-medium px-3 py-1.5 rounded-md transition-colors"
              style={{
                color: pathname === '/how-it-works' ? '#5bb45a' : '#a3c4e8',
                backgroundColor: pathname === '/how-it-works' ? 'rgba(91,180,90,0.12)' : 'transparent',
              }}
              aria-current={pathname === '/how-it-works' ? 'page' : undefined}
            >
              How It Works
            </Link>
          </nav>

          {/* Right-hand controls */}
          <div className="flex items-center gap-3 sm:gap-4">

            {/* Persona switcher */}
            <div className="flex items-center gap-2">
              <label
                htmlFor="persona-switcher"
                className="hidden sm:block text-xs font-medium"
                style={{ color: '#a3c4e8' }}
              >
                Viewing as
              </label>
              <div className="relative">
                <select
                  id="persona-switcher"
                  value={currentPersona.id}
                  onChange={handlePersonaChange}
                  className="appearance-none text-sm rounded-md pl-3 pr-8 py-1.5 font-medium focus:outline-none focus:ring-2 cursor-pointer"
                  style={{
                    backgroundColor: '#1e3f6b',
                    color: '#e8f4ff',
                    border: '1px solid #2b6cb0',
                  }}
                  aria-label="Switch persona"
                >
                  {people.map((p: Person) => (
                    <option key={p.id} value={p.id}>
                      {p.name} · {roleLabels[p.role] ?? p.role}
                    </option>
                  ))}
                </select>
                {/* Custom chevron */}
                <span
                  className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs"
                  style={{ color: '#a3c4e8' }}
                  aria-hidden="true"
                >
                  ▾
                </span>
              </div>
            </div>

            {/* Notification bell */}
            <Link
              href="/notifications"
              className="relative p-2 rounded-full transition-colors focus:outline-none focus:ring-2"
              style={{ color: pathname === '/notifications' ? '#5bb45a' : '#a3c4e8' }}
              aria-label={
                unreadCount > 0
                  ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                  : 'No unread notifications'
              }
              title="Notifications"
            >
              {/* Bell SVG */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>

              {/* Unread badge */}
              {unreadCount > 0 && (
                <span
                  className="absolute top-0.5 right-0.5 flex items-center justify-center rounded-full text-white font-bold"
                  style={{
                    backgroundColor: '#3f9c54',
                    fontSize: '0.6rem',
                    minWidth: '1.1rem',
                    height: '1.1rem',
                    lineHeight: 1,
                    padding: '0 3px',
                  }}
                  aria-hidden="true"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>

            {/* Current role pill */}
            <span
              className="hidden md:inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full"
              style={{ backgroundColor: '#2b6cb0', color: '#e2f0ff' }}
            >
              {roleLabels[currentPersona.role] ?? currentPersona.role}
            </span>
          </div>
        </div>
      </div>

      {/* Sub-bar: current service user context */}
      <div
        className="w-full border-t"
        style={{ backgroundColor: '#0f2240', borderColor: '#1e3f6b' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center gap-2 flex-wrap">
          <span
            className="text-xs font-medium"
            style={{ color: '#a3c4e8' }}
          >
            Child record:
          </span>
          <span
            className="text-xs font-semibold"
            style={{ color: '#e8f4ff' }}
          >
            {state.serviceUser.name}
          </span>
          <span
            className="text-xs"
            style={{ color: '#6b97c4' }}
          >
            ·
          </span>
          <span
            className="text-xs"
            style={{ color: '#7aabcc' }}
          >
            {state.serviceUser.sendCategory}
          </span>

          {/* Spacer */}
          <span className="flex-1" aria-hidden="true" />

          {/* Consent nav link */}
          {isParent ? (
            <Link
              href="/consent"
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-0.5 rounded-full transition-colors"
              style={{
                backgroundColor: onConsentPage ? '#3f9c54' : '#1e3f6b',
                color: onConsentPage ? '#ffffff' : '#5bb45a',
                border: '1px solid',
                borderColor: onConsentPage ? '#3f9c54' : '#3f9c54',
                textDecoration: 'none',
              }}
              aria-current={onConsentPage ? 'page' : undefined}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Consent &amp; Permissions
            </Link>
          ) : (
            <span
              className="relative flex items-center gap-1.5 text-xs font-medium px-3 py-0.5 rounded-full cursor-not-allowed"
              style={{
                backgroundColor: 'transparent',
                color: '#4a6e94',
                border: '1px solid #2b4a6b',
              }}
              title="Consent is managed by the family — switch to Parent persona to access"
              aria-label="Consent and Permissions — family only"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Consent &amp; Permissions
              <span
                className="ml-1 text-xs font-medium"
                style={{ color: '#4a6e94' }}
              >
                · Family only
              </span>
            </span>
          )}
        </div>
      </div>
    </header>
  )
}
