'use client'

import React, { useEffect, useState } from 'react'
import { motion, type Variants } from 'framer-motion'
import { PRODUCT_NAME } from '@/lib/constants'

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const SOURCE_SYSTEMS = [
  {
    id: 'liquidlogic',
    name: 'Liquidlogic',
    org: 'St Helens Council',
    kind: 'Case Management',
    color: '#1a4a7a',
    icon: '🗂',
  },
  {
    id: 'rio',
    name: 'Rio',
    org: 'Mersey Care NHS',
    kind: 'Mental Health EPR',
    color: '#155a3a',
    icon: '🏥',
  },
  {
    id: 'schoolMis',
    name: 'School MIS',
    org: 'St Helens SEND School',
    kind: 'Education Management',
    color: '#4a3080',
    icon: '🎓',
  },
  {
    id: 'alderHey',
    name: 'Alder Hey PAS',
    org: 'Alder Hey Children\'s NHS',
    kind: 'Patient Administration',
    color: '#7a2020',
    icon: '👶',
  },
  {
    id: 'graphnet',
    name: 'Graphnet / CIPHA',
    org: 'Shared Care Record',
    kind: 'Shared Care Record',
    color: '#2b5a8a',
    icon: '🔗',
    highlight: true,
  },
]

const EXAMPLE_EVENTS = [
  { label: 'EHCP review scheduled', system: 'School MIS', category: 'education' },
  { label: 'CAMHS referral accepted', system: 'Rio', category: 'health' },
  { label: 'OT report available', system: 'Alder Hey PAS', category: 'health' },
  { label: 'Placement confirmed', system: 'Liquidlogic', category: 'social_care' },
  { label: 'EHCP draft shared', system: 'Graphnet / CIPHA', category: 'admin' },
]

const PERSONAS = [
  { label: 'Priya (Parent)', icon: '👩', color: '#3f9c54', note: 'sees all' },
  { label: 'Nisha (SENCO)', icon: '👩‍🏫', color: '#2b6cb0', note: 'education + admin' },
  { label: 'Dr Hassan (CAMHS)', icon: '🩺', color: '#6b46a0', note: 'health only' },
  { label: 'Sean (Caseworker)', icon: '📋', color: '#9c6b3f', note: 'education + social + admin' },
]

const CATEGORY_COLORS: Record<string, string> = {
  education: '#4a3080',
  health: '#155a3a',
  social_care: '#1a4a7a',
  admin: '#2b5a8a',
}

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  }),
}

const arrowVariants: Variants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: (i: number) => ({
    scaleX: 1,
    opacity: 1,
    transition: { delay: 0.6 + i * 0.3, duration: 0.45, ease: [0.25, 0.1, 0.25, 1] },
  }),
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StageLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="text-center text-xs font-semibold uppercase tracking-widest mb-4"
      style={{ color: '#5bb45a' }}
    >
      {children}
    </div>
  )
}

function Arrow({ index }: { index: number }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center self-center"
      custom={index}
      variants={arrowVariants}
      initial="hidden"
      animate="visible"
      style={{ originX: 0 }}
    >
      {/* Pulsing flow dots */}
      <div className="flex gap-1 items-center">
        {[0, 1, 2].map((d) => (
          <motion.div
            key={d}
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: '#3f9c54' }}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{
              repeat: Infinity,
              duration: 1.2,
              delay: d * 0.25,
            }}
          />
        ))}
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          className="ml-1"
        >
          <path
            d="M3 9h12M11 5l4 4-4 4"
            stroke="#3f9c54"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Stage 1: Source Systems
// ---------------------------------------------------------------------------

