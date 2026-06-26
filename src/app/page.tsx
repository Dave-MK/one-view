'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '@/context/AppContext'
import { Timeline } from '@/components/Timeline'
import { SimulatorPanel } from '@/components/SimulatorPanel'
import { NotificationsList } from '@/components/NotificationsList'

// ---------------------------------------------------------------------------
// Service User banner
// ---------------------------------------------------------------------------
function ServiceUserBanner() {
  const { state } = useApp()
  const { serviceUser } = state

  // Calculate age display
  const ageLabel = `${serviceUser.age} years old`

  return (
    <div
      className="w-full border-b"
      style={{ backgroundColor: '#fff', borderColor: '#e5e7eb' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex items-start gap-5">
          {/* Avatar placeholder */}
          <div
            className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl"
            style={{ backgroundColor: '#e8f0fe', color: '#13294b' }}
            aria-hidden="true"
          >
            {serviceUser.name.charAt(0)}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center flex-wrap gap-3">
              <h2
                className="text-2xl font-bold tracking-tight"
                style={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  color: '#13294b',
                }}
              >
                {serviceUser.name}
              </h2>
              <span
                className="text-sm px-2.5 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: '#e8f0fe', color: '#13294b' }}
              >
                {ageLabel}
              </span>
              <span
                className="text-sm px-2.5 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: '#dcfce7', color: '#15803d' }}
              >
                EHCP Active
              </span>
            </div>
            <p className="mt-1 text-sm" style={{ color: '#64748b' }}>
              {serviceUser.sendCategory}
            </p>
          </div>

          {/* Consent indicator */}
          <div
            className="hidden sm:flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border flex-shrink-0"
            style={{ backgroundColor: '#fefce8', color: '#a16207', borderColor: '#fde68a' }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Family-controlled consent
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Right panel: Simulator + Notifications tabs
// ---------------------------------------------------------------------------
type RightTab = 'simulator' | 'notifications'

function RightPanel() {
  const { unreadCount } = useApp()
  const [activeTab, setActiveTab] = useState<RightTab>('simulator')

  return (
    <div className="flex flex-col h-full">
      {/* Tab bar */}
      <div
        className="flex border-b"
        style={{ borderColor: '#e5e7eb', backgroundColor: '#f8fafc' }}
        role="tablist"
        aria-label="Right panel"
      >
        {[
          { key: 'simulator' as RightTab, label: 'Simulator' },
          {
            key: 'notifications' as RightTab,
            label: 'Notifications',
            badge: unreadCount,
          },
        ].map((tab) => {
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${tab.key}`}
              onClick={() => setActiveTab(tab.key)}
              className="flex-1 inline-flex items-center justify-center gap-2 text-sm font-medium py-3 px-4 border-b-2 transition-colors"
              style={{
                borderBottomColor: isActive ? '#13294b' : 'transparent',
                color: isActive ? '#13294b' : '#64748b',
                backgroundColor: 'transparent',
              }}
            >
              {tab.label}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span
                  className="inline-flex items-center justify-center rounded-full text-xs font-bold"
                  style={{
                    minWidth: '1.2rem',
                    height: '1.2rem',
                    backgroundColor: '#3f9c54',
                    color: '#fff',
                    fontSize: '0.65rem',
                    padding: '0 3px',
                  }}
                  aria-label={`${tab.badge} unread`}
                >
                  {tab.badge > 9 ? '9+' : tab.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Panel content */}
      <div
        className="flex-1 overflow-y-auto"
        id={`panel-${activeTab}`}
        role="tabpanel"
        aria-label={activeTab === 'simulator' ? 'Simulator panel' : 'Notifications panel'}
      >
        <AnimatePresence mode="wait" initial={false}>
          {activeTab === 'simulator' ? (
            <motion.div
              key="simulator"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <SimulatorPanel />
            </motion.div>
          ) : (
            <motion.div
              key="notifications"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <NotificationsList />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
export default function Home() {
  return (
    <div className="flex flex-col flex-1" style={{ backgroundColor: '#f1f5f9' }}>
      {/* Service user identity bar */}
      <ServiceUserBanner />

      {/* Main layout: Timeline (left) + Simulator/Notifications (right) */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6 h-full">

          {/* Left: Timeline */}
          <div
            className="lg:flex-1 min-w-0 rounded-2xl border overflow-hidden flex flex-col"
            style={{
              backgroundColor: '#fff',
              borderColor: '#e5e7eb',
              minHeight: '600px',
            }}
          >
            <Timeline />
          </div>

          {/* Right: Simulator + Notifications */}
          <div
            className="lg:w-[380px] xl:w-[420px] flex-shrink-0 rounded-2xl border overflow-hidden flex flex-col"
            style={{
              backgroundColor: '#fff',
              borderColor: '#e5e7eb',
              minHeight: '600px',
            }}
          >
            <RightPanel />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        className="w-full border-t py-4 text-center text-xs"
        style={{ borderColor: '#e5e7eb', color: '#94a3b8', backgroundColor: '#fff' }}
      >
        OneView LCR — Prototype only. No clinical data. No data is stored.
        All records remain in their source systems.
      </footer>
    </div>
  )
}
