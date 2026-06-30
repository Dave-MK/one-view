'use client'

import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react'
import type {
  Participant,
  ServiceUser,
  Relationship,
  TimelineEvent,
  Task,
  DocumentRecord,
  Appointment,
  MessageThread,
  Notification,
  AccessLogEntry,
  Category,
  Sensitivity,
} from '@/types'
import {
  participants,
  participantMap,
  serviceUsers,
  serviceUserMap,
  organisationMap,
  seedRelationships,
  seedEvents,
  seedTasks,
  seedDocuments,
  seedAppointments,
  seedThreads,
  seedNotifications,
  seedAccessLog,
} from '@/data/seed'

// ---------------------------------------------------------------------------
// Access rule — the core of the model. A participant may see an item iff a
// relationship links them to that service user AND the item's category is
// permitted AND its sensitivity is covered by the relationship's lawful basis.
// 'standard' sensitivity is always covered for a permitted category.
// ---------------------------------------------------------------------------
export function relationshipFor(
  relationships: Relationship[],
  participantId: string,
  serviceUserId: string,
): Relationship | undefined {
  return relationships.find(
    (r) => r.participantId === participantId && r.serviceUserId === serviceUserId,
  )
}

export function canSee(
  item: { category: Category; sensitivity: Sensitivity; serviceUserId: string },
  participant: Participant,
  relationships: Relationship[],
): boolean {
  const rel = relationshipFor(relationships, participant.id, item.serviceUserId)
  if (!rel) return false
  if (!rel.allowedCategories.includes(item.category)) return false
  if (item.sensitivity === 'standard') return true
  return rel.allowedSensitivities.includes(item.sensitivity)
}

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
export interface AppState {
  activeParticipantId: string
  activeServiceUserId: string
  relationships: Relationship[]
  events: TimelineEvent[]
  tasks: Task[]
  documents: DocumentRecord[]
  appointments: Appointment[]
  threads: MessageThread[]
  notifications: Notification[]
  accessLog: AccessLogEntry[]
}

const initialState: AppState = {
  activeParticipantId: 'priya', // a parent by default
  activeServiceUserId: 'aanya',
  relationships: seedRelationships,
  events: seedEvents,
  tasks: seedTasks,
  documents: seedDocuments,
  appointments: seedAppointments,
  threads: seedThreads,
  notifications: seedNotifications,
  accessLog: seedAccessLog,
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------
export type AppAction =
  | { type: 'SET_PARTICIPANT'; payload: string }
  | { type: 'SET_SERVICE_USER'; payload: string }
  | { type: 'ADD_EVENT'; payload: TimelineEvent }
  | { type: 'COMPLETE_TASK'; payload: string }
  | { type: 'UPDATE_RELATIONSHIP'; payload: { id: string; allowedCategories: Category[] } }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'LOG_ACCESS'; payload: AccessLogEntry }
  | { type: 'RESET_DEMO' }

let logCounter = 0

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_PARTICIPANT':
      return { ...state, activeParticipantId: action.payload }

    case 'SET_SERVICE_USER':
      return { ...state, activeServiceUserId: action.payload }

    case 'ADD_EVENT':
      return {
        ...state,
        events: [action.payload, ...state.events],
        notifications: [
          {
            id: `notif-${action.payload.id}`,
            serviceUserId: action.payload.serviceUserId,
            eventId: action.payload.id,
            message: `New event: ${action.payload.title}`,
            timestamp: action.payload.timestamp,
            read: false,
          },
          ...state.notifications,
        ],
      }

    case 'COMPLETE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload ? { ...t, status: 'closed' } : t,
        ),
      }

    case 'UPDATE_RELATIONSHIP':
      return {
        ...state,
        relationships: state.relationships.map((r) =>
          r.id === action.payload.id
            ? { ...r, allowedCategories: action.payload.allowedCategories }
            : r,
        ),
      }

    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.payload ? { ...n, read: true } : n,
        ),
      }

    case 'LOG_ACCESS':
      return { ...state, accessLog: [action.payload, ...state.accessLog] }

    case 'RESET_DEMO':
      return { ...initialState, activeParticipantId: state.activeParticipantId, activeServiceUserId: state.activeServiceUserId }

    default:
      return state
  }
}

// ---------------------------------------------------------------------------
// Context value
// ---------------------------------------------------------------------------
interface AppContextValue {
  state: AppState
  dispatch: React.Dispatch<AppAction>
  activeParticipant: Participant
  activeServiceUser: ServiceUser
  /** Events of the active service user visible to the active participant. */
  visibleEvents: TimelineEvent[]
  /** Unread notifications for the active service user that the participant can see. */
  unreadCount: number
  logAccess: (action: AccessLogEntry['action'], detail: string) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  const activeParticipant = participantMap[state.activeParticipantId] ?? participants[0]
  const activeServiceUser = serviceUserMap[state.activeServiceUserId] ?? serviceUsers[0]

  const visibleEvents = state.events
    .filter((e) => e.serviceUserId === state.activeServiceUserId)
    .filter((e) => canSee(e, activeParticipant, state.relationships))

  const unreadCount = state.notifications.filter(
    (n) => n.serviceUserId === state.activeServiceUserId && !n.read,
  ).length

  const logAccess = useCallback(
    (action: AccessLogEntry['action'], detail: string) => {
      const participant = participantMap[state.activeParticipantId]
      const rel = relationshipFor(state.relationships, state.activeParticipantId, state.activeServiceUserId)
      if (!participant) return
      logCounter += 1
      dispatch({
        type: 'LOG_ACCESS',
        payload: {
          id: `log-live-${logCounter}`,
          actorParticipantId: participant.id,
          serviceUserId: state.activeServiceUserId,
          action,
          lawfulBasis: rel?.lawfulBasis ?? 'Consent',
          detail,
          timestamp: new Date().toISOString(),
        },
      })
    },
    [state.activeParticipantId, state.activeServiceUserId, state.relationships],
  )

  return (
    <AppContext.Provider
      value={{ state, dispatch, activeParticipant, activeServiceUser, visibleEvents, unreadCount, logAccess }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>')
  return ctx
}

// Convenience re-exports for components
export { participants, serviceUsers, organisationMap, participantMap, serviceUserMap }
