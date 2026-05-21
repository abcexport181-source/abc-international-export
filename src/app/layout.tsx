import './globals.css'
import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BackToTop from '@/components/common/BackToTop'
import { LanguageProvider } from '@/context/LanguageContext'

export const dynamic = 'force-dynamic';

import { createClient } from '@supabase/supabase-js'

const defaultSeo = {
  site_title: 'ABC International Logistics | Your Trusted Merchant Exporter',
  meta_description: 'Global sourcing expertise backed by comprehensive logistics support.',
  meta_keywords: '',
  canonical_url: '',
  og_title: '',
  og_description: '',
  og_image: '',
  twitter_card: 'summary_large_image',
  twitter_title: '',
  twitter_description: '',
  twitter_image: '',
  robots_index: 'true',
  robots_follow: 'true',
  google_search_console: '',
  bing_site_verification: '',
  pinterest_site_verification: '',
  yandex_verification: '',
};

function getSupabaseForCms() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)) {
    return null;
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
      global: {
        fetch: (url, options) => {
          return fetch(url, { ...options, cache: 'no-store' });
        }
      }
    }
  );
}

async function getSeoContent(language: string) {
  const supabase = getSupabaseForCms();
  if (!supabase) return defaultSeo;

  const { data } = await supabase
    .from('site_content')
    .select('content_key, content_value')
    .eq('page_name', 'seo')
    .eq('language_code', language);

  return {
    ...defaultSeo,
    ...(data || []).reduce<Record<string, string>>((acc, item) => {
      acc[item.content_key] = item.content_value || '';
      return acc;
    }, {}),
  };
}

function cleanUrl(value: string) {
  try {
    return value ? new URL(value) : undefined;
  } catch {
    return undefined;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const languageCookie = cookieStore.get('site_language')?.value || 'en';
  const seo = await getSeoContent(languageCookie);
  const siteUrl = cleanUrl(seo.canonical_url);
  const ogImage = seo.og_image || seo.twitter_image;
  const twitterImage = seo.twitter_image || seo.og_image;

  return {
    title: seo.site_title || defaultSeo.site_title,
    description: seo.meta_description || defaultSeo.meta_description,
    keywords: seo.meta_keywords ? seo.meta_keywords.split(',').map(keyword => keyword.trim()).filter(Boolean) : undefined,
    metadataBase: siteUrl,
    alternates: siteUrl ? { canonical: siteUrl } : undefined,
    openGraph: {
      title: seo.og_title || seo.site_title || defaultSeo.site_title,
      description: seo.og_description || seo.meta_description || defaultSeo.meta_description,
      url: siteUrl,
      siteName: 'ABC International',
      images: ogImage ? [{ url: ogImage }] : undefined,
      type: 'website',
    },
    twitter: {
      card: seo.twitter_card === 'summary' ? 'summary' : 'summary_large_image',
      title: seo.twitter_title || seo.og_title || seo.site_title || defaultSeo.site_title,
      description: seo.twitter_description || seo.og_description || seo.meta_description || defaultSeo.meta_description,
      images: twitterImage ? [twitterImage] : undefined,
    },
    robots: {
      index: seo.robots_index !== 'false',
      follow: seo.robots_follow !== 'false',
    },
    verification: {
      google: seo.google_search_console || undefined,
      yandex: seo.yandex_verification || undefined,
      other: {
        'msvalidate.01': seo.bing_site_verification ? [seo.bing_site_verification] : [],
        'p:domain_verify': seo.pinterest_site_verification ? [seo.pinterest_site_verification] : [],
      },
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let isBlogVisible = true;
  const cookieStore = await cookies();
  const languageCookie = cookieStore.get('site_language')?.value || 'en';

  const supabase = getSupabaseForCms();
  if (supabase) {
    const { data } = await supabase
      .from('site_content')
      .select('content_value, language_code')
      .eq('content_key', 'blog_visibility')
      .in('language_code', [languageCookie, 'en']);
      
    if (data && data.length > 0) {
      const langItem = data.find(item => item.language_code === languageCookie);
      const enItem = data.find(item => item.language_code === 'en');
      const val = langItem ? langItem.content_value : enItem ? enItem.content_value : null;
      if (val !== null) {
        isBlogVisible = String(val).trim().toLowerCase() === 'true';
      }
    }
  }

  return (
    <html lang="en">
      <body>
        <LanguageProvider initialLanguage={languageCookie}>
          <Header isBlogVisible={isBlogVisible} />
          <main>{children}</main>
          <Footer />
          <BackToTop />
        </LanguageProvider>
      </body>
    </html>
  )
}
