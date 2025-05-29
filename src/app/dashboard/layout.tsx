'use client';

import { useUser } from '@clerk/nextjs';
import StandardLayout from '@/components/layout/StandardLayout';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoaded } = useUser();
  const userType = isLoaded ? (user?.publicMetadata.userType as string) : null;

  // Only show navigation if user has completed onboarding
  const showNav = userType === 'individual' || userType === 'dealership';

  return (
    <StandardLayout showNavigation={showNav} showBottomNav={showNav}>
      <div className="container-custom px-4 py-6">
        {children}
      </div>
    </StandardLayout>
  );
}
