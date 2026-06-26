'use client'

import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
} from 'react'
import type {
  Person,
  OneViewEvent,
  ConsentRule,
  Notification,
  ServiceUser,
} from '@/types'
import {
  people,
  seedEvents,
  seedConsentRules,
  seedNotifications,
  serviceUsers,
} from '@/data/seed'

// ---------------------------------------------------------------------------
// ABAC helper — exported so any component can call it
// ---------------------------------------------------------------------------
export function canSee(
  event: OneViewEvent,
  viewer: Person,
  consentRules: ConsentRule[],
  serviceUserId: string
): boolean {
  if (viewer.role === 'Parent') return true
  return consentRules.some(
    (r) =>
      r.serviceUserId === serviceUserId &&
      r.granteeRole === viewer.role &&
      r.allowedCategories.includes(event.category)
  )
}

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
export interface AppState {
  currentPersona: Person
  events: OneViewEvent[]
  consentRules: ConsentRule[]
  notifications: Notification[]
  serviceUser: ServiceUser
}

const initialState: AppState = {
  currentPersona: people[0], // Parent by default
  events: seedEvents,
  consentRules: seedConsentRules,
  notifications: seedNotifications,
  serviceUser: serviceUsers[0], // Aanya
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------
export type AppAction =
  | { type: 'SET_PERSONA'; payload: Person }
  | { type: 'ADD_EVENT'; payload: OneViewEvent }
  | { type: 'UPDATE_CONSENT'; payload: ConsentRule }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string } // notification id
  | { type: 'RESET_DEMO' }

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_PERSONA':
      return { ...state, currentPersona: action.payload }

    case 'ADD_EVENT':
      return {
        ...state,
        events: [action.payload, ...state.events],
        notifications: [
          {
            id: `notif-${Date.now()}`,
            eventId: action.payload.id,
            message: `New event: ${action.payload.title}`,
            timestamp: action.payload.timestamp,
            read: false,
          },
          ...state.notifications,
        ],
      }

    case 'UPDATE_CONSENT': {
      const existing = state.consentRules.findIndex(
        (r) =>
          r.serviceUserId === action.payload.serviceUserId &&
          r.granteeRole === action.payload.granteeRole
      )
      if (existing >= 0) {
        const updated = [...state.consentRules]
        updated[existing] = action.payload
        return { ...state, consentRules: updated }
      }
      return {
        ...state,
        consentRules: [...state.consentRules, action.payload],
      }
    }

    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
      }

    case 'RESET_DEMO':
      return initialState

    default:
      return state
  }
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------
interface AppContextValue {
  state: AppState
  dispatch: React.Dispatch<AppAction>
  /** Convenience: visible events for the current persona */
  visibleEvents: OneViewEvent[]
  unreadCount: number
}

const AppContext = createContext<AppContextValue | null>(null)

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  const visibleEvents = state.events.filter((e) =>
    canSee(e, state.currentPersona, state.consentRules, state.serviceUser.id)
  )

  const unreadCount = state.notifications.filter((n) => !n.read).length

  return (
    <AppContext.Provider value={{ state, dispatch, visibleEvents, unreadCount }}>
      {children}
    </AppContext.Provider>
  )
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) {
    throw new Error('useApp must be used inside <AppProvider>')
  }
  return ctx
}

// Re-export people list so Header can iterate personas without importing seed directly
export { people }
