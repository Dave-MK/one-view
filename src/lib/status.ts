import type { TaskStatus, TaskPriority } from '@/types'

type Tone = 'neutral' | 'ok' | 'warn' | 'danger' | 'info' | 'purple'

export const TASK_STATUS_META: Record<TaskStatus, { label: string; tone: Tone }> = {
  not_started: { label: 'Not started', tone: 'neutral' },
  in_progress: { label: 'In progress', tone: 'info' },
  awaiting_info: { label: 'Awaiting info', tone: 'warn' },
  on_hold: { label: 'On hold', tone: 'warn' },
  closed: { label: 'Closed', tone: 'ok' },
}

export const PRIORITY_META: Record<TaskPriority, { label: string; tone: Tone }> = {
  high: { label: 'High', tone: 'danger' },
  medium: { label: 'Medium', tone: 'warn' },
  low: { label: 'Low', tone: 'neutral' },
}
