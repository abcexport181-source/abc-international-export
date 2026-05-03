import './globals.css'
import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BackToTop from '@/components/common/BackToTop'
import { LanguageProvider } from '@/context/LanguageContext'

export const metadata: Metadata = {
  title: 'ABC International Logistics | Your Trusted Merchant Exporter',
  description: 'Global sourcing expertise backed by comprehensive logistics support.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <BackToTop />
        </LanguageProvider>
      </body>
    </html>
  )
}
