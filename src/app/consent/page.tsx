'use client'

import React from 'react'
import { useApp } from '@/context/AppContext'
import { ConsentGrid } from '@/components/ConsentGrid'
import { PRODUCT_NAME } from '@/lib/constants'

const roleLabels: Record<string, string> = {
  Parent: 'Parent / Carer',
  SENCO: 'SENCO',
  SocialWorker: 'Social Worker',
  CAMHSClinician: 'CAMHS Clinician',
  OT: 'Occupational Therapist',
  Caseworker: 'Caseworker',
}

export default function ConsentPage() {
  const { state } = useApp()
  const { currentPersona, serviceUser } = state
  const isParent = currentPersona.role === 'Parent'

  return (
    <div className="min-h-screen" role="main" style={{ backgroundColor: '#f4f7fb' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

        {/* Page header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-medium px-2.5 py-0.5 rounded-full"
              style={{ backgroundColor: '#e8f0fa', color: '#2b6cb0' }}
            >
              {PRODUCT_NAME}
            </span>
            <span style={{ color: '#8ba5be' }} className="text-xs">
              /
            </span>
            <span className="text-xs" style={{ color: '#8ba5be' }}>
              Consent &amp; Permissions
            </span>
          </div>

          <h1
            className="text-2xl sm:text-3xl font-bold tracking-tight"
            style={{
              color: '#13294b',
              fontFamily: 'Georgia, "Times New Roman", serif',
            }}
          >
            Consent &amp; Permissions
          </h1>

          {isParent ? (
            <p className="text-base leading-relaxed max-w-2xl" style={{ color: '#4a6580' }}>
              You control who sees which information about{' '}
              <span className="font-semibold" style={{ color: '#13294b' }}>
                {serviceUser.name}
              </span>
              . Changes take effect immediately — professional views update in real time. {PRODUCT_NAME}{' '}
              never stores clinical records; it only lets professionals know that events exist and
              which system holds the detail.
            </p>
          ) : (
            <p className="text-base leading-relaxed max-w-2xl" style={{ color: '#4a6580' }}>
              This screen is managed by {serviceUser.name}&apos;s parent or carer. You are currently
              viewing as{' '}
              <span className="font-semibold" style={{ color: '#13294b' }}>
                {currentPersona.name}
              </span>{' '}
              ({roleLabels[currentPersona.role] ?? currentPersona.role}).
            </p>
          )}
        </div>

        {/* Persona context strip */}
        <div
          className="flex items-center gap-3 rounded-xl px-4 py-3 border text-sm"
          style={{
            backgroundColor: '#eef3fa',
            borderColor: '#c8d6e5',
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#2b6cb0"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="flex-shrink-0"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span style={{ color: '#4a6580' }}>
            Currently viewing as{' '}
            <span className="font-semibold" style={{ color: '#13294b' }}>
              {currentPersona.name}
            </span>{' '}
            &middot;{' '}
            <span
              className="inline-block text-xs px-2 py-0.5 rounded-full font-medium"
              style={{
                backgroundColor: isParent ? '#e1f3e4' : '#e8f0fa',
                color: isParent ? '#1e5c2a' : '#2b6cb0',
              }}
            >
              {roleLabels[currentPersona.role] ?? currentPersona.role}
            </span>
          </span>
          {isParent && (
            <span
              className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full"
              style={{ backgroundColor: '#3f9c54', color: '#ffffff' }}
            >
              You can edit
            </span>
          )}
        </div>

        {/* Key principles — only show to Parent */}
        {isParent && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3f9c54" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="9 11 12 14 22 4" />
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                  </svg>
                ),
                heading: 'Immediate effect',
                body: 'Toggle a checkbox and the change applies instantly. No waiting, no approvals.',
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3f9c54" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                ),
                heading: 'No data shared — only pointers',
                body: 'Professionals see that a record exists and which system holds it. Clinical content stays in the source system.',
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3f9c54" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0" />
                    <path d="M12 8v4l3 3" />
                  </svg>
                ),
                heading: 'Reversible at any time',
                body: 'You can withdraw access at any moment. Nothing is permanent.',
              },
            ].map(({ icon, heading, body }) => (
              <div
                key={heading}
                className="rounded-xl border p-4 space-y-2"
                style={{ borderColor: '#d1dce8', backgroundColor: '#ffffff' }}
              >
                <div className="flex items-center gap-2">
                  {icon}
                  <span className="text-sm font-semibold" style={{ color: '#13294b' }}>
                    {heading}
                  </span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: '#4a6580' }}>
                  {body}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* The grid itself */}
        <ConsentGrid />
      </div>
    </div>
  )
}
