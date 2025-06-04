import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Electric Vehicle FAQ Ireland | EV Buying Guide | EV-Trader',
  description: 'Frequently asked questions about buying, selling, and owning electric vehicles in Ireland. SEAI grants, charging, insurance, and more.',
  keywords: [
    'electric vehicle FAQ Ireland',
    'EV questions Ireland',
    'how to buy electric car Ireland',
    'SEAI grants FAQ',
    'EV charging questions',
    'electric car insurance Ireland',
    'VRT electric vehicles',
    'EV ownership Ireland',
    'electric vehicle guide Ireland'
  ],
  openGraph: {
    title: 'Electric Vehicle FAQ Ireland | EV-Trader',
    description: 'Get answers to all your electric vehicle questions for Ireland. Grants, charging, buying guides and more.',
    type: 'website',
    url: 'https://ev-trader.ie/faq',
    images: [
      {
        url: '/faq-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Electric Vehicle FAQ Ireland',
      },
    ],
  },
  alternates: {
    canonical: 'https://ev-trader.ie/faq',
  },
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
