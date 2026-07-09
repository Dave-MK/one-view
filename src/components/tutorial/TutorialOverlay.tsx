'use client'

import React, { useEffect, useLayoutEffect, useState, useCallback, useRef } from 'react'
import { useTutorial } from '@/context/TutorialContext'
import { Icon } from '@/components/ui/Icon'

const PAD = 8
const CARD_WIDTH = 320
const MARGIN = 16

// useLayoutEffect on the client, no-op-safe on the server (the overlay never
// renders during SSR, but this keeps React from warning if it ever runs there).
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

function isVisible(rect: DOMRect) {
  return rect.width > 0 && rect.height > 0
}

export function TutorialOverlay() {
  const { isOpen, steps, stepIndex, next, prev, close } = useTutorial()
  const [rect, setRect] = useState<DOMRect | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const [cardH, setCardH] = useState(0)
  const step = isOpen ? steps[stepIndex] : null
  const total = steps.length

  // Locate the current step's target, skipping forward past any target that isn't
  // currently rendered/visible (e.g. an empty-state branch).
  const locate = useCallback(() => {
    if (!step) return
    const el = document.querySelector(`[data-tour="${step.target}"]`)
    if (!el) {
      if (stepIndex < total - 1) next()
      else close()
      return
    }
    // Only scroll when the target isn't already on screen, and do it instantly so
    // its final viewport position is settled the moment we measure. Scroll is
    // synchronous, so we can read the rect right away and set it — the CSS glide
    // of the spotlight is then the single visible motion between steps: no
    // smooth-scroll animation competing with it, and no dead pause waiting for one
    // to finish (the old fixed 320ms delay was the source of the stutter). Reading
    // synchronously also avoids requestAnimationFrame, which is paused while the
    // page is backgrounded — a mid-tour tab switch would otherwise strand it.
    const r0 = el.getBoundingClientRect()
    const inView = r0.top >= 0 && r0.bottom <= window.innerHeight
    if (!inView) el.scrollIntoView({ block: 'center', behavior: 'auto' })
    const r = el.getBoundingClientRect()
    if (!isVisible(r)) {
      if (stepIndex < total - 1) next()
      else close()
      return
    }
    setRect(r)
  }, [step, stepIndex, total, next, close])

  // Locate the current step on open and on each step change. We intentionally do
  // NOT clear `rect` here: keeping the previous highlight on screen until the new
  // one is measured lets the spotlight glide to the next target instead of the
  // whole overlay blinking out and back on every step.
  useEffect(() => {
    if (!isOpen || !step) return
    locate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step?.target, stepIndex, isOpen])

  // When the tour closes, drop the stale highlight (and any pending measure) so a
  // later reopen starts clean rather than flashing the last tour's position.
  useEffect(() => {
    if (isOpen) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRect(null)
  }, [isOpen])

  // Measure the card's real height so it can be positioned fully within the
  // viewport regardless of body length or screen size — a guessed constant left
  // the tallest steps' buttons hanging off the bottom edge. Runs before paint, so
  // the correction is invisible.
  useIsoLayoutEffect(() => {
    if (cardRef.current) setCardH(cardRef.current.offsetHeight)
  }, [stepIndex, isOpen, rect?.width])

  useEffect(() => {
    if (!isOpen) return
    function onResize() {
      if (!step) return
      const el = document.querySelector(`[data-tour="${step.target}"]`)
      if (el) setRect(el.getBoundingClientRect())
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, step?.target])

  useEffect(() => {
    if (!isOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, close, next, prev])

  if (!isOpen || !step || !rect) return null

  const top = rect.top - PAD
  const left = rect.left - PAD
  const width = rect.width + PAD * 2
  const height = rect.height + PAD * 2
  const vw = window.innerWidth
  const vh = window.innerHeight

  const cardWidth = Math.min(CARD_WIDTH, vw - MARGIN * 2)
  const idealLeft = rect.left + rect.width / 2 - cardWidth / 2
  const cardLeft = Math.max(MARGIN, Math.min(idealLeft, vw - cardWidth - MARGIN))
  // Anchor the card by top only, using its measured height (a placeholder until
  // the first measure lands) so it is always clamped fully inside the viewport —
  // buttons included — no matter the body length or screen height. Prefer below
  // the target when it fits, otherwise above.
  const estCardH = cardH || 220
  const placeBelow = rect.bottom + PAD + 12 + estCardH + MARGIN <= vh || rect.top < vh / 2
  const idealTop = placeBelow ? rect.bottom + PAD + 12 : rect.top - PAD - 12 - estCardH
  const cardTop = Math.max(MARGIN, Math.min(idealTop, vh - estCardH - MARGIN))

  const isFirst = stepIndex === 0
  const isLast = stepIndex === total - 1

  // Every panel below is a linear function of the same rect, so a shared geometry
  // transition keeps the cut-out a clean rectangle while the spotlight glides.
  const glide = 'top 0.25s ease, left 0.25s ease, width 0.25s ease, height 0.25s ease'
  // The card is top-anchored, so it glides cleanly in both directions.
  const cardGlide = 'top 0.25s ease, left 0.25s ease'

  return (
    <div className="fixed inset-0 z-[1000]" role="dialog" aria-modal="true" aria-label={`Page tour: ${step.title}`}>
      {/* Four-box dim backdrop around the highlighted target */}
      <button aria-label="Dismiss tour" onClick={close} className="fixed cursor-default" style={{ top: 0, left: 0, width: '100%', height: Math.max(top, 0), backgroundColor: 'rgba(15,23,42,0.55)', transition: glide }} />
      <button aria-label="Dismiss tour" onClick={close} className="fixed cursor-default" style={{ top: top + height, left: 0, width: '100%', height: Math.max(vh - (top + height), 0), backgroundColor: 'rgba(15,23,42,0.55)', transition: glide }} />
      <button aria-label="Dismiss tour" onClick={close} className="fixed cursor-default" style={{ top, left: 0, width: Math.max(left, 0), height, backgroundColor: 'rgba(15,23,42,0.55)', transition: glide }} />
      <button aria-label="Dismiss tour" onClick={close} className="fixed cursor-default" style={{ top, left: left + width, width: Math.max(vw - (left + width), 0), height, backgroundColor: 'rgba(15,23,42,0.55)', transition: glide }} />

      {/* Highlight ring */}
      <div
        className="fixed rounded-xl pointer-events-none"
        style={{ top, left, width, height, transition: glide, boxShadow: '0 0 0 3px #fff, 0 0 0 6px var(--brand-700), 0 8px 24px rgba(15,23,42,0.35)' }}
      />

      {/* Tooltip card */}
      <div
        ref={cardRef}
        className="fixed rounded-xl bg-white p-4 flex flex-col gap-3"
        style={{ width: cardWidth, left: cardLeft, top: cardTop, maxHeight: vh - MARGIN * 2, overflowY: 'auto', transition: cardGlide, boxShadow: '0 16px 40px rgba(15,23,42,0.25)' }}
      >
        <div className="flex items-start justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--brand-700)' }}>Step {stepIndex + 1} of {total}</span>
          <button onClick={close} aria-label="Close tour" className="p-0.5 rounded -mt-1 -mr-1" style={{ color: 'var(--text-faint)' }}>
            <Icon name="close" size={16} />
          </button>
        </div>
        <div>
          <p className="text-sm font-semibold mb-1" style={{ color: 'var(--brand-800)' }}>{step.title}</p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{step.body}</p>
        </div>
        <div className="flex items-center justify-between pt-1">
          <button onClick={close} className="text-xs font-medium" style={{ color: 'var(--text-faint)' }}>Skip tour</button>
          <div className="flex items-center gap-2">
            {!isFirst && (
              <button onClick={prev} className="text-sm font-medium px-3 py-1.5 rounded-lg border" style={{ borderColor: 'var(--border-2)', color: 'var(--text)' }}>Back</button>
            )}
            <button
              onClick={isLast ? close : next}
              className="text-sm font-semibold px-3.5 py-1.5 rounded-lg text-white"
              style={{ backgroundColor: 'var(--brand-800)' }}
            >
              {isLast ? 'Done' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