function SourceSystemsStage() {
  return (
    <div className="flex flex-col gap-2 min-w-[180px] max-w-[200px]">
      <StageLabel>Systems professionals<br />already use</StageLabel>
      {SOURCE_SYSTEMS.map((s, i) => (
        <motion.div
          key={s.id}
          custom={i}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="rounded-lg px-3 py-2 text-white text-xs flex items-start gap-2 shadow-md"
          style={{
            backgroundColor: s.highlight ? '#13294b' : s.color,
            border: s.highlight ? '2px solid #3f9c54' : '1px solid rgba(255,255,255,0.15)',
          }}
        >
          <span className="text-base leading-none mt-0.5">{s.icon}</span>
          <div>
            <div className="font-semibold leading-tight">{s.name}</div>
            <div className="opacity-70 text-[10px] leading-tight mt-0.5">{s.kind}</div>
            {s.highlight && (
              <div
                className="text-[10px] mt-1 font-semibold"
                style={{ color: '#5bb45a' }}
              >
                Shared Care Record
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Stage 2: Events emitted
// ---------------------------------------------------------------------------

function EventsStage() {
  return (
    <div className="flex flex-col gap-2 min-w-[185px] max-w-[200px]">
      <StageLabel>Events emitted<br />automatically</StageLabel>
      {EXAMPLE_EVENTS.map((e, i) => (
        <motion.div
          key={e.label}
          custom={i}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="rounded-md px-3 py-2 text-xs"
          style={{
            backgroundColor: '#1e3f6b',
            border: '1px solid #2b5a8a',
          }}
        >
          <div className="font-medium text-white leading-tight">{e.label}</div>
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
              style={{
                backgroundColor: CATEGORY_COLORS[e.category] ?? '#2b5a8a',
                color: '#e8f4ff',
              }}
            >
              {e.category.replace('_', ' ')}
            </span>
            <span
              className="text-[10px]"
              style={{ color: '#7aabcc' }}
            >
              via {e.system}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Stage 3: OneView assembles
// ---------------------------------------------------------------------------

function OneViewStage() {
  return (
    <div className="flex flex-col items-center min-w-[170px] max-w-[185px]">
      <StageLabel>{PRODUCT_NAME}<br />assembles the timeline</StageLabel>
      <motion.div
        custom={0}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="w-full rounded-xl px-4 py-5 flex flex-col items-center gap-3 shadow-lg"
        style={{ backgroundColor: '#13294b', border: '2px solid #3f9c54' }}
      >
        {/* Logo mark */}
        <span style={{ color: '#5bb45a', fontSize: '1.75rem' }}>◈</span>
        <div
          className="text-white text-sm font-semibold text-center"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          {PRODUCT_NAME}
        </div>

        {/* Consent lock */}
        <div
          className="flex items-center gap-1.5 text-xs rounded-full px-3 py-1"
          style={{ backgroundColor: '#3f9c54', color: '#fff' }}
        >
          <svg width="11" height="13" viewBox="0 0 11 13" fill="currentColor">
            <rect x="1" y="5" width="9" height="7" rx="1.5" />
            <path d="M3 5V3.5a2.5 2.5 0 0 1 5 0V5" stroke="currentColor" strokeWidth="1.4" fill="none" />
          </svg>
          <span className="font-medium">Consent-controlled</span>
        </div>

        {/* Mini timeline bars */}
        <div className="w-full flex flex-col gap-1.5 mt-1">
          {['education', 'health', 'social_care', 'admin'].map((cat) => (
            <div
              key={cat}
              className="flex items-center gap-1.5"
            >
              <div
                className="rounded-sm"
                style={{
                  width: '6px',
                  height: '6px',
                  backgroundColor: CATEGORY_COLORS[cat],
                  flexShrink: 0,
                }}
              />
              <div
                className="rounded h-1.5 flex-1"
                style={{ backgroundColor: CATEGORY_COLORS[cat], opacity: 0.6 }}
              />
            </div>
          ))}
        </div>

        <div
          className="text-[10px] text-center mt-1"
          style={{ color: '#7aabcc' }}
        >
          Provenance preserved on<br />every event
        </div>
      </motion.div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Stage 4: Family + professionals notified
// ---------------------------------------------------------------------------

function NotificationStage() {
  return (
    <div className="flex flex-col gap-2 min-w-[170px] max-w-[185px]">
      <StageLabel>Family &amp; professionals<br />notified</StageLabel>
      {PERSONAS.map((p, i) => (
        <motion.div
          key={p.label}
          custom={i}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="rounded-lg px-3 py-2 flex items-start gap-2 text-xs"
          style={{ backgroundColor: '#1e3f6b', border: '1px solid #2b5a8a' }}
        >
          <span className="text-base leading-none">{p.icon}</span>
          <div className="flex-1">
            <div className="font-medium text-white leading-tight">{p.label}</div>
            <div
              className="text-[10px] mt-0.5 font-medium"
              style={{ color: p.color }}
            >
              {p.note}
            </div>
          </div>
          {/* Notification dot */}
          <motion.div
            className="w-2 h-2 rounded-full flex-shrink-0 mt-1"
            style={{ backgroundColor: p.color }}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ repeat: Infinity, duration: 2, delay: i * 0.4 }}
          />
        </motion.div>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main Pipeline component
// ---------------------------------------------------------------------------

export function HowItWorksPipeline() {
  // Trigger animation only after mount (avoids SSR hydration mismatch)
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  return (
    <div className="w-full flex flex-col gap-10">

      {/* ---- Pipeline grid ---- */}
      <div
        className="w-full overflow-x-auto"
        role="img"
        aria-label="Pipeline diagram showing how data flows from source systems through OneView to families and professionals"
      >
        <div className="flex items-start gap-3 min-w-max mx-auto px-2 py-4">

          {/* Stage 1 */}
          <SourceSystemsStage />

          {/* Arrow 1 */}
          <Arrow index={0} />

          {/* Stage 2 */}
          <EventsStage />

          {/* Arrow 2 */}
          <Arrow index={1} />

          {/* Stage 3 */}
          <OneViewStage />

          {/* Arrow 3 */}
          <Arrow index={2} />

          {/* Stage 4 */}
          <NotificationStage />

        </div>
      </div>

      {/* ---- Key message banner ---- */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.5 }}
        className="rounded-xl px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-3"
        style={{
          backgroundColor: '#0f2240',
          border: '1px solid #2b6cb0',
        }}
      >
        <span style={{ color: '#5bb45a', fontSize: '1.5rem', flexShrink: 0 }}>◈</span>
        <p className="text-sm leading-relaxed" style={{ color: '#c8dff2' }}>
          <span className="font-semibold text-white">
            {PRODUCT_NAME} consumes feeds — it doesn&apos;t replace any system.{' '}
          </span>
          Liquidlogic, Rio, School MIS, Alder Hey PAS, and Graphnet / CIPHA remain the
          authoritative systems of record. {PRODUCT_NAME} reads events from each, assembles a
          single consent-filtered timeline, and notifies the family and relevant professionals.{' '}
          <span className="font-semibold" style={{ color: '#5bb45a' }}>
            The family controls visibility.
          </span>
        </p>
      </motion.div>

      {/* ---- Four rules legend ---- */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0, duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
      >
        {[
          {
            icon: '🏷',
            title: 'Source provenance',
            body: 'Every event shows which system it came from.',
          },
          {
            icon: '🚫',
            title: 'Read-only for professionals',
            body: 'No professional types into OneView. Events arrive in.',
          },
          {
            icon: '📎',
            title: 'Metadata-first documents',
            body: 'Documents show existence + a link back to the source system.',
          },
          {
            icon: '🔐',
            title: 'Family-controlled consent',
            body: 'Granting or revoking access visibly changes what each professional sees.',
          },
        ].map((rule, i) => (
          <motion.div
            key={rule.title}
            custom={i}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="rounded-lg px-4 py-3 text-xs"
            style={{ backgroundColor: '#1e3f6b', border: '1px solid #2b5a8a' }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base">{rule.icon}</span>
              <span className="font-semibold text-white">{rule.title}</span>
            </div>
            <p style={{ color: '#a3c4e8' }}>{rule.body}</p>
          </motion.div>
        ))}
      </motion.div>

    </div>
  )
}
