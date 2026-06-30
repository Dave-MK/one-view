'use client'

import React, { useState } from 'react'
import { useApp, relationshipFor, nextSeq } from '@/context/AppContext'
import { CATEGORY_META } from '@/lib/constants'
import { Icon } from './ui/Icon'
import type { Category, TaskPriority } from '@/types'

export function CreateTaskButton() {
  const { state, dispatch, activeParticipant, activeServiceUser, logAccess } = useApp()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<TaskPriority>('medium')

  const rel = relationshipFor(state.relationships, activeParticipant.id, activeServiceUser.id)
  const cats = rel?.allowedCategories ?? []
  const [category, setCategory] = useState<Category>(cats[0] ?? 'admin')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const t = title.trim()
    if (!t) return
    const due = new Date(Date.now() + 3 * 86400000).toISOString()
    dispatch({
      type: 'ADD_TASK',
      payload: {
        id: `task-live-${nextSeq()}`,
        serviceUserId: activeServiceUser.id,
        title: t,
        assigneeParticipantId: activeParticipant.id,
        dueDate: due,
        priority,
        status: 'not_started',
        category,
      },
    })
    logAccess('updated_record', `Created task: ${t}`)
    setTitle('')
    setOpen(false)
  }

  return (
    <div className="relative">
      <button onClick={() => setOpen((o) => !o)} className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-white text-sm font-semibold" style={{ backgroundColor: 'var(--brand-800)' }} aria-expanded={open}>
        <Icon name="check" size={15} /> Create
      </button>
      {open && (
        <>
          <button className="fixed inset-0 z-20 cursor-default" aria-label="Close" onClick={() => setOpen(false)} />
          <form onSubmit={submit} className="absolute right-0 mt-2 z-30 w-72 rounded-xl border bg-white p-4 flex flex-col gap-3" style={{ borderColor: 'var(--border)', boxShadow: '0 12px 32px rgba(15,23,42,0.16)' }}>
            <p className="text-sm font-semibold" style={{ color: 'var(--brand-800)' }}>New task for {activeServiceUser.name}</p>
            <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title" className="rounded-lg border px-3 py-2 text-sm" style={{ borderColor: 'var(--border-2)' }} />
            <div className="grid grid-cols-2 gap-2">
              <label className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Priority
                <select value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)} className="mt-1 w-full rounded-lg border px-2 py-1.5 text-sm" style={{ borderColor: 'var(--border-2)' }}>
                  <option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
                </select>
              </label>
              <label className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Category
                <select value={category} onChange={(e) => setCategory(e.target.value as Category)} className="mt-1 w-full rounded-lg border px-2 py-1.5 text-sm" style={{ borderColor: 'var(--border-2)' }}>
                  {cats.map((c) => <option key={c} value={c}>{CATEGORY_META[c].label}</option>)}
                </select>
              </label>
            </div>
            <button type="submit" disabled={!title.trim()} className="rounded-lg py-2 text-white text-sm font-semibold" style={{ backgroundColor: 'var(--brand-800)', opacity: title.trim() ? 1 : 0.5 }}>Add task</button>
          </form>
        </>
      )}
    </div>
  )
}
