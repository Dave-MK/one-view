import React from 'react'
import Link from 'next/link'
import { PublicNav, PublicFooter } from '@/components/landing/PublicChrome'
import { JourneyFlows } from '@/components/landing/JourneyFlows'
import { LogoMark } from '@/components/ui/Icon'
import { PRODUCT_NAME, PRODUCT_TAGLINE } from '@/lib/constants'

export const metadata = {
  title: `${PRODUCT_NAME} — A coordination layer for people-centred services`,
}

const HERO_BULLETS = ['Secure and compliant', 'Built for collaboration', 'Reduces duplication', 'Improves outcomes']

const FEATURES = [
  { title: 'For service users, families & carers', body: 'One clear picture of the support around them — and control over who sees what.' },
  { title: 'For professionals & organisations', body: 'A shared operational view across agencies, without replacing the systems you already use.' },
  { title: 'Secure. Private. Governed.', body: 'Role, relationship and lawful basis decide access. Every view is logged.' },
  { title: 'Connected care & support', body: 'Education, health, social care, housing and the voluntary sector, joined up.' },
]

const SERVICE_USER_SIDE = ['Citizen', 'Parent', 'Carer', 'Guardian', 'Advocate']
const PROVIDER_SIDE = ['Local Authority', 'NHS', 'Schools', 'Police', 'Housing', 'VCSE', 'Private providers']
const SHARED_LAYER = ['Timeline', 'Tasks', 'Events', 'Documents', 'Notifications', 'Messaging', 'Audit', 'Governance', 'Reporting']

const DOMAINS = [
  { tag: 'Example A', title: 'SEND', body: "A child's Education, Health & Care journey across school, CAMHS, OT and the local authority.", color: '#2563eb', live: true },
  { tag: 'Example B', title: 'Adult social care', body: 'A post-stroke hospital discharge coordinated across acute & community health, social care, housing and VCSE.', color: '#0d9488', live: true },
  { tag: 'And beyond', title: 'Any coordinated context', body: 'Early help, complex needs, homelessness, reablement, safeguarding — the same layer, a different configuration.', color: '#9333ea', live: false },
]

const GOVERNANCE = [
  { title: 'Tailored, not total', body: 'Each participant has a view based on their role, relationship to the service user, organisational responsibility and lawful basis for access. Never “everyone sees everything”.' },
  { title: 'Relationships, not job titles', body: 'Permissions revolve around the relationship to the person at the centre — a mother can upload evidence and see appointments but not police or safeguarding notes.' },
  { title: 'Lawful basis on every access', body: 'Consent, Direct Care, Safeguarding, Legal Obligation or Statutory Requirement is recorded against each relationship and access.' },
  { title: 'Logged and monitored', body: 'Every record view and change is written to an immutable audit trail, surfaced in the governance dashboard.' },
]

