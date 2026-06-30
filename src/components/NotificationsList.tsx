'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '@/context/AppContext'
import { relativeTime } from '@/lib/format'
import { EmptyState } from './ui/primitives'

export function NotificationsList() {
  const { state, dispatch, activeServiceUser } = useApp()
  const all = state.notifications
    .filter((n) => n.serviceUserId === activeServiceUser.id)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  const unread = all.filter((n) => !n.read)
  const read = all.filter((n) => n.read)

  const markRead = (id: string) => dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id })
  const markAll = () => unread.forEach((n) => dispatch({ type: 'MARK_NOTIFICATION_READ', payload: n.id }))

  if (all.length === 0) return <EmptyState title="No notifications" body="New activity will appear here when events arrive." />

  return (
    <div role="feed" aria-label="Notifications">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold" style={{ color: 'var(--brand-800)' }}>
          Notifications {unread.length > 0 && <span className="ml-1.5 text-xs font-bold px-1.5 py-0.5 rounded-full text-white" style={{ backgroundColor: '#3f9c54' }}>{unread.length}</span>}
        </h3>
        {unread.length > 0 && <button onClick={markAll} className="text-xs font-medium" style={{ color: 'var(--brand-700)' }}>Mark all read</button>}
      </div>

      <AnimatePresence initial={false}>
        {unread.map((n) => (
          <motion.button
            key={n.id} layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, height: 0 }}
            onClick={() => markRead(n.id)}
            className="w-full text-left relative rounded-xl border px-4 py-3 mb-2 block"
            style={{ backgroundColor: '#f0f9ff', borderColor: '#bae6fd' }}
          >
            <span className="absolute left-3 top-4 w-2 h-2 rounded-full" style={{ backgroundColor: '#2563eb' }} aria-hidden="true" />
            <p className="text-sm font-medium leading-snug pl-3" style={{ color: '#0c4a6e' }}>{n.message}</p>
            <p className="text-xs mt-1 pl-3" style={{ color: '#38bdf8' }}>{relativeTime(n.timestamp)}</p>
          </motion.button>
        ))}
      </AnimatePresence>

      {read.length > 0 && (
        <>
          <p className="pt-2 pb-1 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>Earlier</p>
          {read.map((n) => (
            <div key={n.id} className="rounded-xl border px-4 py-3 mb-2" style={{ backgroundColor: 'var(--surface-2)', borderColor: 'var(--border)' }}>
              <p className="text-sm leading-snug" style={{ color: '#475569' }}>{n.message}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-faint)' }}>{relativeTime(n.timestamp)}</p>
            </div>
          ))}
        </>
      )}
    </div>
  )
}
