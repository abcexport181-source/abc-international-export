import './globals.css'
import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BackToTop from '@/components/common/BackToTop'
import { LanguageProvider } from '@/context/LanguageContext'

export const dynamic = 'force-dynamic';

import { createClient } from '@supabase/supabase-js'

export const metadata: Metadata = {
  title: 'ABC International Logistics | Your Trusted Merchant Exporter',
  description: 'Global sourcing expertise backed by comprehensive logistics support.',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let isBlogVisible = false;
  const cookieStore = await cookies();
  const languageCookie = cookieStore.get('site_language')?.value || 'en';

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );
    const { data } = await supabase
      .from('site_content')
      .select('content_value')
      .eq('content_key', 'blog_visibility')
      .eq('language_code', languageCookie)
      .limit(1);
    if (data && data.length > 0) isBlogVisible = String(data[0].content_value).trim().toLowerCase() === 'true';
  }

  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <Header isBlogVisible={isBlogVisible} />
          <main>{children}</main>
          <Footer />
          <BackToTop />
        </LanguageProvider>
      </body>
    </html>
  )
}