function Check() {
  return (
    <span className="flex-shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full" style={{ backgroundColor: 'var(--ok-bg)' }} aria-hidden="true">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
    </span>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#fff' }}>
      <PublicNav />

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ backgroundColor: 'var(--surface-2)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full mb-5" style={{ backgroundColor: '#eff4ff', color: 'var(--brand-700)' }}>
              <LogoMark size={14} /> A coordination layer, not another portal
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-bold leading-tight" style={{ color: 'var(--brand-900)' }}>
              {PRODUCT_TAGLINE}
            </h1>
            <p className="mt-5 text-lg leading-relaxed max-w-xl" style={{ color: 'var(--text-muted)' }}>
              {PRODUCT_NAME} brings the right people and the right information together to coordinate support around what matters most — the person. Everyone legitimately involved works from one shared, consent-controlled picture.
            </p>
            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <Link href="/login" className="flex-1 rounded-xl px-5 py-3.5 text-white text-center" style={{ backgroundColor: 'var(--brand-800)' }}>
                <span className="block font-semibold">I need support</span>
                <span className="block text-xs opacity-80">Access your journey</span>
              </Link>
              <Link href="/login?tab=provider" className="flex-1 rounded-xl px-5 py-3.5 text-center border" style={{ borderColor: 'var(--brand-700)', color: 'var(--brand-700)' }}>
                <span className="block font-semibold">I work in services</span>
                <span className="block text-xs opacity-70">Professional sign in</span>
              </Link>
            </div>
            <ul className="mt-7 grid grid-cols-2 gap-3 max-w-md">
              {HERO_BULLETS.map((b) => (
                <li key={b} className="flex items-center gap-2 text-sm" style={{ color: '#334155' }}><Check /> {b}</li>
              ))}
            </ul>
          </div>

          {/* Abstract "shared picture" visual */}
          <div className="hidden lg:block">
            <div className="rounded-2xl border p-6 bg-white" style={{ borderColor: 'var(--border)', boxShadow: '0 12px 40px rgba(15,23,42,0.10)' }}>
              <div className="flex items-center gap-2 mb-4">
                <LogoMark /> <span className="font-bold" style={{ color: 'var(--brand-800)' }}>{PRODUCT_NAME}</span>
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--ok-bg)', color: 'var(--ok)' }}>Consent-controlled</span>
              </div>
              <div className="flex flex-col gap-2.5">
                {[
                  { c: '#2563eb', w: '92%', t: 'Education · EHCP review scheduled' },
                  { c: '#16a34a', w: '78%', t: 'Health · OT report available' },
                  { c: '#9333ea', w: '85%', t: 'Social care · placement confirmed' },
                  { c: '#ea580c', w: '64%', t: 'Housing · adaptation recommended' },
                  { c: '#dc2626', w: '40%', t: 'Safeguarding · restricted view' },
                ].map((row, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: row.c }} />
                    <span className="text-xs flex-1 truncate" style={{ color: 'var(--text-muted)' }}>{row.t}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t flex items-center gap-2" style={{ borderColor: 'var(--border)' }}>
                <span className="text-xs" style={{ color: 'var(--text-faint)' }}>Each participant sees only their permitted slice.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature strip */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {FEATURES.map((f) => (
          <div key={f.title} className="rounded-xl border p-5 bg-white" style={{ borderColor: 'var(--border)' }}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: '#eff4ff', color: 'var(--brand-700)' }}><LogoMark size={18} /></div>
            <p className="font-semibold text-sm mb-1" style={{ color: 'var(--brand-800)' }}>{f.title}</p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{f.body}</p>
          </div>
        ))}
      </section>

      {/* Dark trust band */}
      <section className="px-4 sm:px-6 lg:px-8 py-4" style={{ backgroundColor: 'var(--brand-900)' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 text-center flex-wrap">
          <span style={{ color: '#5bb45a' }}><LogoMark size={18} color="#5bb45a" /></span>
          <span className="text-sm font-semibold text-white">Trusted. Secure. Working together across services.</span>
          <span className="text-xs" style={{ color: '#7aabcc' }}>{PRODUCT_NAME} is not an emergency service. If you are in immediate danger, call 999.</span>
        </div>
      </section>

      {/* Two worlds, one layer */}
      <section id="two-worlds" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="font-display text-3xl font-bold" style={{ color: 'var(--brand-900)' }}>Two worlds, one shared layer</h2>
          <p className="mt-3" style={{ color: 'var(--text-muted)' }}>
            The person being supported (and those acting for them) on one side; the organisations supporting them on the other. They meet on a single coordination layer.
          </p>
        </div>
        <div className="grid lg:grid-cols-2 gap-5">
          <SideCard title="Service-user side" subtitle="The person, and those acting for them" items={SERVICE_USER_SIDE} color="#7c3aed" />
          <SideCard title="Service-provider side" subtitle="The organisations providing support" items={PROVIDER_SIDE} color="#2563eb" />
        </div>
        <div className="mt-5 rounded-xl border p-6 text-center" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface-2)' }}>
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-faint)' }}>Shared coordination layer</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {SHARED_LAYER.map((s) => (
              <span key={s} className="text-sm font-medium px-3 py-1.5 rounded-lg bg-white border" style={{ borderColor: 'var(--border)', color: 'var(--brand-700)' }}>{s}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Transferable domains */}
      <section id="domains" style={{ backgroundColor: 'var(--surface-2)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-display text-3xl font-bold" style={{ color: 'var(--brand-900)' }}>One layer, many contexts</h2>
            <p className="mt-3" style={{ color: 'var(--text-muted)' }}>
              SEND is simply the first worked example. The same coordination layer reconfigures for any context where multiple agencies and a person need a shared, governed picture.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {DOMAINS.map((d) => (
              <div key={d.title} className="rounded-xl border p-5 bg-white" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: d.color }}>{d.tag}</span>
                  {d.live && <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--ok-bg)', color: 'var(--ok)' }}>In this demo</span>}
                </div>
                <p className="font-display text-xl font-bold mb-1.5" style={{ color: 'var(--brand-800)' }}>{d.title}</p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{d.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & governance */}
      <section id="security" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="font-display text-3xl font-bold" style={{ color: 'var(--brand-900)' }}>Built for information governance</h2>
          <p className="mt-3" style={{ color: 'var(--text-muted)' }}>
            Designed so that information governance leads, Caldicott Guardians and DPOs recognise it as safe by design.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          {GOVERNANCE.map((g) => (
            <div key={g.title} className="rounded-xl border p-5 bg-white flex gap-3" style={{ borderColor: 'var(--border)' }}>
              <Check />
              <div>
                <p className="font-semibold text-sm mb-1" style={{ color: 'var(--brand-800)' }}>{g.title}</p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{g.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Journeys */}
      <section id="journeys" style={{ backgroundColor: 'var(--surface-2)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-display text-3xl font-bold" style={{ color: 'var(--brand-900)' }}>Everyone has a journey</h2>
            <p className="mt-3" style={{ color: 'var(--text-muted)' }}>
              The same platform supports the service user, their representatives, every professional, and the people who govern it — each with the actions and visibility their role allows.
            </p>
          </div>
          <JourneyFlows />
          <div className="text-center mt-10">
            <Link href="/login" className="inline-block rounded-xl px-6 py-3 text-white font-semibold" style={{ backgroundColor: 'var(--brand-800)' }}>
              Explore the demo →
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}

function SideCard({ title, subtitle, items, color }: { title: string; subtitle: string; items: string[]; color: string }) {
  return (
    <div className="rounded-xl border p-6 bg-white" style={{ borderColor: 'var(--border)' }}>
      <p className="font-semibold" style={{ color: 'var(--brand-800)' }}>{title}</p>
      <p className="text-xs mb-4" style={{ color: 'var(--text-faint)' }}>{subtitle}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((i) => (
          <span key={i} className="text-sm font-medium px-3 py-1.5 rounded-full" style={{ backgroundColor: `${color}14`, color }}>{i}</span>
        ))}
      </div>
    </div>
  )
}
