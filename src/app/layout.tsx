import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';

// Initialize email system on server startup
import '@/lib/email/init';

export const metadata: Metadata = {
  title: 'EV-Trader | Irish Electric Vehicle Marketplace',
  description: 'Buy and sell electric vehicles in Ireland - the premier marketplace for EV enthusiasts and dealerships',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="min-h-screen">
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
