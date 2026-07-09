'use client'

import React, { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { PublicNav, PublicFooter } from '@/components/landing/PublicChrome'
import { LogoMark } from '@/components/ui/Icon'
import { PRODUCT_NAME } from '@/lib/constants'
import { useApp } from '@/context/AppContext'

const SSO = ['NHS Login', 'Government Sign-in', 'Google', 'Microsoft']

const SAFETY = [
  { title: 'Encrypted & role-based', body: 'Strong encryption and role-based access ensure your information is shared securely with the right people.' },
  { title: 'You control who sees what', body: 'You decide which professionals can see which categories of your information.' },
  { title: 'Logged and monitored', body: 'All access is recorded and monitored in line with data protection regulations.' },
]

function LoginInner() {
  const router = useRouter()
  const params = useSearchParams()
  const { dispatch } = useApp()
  const isProvider = params.get('tab') === 'provider'
  const [mode, setMode] = useState<'signin' | 'create'>(params.get('tab') === 'create' ? 'create' : 'signin')

  // Prototype "sign in": jump straight into the relevant dashboard with a
  // sensible default persona for that side.
  function enter(provider: boolean) {
    dispatch({ type: 'SET_LOGGED_IN', payload: true })
    if (provider) {
      dispatch({ type: 'SET_PARTICIPANT', payload: 'sean' })
      router.push('/provider')
    } else {
      dispatch({ type: 'SET_PARTICIPANT', payload: 'priya' })
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--surface-2)' }}>
      <PublicNav />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-[1fr_360px] gap-6 items-stretch">
          {/* Auth card */}
          <div className="rounded-2xl border bg-white p-7" style={{ borderColor: 'var(--border)' }} data-tour="login-form">
            <div className="flex items-center gap-2 mb-6">
              <LogoMark /> <span className="font-bold text-lg" style={{ color: 'var(--brand-800)' }}>{PRODUCT_NAME}</span>
            </div>
            <div className="flex border-b mb-6" style={{ borderColor: 'var(--border)' }} role="tablist">
              {(['signin', 'create'] as const).map((m) => (
                <button
                  key={m}
                  role="tab"
                  aria-selected={mode === m}
                  onClick={() => setMode(m)}
                  className="px-4 py-2.5 text-sm font-medium border-b-2 -mb-px"
                  style={{ borderColor: mode === m ? 'var(--brand-700)' : 'transparent', color: mode === m ? 'var(--brand-700)' : 'var(--text-muted)' }}
                >
                  {m === 'signin' ? 'Sign in' : 'Create account'}
                </button>
              ))}
            </div>

            <h1 className="text-lg font-semibold mb-4" style={{ color: 'var(--brand-800)' }}>
              {mode === 'signin' ? `Sign in to your ${PRODUCT_NAME} account` : `Create your ${PRODUCT_NAME} account`}
            </h1>

            <form onSubmit={(e) => { e.preventDefault(); enter(isProvider) }} className="flex flex-col gap-4">
              <label className="block">
                <span className="block text-sm font-medium mb-1" style={{ color: '#334155' }}>Email address</span>
                <input type="email" placeholder="you@example.com" defaultValue="demo@oneview.gov.uk" className="w-full rounded-lg border px-3 py-2.5 text-sm" style={{ borderColor: 'var(--border-2)' }} />
              </label>
              <label className="block">
                <span className="block text-sm font-medium mb-1" style={{ color: '#334155' }}>Password</span>
                <input type="password" placeholder="••••••••" defaultValue="demo1234" className="w-full rounded-lg border px-3 py-2.5 text-sm" style={{ borderColor: 'var(--border-2)' }} />
              </label>
              {mode === 'signin' && <a href="#" className="text-sm font-medium" style={{ color: 'var(--brand-700)' }}>Forgot password?</a>}
              <button type="submit" className="w-full rounded-lg py-2.5 text-white font-semibold" style={{ backgroundColor: 'var(--brand-800)' }}>
                {mode === 'signin' ? 'Sign in' : 'Create account'}
              </button>
            </form>

            <div className="flex items-center gap-3 my-5">
              <span className="flex-1 h-px" style={{ backgroundColor: 'var(--border)' }} />
              <span className="text-xs" style={{ color: 'var(--text-faint)' }}>or continue with</span>
              <span className="flex-1 h-px" style={{ backgroundColor: 'var(--border)' }} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {SSO.map((s) => (
                <button key={s} onClick={() => enter(isProvider)} className="rounded-lg border py-2 text-sm font-medium" style={{ borderColor: 'var(--border-2)', color: '#334155' }}>
                  {s}
                </button>
              ))}
            </div>

            <p className="text-center text-sm mt-5" style={{ color: 'var(--text-muted)' }}>
              Demo: this signs you straight into the {isProvider ? 'professional' : 'service-user'} view — switch participant anytime from the top bar.
            </p>
          </div>

          {/* Safety panel */}
          <div className="rounded-2xl border p-6" style={{ borderColor: 'var(--border)', backgroundColor: '#eef4ff' }} data-tour="login-safety">
            <div className="flex items-center gap-2 mb-4">
              <LogoMark size={18} /> <span className="font-semibold text-sm" style={{ color: 'var(--brand-800)' }}>Your information is safe</span>
            </div>
            <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>
              {PRODUCT_NAME} uses strong encryption and role-based access so your information is shared securely with the right people — and no one else.
            </p>
            <ul className="flex flex-col gap-4">
              {SAFETY.map((s) => (
                <li key={s.title} className="flex gap-3">
                  <span className="flex-shrink-0 mt-0.5 inline-flex items-center justify-center w-6 h-6 rounded-full text-white" style={{ backgroundColor: 'var(--brand-700)' }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                  </span>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: 'var(--brand-800)' }}>{s.title}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
      <PublicFooter />
      <p className="sr-only"><Link href="/">Back to home</Link></p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  )
}
