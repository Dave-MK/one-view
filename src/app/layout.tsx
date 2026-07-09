import type { Metadata } from 'next'
import './globals.css'
import { AppProvider } from '@/context/AppContext'
import { TutorialProvider } from '@/context/TutorialContext'
import { TutorialOverlay } from '@/components/tutorial/TutorialOverlay'
import { PRODUCT_NAME } from '@/lib/constants'

export const metadata: Metadata = {
  title: `${PRODUCT_NAME} — A coordination layer for people-centred services`,
  description:
    'OneView is a secure, governed coordination layer that lets the people supporting someone — and the person themselves — work from one shared, consent-controlled picture. Transferable across SEND, adult social care, health and more.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">
        <AppProvider>
          <TutorialProvider>
            {children}
            <TutorialOverlay />
          </TutorialProvider>
        </AppProvider>
      </body>
    </html>
  )
}
