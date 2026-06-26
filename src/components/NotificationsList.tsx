'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '@/context/AppContext'

function relativeTime(isoString: string): string {
  const now = new Date('2026-06-26T12:00:00.000Z')
  const then = new Date(isoString)
  const diff = now.getTime() - then.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (diff < 60000) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days} days ago`
  return `${Math.floor(days / 7)} weeks ago`
}

export function NotificationsList() {
  const { state, dispatch } = useApp()
  const { notifications } = state

  const sorted = [...notifications].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )

  const unread = sorted.filter((n) => !n.read)
  const read = sorted.filter((n) => n.read)

  function markRead(id: string) {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id })
  }

  function markAllRead() {
    unread.forEach((n) => dispatch({ type: 'MARK_NOTIFICATION_READ', payload: n.id }))
  }

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
          style={{ backgroundColor: '#f1f5f9' }}
          aria-hidden="true"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </div>
        <p className="font-semibold text-sm" style={{ color: '#334155' }}>
          No notifications
        </p>
        <p className="mt-1 text-xs" style={{ color: '#94a3b8' }}>
          New activity will appear here when events arrive.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col" role="feed" aria-label="Notifications">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: '#e5e7eb' }}>
        <h3 className="text-sm font-semibold" style={{ color: '#13294b' }}>
          Notifications
          {unread.length > 0 && (
            <span
              className="ml-2 text-xs font-bold px-1.5 py-0.5 rounded-full"
              style={{ backgroundColor: '#3f9c54', color: '#fff' }}
            >
              {unread.length}
            </span>
          )}
        </h3>
        {unread.length > 0 && (
          <button
            onClick={markAllRead}
            className="text-xs font-medium transition-colors"
            style={{ color: '#2b6cb0' }}
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Unread */}
      {unread.length > 0 && (
        <div>
          <p className="px-4 pt-3 pb-1 text-xs font-semibold uppercase tracking-wider" style={{ color: '#94a3b8' }}>
            Unread
          </p>
          <AnimatePresence initial={false}>
            {unread.map((notif) => (
              <motion.div
                key={notif.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="relative mx-3 mb-2 rounded-xl border px-4 py-3 cursor-pointer group"
                style={{
                  backgroundColor: '#f0f9ff',
                  borderColor: '#bae6fd',
                }}
                role="article"
                aria-label={notif.message}
                onClick={() => markRead(notif.id)}
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') markRead(notif.id) }}
              >
                {/* Unread dot */}
                <span
                  className="absolute left-3 top-4 w-2 h-2 rounded-full"
                  style={{ backgroundColor: '#2b6cb0' }}
                  aria-hidden="true"
                />
                <div className="pl-3">
                  <p className="text-sm font-medium leading-snug" style={{ color: '#0c4a6e' }}>
                    {notif.message}
                  </p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-xs" style={{ color: '#38bdf8' }}>
                      {relativeTime(notif.timestamp)}
                    </span>
                    <span
                      className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: '#2b6cb0' }}
                    >
                      Mark read
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Read */}
      {read.length > 0 && (
        <div>
          <p className="px-4 pt-3 pb-1 text-xs font-semibold uppercase tracking-wider" style={{ color: '#94a3b8' }}>
            Earlier
          </p>
          {read.map((notif) => (
            <div
              key={notif.id}
              className="mx-3 mb-2 rounded-xl border px-4 py-3"
              style={{
                backgroundColor: '#f9fafb',
                borderColor: '#e5e7eb',
              }}
              role="article"
              aria-label={notif.message}
            >
              <div className="pl-1">
                <p className="text-sm leading-snug" style={{ color: '#475569' }}>
                  {notif.message}
                </p>
                <span className="text-xs mt-1 block" style={{ color: '#94a3b8' }}>
                  {relativeTime(notif.timestamp)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="pb-3" />
    </div>
  )
}
