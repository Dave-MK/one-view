'use client'

import React from 'react'
import { useApp } from '@/context/AppContext'
import type { Role, EventCategory } from '@/types'

// Professional roles that require consent (Parent is excluded — they own the data)
const PROFESSIONAL_ROLES: { role: Role; label: string; org: string }[] = [
  { role: 'SENCO', label: 'SENCO', org: 'St Helens SEND School' },
  { role: 'SocialWorker', label: 'Social Worker', org: 'St Helens Council' },
  { role: 'CAMHSClinician', label: 'CAMHS Clinician', org: 'Mersey Care NHS Foundation Trust' },
  { role: 'OT', label: 'Occupational Therapist', org: 'Alder Hey Children\'s NHS Foundation Trust' },
  { role: 'Caseworker', label: 'Caseworker', org: 'St Helens Council — SEND Casework Team' },
]

const CATEGORIES: { id: EventCategory; label: string; colour: string; description: string }[] = [
  {
    id: 'education',
    label: 'Education',
    colour: '#2b6cb0',
    description: 'School records, EHCP reviews, placement decisions',
  },
  {
    id: 'health',
    label: 'Health',
    colour: '#3f9c54',
    description: 'Clinical appointments, therapy reports, referrals',
  },
  {
    id: 'social_care',
    label: 'Social Care',
    colour: '#7b5ea7',
    description: 'Case management, assessments, support plans',
  },
  {
    id: 'admin',
    label: 'Admin',
    colour: '#b45309',
    description: 'Shared documents, correspondence, planning records',
  },
]

