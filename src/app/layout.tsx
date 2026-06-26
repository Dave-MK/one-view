import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { AppProvider } from '@/context/AppContext'
import { Header } from '@/components/Header'
import { PRODUCT_NAME } from '@/lib/constants'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: `${PRODUCT_NAME} — Citizen-controlled coordination for SEND`,
  description:
    'OneView LCR is a citizen-controlled coordination layer for SEND (special educational needs and disabilities) across health, education and social care.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50">
        <AppProvider>
          <Header />
          <main className="flex-1 flex flex-col">{children}</main>
        </AppProvider>
      </body>
    </html>
  )
}
