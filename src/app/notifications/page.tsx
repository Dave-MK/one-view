'use client'

import React from 'react'
import Link from 'next/link'
import { NotificationsList } from '@/components/NotificationsList'

export default function NotificationsPage() {
  return (
    <div className="flex flex-col flex-1" style={{ backgroundColor: '#f1f5f9' }}>
      <div className="max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium mb-5 transition-colors"
          style={{ color: '#2b6cb0' }}
        >
          <span aria-hidden="true">←</span> Back to timeline
        </Link>

        <h1
          className="text-2xl font-bold tracking-tight mb-1"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif', color: '#13294b' }}
        >
          Notifications
        </h1>
        <p className="text-sm mb-6" style={{ color: '#64748b' }}>
          Raised automatically when a new event arrives that you are permitted to see.
        </p>

        <div
          className="rounded-2xl border overflow-hidden"
          style={{ backgroundColor: '#fff', borderColor: '#e5e7eb' }}
        >
          <NotificationsList />
        </div>
      </div>
    </div>
  )
}
