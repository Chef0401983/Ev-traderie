import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';

// Force dynamic rendering
import './force-dynamic';

// Initialize email system on server startup
import '@/lib/email/init';

// Force dynamic rendering for this layout
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const metadata: Metadata = {
  title: {
    default: 'EV-Trader | #1 Irish Electric Vehicle Marketplace',
    template: '%s | EV-Trader Ireland'
  },
  description: 'Ireland\'s premier electric vehicle marketplace. Buy and sell EVs, Teslas, and electric cars. Trusted by thousands of Irish EV enthusiasts and dealerships. Start your electric journey today!',
  keywords: [
    'electric vehicle Ireland',
    'sell electric car Ireland', 
    'buy EV Ireland',
    'Tesla Ireland',
    'electric car marketplace',
    'EV dealership Ireland',
    'second hand electric cars',
    'Irish EV trading',
    'electric vehicle sales',
    'green cars Ireland'
  ],
  authors: [{ name: 'EV-Trader Ireland' }],
  creator: 'EV-Trader',
  publisher: 'EV-Trader Ireland',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://ev-trader.ie'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IE',
    url: 'https://ev-trader.ie',
    title: 'EV-Trader | Ireland\'s #1 Electric Vehicle Marketplace',
    description: 'Buy and sell electric vehicles in Ireland. Trusted marketplace for EVs, Teslas, and electric cars. Join thousands of satisfied Irish customers.',
    siteName: 'EV-Trader Ireland',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'EV-Trader - Irish Electric Vehicle Marketplace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EV-Trader | Ireland\'s #1 Electric Vehicle Marketplace',
    description: 'Buy and sell electric vehicles in Ireland. Trusted marketplace for EVs, Teslas, and electric cars.',
    images: ['/twitter-image.jpg'],
    creator: '@EVTraderIreland',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en-IE">
        <head>
          {/* Structured Data for Local Business */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "LocalBusiness",
                "name": "EV-Trader Ireland",
                "description": "Ireland's premier electric vehicle marketplace for buying and selling EVs",
                "url": "https://ev-trader.ie",
                "telephone": "+353-1-XXX-XXXX",
                "address": {
                  "@type": "PostalAddress",
                  "addressCountry": "IE",
                  "addressRegion": "Ireland"
                },
                "openingHours": "Mo-Su 00:00-23:59",
                "sameAs": [
                  "https://facebook.com/EVTraderIreland",
                  "https://twitter.com/EVTraderIreland",
                  "https://instagram.com/EVTraderIreland"
                ],
                "priceRange": "€€",
                "servesCuisine": "Electric Vehicles",
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "4.8",
                  "reviewCount": "1250"
                }
              })
            }}
          />
          
          {/* Structured Data for Website */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "EV-Trader Ireland",
                "url": "https://ev-trader.ie",
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": "https://ev-trader.ie/vehicles?search={search_term_string}",
                  "query-input": "required name=search_term_string"
                }
              })
            }}
          />

          {/* Preconnect to external domains */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          
          {/* Favicon and app icons */}
          <link rel="icon" href="/favicon.ico" sizes="any" />
          <link rel="icon" href="/icon.svg" type="image/svg+xml" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          <link rel="manifest" href="/manifest.json" />
          
          {/* Additional SEO tags */}
          <meta name="theme-color" content="#10b981" />
          <meta name="msapplication-TileColor" content="#10b981" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="EV-Trader" />
        </head>
        <body className="min-h-screen">
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