export function ConsentGrid() {
  const { state, dispatch } = useApp()
  const { currentPersona, consentRules, serviceUser } = state

  // Non-Parent view
  if (currentPersona.role !== 'Parent') {
    return (
      <div
        className="rounded-2xl border p-8 text-center max-w-lg mx-auto mt-12"
        style={{ borderColor: '#d1dce8', backgroundColor: '#f8fafc' }}
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: '#e8f0fa' }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#2b6cb0"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <h2
          className="text-lg font-semibold mb-2"
          style={{ color: '#13294b', fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          Consent is managed by the family
        </h2>
        <p className="text-sm" style={{ color: '#4a6580' }}>
          Only {serviceUser.name}&apos;s parent or carer can view and change consent settings.
          You are currently viewing as{' '}
          <span className="font-medium" style={{ color: '#13294b' }}>
            {currentPersona.name}
          </span>{' '}
          ({currentPersona.role}). Switch to the Parent persona to see this screen.
        </p>
      </div>
    )
  }

  // Helper: is a given role+category currently allowed?
  function isAllowed(role: Role, category: EventCategory): boolean {
    const rule = consentRules.find(
      (r) => r.serviceUserId === serviceUser.id && r.granteeRole === role
    )
    return rule ? rule.allowedCategories.includes(category) : false
  }

  // Toggle a category for a role
  function handleToggle(role: Role, category: EventCategory) {
    const rule = consentRules.find(
      (r) => r.serviceUserId === serviceUser.id && r.granteeRole === role
    )
    const currentCategories: EventCategory[] = rule ? [...rule.allowedCategories] : []
    let updatedCategories: EventCategory[]
    if (currentCategories.includes(category)) {
      updatedCategories = currentCategories.filter((c) => c !== category)
    } else {
      updatedCategories = [...currentCategories, category]
    }
    dispatch({
      type: 'UPDATE_CONSENT',
      payload: {
        serviceUserId: serviceUser.id,
        granteeRole: role,
        allowedCategories: updatedCategories,
      },
    })
  }

  return (
    <div className="space-y-6">
      {/* Family ownership banner */}
      <div
        className="flex items-start gap-3 rounded-xl px-5 py-4 border"
        style={{ backgroundColor: '#f0f7f1', borderColor: '#5bb45a' }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#3f9c54"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="flex-shrink-0 mt-0.5"
          aria-hidden="true"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <div>
          <p className="text-sm font-semibold" style={{ color: '#1e5c2a' }}>
            You are in control
          </p>
          <p className="text-sm mt-0.5" style={{ color: '#2d6b37' }}>
            You decide which professionals can see which categories of information about{' '}
            <span className="font-medium">{serviceUser.name}</span>. Changes take effect
            immediately across all professional views. OneView does not store clinical records —
            it only shows professionals that events exist.
          </p>
        </div>
      </div>

      {/* Category legend */}
      <div className="flex flex-wrap gap-3">
        {CATEGORIES.map((cat) => (
          <div key={cat.id} className="flex items-center gap-1.5">
            <span
              className="inline-block w-3 h-3 rounded-sm flex-shrink-0"
              style={{ backgroundColor: cat.colour }}
              aria-hidden="true"
            />
            <span className="text-xs font-medium" style={{ color: '#4a6580' }}>
              {cat.label}
            </span>
            <span className="text-xs" style={{ color: '#8ba5be' }}>
              — {cat.description}
            </span>
          </div>
        ))}
      </div>

      {/* Grid — desktop table, mobile cards */}
      <div className="hidden md:block overflow-x-auto rounded-xl border" style={{ borderColor: '#d1dce8' }}>
        <table className="w-full border-collapse">
          <thead>
            <tr style={{ backgroundColor: '#f0f4fa' }}>
              <th
                className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide border-b"
                style={{ color: '#4a6580', borderColor: '#d1dce8', minWidth: '220px' }}
              >
                Professional role
              </th>
              {CATEGORIES.map((cat) => (
                <th
                  key={cat.id}
                  className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide border-b border-l"
                  style={{ color: cat.colour, borderColor: '#d1dce8' }}
                >
                  {cat.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PROFESSIONAL_ROLES.map((prof, idx) => (
              <tr
                key={prof.role}
                style={{
                  backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc',
                }}
              >
                <td
                  className="px-5 py-4 border-b"
                  style={{ borderColor: '#e8eef5' }}
                >
                  <div>
                    <span className="text-sm font-semibold" style={{ color: '#13294b' }}>
                      {prof.label}
                    </span>
                    <span className="block text-xs mt-0.5" style={{ color: '#8ba5be' }}>
                      {prof.org}
                    </span>
                  </div>
                </td>
                {CATEGORIES.map((cat) => {
                  const allowed = isAllowed(prof.role, cat.id)
                  return (
                    <td
                      key={cat.id}
                      className="px-4 py-4 text-center border-b border-l"
                      style={{ borderColor: '#e8eef5' }}
                    >
                      <label
                        className="inline-flex items-center justify-center cursor-pointer group"
                        aria-label={`${allowed ? 'Revoke' : 'Grant'} ${cat.label} access for ${prof.label}`}
                      >
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={allowed}
                          onChange={() => handleToggle(prof.role, cat.id)}
                        />
                        <span
                          className="flex items-center justify-center w-8 h-8 rounded-lg border-2 transition-all duration-150"
                          style={{
                            backgroundColor: allowed ? cat.colour : 'transparent',
                            borderColor: allowed ? cat.colour : '#c8d6e5',
                          }}
                          aria-hidden="true"
                        >
                          {allowed && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="white"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </span>
                      </label>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: card-based layout */}
      <div className="md:hidden space-y-4">
        {PROFESSIONAL_ROLES.map((prof) => (
          <div
            key={prof.role}
            className="rounded-xl border p-4 space-y-3"
            style={{ borderColor: '#d1dce8', backgroundColor: '#ffffff' }}
          >
            <div>
              <p className="text-sm font-semibold" style={{ color: '#13294b' }}>
                {prof.label}
              </p>
              <p className="text-xs mt-0.5" style={{ color: '#8ba5be' }}>
                {prof.org}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => {
                const allowed = isAllowed(prof.role, cat.id)
                return (
                  <label
                    key={cat.id}
                    className="flex items-center gap-2 cursor-pointer select-none rounded-lg px-3 py-2 border transition-all duration-150"
                    style={{
                      backgroundColor: allowed ? `${cat.colour}18` : '#f8fafc',
                      borderColor: allowed ? cat.colour : '#d1dce8',
                    }}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={allowed}
                      onChange={() => handleToggle(prof.role, cat.id)}
                    />
                    <span
                      className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded border-2 transition-all duration-150"
                      style={{
                        backgroundColor: allowed ? cat.colour : 'transparent',
                        borderColor: allowed ? cat.colour : '#c8d6e5',
                      }}
                      aria-hidden="true"
                    >
                      {allowed && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </span>
                    <span
                      className="text-xs font-medium"
                      style={{ color: allowed ? cat.colour : '#4a6580' }}
                    >
                      {cat.label}
                    </span>
                  </label>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <p className="text-xs" style={{ color: '#8ba5be' }}>
        Consent changes are reflected immediately. Professionals who lose access will no longer see
        those event categories in their view. No data is deleted — access is simply withdrawn until
        you re-grant it.
      </p>
    </div>
  )
}
