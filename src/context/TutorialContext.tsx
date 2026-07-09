'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { TOURS, type TourStep } from '@/lib/tours'

interface TutorialContextValue {
  isOpen: boolean
  steps: TourStep[]
  stepIndex: number
  start: (pathname: string) => void
  next: () => void
  prev: () => void
  close: () => void
  hasTour: (pathname: string) => boolean
}

const TutorialContext = createContext<TutorialContextValue | null>(null)

export function TutorialProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [steps, setSteps] = useState<TourStep[]>([])
  const [stepIndex, setStepIndex] = useState(0)

  const hasTour = useCallback((p: string) => (TOURS[p]?.length ?? 0) > 0, [])

  // Tours are opt-in: they open only when the user clicks the help (?) button, so
  // the app never interrupts a live walkthrough with a modal it didn't ask for.
  const start = useCallback((p: string) => {
    const s = TOURS[p]
    if (!s || s.length === 0) return
    setSteps(s)
    setStepIndex(0)
    setIsOpen(true)
  }, [])

  const next = useCallback(() => {
    setStepIndex((i) => Math.min(i + 1, steps.length - 1))
  }, [steps.length])

  const prev = useCallback(() => setStepIndex((i) => Math.max(i - 1, 0)), [])
  const close = useCallback(() => setIsOpen(false), [])

  return (
    <TutorialContext.Provider value={{ isOpen, steps, stepIndex, start, next, prev, close, hasTour }}>
      {children}
    </TutorialContext.Provider>
  )
}

export function useTutorial(): TutorialContextValue {
  const ctx = useContext(TutorialContext)
  if (!ctx) throw new Error('useTutorial must be used inside <TutorialProvider>')
  return ctx
}
