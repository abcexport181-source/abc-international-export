import './globals.css'
import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BackToTop from '@/components/common/BackToTop'

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
        <Header />
        <main>{children}</main>
        <Footer />
        <BackToTop />
      </body>
    </html>
  )
}
